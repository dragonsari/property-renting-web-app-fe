export default function RoomPriceList({ rooms }: { rooms: any[] }) {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-lg">Room Types</h2>

      {rooms.map((room) => (
        <div
          key={room.id}
          className="border rounded-lg p-4 flex justify-between"
        >
          <div>
            <p className="font-medium">{room.name}</p>
            <p className="text-sm text-muted-foreground">
              {room.description}
            </p>
          </div>

          <p className="font-semibold">
            IDR {room.basePrice.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
