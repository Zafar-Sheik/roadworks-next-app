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
import { MoreVertical, Edit, Trash2 } from "lucide-react";

export default async function PotholeSheetsDashboard(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = (await params.searchParams).search;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/potholes${
      query ? `?search=${query}` : ""
    }`,
    { cache: "no-store" }
  );

  const potholes = await response.json();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Pothole Reports</h1>
          <p className="text-gray-500">
            Manage and monitor pothole repair sheets
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pothole-sheets/create" className="gap-2">
            <span>+</span>
            <span>New Report</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Active Reports</CardTitle>
            <SearchSheets />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <div className="hidden md:block min-w-[800px]">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500 border-b">
                <div className="col-span-3">Job Name</div>
                <div className="col-span-2">Dimensions</div>
                <div className="col-span-1">Area</div>
                <div className="col-span-1">Volume</div>
                <div className="col-span-1">Materials</div>
                <div className="col-span-1">Bags</div>
                <div className="col-span-2">Weather</div>
                <div className="col-span-1">Actions</div>
              </div>

              <div className="divide-y">
                {potholes.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    No pothole reports found
                  </div>
                ) : (
                  potholes.map((pothole: any) => (
                    <div
                      key={pothole._id}
                      className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-3 font-medium">
                        {pothole.job?.name}
                      </div>
                      <div className="col-span-2 text-gray-600">
                        {pothole.dimensions.l}m × {pothole.dimensions.w}m ×{" "}
                        {pothole.dimensions.d}m
                      </div>
                      <div className="col-span-1">{pothole.area}m²</div>
                      <div className="col-span-1">{pothole.volume}m³</div>
                      <div className="col-span-1">
                        {pothole.materialsInKg}kg
                      </div>
                      <div className="col-span-1">{pothole.numberOfBags}</div>
                      <div className="col-span-2">
                        <Badge variant="outline">{pothole.weather}</Badge>
                      </div>
                      <div className="col-span-1">
                        <ActionDropdown pothole={pothole} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {potholes.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  No pothole reports found
                </div>
              ) : (
                potholes.map((pothole: any) => (
                  <Card key={pothole._id}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {pothole.job?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {pothole.dimensions.l}m × {pothole.dimensions.w}m
                              × {pothole.dimensions.d}m
                            </div>
                          </div>
                          <Badge variant="outline">{pothole.weather}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Area:</span>{" "}
                            {pothole.area}m²
                          </div>
                          <div>
                            <span className="text-gray-500">Volume:</span>{" "}
                            {pothole.volume}m³
                          </div>
                          <div>
                            <span className="text-gray-500">Materials:</span>{" "}
                            {pothole.materialsInKg}kg
                          </div>
                          <div>
                            <span className="text-gray-500">Bags:</span>{" "}
                            {pothole.numberOfBags}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <ActionDropdown pothole={pothole} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActionDropdown({ pothole }: { pothole: any }) {
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
            href={`/admin/pothole-sheets/edit/${pothole._id}`}
            className="gap-2 cursor-pointer">
            <Edit className="h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        <form
          action={async () => {
            "use server";
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/potholes/delete/${pothole._id}`,
              { method: "DELETE" }
            );
            redirect("/admin/pothole-sheets");
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
