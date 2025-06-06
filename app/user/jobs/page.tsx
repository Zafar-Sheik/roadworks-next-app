// app/user/jobs/page.tsx
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchJobs } from "./SearchJobs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

interface Job {
  _id: string;
  name: string;
  company: string;
  jobType: string;
  isActive: boolean;
}

export default async function UserJobsDashboard({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  if (!checkRole("user")) redirect("/unauthorized");

  const searchQuery = searchParams?.search || "";
  const userId = user.id;

  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/jobs/user/${userId}?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Failed to fetch jobs");
    const jobs: Job[] = await response.json();

    // Group jobs by company for the N3 Repairs section
    const groupedJobs = jobs.reduce((acc, job) => {
      if (!acc[job.company]) acc[job.company] = [];
      acc[job.company].push(job);
      return acc;
    }, {} as Record<string, Job[]>);

    return (
      <div className="space-y-6">
        {/* Your Jobs Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Jobs</h2>
          <div className="text-sm text-gray-500">
            {jobs.length} {jobs.length === 1 ? "position" : "positions"} found
          </div>
        </div>
        {/* Search Input at Top */}
        <SearchJobs initialValue={searchQuery} />
        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
              <p className="text-gray-600">
                {searchQuery ? "No jobs found" : "No jobs assigned yet"}
              </p>
            </div>
          ) : (
            Object.entries(groupedJobs).map(([company, companyJobs]) => (
              <div key={company} className="space-y-6">
                {/* Company Section Header */}
                {company === "N3 Repairs" && (
                  <h2 className="text-xl font-semibold">{company}</h2>
                )}

                {/* Company Jobs */}
                <div className="space-y-4">
                  {companyJobs.map((job) => (
                    <div
                      key={job._id}
                      className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
                      <div className="space-y-1">
                        <h3 className="font-medium">{job.name}</h3>
                        <p className="text-sm text-gray-600">{company}</p>
                        <p className="text-sm text-gray-500">{job.jobType}</p>
                      </div>
                      <Link
                        href={`/user/jobs/${job._id}`}
                        className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-900">
                        View Details
                        <span className="ml-1">→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Error loading jobs</h3>
        <p className="mt-1 text-sm text-red-700">
          Please try refreshing the page or contact support
        </p>
      </div>
    );
  }
}
