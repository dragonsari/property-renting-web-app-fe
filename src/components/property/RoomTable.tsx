"use client";

import DeleteRoomDialog from "./DeleteRoomDialog";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Link from "next/link";

export default function RoomTable({
  propertyId,
  refreshKey,
}: {
  propertyId: number;
  refreshKey: number;
}) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;

    setLoading(true);

    api
      .get(`/tenant/properties/${propertyId}`)
      .then((res) => {
        setRooms(res.data.data.rooms ?? []);
      })
      .catch((err) => {
        console.error("Failed load rooms", err);
      })
      .finally(() => setLoading(false));
  }, [propertyId, refreshKey]);

  if (loading) {
    return <div className="text-muted-foreground">Loading rooms...</div>;
  }

  return (
    <div className="rounded-3xl border bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Room List</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-3 text-left">Room</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((r) => (
              <tr
                key={r.id}
                className="border-t transition hover:bg-muted/40"
              >
                <td className="px-6 py-4 font-medium">{r.name}</td>
                <td className="px-6 py-4">
                  IDR {r.basePrice.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                  href={`/tenant/rooms/${r.id}`}
                  className="inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted"
                  >
                    edit
                  </Link>
                  <DeleteRoomDialog roomId={r.id} />
                </td>
              </tr>
            ))}

            {!rooms.length && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No rooms added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
