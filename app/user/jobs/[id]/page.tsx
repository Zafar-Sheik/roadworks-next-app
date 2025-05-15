// app/user/jobs/[id]/page.tsx
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { currentUser } from "@clerk/nextjs/server";
import PotholeSheet from "../../../components/PotholeSheet";
import Link from "next/link";

interface Job {
  _id: string;
  name: string;
  company: string;
  jobType: string[];
}

interface PotholeSheetData {
  _id: string;
  dimensions: {
    l: number;
    w: number;
    d: number;
  };
  area: number;
  volume: number;
  materialsInKg: number;
  numberOfBags: number;
  weather: string;
  timestamp: string;
}

export default async function JobPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { create?: string };
}) {
  if (!checkRole("user")) redirect("/");
  const user = await currentUser();
  if (!user) redirect("/");

  try {
    // Fetch job details
    const jobResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.id}?userId=${user.id}`,
      { cache: "no-store" }
    );
    if (!jobResponse.ok) throw new Error("Job not found");
    const job: Job = await jobResponse.json();

    // Fetch pothole sheets
    const sheetsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/potholes/${params.id}`,
      { cache: "no-store" }
    );

    let potholeSheets: PotholeSheetData[] = [];
    if (sheetsResponse.ok) {
      potholeSheets = await sheetsResponse.json();
    }

    const showCreateForm = searchParams?.create === "true";

    return (
      <div className="container mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{job.name}</h1>
          {!showCreateForm && (
            <Link
              href={`?create=true`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create New Pothole Sheet
            </Link>
          )}
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">New Pothole Sheet</h2>
              <Link
                href={`/user/jobs/${params.id}`}
                className="text-gray-600 hover:text-gray-900">
                Cancel
              </Link>
            </div>
            <PotholeSheet />
          </div>
        )}

        {/* Existing Sheets */}
        {!showCreateForm && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Pothole Sheets ({potholeSheets.length})
            </h2>

            {potholeSheets.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                No pothole sheets found for this job
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {potholeSheets.map((sheet) => (
                  <div
                    key={sheet._id}
                    className="border p-4 rounded-lg bg-white hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {sheet.dimensions.l}m x {sheet.dimensions.w}m x{" "}
                            {sheet.dimensions.d}m
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(sheet.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {sheet.weather}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Area</p>
                          <p>{sheet.area.toFixed(2)} m²</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Volume</p>
                          <p>{sheet.volume.toFixed(2)} m³</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cement</p>
                          <p>{sheet.materialsInKg} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Bags</p>
                          <p>{sheet.numberOfBags}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading job:", error);
    redirect("/user/jobs");
  }
}
