// app/user/completed-jobs/page.tsx
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchJobs } from "../jobs/SearchJobs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

interface Job {
  _id: string;
  name: string;
  company: string;
  jobType: string[];
  isComplete: boolean;
  completedAt: Date;
}

export default async function CompletedJobsDashboard({
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
    params.append("isComplete", "true"); // Add completed filter

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/jobs/user/${userId}?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Failed to fetch completed jobs");
    const jobs: Job[] = await response.json();

    // Group jobs by company
    const groupedJobs = jobs.reduce((acc, job) => {
      if (!acc[job.company]) acc[job.company] = [];
      acc[job.company].push(job);
      return acc;
    }, {} as Record<string, Job[]>);

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Completed Jobs</h2>
          <div className="text-sm text-gray-500">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} completed
          </div>
        </div>

        {/* Search Input */}
        <SearchJobs initialValue={searchQuery} />

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
              <p className="text-gray-600">
                {searchQuery ? "No jobs found" : "No completed jobs yet"}
              </p>
            </div>
          ) : (
            Object.entries(groupedJobs).map(([company, companyJobs]) => (
              <div key={company} className="space-y-6">
                {/* Company Header */}
                {company === "N3 Repairs" && (
                  <h2 className="text-xl font-semibold">{company}</h2>
                )}

                {/* Jobs List */}
                <div className="space-y-4">
                  {companyJobs.map((job) => (
                    <div
                      key={job._id}
                      className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{job.name}</h3>
                          <span className="text-sm font-medium text-green-600">
                            Completed
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{company}</p>
                        <div className="flex flex-wrap gap-2">
                          {job.jobType.map((type) => (
                            <span
                              key={type}
                              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                              {type}
                            </span>
                          ))}
                        </div>
                        {job.completedAt && (
                          <p className="text-xs text-gray-500">
                            Completed on{" "}
                            {new Date(job.completedAt).toLocaleDateString()}
                          </p>
                        )}
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
    console.error("Failed to fetch completed jobs:", error);
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">
          Error loading completed jobs
        </h3>
        <p className="mt-1 text-sm text-red-700">
          Please try refreshing the page or contact support
        </p>
      </div>
    );
  }
}
