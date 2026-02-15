"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPropertyDetail } from "@/services/propertyCatalog.service";
import RoomPriceList from "@/components/property/RoomPriceList";
import PriceCalendar from "@/components/property/PriceCalender";


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function PropertyDetail() {
  const router=useRouter();
  const params = useParams();
  const id = params?.id;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    getPropertyDetail(Number(id)).then((res) =>{
      setData(res.data);
      router.refresh();
    });
  }, [id]);

  if (!data) {
    return (
      <div className="flex justify-center py-32 text-muted-foreground">
        Loading property...
      </div>
    );
  }

  const images: string[] =
    data.images && data.images.length > 0
      ? data.images.map((img: any) => img.url)
      : [data.image];

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 space-y-14">
      <div className="relative overflow-hidden rounded-3xl border bg-background shadow-sm">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((src: string, i: number) => (
              <CarouselItem key={i} className="basis-full">
                <img
                  src={src}
                  alt={data.name}
                  className="h-105px w-full object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>
      </div>


      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          {data.name}
        </h1>

        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          {data.description}
        </p>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">
          Available Rooms
        </h2>

        <RoomPriceList rooms={data.rooms} />
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">
          Price & Availability
        </h2>

        <PriceCalendar rooms={data.rooms} />
      </div>
    </section>
  );
}
