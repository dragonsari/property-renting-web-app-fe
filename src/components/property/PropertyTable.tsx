import DeletePropertyDialog from "./DeletePropertyDialog";
import Link from "next/link";

export default function PropertyTable({
  properties,
  onDeleted,
}: {
  properties: any[];
  onDeleted: () => void;
}) {
  return (
    <div className="rounded-3xl border bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">
          Property List
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-center">Rooms</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((p) => {
              console.log("PROPERTY ROW ID", p.id, typeof p.id);

              return(
              
              <tr
                key={p.id}
                className="border-t transition hover:bg-muted/40"
              >
                <td className="px-6 py-4 font-medium">
                  {p.name}
                </td>
                <td className="px-6 py-4">
                  {p.category?.name}
                </td>
                <td className="px-6 py-4 text-center">
                  {p.rooms?.length || 0}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                {typeof p.id === "number" && !isNaN(p.id) ? (
                  <Link
                    href={`/tenant/properties/${p.id}`}
                    className="inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted"
                  >
                    Edit
                  </Link>
                ) : (
                  <span className="text-red-500 text-sm">
                    Invalid ID
                  </span>
                )}


                  <DeletePropertyDialog
                    propertyId={p.id}
                    onSuccess={onDeleted}
                  />
                </td>
              </tr>
            )})}

            {!properties.length && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

