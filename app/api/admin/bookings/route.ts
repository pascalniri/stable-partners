import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        slot: true,
        session: true,
        property: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message,
      code: error.code
    }, { status: 500 });
  }
}
