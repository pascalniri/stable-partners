import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";
import { startOfDay, endOfDay, parseISO, isSameDay, format, addDays } from "date-fns";
import { generateSlotsForDay } from "@/lib/scheduler";

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const { startDate, endDate } = await request.json();
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields: startDate, endDate" }, { status: 400 });
    }

    const start = startOfDay(parseISO(startDate));
    const end = endOfDay(parseISO(endDate));

    if (start > end) {
      return NextResponse.json({ error: "Start date must be before or equal to end date" }, { status: 400 });
    }

    // 1. Fetch templates and overrides
    const [templates, overrides] = await Promise.all([
      prisma.availabilityTemplate.findMany(),
      prisma.availabilityOverride.findMany(),
    ]);

    if (templates.length === 0) {
      return NextResponse.json({ error: "No recurring templates configured. Setup weekly schedule first." }, { status: 400 });
    }

    // 2. Fetch all existing sessions in this range
    const existingSessions = await prisma.session.findMany({
      where: {
        startTime: {
          gte: start,
          lte: end,
        },
      },
    });

    // 3. Clear any existing OPEN sessions in this range to allow a clean re-publish
    await prisma.session.deleteMany({
      where: {
        status: "OPEN",
        startTime: {
          gte: start,
          lte: end,
        },
      },
    });

    const sessionsToCreate: any[] = [];
    let currentPointer = new Date(start);

    // 4. Generate sessions day-by-day
    while (currentPointer <= end) {
      const currentDateStr = format(currentPointer, "yyyy-MM-dd");
      const dayOfWeek = currentPointer.getDay();

      const override = overrides.find((o) => {
        const oDate = typeof o.date === "string" ? parseISO(o.date) : new Date(o.date);
        return isSameDay(oDate, currentPointer);
      });

      if (override) {
        if (!override.isUnavailable && override.startTime && override.endTime) {
          const fallbackTemplate = templates.find((t) => t.dayOfWeek === dayOfWeek) || templates[0];
          const dailySlots = generateSlotsForDay(
            currentDateStr,
            override.startTime,
            override.endTime,
            fallbackTemplate.timezone,
            fallbackTemplate.duration,
            fallbackTemplate.buffer
          );

          for (const slot of dailySlots) {
            checkAndAddSlot(slot, currentDateStr, existingSessions, sessionsToCreate);
          }
        }
        // if isUnavailable is true, we block this day and create no sessions
      } else {
        const dayTemplate = templates.find((t) => t.dayOfWeek === dayOfWeek);
        if (dayTemplate) {
          const dailySlots = generateSlotsForDay(
            currentDateStr,
            dayTemplate.startTime,
            dayTemplate.endTime,
            dayTemplate.timezone,
            dayTemplate.duration,
            dayTemplate.buffer
          );

          for (const slot of dailySlots) {
            checkAndAddSlot(slot, currentDateStr, existingSessions, sessionsToCreate);
          }
        }
      }

      currentPointer = addDays(currentPointer, 1);
    }

    // 5. Save all computed session slots to database
    if (sessionsToCreate.length > 0) {
      await prisma.session.createMany({
        data: sessionsToCreate,
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully published ${sessionsToCreate.length} bookable session slots.`,
      count: sessionsToCreate.length,
    });
  } catch (error: any) {
    console.error("Error in publish sessions:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

function checkAndAddSlot(
  slot: { startTime: Date; endTime: Date },
  dateStr: string,
  existingSessions: any[],
  targetArray: any[]
) {
  const hasOverlap = existingSessions.some((s) => {
    if (s.status === "OPEN") return false; // Already deleted
    const sStart = new Date(s.startTime).getTime();
    const sEnd = new Date(s.endTime).getTime();
    const pStart = slot.startTime.getTime();
    const pEnd = slot.endTime.getTime();
    return pStart < sEnd && pEnd > sStart;
  });

  if (!hasOverlap) {
    targetArray.push({
      date: new Date(dateStr),
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: "OPEN",
    });
  }
}
