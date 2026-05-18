import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const { id } = await params;
    const session = await prisma.session.findUnique({
      where: { id },
      include: { booking: true }, // Singular relation
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    // Protect active booked slots
    if (session.status === "BOOKED") {
      return NextResponse.json(
        { error: "Cannot delete a booked session slot. Please cancel the booking first." },
        { status: 400 }
      );
    }

    // Safely delete session
    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Session slot deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
