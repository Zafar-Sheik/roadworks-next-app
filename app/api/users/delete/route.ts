import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { protectRoute } from "@/lib/protectRoute";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "ID not found" }), {
        status: 400,
      });
    }

    // Check if the userId is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    await connectDB();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      // User with the given ID was not found
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is deleted", user: deletedUser }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting user" + error.message, {
      status: 500,
    });
  }
};
