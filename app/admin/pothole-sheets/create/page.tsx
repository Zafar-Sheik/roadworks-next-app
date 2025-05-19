// app/admin/jobs/create/page.tsx
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import Link from "next/link";
import { clerkClient } from "@clerk/nextjs/server";
import Jobs from "@/lib/models/Jobs";

export default async function CreateJobPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const client = await clerkClient();
  // Fetch users from Clerk
  const users = client.users.getUserList({ limit: 500 });

  async function createJob(formData: FormData) {
    "use server";

    try {
      const rawData = {
        name: formData.get("name"),
        jobType:
          formData
            .get("jobType")
            ?.toString()
            .split(",")
            .map((s) => s.trim()) || [],
        company: formData.get("company"),
        user: formData.get("user") || undefined,
        isActive: formData.get("isActive") === "on",
        isComplete: formData.get("isComplete") === "on",
      };

      // First create the Job
      const jobResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rawData),
        }
      );

      if (!jobResponse.ok) {
        const error = await jobResponse.json();
        throw new Error(error.error || "Failed to create job");
      }

      const newJob = await jobResponse.json();

      // Then create the JobSheet linked to the new Job
      const jobSheetResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobsheets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Default Sheet for ${rawData.name}`,
            job: newJob._id, // Link to the newly created job
            formulae: [], // Initial empty formulae array
          }),
        }
      );

      if (!jobSheetResponse.ok) {
        const error = await jobSheetResponse.json();
        throw new Error(error.error || "Failed to create job sheet");
      }

      redirect("/admin/jobs");
    } catch (error: any) {
      redirect(`/admin/jobs/create?error=${encodeURIComponent(error.message)}`);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link
          href="/admin/jobs"
          className="text-blue-500 hover:text-blue-700 text-sm">
          &larr; Back to Jobs List
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Create New Job</h1>

      <form className="max-w-2xl space-y-4" action={createJob}>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Job Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="jobType">
            Job Types
          </label>
          <select
            id="jobType"
            name="jobType"
            className="w-full p-2 border rounded-md">
            <option value="">Select Job Type</option>
            <option value="pot_hole_filling">Pot Hole Filling</option>
            <option value="road_painting">Road Painting</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="company">
            Company *
          </label>
          <select
            id="company"
            name="company"
            required
            className="w-full p-2 border rounded-md">
            <option value="">Select Company</option>
            <option value="Bombela">Bombela</option>
            <option value="Unamusa">Unamusa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="user">
            Assign to User
          </label>
          <select
            id="user"
            name="user"
            className="w-full p-2 border rounded-md">
            <option value="">Select User</option>
            {(await users).data.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.firstName || user.emailAddresses[0]?.emailAddress}
                {user.lastName && ` ${user.lastName}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              className="h-4 w-4"
              defaultChecked
            />
            <span className="text-sm">Active Job</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="isComplete" className="h-4 w-4" />
            <span className="text-sm">Completed</span>
          </label>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
}
