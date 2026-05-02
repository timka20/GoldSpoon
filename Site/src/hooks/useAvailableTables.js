import { useState, useEffect, useMemo } from 'react';
import { api } from '../api/client';

const ACTIVE_ORDER_STATUSES = ['pending', 'cooking', 'ready', 'in_progress', 'active', 'new'];

export function useAvailableTables() {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [tData, oData, rData] = await Promise.all([
          api.getTables().catch(() => []),
          api.getOrders().catch(() => []),
          api.getReservations().catch(() => []),
        ]);
        if (!cancelled) {
          setTables(tData || []);
          setOrders(oData || []);
          setReservations(rData || []);
        }
      } catch {
        if (!cancelled) {
          setTables([]);
          setOrders([]);
          setReservations([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const now = new Date();

  const tablesWithActiveOrders = useMemo(() => {
    const ids = new Set();
    orders.forEach(order => {
      if (!order.Status) return;
      const status = String(order.Status).toLowerCase();
      const isActive = ACTIVE_ORDER_STATUSES.includes(status);
      if (isActive && order.TableID) {
        ids.add(order.TableID);
      }
    });
    return ids;
  }, [orders]);

  const otherUserReservations = useMemo(() => {
    const userId = localStorage.getItem('userId');
    const map = new Map(); 
    reservations.forEach(r => {
      if (!r.TableID) return;
      const resDate = r.ReservationDateTime ? new Date(r.ReservationDateTime) : null;
      const isUpcoming = !resDate || resDate >= now;
      if (isUpcoming && String(r.UserID) !== String(userId)) {
        map.set(r.TableID, r);
      }
    });
    return map;
  }, [reservations, now]);

  const myReservations = useMemo(() => {
    const userId = localStorage.getItem('userId');
    const map = new Map();
    reservations.forEach(r => {
      if (!r.TableID) return;
      const resDate = r.ReservationDateTime ? new Date(r.ReservationDateTime) : null;
      const isUpcoming = !resDate || resDate >= now;
      if (isUpcoming && String(r.UserID) === String(userId)) {
        map.set(r.TableID, r);
      }
    });
    return map;
  }, [reservations, now]);

  const availableForReservation = useMemo(() => {
    return tables.filter(t => {
      if (t.IsReserved) return false;
      if (tablesWithActiveOrders.has(t.TableID)) return false;
      if (otherUserReservations.has(t.TableID)) return false;
      return true;
    });
  }, [tables, tablesWithActiveOrders, otherUserReservations]);

  const availableForOrder = useMemo(() => {
    return tables.filter(t => {
      if (tablesWithActiveOrders.has(t.TableID)) return false;
      if (otherUserReservations.has(t.TableID)) return false;
      return true;
    });
  }, [tables, tablesWithActiveOrders, otherUserReservations]);

  return {
    tables,
    orders,
    reservations,
    loading,
    tablesWithActiveOrders,
    otherUserReservations,
    myReservations,
    availableForReservation,
    availableForOrder,
  };
}
