
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('🧪 Testing Booking Creation...');
    const booking = await prisma.booking.create({
      data: {
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '+123456789',
        serviceType: 'Full Management Protocol',
        description: 'Test Description',
      }
    });
    console.log('✅ Success! Created booking ID:', booking.id);
  } catch (error) {
    console.error('❌ Error during creation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
