import { api } from "./api";

export const propertyManagementService = {
  getMyProperties: () =>
    api.get("/tenant/properties/my"),

  deleteProperty: (id: number) =>
    api.delete(`/tenant/properties/${id}`),
};
