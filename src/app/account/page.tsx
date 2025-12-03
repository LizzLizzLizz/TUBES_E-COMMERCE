import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AccountTabs from '@/components/AccountTabs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      latitude: true,
      longitude: true,
      city: true,
      province: true,
      postalCode: true,
      role: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
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

  return (
    <div className="max-w-7xl mx-auto">
      <AccountTabs user={user} orders={orders} />
    </div>
  );
}
