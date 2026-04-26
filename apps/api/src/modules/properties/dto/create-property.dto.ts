import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Modern Villa in Zurich' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A beautiful 5-bedroom villa with lake view.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Zurich, Switzerland' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 2500000, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 3, required: false })
  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @ApiProperty({ example: 2, required: false })
  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @ApiProperty({ example: ['https://example.com/image1.jpg'], required: false })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 'MANAGED', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'https://example.com/video.mp4', required: false })
  @IsString()
  @IsOptional()
  videoUrl?: string;
}
