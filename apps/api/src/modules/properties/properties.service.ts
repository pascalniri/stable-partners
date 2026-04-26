import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: {
        title: createPropertyDto.title,
        description: createPropertyDto.description,
        location: createPropertyDto.location,
        price: createPropertyDto.price || null,
        bedrooms: createPropertyDto.bedrooms || 0,
        bathrooms: createPropertyDto.bathrooms || 0,
        images: createPropertyDto.images || [],
        videoUrl: createPropertyDto.videoUrl || null,
        status: createPropertyDto.status || 'MANAGED',
      },
    });
  }

  async findAll() {
    return this.prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(id: string, updatePropertyDto: Partial<CreatePropertyDto>) {
    // Ensure the property exists first
    await this.findOne(id);

    // Clean undefined values to prevent Prisma from potentially choking
    const data: any = {};
    const fields = ['title', 'description', 'location', 'price', 'bedrooms', 'bathrooms', 'images', 'status', 'videoUrl'];
    
    fields.forEach(field => {
      if (updatePropertyDto[field] !== undefined) {
        data[field] = updatePropertyDto[field];
      }
    });
    
    return this.prisma.property.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.property.delete({
      where: { id },
    });
  }
}
