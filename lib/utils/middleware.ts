import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define custom JWT payload interface
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: "admin" | "laborer";
  company: "CompanyA" | "CompanyB";
}

export const checkRole = (allowedRoles: string[]) => {
  return (req: NextRequest) => {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return false;

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as CustomJwtPayload;
      return allowedRoles.includes(decoded.role);
    } catch (error) {
      return false;
    }
  };
};
