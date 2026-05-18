import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addDays, startOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching availability sessions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
