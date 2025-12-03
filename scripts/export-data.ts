import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SOURCE_DATABASE_URL || process.env.DATABASE_URL
    }
  }
});

async function exportData() {
  console.log('Exporting data from local database...');
  
  // Export all data
  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany();
  const variants = await prisma.variant.findMany();
  const orders = await prisma.order.findMany();
  const orderItems = await prisma.orderItem.findMany();
  
  const data = {
    users,
    categories,
    products,
    variants,
    orders,
    orderItems
  };
  
  fs.writeFileSync('database-export.json', JSON.stringify(data, null, 2));
  
  console.log('\n✅ Data exported successfully!');
  console.log(`📊 Statistics:`);
  console.log(`   Users: ${users.length}`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Products: ${products.length}`);
  console.log(`   Variants: ${variants.length}`);
  console.log(`   Orders: ${orders.length}`);
  console.log(`   Order Items: ${orderItems.length}`);
  console.log('\n📁 File saved: database-export.json');
  
  await prisma.$disconnect();
}

exportData().catch((e) => {
  console.error(e);
  process.exit(1);
});
