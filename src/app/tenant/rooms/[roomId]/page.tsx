import RoomCalendarView from "@/views/RoomCalender/page";

export default async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return <RoomCalendarView roomId={Number(roomId)} />;
}
