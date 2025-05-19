import { NextRequest, NextResponse } from "next/server";
import PotholeSheets from "@/lib/models/PotholeSheets";
import connectDB from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { id, ...updateData } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Missing pothole ID" },
        { status: 400 }
      );
    }

    // Check if pothole exists
    const existingPothole = await PotholeSheets.findById(id);
    if (!existingPothole) {
      return NextResponse.json({ error: "Pothole not found" }, { status: 404 });
    }

    // Update the document
    const updatedPothole = await PotholeSheets.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true, // Ensure updated data follows schema rules
      }
    ).populate("job");

    return NextResponse.json(updatedPothole, { status: 200 });
  } catch (error) {
    console.error("Error updating pothole:", error);
    return NextResponse.json(
      { error: "Failed to update pothole" },
      { status: 500 }
    );
  }
}
