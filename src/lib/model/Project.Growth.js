import mongoose from "mongoose";
import { connectDB } from "../config/db";
const connection = await connectDB();

const GrowthSchema = new mongoose.Schema({
  projects: {
    type: Number,
    required: true
  }
},{ timestamps: true });

export default connection.model.GrowthSchema || connection.model('Growth', GrowthSchema);