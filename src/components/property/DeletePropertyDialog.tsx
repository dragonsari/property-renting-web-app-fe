"use client";

import { useState } from "react";
import { propertyManagementService } from "@/services/propertyManagement.service";

export default function DeletePropertyDialog({
  propertyId,
  onSuccess,
}: {
  propertyId: number;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus properti ini?")) return;

    setLoading(true);
    await propertyManagementService.deleteProperty(propertyId);
    setLoading(false);
    onSuccess();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted text-red-500"
    >
      Delete
    </button>
  );
}
