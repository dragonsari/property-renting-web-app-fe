"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { api } from "@/services/api";

interface ReplyReviewProps {
  reviewId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReplyReview({
  reviewId,
  onClose,
  onSuccess,
}: ReplyReviewProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await api.replyToReview(reviewId, reply, token || "");
      enqueueSnackbar("Balasan berhasil dikirim", { variant: "success" });
      onSuccess();
      onClose();
    } catch (error) {
      enqueueSnackbar("Gagal mengirim balasan", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Balas Review
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Balasan Anda
            </label>
            <textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tulis balasan Anda di sini..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? "Mengirim..." : "Kirim Balasan"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
