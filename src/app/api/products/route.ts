import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('search');
  
  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          categoryId ? { categoryId } : {},
          search ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ],
          } : {},
        ],
      },
      include: {
        category: true,
        variants: true,
      } as any,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const product = await prisma.product.create({
      data: json,
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error creating product' },
      { status: 500 }
    );
  }
}