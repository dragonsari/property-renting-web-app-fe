"use client";

import { useTenantProperties } from "@/hooks/useTenantProperties";
import PropertyTable from "@/components/property/PropertyTable";
import PropertyCreateForm from "@/components/property/PropertyCreateForm";
import { useState } from "react";

export default function TenantPropertiesView() {
  const { data, loading, refetch } = useTenantProperties();
  const [refresh, setRefresh] = useState(0);

  if (loading) {
    return (
      <div className="flex justify-center py-32 text-muted-foreground">
        Loading properties...
      </div>
    );
  }

  return (
    
    <section className="mt-6 mx-auto max-w-6xl px-4 py-14 space-y-10">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            My Properties
          </h1>
          <p className="text-muted-foreground">
            Manage and edit your listed properties
          </p>
        </div>
      </div>
      <PropertyCreateForm 
        onSuccess={refetch}
      />

      <PropertyTable
        properties={data}
        onDeleted={refetch}
      />
    </section>
  );
}
