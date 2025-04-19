// lib/protectRoute.ts
import { NextResponse } from "next/server";
import { verifyToken, AuthUser } from "./auth";

export function protectRoute(req: Request, requiredRole?: "admin" | "laborer") {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const token = authHeader.split(" ")[1];
  const { valid, user } = verifyToken(token);

  if (!valid || !user) {
    return {
      error: NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      ),
    };
  }

  if (requiredRole && user.role !== requiredRole) {
    return {
      error: NextResponse.json(
        { error: "Forbidden: Admins only" },
        { status: 403 }
      ),
    };
  }

  return { user }; // ✅ Authorized
}
