import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchSheets } from "./SearchSheets";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, ToggleRight } from "lucide-react";

export default async function AdminJobsDashboard(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = (await params.searchParams).search;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs${
      query ? `?search=${query}` : ""
    }`,
    { cache: "no-store" }
  );

  const jobs = await response.json();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Sheet Management
          </h1>
          <p className="text-gray-500">
            Manage and monitor current job postings
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/create" className="gap-2">
            <span>+</span>
            <span>Create New Job</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Job Listings</CardTitle>
            <SearchSheets />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500 border-b">
                <div className="col-span-4">Job Name</div>
                <div className="col-span-3">Company</div>
                <div className="col-span-2">Job Type</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {jobs.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    No jobs found matching your criteria
                  </div>
                ) : (
                  jobs.map((job: any) => (
                    <div
                      key={job._id}
                      className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-4 font-medium">{job.name}</div>
                      <div className="col-span-3 text-gray-600">
                        {job.company}
                      </div>
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-2">
                          {job.jobType.map((type: string) => (
                            <Badge variant="outline" key={type}>
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge
                          variant={job.isActive ? "default" : "destructive"}>
                          {job.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="col-span-1">
                        <ActionDropdown job={job} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActionDropdown({ job }: { job: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            href={`/admin/jobs/edit/${job._id}`}
            className="gap-2 cursor-pointer">
            <Edit className="h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        <form
          action={async () => {
            "use server";
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${job._id}`,
              { method: "DELETE" }
            );
            redirect("/admin/jobs");
          }}>
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="w-full gap-2 cursor-pointer text-red-600">
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </DropdownMenuItem>
        </form>

        <form
          action={async () => {
            "use server";
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/update`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: job._id,
                isActive: !job.isActive,
              }),
            });
            redirect("/admin/jobs");
          }}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full gap-2 cursor-pointer">
              <ToggleRight className="h-4 w-4" />
              Toggle Status
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
