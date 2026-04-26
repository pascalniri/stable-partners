import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplyBookingDto {
  @ApiProperty({ example: 'https://meet.google.com/abc-defg-hij' })
  @IsUrl()
  @IsNotEmpty()
  meetingLink: string;

  @ApiProperty({ example: 'May 10th, 2026 at 2:00 PM' })
  @IsString()
  @IsNotEmpty()
  scheduledDate: string;

  @ApiProperty({ example: 'Looking forward to our session!' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
