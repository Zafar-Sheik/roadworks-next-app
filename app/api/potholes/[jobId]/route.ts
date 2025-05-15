// app/api/potholes/[jobId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Pothole from "@/lib/models/PotholeSheets";
import { Types } from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    await connectDB();

    // Validate the jobId parameter
    if (!Types.ObjectId.isValid(params.jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID format" },
        { status: 400 }
      );
    }

    const potholes = await Pothole.find({ job: params.jobId })
      .populate({
        path: "job",
        select: "title location status", // Include specific job fields
      })
      .sort({ timestamp: -1 });

    if (!potholes || potholes.length === 0) {
      return NextResponse.json(
        { error: "No potholes found for this job" },
        { status: 404 }
      );
    }

    return NextResponse.json(potholes, { status: 200 });
  } catch (error) {
    console.error("Error fetching job potholes:", error);
    return NextResponse.json(
      { error: "Failed to fetch job potholes" },
      { status: 500 }
    );
  }
}
