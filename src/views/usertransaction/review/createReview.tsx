"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { api } from "@/services/api";

export default function CreateReview() {
  const router = useRouter();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    checkOrder();
  }, []);

  const checkOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const orderId = parseInt(params.orderId as string);

      const ordersData = await api.getMyOrders(token || "");
      const currentOrder = ordersData?.data?.find((o: any) => o.id === orderId);

      if (!currentOrder) {
        enqueueSnackbar("Order tidak ditemukan", { variant: "error" });
        router.push("/usertransaction/orders");
        return;
      }

      if (currentOrder.reviews?.length > 0) {
        enqueueSnackbar("Anda sudah memberikan review", { variant: "info" });
        router.push("/usertransaction/orders");
        return;
      }

      setOrder(currentOrder);
    } catch (error) {
      enqueueSnackbar("Gagal memuat data", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await api.createReview(
        {
          orderId: parseInt(params.orderId as string),
          propertyId: order.room.property.id,
          rating: review.rating,
          comment: review.comment,
        },
        token || "",
      );

      enqueueSnackbar("Review berhasil dikirim", { variant: "success" });
      router.push("/usertransaction/orders");
    } catch (error) {
      enqueueSnackbar("Gagal mengirim review", { variant: "error" });
    } finally {
      setSubmitting(false);
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tulis Review
          </h1>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-medium text-gray-900">
              {order?.room?.property?.name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(order?.checkIn).toLocaleDateString("id-ID")} -{" "}
              {new Date(order?.checkOut).toLocaleDateString("id-ID")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReview({ ...review, rating: star })}
                    className={`w-12 h-12 rounded-lg text-lg font-semibold transition ${
                      review.rating >= star
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Komentar
              </label>
              <textarea
                rows={5}
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Bagaimana pengalaman menginap Anda?"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? "Mengirim..." : "Kirim Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
