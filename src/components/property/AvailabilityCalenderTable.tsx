"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import clsx from "clsx";

type Availability = {
  date: string;
  isAvailable: boolean;
};

type PeakRate = {
  startDate: string;
  endDate: string;
  type: "PERCENT" | "NOMINAL";
  value: number;
};

export default function AvailabilityCalendarTable({
  roomId,
  refreshKey,
}: {
  roomId: number;
  refreshKey: number;
}) {
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    api
      .get(`/tenant/rooms/${roomId}`)
      .then((res) => setRoom(res.data.data));
  }, [roomId, refreshKey]);

  const availabilityMap = useMemo(() => {
    const map = new Map<string, boolean>();
    room?.availabilities?.forEach((a: Availability) => {
      map.set(a.date.slice(0, 10), a.isAvailable);
    });
    return map;
  }, [room]);

  function getPeakForDate(date: Date): PeakRate | null {
    if (!room?.peakRates) return null;

    return room.peakRates.find((p: PeakRate) => {
      const d = date.getTime();
      return (
        d >= new Date(p.startDate).getTime() &&
        d <= new Date(p.endDate).getTime()
      );
    }) ?? null;
  }

  function calculatePrice(date: Date) {
    if (!room) return null;

    const base = room.basePrice;
    const peak = getPeakForDate(date);

    if (!peak) {
      return { price: base, label: "Normal" };
    }

    if (peak.type === "PERCENT") {
      const price = base + (base * peak.value) / 100;
      return {
        price,
        label: `+${peak.value}%`,
      };
    }

    return {
      price: base + peak.value,
      label: `+${peak.value.toLocaleString()}`,
    };
  }

  // calendar grid (same as sebelumnya)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const first = new Date(y, m, 1);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(y, m, 1 - offset);

    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentMonth]);

  if (!room) return null;

  return (
    <div className="rounded-3xl border bg-card shadow-sm p-6 space-y-4">
      {/* header */}
      <div className="flex justify-between items-center">
        <button onClick={() => setCurrentMonth(
          d => new Date(d.getFullYear(), d.getMonth() - 1, 1)
        )}>←</button>

        <h3 className="font-semibold">
          {currentMonth.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <button onClick={() => setCurrentMonth(
          d => new Date(d.getFullYear(), d.getMonth() + 1, 1)
        )}>→</button>
      </div>

      {/* days */}
      <div className="grid grid-cols-7 text-sm text-muted-foreground">
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => <div key={d}>{d}</div>)}
      </div>

      {/* calendar */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const inMonth = d.getMonth() === currentMonth.getMonth();
          const available = availabilityMap.get(key);
          const price = calculatePrice(d);

          return (
            <div
              key={key}
              className={clsx(
                "h-20 rounded-lg p-1 text-xs border",
                !inMonth && "opacity-40",
                available === false && "bg-red-100 border-red-300",
                available === true && "bg-green-100 border-green-300"
              )}
            >
              <div className="font-medium">{d.getDate()}</div>

              {price && (
                <div className="text-[10px] mt-1">
                  <div>IDR {price.price.toLocaleString()}</div>
                  {price.label !== "Normal" && (
                    <div className="text-orange-600">{price.label}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
