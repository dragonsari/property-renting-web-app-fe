"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { api } from "@/services/api";

export default function PropertiesPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchProperties();
    } catch (error) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = properties.filter(
        (prop: any) =>
          prop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prop.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prop.city?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
  }, [searchTerm, properties]);

  const fetchProperties = async () => {
    try {
      const data = await api.getProperties();
      setProperties(data?.data || []);
      setFilteredProperties(data?.data || []);
    } catch (error) {
      enqueueSnackbar("Gagal memuat properti", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (propertyId: number) => {
    router.push(`/booking/${propertyId}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="text-center text-[#64748b]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-[#1e293b]">Properties</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#64748b]">Hi, {user?.name}</span>
              <button
                onClick={() => router.push("/usertransaction/orders")}
                className="px-4 py-2 bg-[#2467ff] hover:bg-[#1a4fcc] text-white rounded-lg text-sm"
              >
                My Orders
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari properti berdasarkan nama, lokasi, atau kota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2467ff] focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-[#64748b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-[#64748b]">Tidak ada properti ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property: any) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group cursor-pointer"
                onClick={() => handleBooking(property.id)}
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Badge */}
                  {property.isAvailable && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Tersedia
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-[#1e293b] mb-1">
                    {property.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center text-[#64748b] text-sm mb-2">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {property.city ||
                      property.address ||
                      "Lokasi tidak tersedia"}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-sm text-[#64748b]">Mulai dari</p>
                      <p className="text-xl font-bold text-[#2467ff]">
                        Rp {property.pricePerNight?.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#64748b]">/malam</p>
                    </div>

                    {/* Rating */}
                    {property.rating && (
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                        <svg
                          className="w-4 h-4 text-yellow-400 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-[#1e293b]">
                          {property.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Facilities */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {property.amenities
                          .slice(0, 3)
                          .map((amenity: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-[#64748b] px-2 py-1 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        {property.amenities.length > 3 && (
                          <span className="text-xs text-[#2467ff]">
                            +{property.amenities.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBooking(property.id);
                    }}
                    className="w-full mt-4 bg-[#2467ff] hover:bg-[#1a4fcc] text-white py-2 rounded-lg transition"
                  >
                    Booking Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
