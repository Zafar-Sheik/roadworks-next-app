// app/user/jobs/[id]/page.tsx
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { currentUser } from "@clerk/nextjs/server";
import PotholeSheet from "../../../components/PotholeSheet";

export default async function JobPage({ params }: { params: { id: string } }) {
  // Authentication checks
  if (!checkRole("user")) redirect("/");
  const user = await currentUser();
  if (!user) redirect("/");

  try {
    // Fetch job details
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.id}?userId=${user.id}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Job not found");
    const job = await response.json();

    // Check if job type contains "pothole" (case insensitive)
    const isPotholeJob = job.jobType?.some((type: string) =>
      type.toLowerCase().includes("pot_hole_filling")
    );

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{job.name}</h1>

        {isPotholeJob ? (
          <PotholeSheet />
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No specialized sheet required for this job type
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading job:", error);
    redirect("/user/jobs");
  }
}
