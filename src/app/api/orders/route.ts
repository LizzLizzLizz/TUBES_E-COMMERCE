import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        user: {
          email: session.user.email!,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const json = await request.json();
    const { items, address, total } = json;

    // Check stock availability for all items
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Produk tidak ditemukan` },
          { status: 400 }
        );
      }

      // Check if product has variants
      if (product.variants && product.variants.length > 0) {
        // Product has variants - check variant stock
        if (!item.variantId) {
          return NextResponse.json(
            { error: `Silakan pilih varian untuk ${product.name}` },
            { status: 400 }
          );
        }

        const variant = product.variants.find(v => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json(
            { error: `Varian tidak ditemukan untuk ${product.name}` },
            { status: 400 }
          );
        }

        if (variant.stock < item.quantity) {
          return NextResponse.json(
            { error: `Stok tidak mencukupi untuk ${product.name} - ${variant.name}. Stok tersedia: ${variant.stock}` },
            { status: 400 }
          );
        }
      } else {
        // Product has no variants - check product stock
        if (product.stock < item.quantity) {
          return NextResponse.json(
            { error: `Stok tidak mencukupi untuk produk ${product.name}. Stok tersedia: ${product.stock}` },
            { status: 400 }
          );
        }
      }
    }

    // Create order and reduce stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Reduce stock for each item
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (product?.variants && product.variants.length > 0 && item.variantId) {
          // Reduce variant stock
          await tx.variant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } else {
          // Reduce product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Create the order
      return await tx.order.create({
        data: {
          user: {
            connect: {
              email: session.user!.email!,
            },
          },
          status: 'UNPAID',
          address,
          total,
          items: {
            create: items.map((item: any) => ({
              product: {
                connect: {
                  id: item.productId,
                },
              },
              quantity: item.quantity,
              price: item.price,
              variantId: item.variantId || null,
              variantName: item.variantName || null,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    );
  }
}