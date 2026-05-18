import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";
import { formatInTimezone } from "@/lib/scheduler";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to perform this action." },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        session: true,
        slot: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    // Authorization check: Must be ADMIN or the owner of the booking
    if (authUser.role !== "ADMIN" && booking.userId !== authUser.sub) {
      return NextResponse.json(
        { error: "Unauthorized. You can only cancel your own bookings." },
        { status: 403 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking is already cancelled." },
        { status: 400 }
      );
    }

    // Cancel in a transaction
    if (booking.sessionId) {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id },
          data: { status: "CANCELLED" },
        }),
        prisma.session.update({
          where: { id: booking.sessionId },
          data: { status: "OPEN" }, // Re-open slot
        }),
      ]);
    } else if (booking.slotId) {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id },
          data: { status: "CANCELLED" },
        }),
        prisma.availabilitySlot.update({
          where: { id: booking.slotId },
          data: { isBooked: false }, // Re-open slot
        }),
      ]);
    } else {
      await prisma.booking.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
    }

    // Fetch the updated booking to send correct email info
    const updatedBooking = await prisma.booking.findUnique({
      where: { id },
      include: { session: true, slot: true }
    });

    // Send cancellation emails
    try {
      let formattedDate = "N/A";
      if (updatedBooking?.session) {
        formattedDate = formatInTimezone(
          new Date(updatedBooking.session.startTime),
          booking.timezone,
          "full"
        ) + ` (${booking.timezone})`;
      } else if (updatedBooking?.slot) {
        formattedDate = new Date(updatedBooking.slot.startTime).toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: booking.timezone,
        }) + ` (${booking.timezone})`;
      }

      await Promise.all([
        // Send email to User
        sendEmail({
          to: booking.customerEmail,
          subject: "Booking Cancelled - Stable Partners",
          template: "booking-declined", // using existing declined/cancelled template
          context: {
            name: booking.customerName,
            date: formattedDate,
            reason: "Cancelled by user or administrator."
          },
        }),
        // Send email to Admin
        prisma.user.findFirst({ where: { role: "ADMIN" } }).then(async (adminUser) => {
          if (adminUser) {
            await sendEmail({
              to: adminUser.email,
              subject: `Booking Cancelled: ${booking.customerName}`,
              template: "booking-declined",
              context: {
                name: adminUser.name || "Admin",
                date: formattedDate,
                reason: `Cancelled booking for customer: ${booking.customerName} (${booking.customerEmail})`
              },
            });
          }
        })
      ]);
    } catch (err) {
      console.error("Email sending failed for session cancellation:", err);
    }

    return NextResponse.json({ success: true, message: "Booking cancelled successfully." });
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
