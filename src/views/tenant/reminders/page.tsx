'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { api } from '@/services/api';

export default function OrderReminders() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await api.getOrderReminders(token || '');
      setReminders(data?.data || {});
    } catch (error) {
      enqueueSnackbar('Gagal memuat reminder', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pengingat Order</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Total Pengingat</p>
            <p className="text-3xl font-bold text-gray-900">
              {reminders?.totalReminders || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Perlu Tindakan</p>
            <p className="text-3xl font-bold text-yellow-600">
              {reminders?.summary?.need_action || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Urgent (>24 jam)</p>
            <p className="text-3xl font-bold text-red-600">
              {reminders?.summary?.urgent || 0}
            </p>
          </div>
        </div>

        {/* New Orders */}
        {reminders?.new_orders?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Baru (Perlu Konfirmasi)
            </h2>
            <div className="space-y-4">
              {reminders.new_orders.map((order: any) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{order.room?.property?.name}</p>
                      <p className="text-sm text-gray-600 mt-1">Customer: {order.user?.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.checkIn).toLocaleDateString('id-ID')} - {new Date(order.checkOut).toLocaleDateString('id-ID')}
                      </p>
                      <p className="text-sm font-medium text-blue-600 mt-1">
                        Rp {order.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      Menunggu Konfirmasi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Urgent Orders */}
        {reminders?.waiting_too_long?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Menunggu >24 Jam
            </h2>
            <div className="space-y-4">
              {reminders.waiting_too_long.map((order: any) => (
                <div key={order.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{order.room?.property?.name}</p>
                      <p className="text-sm text-gray-600 mt-1">Customer: {order.user?.name}</p>
                      <p className="text-sm text-gray-600">
                        Dibuat: {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      Urgent
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}