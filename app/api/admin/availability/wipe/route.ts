import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function DELETE() {
  try {
    const result = await prisma.availabilitySlot.deleteMany({
      where: {
        isBooked: false,
        startTime: {
          gte: startOfDay(new Date()), // Only clear from today onwards
        },
      },
    });

    console.log(`NUCLEAR WIPE: Removed ${result.count} unbooked slots from future.`);
    
    return NextResponse.json({ 
      success: true, 
      count: result.count 
    });
  } catch (error) {
    console.error('WIPE ERROR:', error);
    return NextResponse.json({ error: 'Failed to clear schedule' }, { status: 500 });
  }
}
