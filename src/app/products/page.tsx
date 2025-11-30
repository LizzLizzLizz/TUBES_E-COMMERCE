import ProductCard from '@/components/ProductCard';
import { PrismaClient } from '@prisma/client';

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string;
  categoryId: string;
  category: Category;
};

const prisma = new PrismaClient();

function buildQuery(categoryId?: string) {
  const url = new URL('/products', 'http://localhost');
  if (categoryId) url.searchParams.set('category', categoryId);
  return url.pathname + url.search;
}

function FilterLink({ label, categoryId, active }: { label: string; categoryId?: string; active?: boolean }) {
  return (
    <a
      href={buildQuery(categoryId)}
      className={
        'rounded-full px-3 py-1 text-sm border transition-colors ' +
        (active ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100')
      }
    >
      {label}
    </a>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  // In Next.js 16 searchParams can be a Promise and must be awaited
  const params = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        AND: [
          params.category ? { categoryId: params.category } : {},
          params.search
            ? {
                OR: [
                  { name: { contains: params.search, mode: 'insensitive' } },
                  { description: { contains: params.search, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      include: { category: true },
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-5xl sm:text-6xl font-normal text-gray-900 text-center" style={{ fontFamily: 'Aerosol Soldier' }}>Produk</h1>
        
        {/* Search Results Indicator */}
        {params.search && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm">
              Hasil pencarian untuk: <strong className="text-gray-900">&quot;{params.search}&quot;</strong>
            </span>
            <span className="text-sm text-gray-500">({products.length} produk)</span>
          </div>
        )}
        
        {/* Category filter as plain links (no client event handlers in server component) */}
        <div className="flex flex-wrap gap-2 justify-center">
          <FilterLink label="Semua" active={!params.category} />
          {categories.map((c: Category) => (
            <FilterLink key={c.id} label={c.name} categoryId={c.id} active={params.category === c.id} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product: any) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-base sm:text-lg text-gray-600">Tidak ada produk ditemukan.</p>
          {params.search && (
            <p className="text-sm text-gray-500 mt-2">
              Coba gunakan kata kunci yang berbeda
            </p>
          )}
        </div>
      )}
    </div>
  );
}