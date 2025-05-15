// app/api/jobs/user/[userId]/route.ts
import Job from "@/lib/models/Jobs";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search") || "";
    const isComplete = searchParams.get("isComplete");

    // Base query - always filter by user
    const query: Record<string, unknown> = { user: params.userId };

    // Add search criteria if present
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { company: { $regex: searchQuery, $options: "i" } },
        { jobType: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Add completion filter if specified
    if (isComplete !== null) {
      query.isComplete = isComplete === "true";
    }

    const jobs = await Job.find(query).lean();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch user jobs" },
      { status: 500 }
    );
  }
}
