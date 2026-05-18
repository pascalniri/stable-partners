import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";
import { generateSlotsForDay } from "@/lib/scheduler";
import { 
  parseISO, 
  eachDayOfInterval, 
  format, 
  getDay,
  startOfDay,
  endOfDay
} from "date-fns";

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const { startDate, endDate, previewOnly = false } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "startDate and endDate are required." }, { status: 400 });
    }

    const firstDay = parseISO(startDate);
    const lastDay = parseISO(endDate);

    // Fetch all availability templates
    const templates = await prisma.availabilityTemplate.findMany();
    
    // Fetch overrides for the date range
    const overrides = await prisma.availabilityOverride.findMany({
      where: {
        date: {
          gte: startOfDay(firstDay),
          lte: endOfDay(lastDay),
        },
      },
    });

    // Fetch existing sessions in the date range to check conflicts
    const existingSessions = await prisma.session.findMany({
      where: {
        startTime: {
          gte: startOfDay(firstDay),
        },
        endTime: {
          lte: endOfDay(lastDay),
        },
      },
    });

    // We generate slots day by day
    const days = eachDayOfInterval({ start: firstDay, end: lastDay });
    const generatedSlots: {
      date: string;
      startTime: string; // ISO date string
      endTime: string;   // ISO date string
      timezone: string;
      duration: number;
    }[] = [];

    for (const day of days) {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayOfWeek = getDay(day); // 0 (Sunday) to 6 (Saturday)

      // 1. Check override
      const override = overrides.find(
        (ov) => format(new Date(ov.date), "yyyy-MM-dd") === dateStr
      );

      let isUnavailable = false;
      let startTimeStr = "";
      let endTimeStr = "";
      let timezone = "UTC";
      let duration = 30;
      let buffer = 10;

      if (override) {
        if (override.isUnavailable) {
          isUnavailable = true;
        } else {
          startTimeStr = override.startTime || "";
          endTimeStr = override.endTime || "";
          // Since overrides might not store duration/buffer/timezone directly,
          // we fallback to the matching template for timezone/duration/buffer
          const template = templates.find((t) => t.dayOfWeek === dayOfWeek);
          if (template) {
            timezone = template.timezone;
            duration = template.duration;
            buffer = template.buffer;
          }
        }
      } else {
        // Look for template
        const template = templates.find((t) => t.dayOfWeek === dayOfWeek);
        if (template) {
          startTimeStr = template.startTime;
          endTimeStr = template.endTime;
          timezone = template.timezone;
          duration = template.duration;
          buffer = template.buffer;
        } else {
          // No template, treat as unavailable
          isUnavailable = true;
        }
      }

      if (isUnavailable || !startTimeStr || !endTimeStr) {
        continue;
      }

      // Generate slots for this day
      const dailySlots = generateSlotsForDay(
        dateStr,
        startTimeStr,
        endTimeStr,
        timezone,
        duration,
        buffer
      );

      for (const slot of dailySlots) {
        // Conflict check: does it overlap with an existing session (OPEN or BOOKED or CANCELLED)?
        const overlaps = existingSessions.some((existing) => {
          const eStart = new Date(existing.startTime).getTime();
          const eEnd = new Date(existing.endTime).getTime();
          const sStart = slot.startTime.getTime();
          const sEnd = slot.endTime.getTime();
          return sStart < eEnd && sEnd > eStart;
        });

        if (!overlaps) {
          generatedSlots.push({
            date: dateStr,
            startTime: slot.startTime.toISOString(),
            endTime: slot.endTime.toISOString(),
            timezone,
            duration,
          });
        }
      }
    }

    if (previewOnly) {
      return NextResponse.json({ preview: true, slots: generatedSlots });
    }

    // Save sessions to DB with status = OPEN
    if (generatedSlots.length > 0) {
      await prisma.session.createMany({
        data: generatedSlots.map((s) => ({
          date: new Date(s.date),
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime),
          status: "OPEN",
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      success: true,
      count: generatedSlots.length,
      slots: generatedSlots,
    });
  } catch (error: any) {
    console.error("Error generating session slots:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
