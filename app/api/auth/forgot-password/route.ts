import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mail';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security, don't reveal if user exists or not
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://stablepartners.com'}/admin/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Password Reset Request - Stable Partners',
      template: 'reset-password',
      context: { resetLink },
    });

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
