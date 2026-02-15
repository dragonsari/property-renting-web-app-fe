"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { api } from "@/services/api";

interface ReservationFormProps {
  propertyId?: number;
  propertyName?: string;
  pricePerNight?: number;
}

export default function ReservationForm({
  propertyId,
  propertyName,
  pricePerNight,
}: ReservationFormProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    roomId: "",
    checkIn: "",
    checkOut: "",
    totalPrice: 0,
  });

  const calculateTotal = () => {
    if (!form.checkIn || !form.checkOut || !pricePerNight) return;
    const days = Math.ceil(
      (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    setForm({ ...form, totalPrice: days * pricePerNight });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await api.createOrder(
        {
          propertyId: propertyId,
          roomId: parseInt(form.roomId),
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          totalPrice: form.totalPrice,
        },
        token || "",
      );

      enqueueSnackbar("Booking berhasil! Silakan upload bukti pembayaran", {
        variant: "success",
      });
      router.push("/usertransaction/orders");
    } catch (error) {
      enqueueSnackbar("Booking gagal", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-[#1e293b] mb-6">Form Booking</h2>

      {propertyName && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-[#64748b]">Properti</p>
          <p className="font-medium text-[#1e293b]">{propertyName}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#64748b] mb-1">
            Pilih Kamar
          </label>
          <select
            className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#2467ff]"
            onChange={(e) => setForm({ ...form, roomId: e.target.value })}
            required
          >
            <option value="">Pilih kamar</option>
            <option value="1">Kamar Deluxe - Kapasitas 2 orang</option>
            <option value="2">Kamar Superior - Kapasitas 3 orang</option>
            <option value="3">Kamar Family - Kapasitas 4 orang</option>
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
              onChange={(e) => {
                setForm({ ...form, checkIn: e.target.value });
                setTimeout(calculateTotal, 100);
              }}
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
              onChange={(e) => {
                setForm({ ...form, checkOut: e.target.value });
                setTimeout(calculateTotal, 100);
              }}
              required
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-[#64748b]">Total Harga</p>
          <p className="text-2xl font-bold text-[#2467ff]">
            Rp {form.totalPrice?.toLocaleString() || 0}
          </p>
          {pricePerNight && (
            <p className="text-xs text-[#64748b] mt-1">
              Rp {pricePerNight.toLocaleString()} x malam
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2467ff] hover:bg-[#1a4fcc] text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Booking Sekarang"}
        </button>
      </form>
    </div>
  );
}
