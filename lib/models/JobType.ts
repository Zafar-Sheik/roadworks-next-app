// models/JobType.ts
import mongoose, { Schema, Document } from "mongoose";

interface RequiredInput {
  name: string;
  unit: string;
}

export interface IJobType extends Document {
  name: string;
  formula: string;
  requiredInputs: RequiredInput[];
  company: "CompanyA" | "CompanyB";
}

const JobTypeSchema: Schema<IJobType> = new Schema({
  name: { type: String, required: true },
  formula: { type: String, required: true },
  requiredInputs: [
    {
      name: { type: String, required: true },
      unit: { type: String, required: true },
    },
  ],
  company: { type: String, enum: ["CompanyA", "CompanyB"], required: true },
});

export default mongoose.models.JobType ||
  mongoose.model<IJobType>("JobType", JobTypeSchema);
