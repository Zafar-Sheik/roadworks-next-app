// app/api/admin/users/update/route.ts
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newEmail } = body;
    
    if (!userId || !newEmail) {
      return NextResponse.json(
        { success: false, message: "ID and new email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User updated", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};