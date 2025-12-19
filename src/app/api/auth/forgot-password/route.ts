import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { sendEmail, getPasswordResetEmailTemplate } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return errorResponse('Email is required', 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success (security: don't reveal if email exists)
    // But only send email if user exists
    if (user) {
      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save code to database
      await prisma.user.update({
        where: { email },
        data: {
          resetToken: verificationCode,
          resetTokenExpiry,
        },
      });

      // Send email
      try {
        await sendEmail({
          to: email,
          subject: 'Kode Verifikasi Reset Kata Sandi - PERON.ID',
          html: getPasswordResetEmailTemplate(verificationCode, user.name || undefined),
        });
        console.log('Password reset code sent to:', email);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Log verification code for development/testing
        console.log('\n==============================================');
        console.log('VERIFICATION CODE (Email failed to send)');
        console.log('==============================================');
        console.log('Email:', email);
        console.log('Code:', verificationCode);
        console.log('Code expires in: 1 hour');
        console.log('==============================================\n');
        // Continue anyway - don't reveal if email sending failed
      }
    }

    return successResponse(
      null,
      'If an account exists with that email, a verification code has been sent',
      200
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse('Failed to process request', 500);
  }
}
