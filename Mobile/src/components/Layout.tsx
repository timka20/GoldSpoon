import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import type { Order } from '../types';

const HIDDEN_NAV_PATHS = ['/login', '/register'];

export default function Layout() {
  const location = useLocation();
  const showNav = !HIDDEN_NAV_PATHS.includes(location.pathname);
  const { isAuthenticated } = useAuthStore();
  const { fetchOrders } = useOrderStore();
  const prevOrdersRef = useRef<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkOrders = async () => {
      const prev = prevOrdersRef.current;
      await fetchOrders();
      const current = useOrderStore.getState().orders;

      current.forEach((order) => {
        const old = prev.find((o) => o.OrderID === order.OrderID);
        if (old && old.Status !== order.Status) {
          const enabled = localStorage.getItem('notifications') === 'true';
          if (enabled && Notification.permission === 'granted') {
            new Notification('Золотая Ложка', {
              body: `Статус заказа #${order.OrderID} изменился: ${order.Status}`,
              icon: '/icon-192x192.png',
            });
          }
        }
      });

      prevOrdersRef.current = current;
    };

    checkOrders();
    const interval = setInterval(checkOrders, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchOrders]);

  return (
    <div className="flex flex-col h-screen bg-charcoal text-snow overflow-hidden">
      <main className="flex-1 overflow-y-auto hide-scrollbar safe-top safe-bottom">
        <Outlet />
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
