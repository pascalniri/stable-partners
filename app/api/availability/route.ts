import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addDays, startOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: {
        isBooked: false,
        startTime: {
          gt: addDays(startOfDay(new Date()), 1), // Only show from tomorrow onwards
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
