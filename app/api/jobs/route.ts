import connectDB from "@/lib/db"; // Your DB connection utility
import Job from "@/lib/models/Jobs";
import { NextResponse } from "next/server";

// Connect to database
connectDB();

// Get all jobs
export async function GET() {
  try {
    const jobs = await Job.find({});
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// Create new job
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "jobType",
      "company",
      "user",
      "isActive",
      "isComplete",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const newJob = new Job(body);
    await newJob.save();

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
