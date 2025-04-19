// app/api/admin/users/update/route.ts
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newEmail } = body;
    await connectDB();

    if (!userId || !newEmail) {
      return new NextResponse(
        JSON.stringify({ message: "ID or new email not found" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { email: newEmail },
      { new: true }
    );

    if (!updatedUser) {
      // User with the given ID was not found
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is updated", user: updatedUser }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating user" + error.message, {
      status: 500,
    });
  }
};
