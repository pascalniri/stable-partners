import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [EmailsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
