"use client";

import { useState } from "react";
import HeroSection from "@/views/Home/hero-section";
import PropertyPage from "@/views/Property/page";
import { PropertyQuery } from "@/services/propertyCatalog.service";
import FooterSection from "@/views/Home/footer";

export default function HomePage() {
  const [query, setQuery] = useState<PropertyQuery>({
    page: 1,
    sortBy: "name",
    sortOrder: "asc",
  });

  return (
    <>
      <HeroSection/>
      
      <PropertyPage/>

      <FooterSection/>
    </>
  );
}
