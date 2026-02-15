'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { api } from '@/services/api';

export default function PropertyReport() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await api.getPropertyReport(token || '');
      setProperties(data?.data?.properties || []);
    } catch (error) {
      enqueueSnackbar('Gagal memuat laporan properti', { variant: 'error' });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Laporan Properti</h1>

        <div className="grid grid-cols-1 gap-6">
          {properties.map((property: any) => (
            <div key={property.propertyId} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4">
                {property.propertyImage && (
                  <img 
                    src={property.propertyImage} 
                    alt={property.propertyName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{property.propertyName}</h3>
                  <p className="text-gray-600 text-sm mt-1">{property.propertyAddress}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Kamar</p>
                      <p className="text-lg font-semibold text-gray-900">{property.totalRooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Booking</p>
                      <p className="text-lg font-semibold text-gray-900">{property.totalBookings}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Pendapatan</p>
                      <p className="text-lg font-semibold text-gray-900">
                        Rp {property.totalRevenue?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating Rata-rata</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {property.averageRating?.toFixed(1)} ⭐
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Jumlah Review: {property.reviewsCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}