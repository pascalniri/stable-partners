import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { meetingLink, status } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { slot: true, session: true }
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: status || 'CONFIRMED',
        meetingLink: meetingLink || booking.meetingLink,
      },
      include: { slot: true, session: true }
    });

    // If approved, send the meeting details email
    if (status === 'CONFIRMED' || (!status && meetingLink)) {
      const scheduledTime = updatedBooking.session
        ? new Date(updatedBooking.session.startTime).toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: updatedBooking.timezone 
          }) + ` (${updatedBooking.timezone})`
        : updatedBooking.slot
        ? new Date(updatedBooking.slot.startTime).toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: updatedBooking.timezone 
          }) + ` (${updatedBooking.timezone})`
        : 'To be determined';

      await sendEmail({
        to: updatedBooking.customerEmail,
        subject: 'Session Confirmed - Stable Partners',
        template: 'meeting-details',
        context: {
          name: updatedBooking.customerName,
          date: scheduledTime,
          link: meetingLink
        },
      });
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
