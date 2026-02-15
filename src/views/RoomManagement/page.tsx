"use client";

import RoomTable from "@/components/property/RoomTable";
import RoomForm from "@/components/property/RoomForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomManagementView({
  propertyId,
}: {
  propertyId: number;
}) {
  const router = useRouter();
  const [refresh, setRefresh] = useState(0);

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

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Manage Rooms
        </h1>
        <p className="text-muted-foreground">
          Add, update, or remove rooms for this property
        </p>
      </div>

      <RoomForm
        propertyId={propertyId}
        onSuccess={() => setRefresh((v) => v + 1)}
      />

      <RoomTable
        propertyId={propertyId}
        refreshKey={refresh}
      />
    </section>
  );
}


