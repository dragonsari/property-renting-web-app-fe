import { useEffect, useState } from "react";
import { propertyManagementService } from "@/services/propertyManagement.service";

export function useTenantProperties() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true); 
      const res = await propertyManagementService.getMyProperties();
      setData(res.data.data);
    } catch (e) {
      console.error("Failed fetch tenant properties", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, refetch: fetchData };
}
