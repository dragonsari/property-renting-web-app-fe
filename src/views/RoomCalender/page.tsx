"use client";

import { useState } from "react";
import AvailabilityForm from "@/components/property/AvailabilityForm";
import AvailabilityCalendarTable from "@/components/property/AvailabilityCalenderTable";
import PeakRateForm from "@/components/property/PeakRateForm";
import PeakRateTable from "@/components/property/PeakRateTable";
import { useRouter } from "next/navigation";

export default function RoomCalendarView({
  roomId,
}: {
  roomId: number;
}) {
  const router = useRouter();
  const [refreshCalendar, setRefreshCalendar] = useState(0);

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 space-y-10 mt-6">
      <button
        onClick={() => router.back()}
        aria-label="Back"
        className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition"
      >
        ←
      </button>

      <AvailabilityForm
        roomId={roomId}
        onSuccess={() => setRefreshCalendar(v => v + 1)}
      />

      <AvailabilityCalendarTable
        roomId={roomId}
        refreshKey={refreshCalendar}
      />

      <PeakRateForm
        roomId={roomId}
        onSuccess={() => setRefreshCalendar(v => v + 1)}
      />

      <PeakRateTable
        roomId={roomId}
        refreshKey={refreshCalendar}
        onChange={()=> setRefreshCalendar(v=>v+1)}
      />
    </section>
  );
}
