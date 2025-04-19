// models/JobSheet.ts
import mongoose, { Schema, Document, Types } from "mongoose";

interface InputOutput {
  name: string;
  value: number;
  unit: string;
}

export interface IJobSheet extends Document {
  user: Types.ObjectId; // ref: User
  jobType: Types.ObjectId; // ref: JobType
  inputs: InputOutput[];
  outputs: InputOutput[];
  company: "CompanyA" | "CompanyB";
}

const JobSheetSchema: Schema<IJobSheet> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobType: { type: Schema.Types.ObjectId, ref: "JobType", required: true },
    inputs: [
      {
        name: { type: String, required: true },
        value: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    outputs: [
      {
        name: { type: String, required: true },
        value: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    company: { type: String, enum: ["CompanyA", "CompanyB"], required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.JobSheet ||
  mongoose.model<IJobSheet>("JobSheet", JobSheetSchema);
