import mongoose, { Schema, Document } from "mongoose";
import Jobs from "./Jobs";
import { calculateArea, calculateVolume, calculateMaterials } from "../utils";

export interface IPothole extends Document {
  job: typeof Jobs.prototype._id;
  dimensions: {
    l: number;
    w: number;
    d: number;
  };
  area: number;
  volume: number;
  materialsInKg: number;
  numberOfBags: number;

  weather: string;
}

const PotholeSchema = new Schema<IPothole>(
  {
    job: { type: Schema.Types.ObjectId, ref: "Jobs", required: true },
    dimensions: {
      l: { type: Number, required: true, min: 0 },
      w: { type: Number, required: true, min: 0 },
      d: { type: Number, required: true, min: 0 },
    },
    area: { type: Number, required: true },
    volume: { type: Number, required: true },
    materialsInKg: { type: Number, required: true },
    numberOfBags: { type: Number, required: true, min: 0 },

    weather: {
      type: String,
      default: "Sunny",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate values before saving
PotholeSchema.pre<IPothole>("save", function (next) {
  this.area = calculateArea(this.dimensions.l, this.dimensions.w);
  this.volume = calculateVolume(
    this.dimensions.l,
    this.dimensions.w,
    this.dimensions.d
  );
  this.materialsInKg = calculateMaterials(this.numberOfBags);
  next();
});

export default mongoose.models.Pothole ||
  mongoose.model<IPothole>("Pothole", PotholeSchema);
