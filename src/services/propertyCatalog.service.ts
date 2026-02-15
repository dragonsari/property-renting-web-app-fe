import { api } from "./api";

export type PropertyQuery = {
  page: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  sortBy?: "name" | "price";
  sortOrder?: "asc" | "desc";
  checkIn?: string;
  checkOut?: string;
  latitude?: number;
  longitude?: number;
};

export async function getProperties(params: PropertyQuery) {
  const res = await api.get("/properties", { params });
  return res.data;
}

export async function getPropertyDetail(id: number) {
  const res = await api.get(`/properties/${id}`);
  return res.data;
}
