import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@peron.id' },
    update: {},
    create: {
      email: 'admin@peron.id',
      name: 'Administrator',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = [
    { name: 'Spray Paint', slug: 'spray-paint' },
    { name: 'Marker and Ink', slug: 'marker-ink' },
    { name: 'Nozzle/Caps', slug: 'nozzle-caps' },
    { name: 'Sketchbook', slug: 'sketchbook' },
    { name: 'Apparel/Merch', slug: 'apparel-merch' },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name },
    });
    createdCategories.push({ ...category, slug: cat.slug });
    console.log('✅ Category created:', category.name);
  }

  // Create products (one per category)
  const products = [
    {
      name: 'Montana Gold 400ml - Premium Spray Paint',
      description: 'Cat semprot premium dengan 185+ warna cerah. Formula berbasis nitro-kombinasi dengan tekanan rendah untuk kontrol presisi tinggi. Cocok untuk detail halus dan coverage lebar. Pigmen berkualitas tinggi dengan hasil glossy finish.',
      price: 85000,
      stock: 50,
      images: 'https://picsum.photos/seed/montana-gold/800/800',
      categoryName: 'Spray Paint',
    },
    {
      name: 'Posca Paint Marker PC-5M Set (8 Colors)',
      description: 'Set 8 marker cat berkualitas tinggi dengan tip sedang (PC-5M). Tinta berbasis air, tidak beracun, dan permanen di sebagian besar permukaan. Ideal untuk kanvas, kayu, logam, plastik, dan kaca. Warna cerah dan opaque.',
      price: 320000,
      stock: 30,
      images: 'https://picsum.photos/seed/posca-set/800/800',
      categoryName: 'Marker and Ink',
    },
    {
      name: 'Universal Spray Cap Pack (10pcs Mixed)',
      description: 'Paket 10 nozzle/caps universal untuk berbagai merek spray paint. Termasuk fat caps untuk coverage luas, skinny caps untuk detail, dan outline caps. Kompatibel dengan Montana, Molotow, Ironlak, dan merek lainnya.',
      price: 75000,
      stock: 100,
      images: 'https://picsum.photos/seed/spray-caps/800/800',
      categoryName: 'Nozzle/Caps',
    },
    {
      name: 'Blackbook A4 Premium Sketchbook (150gsm)',
      description: 'Sketchbook premium A4 dengan 80 halaman kertas 150gsm. Cocok untuk sketsa, marker, pensil, dan tinta. Hardcover hitam dengan binding kuat. Ideal untuk sketch graffiti, character design, dan concept art.',
      price: 125000,
      stock: 40,
      images: 'https://picsum.photos/seed/blackbook/800/800',
      categoryName: 'Sketchbook',
    },
    {
      name: 'PERON.ID Crew T-Shirt (Black)',
      description: 'Kaos premium 100% cotton combed 30s dengan sablon khusus PERON.ID logo. Desain eksklusif untuk street art community. Tersedia ukuran S, M, L, XL, XXL. Nyaman dipakai dan tahan lama.',
      price: 150000,
      stock: 60,
      images: 'https://picsum.photos/seed/peron-tshirt/800/800',
      categoryName: 'Apparel/Merch',
    },
  ];

  for (const prod of products) {
    const category = createdCategories.find((c) => c.name === prod.categoryName);
    if (category) {
      const product = await prisma.product.create({
        data: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          stock: prod.stock,
          images: prod.images,
          categoryId: category.id,
        },
      });
      console.log('✅ Product created:', product.name);
    }
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
