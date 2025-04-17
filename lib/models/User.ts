import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

// Define interface for User document
interface UserDocument extends Document {
  email: string;
  password: string;
  role: "admin" | "laborer";
  company: "CompanyA" | "CompanyB";
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "laborer"], required: true },
  company: { type: String, enum: ["CompanyA", "CompanyB"], required: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

export const User = model<UserDocument>("User", userSchema);
