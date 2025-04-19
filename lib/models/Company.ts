// models/Company.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICompany extends Document {
  name: "CompanyA" | "CompanyB";
  jobTypes: Types.ObjectId[]; // References JobType._id
}

const CompanySchema: Schema<ICompany> = new Schema(
  {
    name: {
      type: String,
      enum: ["CompanyA", "CompanyB"],
      required: true,
      unique: true,
    },
    jobTypes: [{ type: Schema.Types.ObjectId, ref: "JobType" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Company ||
  mongoose.model<ICompany>("Company", CompanySchema);
