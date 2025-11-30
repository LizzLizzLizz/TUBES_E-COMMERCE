import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
// @ts-ignore - TypeScript cache issue with new component
import BannerCarousel from '@/components/BannerCarousel';

const prisma = new PrismaClient();

export default async function Home() {
  // Fetch categories from database
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'asc' },
    take: 5,
  });

  // Fetch all products
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 20, // Limit to 20 products per page
  });

  // Map categories to images (order: Apparel/Merch, Marker/Ink, Nozzle/Caps, Sketchbook, Spray Paint)
  const categoryImages = [
    'https://drive.google.com/uc?export=view&id=18MV2Dm2Y2_9-kKvpY7XADFNSenOtg0Dr', // Apparel/Merch (1st)
    'https://drive.google.com/uc?export=view&id=1Xps0eQ347TSzPdEbYGuCleZefOTjNyZy', // Marker and Ink (2nd)
    'https://drive.google.com/uc?export=view&id=18vpYarnJL8c5Cmt5XU3CzQ4HjZrKuRSQ', // Nozzle/Caps (3rd)
    'https://drive.google.com/uc?export=view&id=1If4aAjuk013mi7pTkJv99GgbUHRgzlv6', // Sketchbook (4th)
    'https://drive.google.com/uc?export=view&id=1FQaNhXd97rPIiIYkDpNZnfwY0-vdp9_S', // Spray Paint (5th)
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 sm:pb-16">
      {/* Hero Section - Banner Carousel */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <BannerCarousel />
      </section>

      {/* Kategori */}
      <section className="space-y-6 sm:space-y-8">
        <h2 className="text-center text-5xl sm:text-6xl font-normal text-gray-900" style={{ fontFamily: 'Aerosol Soldier' }}>Kategori</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              image={categoryImages[index]}
              categoryId={category.id}
            />
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-5xl sm:text-6xl font-normal text-gray-900" style={{ fontFamily: 'Aerosol Soldier' }}>Semua Produk</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/products" className="text-sm sm:text-base text-blue-600 hover:text-blue-800 font-medium">
            Lihat Semua →
          </Link>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ image, categoryId }: { image: string; categoryId: string }) {
  return (
    <Link href={`/products?category=${categoryId}`} className="group overflow-hidden rounded-lg block shadow-md hover:shadow-xl transition-shadow">
      <div className="relative h-40 sm:h-48 md:h-52 lg:h-56">
        <Image
          src={image}
          alt="Kategori"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </Link>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={product.images || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-2">{product.category.name}</p>
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}