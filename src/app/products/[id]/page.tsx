import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductDetailClient from '@/components/ProductDetailClient';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const prisma = new PrismaClient();

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { 
      category: true,
      variants: true,
    } as any,
  }) as any;

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Kembali ke Produk
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
          <Image
            src={product.images || 'https://picsum.photos/seed/product/800/800'}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Link
              href={`/products?category=${product.categoryId}`}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {product.category.name}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {product.name}
            </h1>
          </div>

          <div className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(product.price)}
          </div>

          <div className="prose prose-sm">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <ProductDetailClient 
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
              images: product.images || '',
              variantType: product.variantType,
              variants: product.variants,
            }} 
          />

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Detail Produk</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Kategori</dt>
                <dd className="text-gray-900">{product.category.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">ID Produk</dt>
                <dd className="text-gray-900 font-mono text-xs">{product.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
