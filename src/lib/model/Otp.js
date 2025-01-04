import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  requestedByEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: Number,
    required: true,
    min: 100000,
    max: 999999,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  purpose: { 
    type: String, 
    required: true 
  },
});

export default mongoose.models.OTPs || mongoose.model("OTPs", otpSchema);
