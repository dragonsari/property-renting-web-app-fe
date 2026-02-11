"use client";

import { useEffect, useState } from "react";

type LocationResult = {
  label: string;
  latitude: number;
  longitude: number;
};

export default function DestinationInput({
  onSelect,
}: {
  onSelect: (location: LocationResult) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchLocations = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/locations/search?q=${query}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchLocations, 400);
    return () => {
      controller.abort();
      clearTimeout(delay);
    };
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tujuan (kota / area)"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
      />

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow">
          {results.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(item);
                setQuery(item.label);
                setResults([]);
                setShowDropdown(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}

      
      {loading && (
        <div className="absolute right-3 top-2 text-xs text-gray-400">
          Loading...
        </div>
      )}
    </div>
  );
}
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
