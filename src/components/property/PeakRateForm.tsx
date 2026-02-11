"use client";

import { useState } from "react";
import { useRoomCalendar } from "@/hooks/useRoomCalender";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PeakRateForm({ 
  roomId,
  onSuccess,
 }: { 
  roomId: number;
  onSuccess:()=>void;
}) {
  const { createPeak } = useRoomCalendar();
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    type: "PERCENT",
    value: "",
  });

  async function submit() {
    if (!form.startDate || !form.endDate || !form.value) {
      alert("Semua field wajib diisi");
      return;
    }

    await createPeak(roomId, {
      ...form,
      value: Number(form.value),
    });
    onSuccess();

    alert("Peak rate added");
  }

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">
        Add Peak Season Rate
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          type="date"
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />

        <Input
          type="date"
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <select
          className="h-10 rounded-md border bg-background px-3 text-sm"
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="PERCENT">Percent (%)</option>
          <option value="NOMINAL">Nominal</option>
        </select>

        <Input
          type="number"
          placeholder="Value"
          onChange={(e) =>
            setForm({ ...form, value: e.target.value })
          }
        />
      </div>

      <Button className="w-fit bg-blue-600 hover:bg-blue-700" onClick={submit} >
        Save Peak Rate
      </Button>
    </div>
  );
}
