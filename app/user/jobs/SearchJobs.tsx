// app/user/jobs/SearchJobs.tsx
"use client";

import { useRouter } from "next/navigation";

export function SearchJobs({ initialValue }: { initialValue: string }) {
  const router = useRouter();

  return (
    <input
      type="text"
      placeholder="Search jobs..."
      defaultValue={initialValue}
      onChange={(e) => {
        router.push(`/user/jobs?search=${e.target.value}`);
      }}
      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
    />
  );
}
