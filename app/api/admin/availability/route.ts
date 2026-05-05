import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { 
  addMinutes, 
  parseISO, 
  startOfDay, 
  endOfDay,
  addDays, 
  setHours, 
  setMinutes,
  differenceInDays,
  isAfter
} from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: {
        startTime: {
          gte: startOfDay(new Date()),
        },
      },
      include: {
        booking: {
          select: { id: true }
        }
      },
      orderBy: { startTime: 'asc' },
    });
    console.log(`[DEBUG] FETCHED SLOTS: Total = ${slots.length}`);
    if (slots.length > 0) {
      console.log(`[DEBUG] FIRST SLOT SAMPLE:`, JSON.stringify(slots[0], null, 2));
    }
    return NextResponse.json(slots);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { 
      startDate, 
      endDate, 
      startTime, 
      endTime, 
      slotDuration 
    } = await request.json();

    if (!startDate || !endDate || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Normalize dates to start of day
    // Using parseISO on "YYYY-MM-DD" strings is safe
    const firstDay = startOfDay(parseISO(startDate));
    const lastDay = startOfDay(parseISO(endDate));
    
    // Safety check: ensure start is not after end
    if (isAfter(firstDay, lastDay)) {
      return NextResponse.json({ error: 'Start date must be before or equal to end date' }, { status: 400 });
    }

    // 2. Parse time window
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const duration = Number(slotDuration);

    // 3. DEEP CLEAN: Delete all unbooked slots in this range
    const deleteResult = await prisma.availabilitySlot.deleteMany({
      where: {
        isBooked: false,
        startTime: {
          gte: firstDay,
          lte: endOfDay(lastDay),
        },
      },
    });
    console.log(`DEEP CLEAN: Removed ${deleteResult.count} unbooked slots.`);

    // 4. Fetch existing BOOKED slots to prevent overlaps
    const bookedSlots = await prisma.availabilitySlot.findMany({
      where: {
        isBooked: true,
        startTime: {
          gte: firstDay,
          lte: endOfDay(lastDay),
        },
      },
    });

    const slotsToCreate = [];
    const daysToProcess = differenceInDays(lastDay, firstDay) + 1;
    
    if (daysToProcess > 60) {
      return NextResponse.json({ error: 'Range too large. Max 60 days.' }, { status: 400 });
    }

    for (let i = 0; i < daysToProcess; i++) {
      const currentDay = addDays(firstDay, i);
      let currentPointer = setMinutes(setHours(currentDay, startH), startM);
      const dayEndThreshold = setMinutes(setHours(currentDay, endH), endM);

      while (currentPointer < dayEndThreshold) {
        const potentialEnd = addMinutes(currentPointer, duration);
        
        if (potentialEnd <= dayEndThreshold) {
          // Check if this new slot would overlap with any booked slot
          const overlapsWithBooking = bookedSlots.some(booked => {
            const bStart = booked.startTime.getTime();
            const bEnd = booked.endTime.getTime();
            const pStart = currentPointer.getTime();
            const pEnd = potentialEnd.getTime();
            return (pStart < bEnd && pEnd > bStart);
          });

          if (!overlapsWithBooking) {
            slotsToCreate.push({
              startTime: currentPointer,
              endTime: potentialEnd,
              isBooked: false,
            });
          }
        }
        
        currentPointer = potentialEnd;
      }
    }

    // 5. Batch create new slots
    if (slotsToCreate.length > 0) {
      await prisma.availabilitySlot.createMany({
        data: slotsToCreate,
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ 
      success: true, 
      count: slotsToCreate.length 
    });

  } catch (error) {
    console.error('CRITICAL ERROR IN SCHEDULER:', error);
    return NextResponse.json({ error: 'Failed to generate slots' }, { status: 500 });
  }
}
