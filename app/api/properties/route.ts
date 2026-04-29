import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        price: body.price || null,
        bedrooms: body.bedrooms || 0,
        bathrooms: body.bathrooms || 0,
        images: body.images || [],
        videoUrl: body.videoUrl || null,
        status: body.status || 'MANAGED',
      },
    });
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
