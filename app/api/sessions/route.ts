import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseISO, startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monthStr = searchParams.get("month"); // e.g. "2026-06"

    const tz = searchParams.get("timezone") || "UTC";

    let whereClause: any = {
      status: "OPEN",
      startTime: {
        gte: new Date(), // Past slot cleanup
      },
    };

    if (monthStr) {
      const parsedMonth = parseISO(`${monthStr}-01`);
      const start = startOfMonth(parsedMonth);
      const end = endOfMonth(parsedMonth);

      whereClause.startTime = {
        gte: new Date(Math.max(new Date().getTime(), start.getTime())),
        lte: end,
      };
    }

    const sessions = await prisma.session.findMany({
      where: whereClause,
      orderBy: { startTime: "asc" },
    });

    const formattedSessions = sessions.map(session => {
      const dateObj = new Date(session.startTime);
      return {
        ...session,
        localDate: dateObj.toLocaleDateString("en-CA", { timeZone: tz }),
        localTime: dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }),
        localEndTime: new Date(session.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz })
      };
    });

    return NextResponse.json(formattedSessions);
  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
