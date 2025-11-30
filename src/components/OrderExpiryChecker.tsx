'use client';

import { useEffect } from 'react';

export default function OrderExpiryChecker() {
  useEffect(() => {
    // Function to call auto-cancel API
    const checkExpiredOrders = async () => {
      try {
        await fetch('/api/orders/auto-cancel', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'your-secret-key'}`,
          },
        });
      } catch (error) {
        console.error('Failed to check expired orders:', error);
      }
    };

    // Check immediately on mount
    checkExpiredOrders();

    // Then check every 5 minutes
    const interval = setInterval(checkExpiredOrders, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
}
