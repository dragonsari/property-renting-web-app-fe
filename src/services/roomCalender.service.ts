import { api } from "./api";

export const roomCalendarService = {
  setAvailability: (roomId: number, body: any) =>
    api.post(`/tenant/rooms/${roomId}/availability`, body),

  createPeak: (roomId: number, body: any) =>
    api.post(`/tenant/rooms/${roomId}/peak`, body),

  deletePeak: (peakId: number) =>
    api.delete(`/tenant/rooms/peak/${peakId}`),
};
