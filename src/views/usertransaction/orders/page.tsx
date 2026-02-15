'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { api } from '@/services/api';

export default function UserOrdersPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    orderNo: '',
    status: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await api.getMyOrders(token || '', filters);
      setOrders(data?.data || []);
    } catch (error) {
      enqueueSnackbar('Gagal memuat pesanan', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  //PAYMENT FUNCTIONS
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, orderId: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validasi ukuran file (max 1MB)
      if (file.size > 1048576) {
        enqueueSnackbar('Ukuran file maksimal 1MB', { variant: 'error' });
        return;
      }
      
      // Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        enqueueSnackbar('Format file harus .jpg atau .png', { variant: 'error' });
        return;
      }
      
      setSelectedFile(file);
      setSelectedOrderId(orderId);
    }
  };

  const handleUploadPayment = async (orderId: number) => {
    if (!selectedFile || selectedOrderId !== orderId) return;
    
    try {
      const token = localStorage.getItem('token');
      await api.uploadPaymentProof(orderId, selectedFile, token || '');
      enqueueSnackbar('Bukti pembayaran berhasil diupload', { variant: 'success' });
      setSelectedFile(null);
      setSelectedOrderId(null);
      fetchOrders(); // Refresh data
    } catch (error) {
      enqueueSnackbar('Upload gagal', { variant: 'error' });
    }
  };

  const handleCancelPayment = () => {
    setSelectedFile(null);
    setSelectedOrderId(null);
  };

  //ORDER FUNCTIONS
  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Yakin ingin membatalkan pesanan?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await api.cancelOrder(orderId, token || '');
      enqueueSnackbar('Pesanan dibatalkan', { variant: 'success' });
      fetchOrders();
    } catch (error) {
      enqueueSnackbar('Gagal membatalkan', { variant: 'error' });
    }
  };

  const handleFilter = () => {
    fetchOrders();
  };

  const handleReset = () => {
    setFilters({
      startDate: '',
      endDate: '',
      orderNo: '',
      status: ''
    });
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
      <div className="min-h-screen bg-[#f5f7fa] p-8 flex items-center justify-center">
        <div className="text-center text-[#64748b]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#1e293b]">Pesanan Saya</h1>
            <button
              onClick={() => router.push('/properties')}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-[#64748b] rounded-lg text-sm"
            >
              Kembali ke Properties
            </button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Filter Pesanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">
                No. Order
              </label>
              <input
                type="text"
                value={filters.orderNo}
                onChange={(e) => setFilters({...filters, orderNo: e.target.value})}
                placeholder="Contoh: 123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Semua</option>
                <option value="Menunggu_Pembayaran">Menunggu Pembayaran</option>
                <option value="Menunggu_Konfirmasi_Pembayaran">Menunggu Konfirmasi</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleFilter}
                className="px-4 py-2 bg-[#2467ff] hover:bg-[#1a4fcc] text-white rounded-lg"
              >
                Filter
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-[#64748b]">Belum ada pesanan</p>
            </div>
          ) : (
            orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#1e293b]">
                      {order.room?.property?.name || 'Properti'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-[#64748b]">Check-in</p>
                        <p className="font-medium text-[#1e293b]">
                          {order.checkIn ? new Date(order.checkIn).toLocaleDateString('id-ID') : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748b]">Check-out</p>
                        <p className="font-medium text-[#1e293b]">
                          {order.checkOut ? new Date(order.checkOut).toLocaleDateString('id-ID') : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748b]">Kamar</p>
                        <p className="font-medium text-[#1e293b]">{order.room?.name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748b]">Total Harga</p>
                        <p className="font-bold text-[#2467ff]">
                          Rp {order.totalPrice?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - PAYMENT SECTION */}
                  <div className="w-full lg:w-80 space-y-3">
                    {/* Status: Menunggu Pembayaran - TAMPILKAN UPLOAD PAYMENT */}
                    {order.status === 'Menunggu_Pembayaran' && (
                      <div className="space-y-3">
                        {selectedOrderId === order.id && selectedFile ? (
                          // Tampilkan preview file yang dipilih
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-[#1e293b] truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-[#64748b]">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleUploadPayment(order.id)}
                                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                              >
                                Upload
                              </button>
                              <button
                                onClick={handleCancelPayment}
                                className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-[#64748b] text-sm rounded-lg"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Tombol pilih file
                          <div>
                            <input
                              type="file"
                              id={`file-${order.id}`}
                              className="hidden"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => handleFileSelect(e, order.id)}
                            />
                            <label
                              htmlFor={`file-${order.id}`}
                              className="block w-full text-center px-4 py-2 bg-[#2467ff] hover:bg-[#1a4fcc] text-white rounded-lg cursor-pointer"
                            >
                              Pilih Bukti Pembayaran
                            </label>
                            <p className="text-xs text-[#64748b] mt-1">
                              Format: JPG/PNG, Maks: 1MB
                            </p>
                          </div>
                        )}
                        
                        {/* Tombol Cancel Order */}
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="w-full px-4 py-2 border border-red-300 hover:bg-red-50 text-red-600 rounded-lg"
                        >
                          Batalkan Pesanan
                        </button>
                      </div>
                    )}

                    {/* Status: Menunggu Konfirmasi */}
                    {order.status === 'Menunggu_Konfirmasi_Pembayaran' && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-700">
                          Bukti pembayaran telah diupload. Menunggu konfirmasi tenant.
                        </p>
                        {order.paymentProof && (
                          <a 
                            href={order.paymentProof}
                            target="_blank"
                            className="text-xs text-blue-600 hover:underline mt-2 block"
                          >
                            Lihat Bukti Pembayaran
                          </a>
                        )}
                      </div>
                    )}

                    {/* Status: Confirmed */}
                    {order.status === 'confirmed' && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-700">
                          Pembayaran telah dikonfirmasi
                        </p>
                        {new Date(order.checkOut) < new Date() && !order.reviews?.length && (
                          <button
                            onClick={() => router.push(`/usertransaction/review/${order.id}`)}
                            className="mt-3 w-full px-4 py-2 bg-[#2467ff] hover:bg-[#1a4fcc] text-white rounded-lg"
                          >
                            Tulis Review
                          </button>
                        )}
                      </div>
                    )}

                    {/* Status: Dibatalkan */}
                    {order.status === 'Dibatalkan' && (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-700">
                          Pesanan dibatalkan
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}