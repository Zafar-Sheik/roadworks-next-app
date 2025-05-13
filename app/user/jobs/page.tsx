// app/user/dashboard/page.tsx
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchJobs } from "./SearchJobs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function UserDashboard(params: {
  searchParams: { search?: string };
}) {
  // Authentication and authorization check
  if (!checkRole("user")) {
    redirect("/");
  }

  // Get current Clerk user
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  // Get search query parameter
  const searchQuery = params.searchParams?.search || "";

  // Build API URL with user ID path parameter
  const apiUrl = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/user/${user.id}`
  );
  if (searchQuery) {
    apiUrl.searchParams.append("search", searchQuery);
  }

  // Fetch user-specific jobs with search filter
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
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Your Jobs ({jobs.length})
        </h1>
        <div className="w-full md:w-auto">
          <SearchJobs />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
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
                  {searchQuery
                    ? "No matching jobs found"
                    : "No jobs assigned yet"}
                </td>
              </tr>
            ) : (
              jobs.map((job: any) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {job.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {job.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {job.jobType.map((type: string) => (
                        <span
                          key={type}
                          className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/user/jobs/${job._id}`}
                      className="text-blue-600 hover:text-blue-900 font-medium text-sm">
                      View Details →
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
