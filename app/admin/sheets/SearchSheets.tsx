"use client";

import { usePathname, useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const SearchSheets = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const queryTerm = formData.get("search") as string;
          router.push(pathname + "?search=" + encodeURIComponent(queryTerm));
        }}
        className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon
              className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Search sheets..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              onChange={(e) => {
                // Optional: Add instant search without submit button
                if (e.target.value === "") {
                  router.push(pathname);
                }
              }}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <span className="hidden sm:inline">Search</span>
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
