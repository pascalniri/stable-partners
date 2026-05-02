import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mail';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        property: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple validation
    if (!body.customerName || !body.customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone || null,
        propertyType: body.propertyType || null,
        propertyLocation: body.propertyLocation || null,
        unitsRooms: body.unitsRooms ? String(body.unitsRooms) : null,
        occupancyStatus: body.occupancyStatus || null,
        estimatedIncome: body.estimatedIncome || null,
        mainChallenge: body.mainChallenge || null,
        mainGoal: body.mainGoal || null,
        additionalInfo: body.additionalInfo || null,
        serviceType: body.serviceType || 'Property Assessment',
        description: body.description || null,
        propertyId: body.propertyId || null,
      } as any,
      include: {
        property: true,
      },
    }) as any;

    // Send emails in background
    Promise.all([
      sendEmail({
        to: booking.customerEmail,
        subject: 'Inquiry Received - Stable Partners',
        template: 'thank-you',
        context: { name: booking.customerName },
      }),
      sendEmail({
        to: process.env.EMAIL_USER || '',
        subject: `NEW ASSESSMENT REQUEST: ${booking.customerName}`,
        template: 'lead-notification',
        context: {
          name: booking.customerName,
          email: booking.customerEmail,
          phone: booking.customerPhone,
          propertyType: booking.propertyType,
          propertyLocation: booking.propertyLocation,
          unitsRooms: booking.unitsRooms,
          occupancyStatus: booking.occupancyStatus,
          estimatedIncome: booking.estimatedIncome,
          mainChallenge: booking.mainChallenge,
          mainGoal: booking.mainGoal,
          additionalInfo: booking.additionalInfo,
          serviceType: booking.serviceType,
          propertyName: booking.property?.title,
        },
      }),
    ]).catch(err => console.error('Background email error:', err));

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message,
      code: error.code
    }, { status: 500 });
  }
}
