// models/Jobs.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IJobs extends Document {
  name: string;
  jobType: string[];
  company: "Bombela" | "Unamusa";
  user: string; // Add optional user field
  area?: number;
  volume?: number;
  isActive: boolean;
  isComplete: boolean;
}

const JobSchema: Schema<IJobs> = new Schema(
  {
    name: { type: String, required: true },
    jobType: { type: [String], required: true },
    company: { type: String, enum: ["Bombela", "Unamusa"], required: true },
    area: { type: Number },
    volume: { type: Number },
    user: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    isComplete: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.JobSchema ||
  mongoose.model<IJobs>("Jobs", JobSchema);
