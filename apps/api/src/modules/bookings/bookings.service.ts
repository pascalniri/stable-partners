import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private emailsService: EmailsService,
  ) {}

  // Create a new inquiry linked to a property
  async create(createBookingDto: CreateBookingDto) {
    try {
      console.log('📝 Attempting to create booking with:', JSON.stringify(createBookingDto, null, 2));
      
      // Strict UUID validation for propertyId
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let finalPropertyId: string | null = null;
      
      if (createBookingDto.propertyId && uuidRegex.test(createBookingDto.propertyId)) {
        finalPropertyId = createBookingDto.propertyId;
        console.log('✅ Valid propertyId detected:', finalPropertyId);
      } else if (createBookingDto.propertyId) {
        console.warn('⚠️ Invalid or empty propertyId provided, ignoring:', createBookingDto.propertyId);
      }

      console.log('🛰️ Executing Prisma create...');
      const booking = await this.prisma.booking.create({
        data: {
          customerName: createBookingDto.customerName,
          customerEmail: createBookingDto.customerEmail,
          customerPhone: createBookingDto.customerPhone || null,
          serviceType: createBookingDto.serviceType,
          description: createBookingDto.description || null,
          propertyId: finalPropertyId,
        },
        include: {
          property: true,
        },
      });

      console.log('✅ Booking created successfully:', booking.id);

      // Trigger Emails
      try {
        await Promise.all([
          this.emailsService.sendThankYou(
            booking.customerEmail,
            booking.customerName,
          ),
          this.emailsService.sendLeadNotification({
            name: booking.customerName,
            email: booking.customerEmail,
            phone: booking.customerPhone || undefined,
            serviceType: booking.serviceType,
            description: booking.description || undefined,
            propertyName: booking.property?.title,
          }),
        ]);
        console.log('📧 Emails sent successfully');
      } catch (emailError) {
        console.error('⚠️ Email service error (booking still created):', emailError.message);
        // We don't throw here so the user still gets a success response
      }

      return booking;
    } catch (error) {
      console.error('❌ Failed to create booking:', error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        property: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
