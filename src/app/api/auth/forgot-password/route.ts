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
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save token to database
      await prisma.user.update({
        where: { email },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Create reset URL
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

      // Send email
      try {
        await sendEmail({
          to: email,
          subject: 'Reset Kata Sandi - PERON.ID',
          html: getPasswordResetEmailTemplate(resetUrl, user.name || undefined),
        });
        console.log('Password reset email sent to:', email);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Log reset URL for development/testing
        console.log('\n==============================================');
        console.log('PASSWORD RESET LINK (Email failed to send)');
        console.log('==============================================');
        console.log('Email:', email);
        console.log('Reset URL:', resetUrl);
        console.log('Token expires in: 1 hour');
        console.log('==============================================\n');
        // Continue anyway - don't reveal if email sending failed
      }
    }

    return successResponse(
      null,
      'If an account exists with that email, a password reset link has been sent',
      200
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse('Failed to process request', 500);
  }
}
