import connectDB from "@/lib/db";
import User from "@/lib/models/User";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

//GET: Return Users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching Users: " + error.message, {
      status: 500,
    });
  }
}

// POST: create user with hashed password
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // Check for required fields
    const { email, password, role = "laborer", company = "CompanyA" } = body;
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      company,
    });

    return NextResponse.json({ success: true, user: newUser }); //user successfully created
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
