import { useState } from "react";
import { roomManagementService } from "@/services/roomManagement.service";

export function useRooms() {
  const [loading, setLoading] = useState(false);

  async function create(propertyId: number, body: any) {
    setLoading(true);
    await roomManagementService.create(propertyId, body);
    setLoading(false);
  }

  async function update(roomId: number, body: any) {
    setLoading(true);
    await roomManagementService.update(roomId, body);
    setLoading(false);
  }

  async function remove(roomId: number) {
    setLoading(true);
    await roomManagementService.remove(roomId);
    setLoading(false);
  }

  return { create, update, remove, loading };
}
