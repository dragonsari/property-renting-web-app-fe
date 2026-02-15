'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { api } from '@/services/api';

export default function BookingForm() {
  const router = useRouter();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [form, setForm] = useState({
    roomId: '',
    checkIn: '',
    checkOut: '',
    totalPrice: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const data = await api.getPropertyById(parseInt(params.id as string));
      setProperty(data?.data);
    } catch (error) {
      enqueueSnackbar('Gagal memuat properti', { variant: 'error' });
    }
  };

  const calculateTotal = () => {
    if (!form.checkIn || !form.checkOut || !property) return;
    const days = Math.ceil(
      (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    setForm({...form, totalPrice: days * property.pricePerNight});
  };

  useEffect(() => {
    calculateTotal();
  }, [form.checkIn, form.checkOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await api.createOrder({
        roomId: parseInt(form.roomId),
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        totalPrice: form.totalPrice
      }, token || '');
      
      enqueueSnackbar('Booking berhasil! Silakan upload bukti pembayaran', { 
        variant: 'success' 
      });
      router.push('/usertransaction/orders');
    } catch (error) {
      enqueueSnackbar('Booking gagal', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] p-8 flex items-center justify-center">
        <div className="text-center text-[#64748b]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Booking Properti</h1>
          <p className="text-[#64748b] mb-6">{property.name}</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">
                Pilih Kamar
              </label>
              <select
                className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#2467ff]"
                onChange={(e) => setForm({...form, roomId: e.target.value})}
                required
              >
                <option value="">Pilih kamar</option>
                {property.rooms?.map((room: any) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - Kapasitas {room.capacity} orang
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#64748b] mb-1">
                  Check-in
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#2467ff]"
                  onChange={(e) => setForm({...form, checkIn: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#64748b] mb-1">
                  Check-out
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#2467ff]"
                  onChange={(e) => setForm({...form, checkOut: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-[#64748b]">Total Harga</p>
              <p className="text-2xl font-bold text-[#2467ff]">
                Rp {form.totalPrice?.toLocaleString()}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2467ff] hover:bg-[#1a4fcc] text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Booking Sekarang'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}