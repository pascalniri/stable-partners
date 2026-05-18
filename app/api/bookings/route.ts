import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { getAuthenticatedUser } from "@/lib/auth";
import { formatInTimezone } from "@/lib/scheduler";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        property: true,
        session: true,
        slot: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      sessionId, // For new session-based booking
      notes,      // For new session-based booking
      customerPhone,
      timezone = "UTC",
      
      // Old slot-based booking fields
      customerName: inputName,
      customerEmail: inputEmail,
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

    // --- NEW CALENDLY SESSION-BASED BOOKING FLOW ---
    if (sessionId) {
      const authUser = await getAuthenticatedUser();
      if (!authUser) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in to book a session." },
          { status: 401 }
        );
      }

      // Fetch user from DB
      const dbUser = await prisma.user.findUnique({
        where: { id: authUser.sub },
      });

      if (!dbUser) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      // Fetch session slot
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        return NextResponse.json({ error: "Session slot not found." }, { status: 404 });
      }

      if (session.status !== "OPEN") {
        return NextResponse.json(
          { error: "This session has already been booked or cancelled." },
          { status: 400 }
        );
      }

      // Create booking and update session inside a transaction
      const [booking] = await prisma.$transaction([
        prisma.booking.create({
          data: {
            customerName: dbUser.name || dbUser.email.split("@")[0],
            customerEmail: dbUser.email,
            customerPhone: customerPhone || null,
            timezone: timezone || "UTC",
            sessionId: session.id,
            userId: dbUser.id,
            notes: notes || null,
            status: "CONFIRMED", // Pre-confirmed like Calendly
            serviceType: "Consultation Session",
            description: notes || "Booked consultation session.",
          },
          include: {
            session: true,
            user: {
              select: { name: true, email: true }
            }
          }
        }),
        prisma.session.update({
          where: { id: session.id },
          data: { status: "BOOKED" },
        }),
      ]);

      // Format date in target timezone
      const formattedDate = formatInTimezone(
        new Date(session.startTime),
        timezone,
        "full"
      ) + ` (${timezone})`;

      // Email notifications
      try {
        await Promise.all([
          // Email to User
          sendEmail({
            to: dbUser.email,
            subject: "Session Confirmed - Stable Partners",
            template: "meeting-details",
            context: {
              name: dbUser.name || dbUser.email.split("@")[0],
              date: formattedDate,
              link: "https://meet.google.com/abc-defg-hij", // placeholder or dynamic link
            },
          }),
          // Email to Admin
          prisma.user.findFirst({ where: { role: "ADMIN" } }).then(async (adminUser) => {
            if (adminUser) {
              await sendEmail({
                to: adminUser.email,
                subject: `New Session Booking: ${dbUser.name || dbUser.email}`,
                template: "lead-notification",
                context: {
                  name: dbUser.name || dbUser.email,
                  email: dbUser.email,
                  phone: customerPhone || "N/A",
                  propertyType: "N/A",
                  propertyLocation: "N/A",
                  unitsRooms: "N/A",
                  occupancyStatus: "N/A",
                  estimatedIncome: "N/A",
                  mainChallenge: notes || "N/A",
                  mainGoal: "Consultation Call",
                  additionalInfo: "Calendly-style Session Booking",
                  serviceType: "Consultation Session",
                  propertyName: "N/A",
                  scheduledTime: formattedDate,
                  timezone: timezone
                },
              });
            }
          }),
        ]);
      } catch (err) {
        console.error("Email sending failed for session booking:", err);
      }

      return NextResponse.json(booking, { status: 201 });
    }

    // --- OLD SLOT-BASED BOOKING FLOW ---
    const resolvedPropertyType = propertyType === "Other" ? body.propertyTypeOther : propertyType;
    const resolvedMainChallenge = mainChallenge === "Other (Please specify)" ? body.mainChallengeOther : mainChallenge;
    const resolvedMainGoal = mainGoal === "Other (Please specify)" ? body.mainGoalOther : mainGoal;
    const resolvedOccupancyStatus = occupancyStatus === "Other (Please specify)" ? body.occupancyStatusOther : occupancyStatus;

    // Validation
    const mandatoryFields = [
      "customerName",
      "customerEmail",
      "customerPhone",
      "slotId",
      "propertyType",
      "unitsRooms",
      "occupancyStatus",
      "mainChallenge",
      "mainGoal"
    ];

    const missingFields = mandatoryFields.filter(field => {
      if (field === "propertyType") return !resolvedPropertyType;
      if (field === "mainChallenge") return !resolvedMainChallenge;
      if (field === "mainGoal") return !resolvedMainGoal;
      if (field === "occupancyStatus") return !resolvedOccupancyStatus;
      return !body[field];
    });

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing mandatory fields: ${missingFields.join(", ")}` 
      }, { status: 400 });
    }

    if (slotId) {
      const session = await prisma.session.findUnique({
        where: { id: slotId }
      });

      if (!session || session.status !== "OPEN") {
        return NextResponse.json({ error: "This time slot is no longer available." }, { status: 400 });
      }

      await prisma.session.update({
        where: { id: slotId },
        data: { status: "BOOKED" }
      });
    }

    const booking = await prisma.booking.create({
      data: {
        customerName: inputName,
        customerEmail: inputEmail,
        customerPhone: customerPhone || null,
        timezone: timezone || "UTC",
        sessionId: slotId || null,
        propertyType: resolvedPropertyType || null,
        propertyLocation: propertyLocation || null,
        unitsRooms: unitsRooms ? String(unitsRooms) : null,
        occupancyStatus: resolvedOccupancyStatus || null,
        estimatedIncome: estimatedIncome || null,
        mainChallenge: resolvedMainChallenge || null,
        mainGoal: resolvedMainGoal || null,
        additionalInfo: additionalInfo || null,
        serviceType: serviceType || "Property Assessment",
        propertyId: propertyId || null,
        status: "PENDING",
      },
      include: {
        property: true,
        session: true
      }
    }) as any;

    try {
      await Promise.all([
        sendEmail({
          to: booking.customerEmail,
          subject: "Request Received - Stable Partners",
          template: "thank-you",
          context: { name: booking.customerName },
        }),
        sendEmail({
          to: process.env.EMAIL_USER || "",
          subject: `NEW BOOKING REQUEST: ${booking.customerName}`,
          template: "lead-notification",
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
            scheduledTime: booking.session 
              ? new Date(booking.session.startTime).toLocaleString("en-US", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric", 
                  hour: "2-digit", 
                  minute: "2-digit",
                  timeZone: booking.timezone 
                }) + ` (${booking.timezone})`
              : "Manual scheduling",
            timezone: booking.timezone
          },
        }),
      ]);
    } catch (err) {
      console.error("Email sending failed:", err);
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      message: error.message,
      code: error.code
    }, { status: 500 });
  }
}

