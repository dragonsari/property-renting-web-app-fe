import dayjs from "dayjs";

export default function PriceCalendar({ rooms }: { rooms: any[] }) {
  const days = Array.from({ length: 30 }, (_, i) =>
    dayjs().add(i, "day")
  );

  function isAvailable(room: any, date: string) {
    return !room.availabilities.some(
      (a:any)=>
        !a.isAvailable&&
      dayjs(a.date).format("YYYY-MM-DD")===date
    )
  }

  function finalPrice(room: any, date: string) {
    let price = room.basePrice;

    const peak = room.peakRates.find(
      (p: any) => date >= p.startDate && date <= p.endDate
    );

    if (peak) {
      price =
        peak.type === "PERCENT"
          ? price + price * (peak.value / 100)
          : price + peak.value;
    }

    return price;
  }

  function lowestPrice(date: string) {
    const prices = rooms
      .filter((r) => isAvailable(r, date))
      .map((r) => finalPrice(r, date));

    return prices.length ? Math.min(...prices) : null;
  }

  return (
    <div>
      <h2 className="font-semibold text-lg mb-2">
        Price Calendar (Next 30 Days)
      </h2>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const date = d.format("YYYY-MM-DD");
          const price = lowestPrice(date);

          return (
            <div
              key={date}
              className={`border rounded p-2 text-center ${
                price ? "" : "opacity-40"
              }`}
            >
              <p className="text-sm">{d.format("DD")}</p>

              {price ? (
                <p className="text-xs font-medium text-blue-600">
                  {price.toLocaleString()}
                </p>
              ) : (
                <p className="text-xs text-red-500">
                  Not Available
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
