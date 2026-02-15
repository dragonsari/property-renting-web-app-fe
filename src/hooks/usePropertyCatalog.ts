import { useEffect, useState } from "react";
import { getProperties, PropertyQuery } from "@/services/propertyCatalog.service";

export function usePropertyCatalog(query: PropertyQuery) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    getProperties(query)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        console.error("Failed load properties:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    query.page,
    query.limit,
    query.search,
    query.categoryId,
    query.sortBy,
    query.sortOrder,
    query.checkIn,
    query.checkOut,
    query.latitude,
    query.longitude,
  ]);

  return { data, loading };
}
