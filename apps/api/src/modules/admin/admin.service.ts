import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReplyBookingDto } from './dto/reply-booking.dto';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private emailsService: EmailsService,
  ) {}

  async getAllBookings() {
    return this.prisma.booking.findMany({
      include: {
        messages: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async replyToBooking(
    id: string,
    replyBookingDto: ReplyBookingDto,
    adminId: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // 1. Create a Message record
    await this.prisma.message.create({
      data: {
        content: replyBookingDto.message,
        bookingId: id,
        sender: 'ADMIN',
      },
    });

    // 2. Update Booking status
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
      },
    });

    // 3. Send Email
    await this.emailsService.sendMeetingDetails(
      booking.customerEmail,
      booking.customerName,
      replyBookingDto.scheduledDate,
      replyBookingDto.meetingLink,
    );

    return updatedBooking;
  }
}
