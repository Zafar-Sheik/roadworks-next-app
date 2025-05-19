// File: app/api/potholes/[id]/route.ts
import { NextResponse } from "next/server";
import PotholeSheets from "@/lib/models/PotholeSheets";
import connectDB from "@/lib/db";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const deletedPothole = await PotholeSheets.findByIdAndDelete(id);

    if (!deletedPothole) {
      return NextResponse.json({ error: "Pothole not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Pothole deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting pothole:", error);
    return NextResponse.json(
      { error: "Failed to delete pothole" },
      { status: 500 }
    );
  }
}
