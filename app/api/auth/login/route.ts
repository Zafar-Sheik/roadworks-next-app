// app/api/auth/login/route.ts
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const payload: JwtPayload = {
      _id: user._id.toString(),
      role: user.role,
      company: user.company,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return NextResponse.json({ success: true, token });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
