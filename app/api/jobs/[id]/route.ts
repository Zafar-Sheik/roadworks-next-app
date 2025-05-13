import connectDB from "@/lib/db";
import Job from "@/lib/models/Jobs";
import { NextResponse } from "next/server";

connectDB();

// Get single job by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await Job.findById(params.id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// UPDATE job
export async function PUT(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const body = await req.json();
    const updatedJob = await Job.findByIdAndUpdate(params.jobId, body, {
      new: true,
    });
    if (!updatedJob)
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}
