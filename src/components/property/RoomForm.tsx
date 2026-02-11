"use client";

import { useState } from "react";
import { useRooms } from "@/hooks/useRooms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RoomForm({
  propertyId,
  onSuccess,
}: {
  propertyId: number;
  onSuccess: () => void;
}) {
  const { create, loading } = useRooms();

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    roomType: "STANDARD",
  });

  async function submit() {
    if(!propertyId || isNaN(propertyId))
      alert("Property ID tidak valid")
    if (!form.name || !form.basePrice) {
      alert("Room name & price wajib diisi");
      return;
    }

    await create(propertyId, {
      ...form,
      basePrice: Number(form.basePrice),
    });

    setForm({
      name: "",
      description: "",
      basePrice: "",
      roomType: "STANDARD",
    });

    onSuccess();
  }

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Add New Room</h2>

      <Input
        placeholder="Room name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

     
      <select
        className="h-10 rounded-md border bg-background px-3 text-sm"
        value={form.roomType}
        onChange={(e) =>
          setForm({ ...form, roomType: e.target.value })
        }
      >
        <option value="STANDARD">Standard</option>
        <option value="DELUXE">Deluxe</option>
        <option value="SUITE">Suite</option>
      </select>

      <Input
        placeholder="Base price (IDR)"
        type="number"
        value={form.basePrice}
        onChange={(e) =>
          setForm({ ...form, basePrice: e.target.value })
        }
      />

      <Input
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <Button onClick={submit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
        {loading ? "Saving..." : "Save Room"}
      </Button>
    </div>
  );
}
