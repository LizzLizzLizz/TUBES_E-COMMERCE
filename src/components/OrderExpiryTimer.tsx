'use client';

import { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface OrderExpiryTimerProps {
  createdAt: Date | string;
  status: string;
}

export default function OrderExpiryTimer({ createdAt, status }: OrderExpiryTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Only show timer for UNPAID orders
    if (status !== 'UNPAID') {
      return;
    }

    const calculateTimeLeft = () => {
      const created = new Date(createdAt);
      const expiryTime = new Date(created.getTime() + 15 * 60 * 1000); // 15 minutes from creation
      const now = new Date();
      const difference = expiryTime.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft('Expired');
        return;
      }

      const minutes = Math.floor(difference / 60000);
      const seconds = Math.floor((difference % 60000) / 1000);
      
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      setIsExpired(false);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [createdAt, status]);

  if (status !== 'UNPAID') {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
      <ClockIcon className="h-4 w-4" />
      <span className="font-medium">
        {isExpired ? 'Pesanan akan dibatalkan otomatis' : `Bayar dalam: ${timeLeft}`}
      </span>
    </div>
  );
}
