import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @ApiProperty({ example: 'Consultancy' })
  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @ApiProperty({
    example: 'I want to discuss property management.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid-of-property', required: false })
  @IsString()
  @IsOptional()
  propertyId?: string;
}
