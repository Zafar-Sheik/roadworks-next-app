// app/api/jobs/route.ts
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import Jobs from "@/lib/models/Jobs";
import connectDB from "@/lib/db";

connectDB();
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const userId = searchParams.get("userId");

    // Build filter object
    const filter: any = {};

    // Add user filter if userId exists
    if (userId) {
      filter.user = userId;
    }

    // Add search filter if search term exists
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const jobs = await Jobs.find(filter).sort({ createdAt: -1 }).exec();

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const missingFields = requiredFields.filter((field) => !(field in body));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate field types
    if (!Array.isArray(body.jobType)) {
      return NextResponse.json(
        { error: "jobType must be an array of strings" },
        { status: 400 }
      );
    }

    if (!["Bombela", "Unamusa"].includes(body.company)) {
      return NextResponse.json(
        { error: "Invalid company value" },
        { status: 400 }
      );
    }

    // Create new job document
    const newJob = new Jobs({
      name: body.name,
      jobType: body.jobType,
      company: body.company,
      user: body.user,
      isActive: body.isActive,
      isComplete: body.isComplete,
    });

    await newJob.save();

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);

    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
