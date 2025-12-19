import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, password } = body;

    if (!code || !password) {
      return errorResponse('Verification code and password are required', 400);
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return errorResponse('Invalid verification code format', 400);
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters', 400);
    }

    // Find user with valid verification code
    const user = await prisma.user.findFirst({
      where: {
        resetToken: code,
        resetTokenExpiry: {
          gt: new Date(), // Code not expired
        },
      },
    });

    if (!user) {
      return errorResponse('Invalid or expired verification code', 400);
    }

    // Hash new password
    const hashedPassword = await hash(password, 10);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return successResponse(
      null,
      'Password has been reset successfully',
      200
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse('Failed to reset password', 500);
  }
}
