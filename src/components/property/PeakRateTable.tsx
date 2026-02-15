"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useRoomCalendar } from "@/hooks/useRoomCalender";

export default function PeakRateTable({ 
  roomId,
  refreshKey,
  onChange,
}: { 
  roomId: number;
  refreshKey:number;
  onChange : () => void;
}) {
  const [peaks, setPeaks] = useState<any[]>([]);
  const { deletePeak } = useRoomCalendar();

  useEffect(() => {
    api
      .get(`/tenant/rooms/${roomId}/peak`)
      .then((res) => setPeaks(res.data.data));
  }, [roomId, refreshKey]);

  async function remove(id: number) {
    if (!confirm("Hapus peak rate ini?")) return;
    await deletePeak(id);
    onChange();
    setPeaks((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="rounded-3xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">
          Peak Season Rates
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-3 text-left">Date Range</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Value</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>

          <tbody>
            {peaks.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-muted/40 transition"
              >
                <td className="px-6 py-4">
                  {p.startDate} – {p.endDate}
                </td>
                <td className="px-6 py-4 font-medium">
                  {p.type}
                </td>
                <td className="px-6 py-4">
                  {p.value}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => remove(p.id)}
                    className="text-sm text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!peaks.length && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No peak season rate added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
