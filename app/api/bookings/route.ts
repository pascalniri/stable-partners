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
    const { 
      customerName, 
      customerEmail, 
      customerPhone,
      timezone,
      slotId,
      propertyType,
      propertyLocation,
      unitsRooms,
      occupancyStatus,
      estimatedIncome,
      mainChallenge,
      mainGoal,
      additionalInfo,
      serviceType,
      propertyId 
    } = body;

    // Resolve "Other" property type and challenge
    const resolvedPropertyType = propertyType === 'Other' ? body.propertyTypeOther : propertyType;
    const resolvedMainChallenge = mainChallenge === 'Other (Please specify)' ? body.mainChallengeOther : mainChallenge;
    const resolvedMainGoal = mainGoal === 'Other (Please specify)' ? body.mainGoalOther : mainGoal;
    const resolvedOccupancyStatus = occupancyStatus === 'Other (Please specify)' ? body.occupancyStatusOther : occupancyStatus;

    // Validation
    const mandatoryFields = [
      'customerName',
      'customerEmail',
      'customerPhone',
      'slotId',
      'propertyType',
      'unitsRooms',
      'occupancyStatus',
      'mainChallenge',
      'mainGoal'
    ];

    const missingFields = mandatoryFields.filter(field => {
      if (field === 'propertyType') return !resolvedPropertyType;
      if (field === 'mainChallenge') return !resolvedMainChallenge;
      if (field === 'mainGoal') return !resolvedMainGoal;
      if (field === 'occupancyStatus') return !resolvedOccupancyStatus;
      return !body[field];
    });

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing mandatory fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // If slot-based booking
    if (slotId) {
      const slot = await prisma.availabilitySlot.findUnique({
        where: { id: slotId }
      });

      if (!slot || slot.isBooked) {
        return NextResponse.json({ error: 'This time slot is no longer available.' }, { status: 400 });
      }

      // Mark slot as booked
      await prisma.availabilitySlot.update({
        where: { id: slotId },
        data: { isBooked: true }
      });
    }

    const booking = await prisma.booking.create({
      data: {
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        timezone: timezone || 'UTC',
        slotId: slotId || null,
        propertyType: resolvedPropertyType || null,
        propertyLocation: propertyLocation || null,
        unitsRooms: unitsRooms ? String(unitsRooms) : null,
        occupancyStatus: resolvedOccupancyStatus || null,
        estimatedIncome: estimatedIncome || null,
        mainChallenge: resolvedMainChallenge || null,
        mainGoal: resolvedMainGoal || null,
        additionalInfo: additionalInfo || null,
        serviceType: serviceType || 'Property Assessment',
        propertyId: propertyId || null,
        status: 'PENDING',
      },
      include: {
        property: true,
        slot: true
      }
    }) as any;

    // Send emails
    try {
      await Promise.all([
        sendEmail({
          to: booking.customerEmail,
          subject: 'Request Received - Stable Partners',
          template: 'thank-you',
          context: { name: booking.customerName },
        }),
        sendEmail({
          to: process.env.EMAIL_USER || '',
          subject: `NEW BOOKING REQUEST: ${booking.customerName}`,
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
            scheduledTime: booking.slot 
              ? new Date(booking.slot.startTime).toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: booking.timezone 
                }) + ` (${booking.timezone})`
              : 'Manual scheduling',
            timezone: booking.timezone
          },
        }),
      ]);
    } catch (err) {
      console.error('Email sending failed:', err);
    }

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
