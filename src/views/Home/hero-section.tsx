
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function HeroSection() {

  return (
    <main className="bg-white">
       <section className="relative h-[85vh]">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80"
          alt="Hero Background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4 text-white">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            Temukan Penginapan Terbaik
            <br />
            Sesuai Tanggal & Budget
          </h1>

          <p className="mt-4 max-w-xl text-white/90">
            Booking hotel, villa, dan apartment dengan harga terbaik dan fleksibel
            sesuai tanggal perjalananmu.
          </p>

          <div className="mt-6 flex gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="#property">Cari Penginapan</Link>
            </Button>

            <Button asChild variant="outline" className="border-white text-black hover:bg-white/10">
              <Link href="/RegisterTenant">Daftar sebagai Tenant</Link>
            </Button>
          </div>
        </div>
    </section>
    </main>
  );
}
