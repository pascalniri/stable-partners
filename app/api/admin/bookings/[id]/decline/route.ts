import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mail';
import { format, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { slot: true, session: true }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // 1. Update Booking status to CANCELLED
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    // 2. If it has a slot/session, RE-OPEN IT
    if (booking.sessionId) {
      await prisma.session.update({
        where: { id: booking.sessionId },
        data: { status: 'OPEN' }
      });
    } else if (booking.slotId) {
      await prisma.availabilitySlot.update({
        where: { id: booking.slotId },
        data: { isBooked: false }
      });
    }

    // 3. Send Decline Email
    let requestedTime = "the requested time";
    if (booking.session) {
      requestedTime = format(new Date(booking.session.startTime), "EEEE, MMMM do 'at' HH:mm") + " (" + booking.timezone + ")";
    } else if (booking.slot) {
      requestedTime = format(new Date(booking.slot.startTime), "EEEE, MMMM do 'at' HH:mm") + " (" + booking.timezone + ")";
    }

    await sendEmail({
      to: booking.customerEmail,
      subject: 'Schedule Update - Stable Partners Group',
      template: 'booking-declined',
      context: {
        customerName: booking.customerName,
        requestedTime: requestedTime,
        bookingId: id,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error declining booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
