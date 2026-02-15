'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { api } from '@/services/api';
import ReplyReview from '@/views/tenant/reviews/reply-review';

export default function ReservationList() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<number | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await api.getTenantOrders(token || '');
      setOrders(data?.data?.all || []);
    } catch (error) {
      enqueueSnackbar('Gagal memuat reservasi', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (orderId: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.confirmPayment(orderId, token || '');
      enqueueSnackbar('Pembayaran dikonfirmasi', { variant: 'success' });
      fetchOrders();
    } catch (error) {
      enqueueSnackbar('Gagal konfirmasi', { variant: 'error' });
    }
  };

  const handleReject = async (orderId: number) => {
    const reason = prompt('Alasan penolakan:');
    if (!reason) return;
    
    try {
      const token = localStorage.getItem('token');
      await api.rejectPayment(orderId, reason, token || '');
      enqueueSnackbar('Pembayaran ditolak', { variant: 'warning' });
      fetchOrders();
    } catch (error) {
      enqueueSnackbar('Gagal menolak', { variant: 'error' });
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!confirm('Yakin ingin membatalkan pesanan?')) return;
    const reason = prompt('Alasan pembatalan:');
    if (!reason) return;
    
    try {
      const token = localStorage.getItem('token');
      await api.cancelOrderTenant(orderId, reason, token || '');
      enqueueSnackbar('Pesanan dibatalkan', { variant: 'success' });
      fetchOrders();
    } catch (error) {
      enqueueSnackbar('Gagal membatalkan', { variant: 'error' });
    }
  };

  const handleReplyClick = (reviewId: number) => {
    setSelectedReview(reviewId);
    setShowReplyModal(true);
  };

  const handleReplySuccess = () => {
    fetchOrders();
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'Menunggu_Pembayaran':
        return 'bg-yellow-100 text-yellow-700';
      case 'Menunggu_Konfirmasi_Pembayaran':
        return 'bg-blue-100 text-blue-700';
      case 'Dibatalkan':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center text-[#64748b]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Properti</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tanggal</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Total</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Review</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#64748b]">
                  Belum ada reservasi
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">{order.room?.property?.name || '-'}</td>
                  <td className="py-4 px-6">{order.user?.name || '-'}</td>
                  <td className="py-4 px-6">
                    {order.checkIn ? new Date(order.checkIn).toLocaleDateString('id-ID') : '-'} - {order.checkOut ? new Date(order.checkOut).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="py-4 px-6 font-medium">
                    Rp {order.totalPrice?.toLocaleString() || 0}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {order.reviews?.length > 0 ? (
                      <div>
                        <p className="text-sm text-gray-900">⭐ {order.reviews[0].rating}</p>
                        <p className="text-xs text-gray-600 truncate max-w-xs">{order.reviews[0].comment}</p>
                        {!order.reviews[0].reply && (
                          <button
                            onClick={() => handleReplyClick(order.reviews[0].id)}
                            className="text-xs text-[#2467ff] hover:text-[#1a4fcc] mt-1"
                          >
                            Balas
                          </button>
                        )}
                        {order.reviews[0].reply && (
                          <p className="text-xs text-green-600 mt-1">Balasan: {order.reviews[0].reply}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Belum ada review</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {order.status === 'Menunggu_Konfirmasi_Pembayaran' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirm(order.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                        >
                          Konfirmasi
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                    {order.status === 'Menunggu_Pembayaran' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
                      >
                        Batalkan
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showReplyModal && selectedReview && (
        <ReplyReview
          reviewId={selectedReview}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedReview(null);
          }}
          onSuccess={handleReplySuccess}
        />
      )}
    </div>
  );
}