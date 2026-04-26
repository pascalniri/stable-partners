import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ReplyBookingDto } from './dto/reply-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('bookings')
  @ApiOperation({ summary: 'Get all bookings for admin dashboard' })
  @ApiResponse({ status: 200, description: 'Return list of bookings.' })
  getAllBookings() {
    return this.adminService.getAllBookings();
  }

  @Post('bookings/:id/reply')
  @ApiOperation({ summary: 'Reply to a booking with meeting details' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully updated and email sent.',
  })
  replyToBooking(
    @Param('id') id: string,
    @Body() replyBookingDto: ReplyBookingDto,
    @Request() req,
  ) {
    return this.adminService.replyToBooking(id, replyBookingDto, req.user.id);
  }
}
