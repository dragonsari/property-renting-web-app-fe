"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { api } from "@/services/api";

export default function SalesReport() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = await api.getSalesReport(
        dateRange.startDate,
        dateRange.endDate,
        token || "",
      );
      setReport(data);
    } catch (error) {
      enqueueSnackbar("Gagal memuat laporan", { variant: "error" });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Laporan Penjualan
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={fetchReport}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Terapkan Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Total Pendapatan</p>
            <p className="text-3xl font-bold text-gray-900">
              Rp {report?.summary?.totalRevenue?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
            <p className="text-3xl font-bold text-gray-900">
              {report?.summary?.totalOrders || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Rata-rata Transaksi</p>
            <p className="text-3xl font-bold text-gray-900">
              Rp {report?.summary?.averageOrderValue?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Daftar Transaksi
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                    Tanggal
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                    Properti
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {report?.orders?.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-4 px-4">{order.room?.property?.name}</td>
                    <td className="py-4 px-4">{order.user?.name}</td>
                    <td className="py-4 px-4 font-medium">
                      Rp {order.totalPrice?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
