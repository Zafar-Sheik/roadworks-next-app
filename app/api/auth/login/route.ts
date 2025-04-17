import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/lib/models/User";
import connect from "@/lib/db";

export async function POST(req: Request) {
  await connect;

  const { email, password } = await req.json();

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Type assertion to ensure TypeScript recognizes the method
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // When creating tokens, ensure the payload matches CustomJwtPayload
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      company: user.company,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return NextResponse.json({ token });
}
