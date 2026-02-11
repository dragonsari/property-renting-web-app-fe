import { useEffect, useState } from "react";
import { api } from "@/services/api";

export function useCategories() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories")
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
