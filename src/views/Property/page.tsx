"use client";

import { useState } from "react";
import { usePropertyCatalog } from "@/hooks/usePropertyCatalog";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilter from "@/components/property/PropertyFilter";
import PropertyPagination from "@/components/property/PropertyPagination";
import { PropertyQuery } from "@/services/propertyCatalog.service";

export default function PropertyPage() {
  const [query, setQuery] = useState<PropertyQuery>({
    page: 1,
    limit: 9,
    sortBy: "name",
    sortOrder: "asc",
  });

  const { data, loading } = usePropertyCatalog(query);

  function onChange(key: string, value: any) {
    setQuery((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
    }));
  }

  if (loading) return <p>Loading...</p>;
  if (!data) return null;
  
  return (
    <section id="property">
    <div 
    className="p-6 space-y-6 max-w-5xl mx-auto"
    id = "property"
    >
      <PropertyFilter query={query} onChange={(newQuery) => setQuery(newQuery)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.data.map((item: any) => (
          <PropertyCard key={item.id} property={item} />
        ))}
      </div>

      <PropertyPagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        onChange={(p) => onChange("page", p)}
      />
    </div>
    </section>
  );
}


