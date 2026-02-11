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
  const [refreshAvailability, setRefreshAvailability] = useState(0);
  const [refreshPeak, setRefreshPeak] = useState(0);

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 space-y-10 mt-6">
      
      <button
        onClick={() => router.back()}
        aria-label="Back"
        className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>


      <AvailabilityForm
        roomId={roomId}
        onSuccess={() => setRefreshAvailability((v) => v + 1)}
      />

      <AvailabilityCalendarTable
        roomId={roomId}
        refreshKey={refreshAvailability}
      />

      <PeakRateForm
        roomId={roomId}
        onSuccess={() => setRefreshPeak((v) => v + 1)}
      />

      <PeakRateTable
        roomId={roomId}
        refreshKey={refreshPeak}
      />
    </section>
  );
}
