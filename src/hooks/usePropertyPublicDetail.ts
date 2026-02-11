import { useEffect, useState } from "react";
import { api } from "@/services/api";

export function usePropertyPublicDetail(id: number) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading };
}
