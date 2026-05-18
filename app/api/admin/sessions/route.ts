import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      include: {
        booking: {
          select: { id: true, customerName: true, customerEmail: true, status: true },
        },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error("Error in GET admin sessions:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
