import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TARGET_DATABASE_URL || process.env.DATABASE_URL
    }
  }
});

async function importData() {
  console.log('Importing data to Neon database...');
  
  const data = JSON.parse(fs.readFileSync('database-export.json', 'utf-8'));
  
  // Import in order (respecting foreign keys)
  console.log('Importing users...');
  for (const user of data.users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user
    });
  }
  
  console.log('Importing categories...');
  for (const category of data.categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category
    });
  }
  
  console.log('Importing products...');
  for (const product of data.products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product
    });
  }
  
  console.log('Importing variants...');
  for (const variant of data.variants) {
    await prisma.variant.upsert({
      where: { id: variant.id },
      update: variant,
      create: variant
    });
  }
  
  console.log('Importing orders...');
  for (const order of data.orders) {
    await prisma.order.upsert({
      where: { id: order.id },
      update: order,
      create: order
    });
  }
  
  console.log('Importing order items...');
  for (const item of data.orderItems) {
    await prisma.orderItem.upsert({
      where: { id: item.id },
      update: item,
      create: item
    });
  }
  
  console.log('\n✅ Data imported successfully!');
  console.log(`📊 Imported:`);
  console.log(`   Users: ${data.users.length}`);
  console.log(`   Categories: ${data.categories.length}`);
  console.log(`   Products: ${data.products.length}`);
  console.log(`   Variants: ${data.variants.length}`);
  console.log(`   Orders: ${data.orders.length}`);
  console.log(`   Order Items: ${data.orderItems.length}`);
  
  await prisma.$disconnect();
}

importData().catch((e) => {
  console.error(e);
  process.exit(1);
});
