"use client";

import { useState } from "react";
import { useRoomCalendar } from "@/hooks/useRoomCalender";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AvailabilityForm({ 
  roomId,
  onSuccess,
}: { 
  roomId: number;
  onSuccess:()=> void;
}) {
  const { setAvailability, loading } = useRoomCalendar();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [available, setAvailable] = useState(true);

  async function submit() {
    if (!startDate || !endDate) {
      alert("Start & End date wajib diisi");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert("Start date tidak boleh lebih besar dari end date");
      return;
    }

    const dates: Date[] = [];
    let current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    await Promise.all(
      dates.map((d) =>
        setAvailability(roomId, {
          date: d.toISOString().slice(0, 10),
          isAvailable: available,
        })
      )
    );

    onSuccess();

    alert("Availability updated");
  }


  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">Room Availability</h3>

      <div className="grid gap-4 md:grid-cols-3">
        <Input type="date" onChange={(e) => setStartDate(e.target.value)} />
        <Input type="date" onChange={(e) => setEndDate(e.target.value)} />

        <select
          className="h-10 rounded-md border bg-background px-3 text-sm"
          onChange={(e) => setAvailable(e.target.value === "true")}
        >
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </div>

      <Button onClick={submit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
        {loading ? "Saving..." : "Apply Availability"}
      </Button>
    </div>
  );
}
