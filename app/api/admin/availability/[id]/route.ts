import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if it's booked - don't allow deleting booked slots without cancelling first
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id },
    });

    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    if (slot.isBooked) {
      return NextResponse.json({ error: 'Cannot delete a booked slot. Please cancel the booking first.' }, { status: 400 });
    }

    await prisma.availabilitySlot.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting slot:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
