// lib/auth.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthUser {
  _id: string;
  email: string;
  role: "admin" | "laborer";
  company: "CompanyA" | "CompanyB";
}

export function verifyToken(token: string): {
  valid: boolean;
  user?: AuthUser;
} {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return { valid: true, user: decoded };
  } catch (err) {
    return { valid: false };
  }
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
