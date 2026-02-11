import { api } from "./api";

export const roomManagementService = {
  create: (propertyId: number, body: any) =>
    api.post(`/tenant/rooms/property/${propertyId}`, body),

  update: (roomId: number, body: any) =>
    api.patch(`/tenant/rooms/${roomId}`, body),

  remove: (roomId: number) =>
    api.delete(`/tenant/rooms/${roomId}`),
};
