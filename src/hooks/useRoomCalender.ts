import { useState } from "react";
import { roomCalendarService } from "@/services/roomCalender.service";

export function useRoomCalendar() {
  const [loading, setLoading] = useState(false);

  async function setAvailability(roomId: number, body: any) {
    setLoading(true);
    await roomCalendarService.setAvailability(roomId, body);
    setLoading(false);
  }

  async function createPeak(roomId: number, body: any) {
    setLoading(true);
    await roomCalendarService.createPeak(roomId, body);
    setLoading(false);
  }

  async function deletePeak(peakId: number) {
    setLoading(true);
    await roomCalendarService.deletePeak(peakId);
    setLoading(false);
  }

  return { setAvailability, createPeak, deletePeak, loading };
}
