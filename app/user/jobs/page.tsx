import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchJobs } from "./SearchJobs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function UserDashboard(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  // Authentication checks
  if (!checkRole("user")) {
    redirect("/");
  }

  // Get current user
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  // Get search query parameter
  const query = (await params.searchParams).search;

  // Build API URL with user ID and optional search
  const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`);
  apiUrl.searchParams.append("userId", user.id);
  if (query) {
    apiUrl.searchParams.append("search", query);
  }

  // Fetch user-specific jobs
  let jobs = [];
  try {
    const response = await fetch(apiUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    jobs = await response.json();
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center">
          Error loading jobs. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <SearchJobs />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  {query ? "No matching jobs found" : "No jobs available yet"}
                </td>
              </tr>
            ) : (
              jobs.map((job: any) => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{job.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{job.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.jobType.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {job.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Link
                      href={`/user/jobs/${job._id}`}
                      className="text-blue-600 hover:text-blue-900">
                      Open Job
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
