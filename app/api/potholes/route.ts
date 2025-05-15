import { NextRequest, NextResponse } from "next/server";
import PotholeSheets from "@/lib/models/PotholeSheets";
import Jobs from "@/lib/models/Jobs";
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
    const job = await Jobs.findById(body.job);
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
      weather: body.weather,
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
    await connectDB();

    // Find all potholes and populate the job reference
    const potholes = await PotholeSheets.find()
      .populate({
        path: "job",
        select: "-__v", // Exclude the version key
      })
      .sort({ timestamp: -1 }); // Sort by newest first

    if (!potholes || potholes.length === 0) {
      return NextResponse.json({ error: "No potholes found" }, { status: 404 });
    }

    return NextResponse.json(potholes, { status: 200 });
  } catch (error) {
    console.error("Error fetching potholes:", error);
    return NextResponse.json(
      { error: "Failed to fetch potholes" },
      { status: 500 }
    );
  }
}
