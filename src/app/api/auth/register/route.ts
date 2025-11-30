import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { z } from 'zod';
import { rateLimit, getClientIp, rateLimitConfigs } from '@/lib/rateLimit';

// ✅ SECURITY FIX: Strong password validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export async function POST(request: Request) {
  try {
    // ✅ SECURITY FIX: Rate limiting for registration
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(`register:${clientIp}`, rateLimitConfigs.auth);

    if (!rateLimitResult.success) {
      return errorResponse(
        'Too many registration attempts. Please try again later.',
        429
      );
    }

    const body = await request.json();

    // ✅ SECURITY FIX: Validate input with strong password requirements
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.issues.map(e => e.message).join(', '),
        400
      );
    }

    const { name, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return errorResponse('Email already registered', 400);
    }

    // Hash password with salt (bcrypt automatically handles salt)
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      userWithoutPassword,
      'User registered successfully',
      201
    );
  } catch (error) {
    console.error('Error during registration:', error);
    return errorResponse('Failed to create user', 500);
  }
}