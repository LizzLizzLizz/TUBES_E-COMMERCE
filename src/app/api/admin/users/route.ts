import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '@/lib/apiResponse';

const prisma = new PrismaClient();

// GET - List all users
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return errorResponse('Unauthorized', 401);
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(users, 'Users retrieved successfully');
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return errorResponse('Failed to fetch users', 500);
  }
}

// POST - Create new user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return errorResponse('Unauthorized', 401);
    }

    const { name, email, password, phone, address, role } = await req.json();

    if (!name || !email || !password) {
      return errorResponse('Name, email, and password are required', 400);
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role: role || 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse(user, 'User created successfully', 201);
  } catch (error) {
    console.error('Failed to create user:', error);
    return errorResponse('Failed to create user', 500);
  }
}
