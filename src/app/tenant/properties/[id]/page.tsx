import RoomManagementView from "@/views/RoomManagement/page";

export default async function Page({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  const propertyId = Number(id);

  if (!id || isNaN(propertyId)) {
    return (
      <div className="p-10 text-red-500">
        Property ID tidak valid
      </div>
    );
  }

  return <RoomManagementView propertyId={propertyId} />;
}
