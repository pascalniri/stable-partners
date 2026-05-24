import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addDays, startOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tz = searchParams.get("timezone") || "UTC";

    const sessions = await prisma.session.findMany({
      where: {
        status: "OPEN",
        startTime: {
          gt: new Date(), // Only show future sessions
        },
      },
      orderBy: {
        startTime: "asc",
      },
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
  } catch (error) {
    console.error("Error fetching availability sessions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
