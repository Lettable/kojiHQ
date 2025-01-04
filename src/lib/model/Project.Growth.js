import mongoose from "mongoose";

const GrowthSchema = new mongoose.Schema({
  projects: {
    type: Number,
    required: true
  }
},{ timestamps: true });

export default mongoose.model.GrowthSchema || mongoose.model('Growth', GrowthSchema);