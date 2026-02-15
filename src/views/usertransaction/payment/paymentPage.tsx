"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { api } from "@/services/api";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!orderId) {
      enqueueSnackbar("Order ID tidak ditemukan", { variant: "error" });
      router.push("/usertransaction/orders");
      return;
    }

    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const ordersData = await api.getMyOrders(token || "");
      const currentOrder = ordersData?.data?.find(
        (o: any) => o.id === parseInt(orderId!),
      );

      if (!currentOrder) {
        enqueueSnackbar("Order tidak ditemukan", { variant: "error" });
        router.push("/usertransaction/orders");
        return;
      }

      if (currentOrder.status !== "Menunggu_Pembayaran") {
        enqueueSnackbar("Order ini sudah tidak memerlukan pembayaran", {
          variant: "warning",
        });
        router.push("/usertransaction/orders");
        return;
      }

      setOrder(currentOrder);
    } catch (error) {
      enqueueSnackbar("Gagal memuat detail order", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validasi ukuran file (max 1MB)
      if (file.size > 1048576) {
        enqueueSnackbar("Ukuran file maksimal 1MB", { variant: "error" });
        return;
      }

      // Validasi tipe file
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        enqueueSnackbar("Format file harus .jpg atau .png", {
          variant: "error",
        });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !order) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      await api.uploadPaymentProof(order.id, selectedFile, token || "");
      enqueueSnackbar("Bukti pembayaran berhasil diupload", {
        variant: "success",
      });
      router.push("/usertransaction/orders");
    } catch (error) {
      enqueueSnackbar("Upload gagal", { variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    router.push("/usertransaction/orders");
  };

  const calculateTimeLeft = () => {
    if (!order) return null;
    const created = new Date(order.createdAt).getTime();
    const expiry = created + 60 * 60 * 1000; // 1 jam
    const now = new Date().getTime();
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes} menit ${seconds} detik`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="text-center text-[#64748b]">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#64748b] mb-4">Order tidak ditemukan</p>
          <button
            onClick={() => router.push("/usertransaction/orders")}
            className="px-4 py-2 bg-[#2467ff] hover:bg-[#1a4fcc] text-white rounded-lg"
          >
            Kembali ke Orders
          </button>
        </div>
      </div>
    );
  }

  const timeLeft = calculateTimeLeft();

  return (
    <div className="min-h-screen bg-[#f5f7fa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b]">
            Upload Bukti Pembayaran
          </h1>
          <p className="text-[#64748b] mt-2">Order #{order.id}</p>
        </div>

        {/* Timer Warning */}
        {timeLeft && (
          <div
            className={`rounded-xl p-4 mb-6 ${
              timeLeft === "Expired" ? "bg-red-50" : "bg-yellow-50"
            }`}
          >
            <p
              className={`text-sm ${
                timeLeft === "Expired" ? "text-red-700" : "text-yellow-700"
              }`}
            >
              ⏰{" "}
              {timeLeft === "Expired"
                ? "Batas waktu pembayaran telah habis. Pesanan akan otomatis dibatalkan."
                : `Sisa waktu upload: ${timeLeft}`}
            </p>
          </div>
        )}

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
            Ringkasan Order
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#64748b]">Properti</p>
              <p className="font-medium text-[#1e293b]">
                {order.room?.property?.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#64748b]">Kamar</p>
              <p className="font-medium text-[#1e293b]">
                {order.room?.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#64748b]">Check-in</p>
              <p className="font-medium text-[#1e293b]">
                {order.checkIn
                  ? new Date(order.checkIn).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#64748b]">Check-out</p>
              <p className="font-medium text-[#1e293b]">
                {order.checkOut
                  ? new Date(order.checkOut).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-[#64748b]">Total Pembayaran</p>
              <p className="text-2xl font-bold text-[#2467ff]">
                Rp {order.totalPrice?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Upload Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
            Upload Bukti Transfer
          </h2>

          {!previewUrl ? (
            // Upload Area
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="payment-proof"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
              <label htmlFor="payment-proof" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-[#64748b] mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <p className="text-[#1e293b] font-medium mb-1">
                    Klik untuk pilih file
                  </p>
                  <p className="text-sm text-[#64748b]">
                    Format: JPG, PNG (Maks. 1MB)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            // Preview Area
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto object-contain"
                />
                <p className="text-sm text-[#64748b] text-center mt-2">
                  {selectedFile?.name} ({(selectedFile!.size / 1024).toFixed(2)}{" "}
                  KB)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-[#2467ff] hover:bg-[#1a4fcc] text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload Bukti Pembayaran"}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-[#64748b] rounded-lg transition"
                >
                  Ganti File
                </button>
              </div>
            </div>
          )}

          {/* Cancel Button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleCancel}
              className="text-sm text-[#64748b] hover:text-[#1e293b]"
            >
              ← Kembali ke Orders
            </button>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-blue-50 rounded-xl p-6 mt-6">
          <h3 className="font-semibold text-[#1e293b] mb-2">
            Petunjuk Pembayaran
          </h3>
          <ul className="text-sm text-[#64748b] space-y-2">
            <li>
              • Transfer ke rekening:{" "}
              <span className="font-medium text-[#1e293b]">BCA 1234567890</span>{" "}
              a/n PT Property Rental
            </li>
            <li>
              • Jumlah transfer:{" "}
              <span className="font-medium text-[#1e293b]">
                Rp {order.totalPrice?.toLocaleString() || 0}
              </span>
            </li>
            <li>• Upload bukti transfer dalam format JPG/PNG (maks. 1MB)</li>
            <li>• Pembayaran akan dikonfirmasi oleh tenant dalam 1x24 jam</li>
            <li>
              • Jika tidak ada konfirmasi, silakan hubungi customer service
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
