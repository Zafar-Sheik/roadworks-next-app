import { NextRequest, NextResponse } from "next/server";
import PotholeSheets from "@/lib/models/PotholeSheets";
import Job from "@/lib/models/Jobs";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate required fields
    if (
      !body.job ||
      !body.dimensions ||
      !body.area ||
      !body.volume ||
      !body.materialsInKg ||
      !body.numberOfBags
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate job exists
    const job = await Job.findById(body.job);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Create new pothole document
    const newPothole = new PotholeSheets({
      job: body.job,
      dimensions: {
        l: body.dimensions.l,
        w: body.dimensions.w,
        d: body.dimensions.d,
      },
      area: body.area,
      volume: body.volume,
      materialsInKg: body.materialsInKg,
      numberOfBags: body.numberOfBags,
    });

    // Save to database (pre-save hook will calculate derived values)
    const savedPothole = await newPothole.save();

    return NextResponse.json(savedPothole, { status: 201 });
  } catch (error) {
    console.error("Error creating pothole report:", error);
    return NextResponse.json(
      { error: "Failed to create pothole report" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const potholes = await PotholeSheets.find().populate("job");
    return NextResponse.json(potholes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch potholes" },
      { status: 500 }
    );
  }
}
