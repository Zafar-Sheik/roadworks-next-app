import Job from "@/lib/models/Jobs";
import { NextResponse } from "next/server";
// api/jobs/[userId]/route.ts
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search") || "";

    const query: any = { user: params.userId };

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { jobType: { $regex: searchQuery, $options: "i" } },
        { company: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query);
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user jobs" },
      { status: 500 }
    );
  }
}
