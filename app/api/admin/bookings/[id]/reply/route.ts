import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mail';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // 1. Create a Message record
    await prisma.message.create({
      data: {
        content: body.message,
        bookingId: id,
        sender: 'ADMIN',
      },
    });

    // 2. Update Booking status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
      },
    });

    // 3. Send Email
    let formattedDate = body.scheduledDate;
    try {
      const dateObj = new Date(body.scheduledDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: booking.timezone
        }) + ` (${booking.timezone})`;
      }
    } catch (e) {
      console.error('Date formatting error:', e);
    }

    await sendEmail({
      to: booking.customerEmail,
      subject: 'Meeting Details - Stable Partners',
      template: 'meeting-details',
      context: {
        name: booking.customerName,
        date: formattedDate,
        link: body.meetingLink,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error replying to booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
