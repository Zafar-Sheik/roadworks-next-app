"use client";

import { usePathname, useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const SearchSheets = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Sync with URL search param on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search") || "";
    setSearchTerm(initialSearch);
    setIsMounted(true);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!isMounted) return;

    const debounceTimer = setTimeout(() => {
      const query = searchTerm.trim();
      const newParams = new URLSearchParams(window.location.search);

      if (query) {
        newParams.set("search", query);
      } else {
        newParams.delete("search");
      }

      router.push(`${pathname}?${newParams.toString()}`);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, pathname, router, isMounted]);

  return (
    <div className="w-full max-w-[240px] lg:max-w-md">
      <div className="relative">
        <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search sheets..."
          className={cn(
            "pl-8 pr-3 h-9",
            "transition-all duration-300",
            "focus-visible:ring-1 focus-visible:ring-primary"
          )}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};
