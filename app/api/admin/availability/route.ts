import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";
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
} from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const formatParam = searchParams.get("format"); // 'template' or undefined

    if (formatParam === "template") {
      const [templates, overrides] = await Promise.all([
        prisma.availabilityTemplate.findMany({
          orderBy: { dayOfWeek: "asc" },
        }),
        prisma.availabilityOverride.findMany({
          where: {
            date: {
              gte: startOfDay(new Date()),
            },
          },
          orderBy: { date: "asc" },
        }),
      ]);
      return NextResponse.json({ templates, overrides });
    }

    // Old slot retrieval
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
      orderBy: { startTime: "asc" },
    });
    return NextResponse.json(slots);
  } catch (error) {
    console.error("Error in GET admin availability:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const body = await request.json();

    // --- NEW WEEKLY TEMPLATE & OVERRIDES SAVING ---
    if ("templates" in body || "overrides" in body) {
      const { templates, overrides } = body;

      // Update weekly templates
      if (templates && Array.isArray(templates)) {
        await prisma.availabilityTemplate.deleteMany();
        if (templates.length > 0) {
          await prisma.availabilityTemplate.createMany({
            data: templates.map((t: any) => ({
              dayOfWeek: Number(t.dayOfWeek),
              startTime: t.startTime,
              endTime: t.endTime,
              timezone: t.timezone || "UTC",
              duration: t.duration !== undefined && t.duration !== null ? Number(t.duration) : 30,
              buffer: t.buffer !== undefined && t.buffer !== null ? Number(t.buffer) : 10,
            })),
          });
        }
      }

      // Update overrides
      if (overrides && Array.isArray(overrides)) {
        const overrideDates = overrides.map((o: any) => new Date(o.date));
        if (overrideDates.length > 0) {
          await prisma.availabilityOverride.deleteMany({
            where: {
              date: {
                in: overrideDates,
              },
            },
          });
        }

        await prisma.availabilityOverride.createMany({
          data: overrides.map((o: any) => ({
            date: new Date(o.date),
            isUnavailable: Boolean(o.isUnavailable),
            startTime: o.isUnavailable ? null : o.startTime,
            endTime: o.isUnavailable ? null : o.endTime,
          })),
        });
      }

      const [freshTemplates, freshOverrides] = await Promise.all([
        prisma.availabilityTemplate.findMany({ orderBy: { dayOfWeek: "asc" } }),
        prisma.availabilityOverride.findMany({ orderBy: { date: "asc" } }),
      ]);

      return NextResponse.json({
        success: true,
        templates: freshTemplates,
        overrides: freshOverrides,
      });
    }

    // --- OLD SLOT GENERATION ---
    const { 
      startDate, 
      endDate, 
      startTime, 
      endTime, 
      slotDuration 
    } = body;

    if (!startDate || !endDate || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const firstDay = startOfDay(parseISO(startDate));
    const lastDay = startOfDay(parseISO(endDate));
    
    if (isAfter(firstDay, lastDay)) {
      return NextResponse.json({ error: "Start date must be before or equal to end date" }, { status: 400 });
    }

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const duration = Number(slotDuration);

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
      return NextResponse.json({ error: "Range too large. Max 60 days." }, { status: 400 });
    }

    for (let i = 0; i < daysToProcess; i++) {
      const currentDay = addDays(firstDay, i);
      let currentPointer = setMinutes(setHours(currentDay, startH), startM);
      const dayEndThreshold = setMinutes(setHours(currentDay, endH), endM);

      while (currentPointer < dayEndThreshold) {
        const potentialEnd = addMinutes(currentPointer, duration);
        
        if (potentialEnd <= dayEndThreshold) {
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
    console.error("CRITICAL ERROR IN SCHEDULER:", error);
    return NextResponse.json({ error: "Failed to generate slots" }, { status: 500 });
  }
}

