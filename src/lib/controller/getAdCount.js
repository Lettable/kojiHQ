import mongoose from "mongoose";
import { connectDB } from "../config/db";

const getForwardedCount = async (user_id) => {
  try {
    const connection = await connectDB("MAIN");

    const forwardSchema = new mongoose.Schema({
      user_id: { type: Number, required: true },
      count: { type: Number, required: true },
    });

    const Forwarded =
      connection.models.forwarded ||
      connection.model("forwarded", forwardSchema);

    const forwardData = await Forwarded.findOne({ user_id: user_id });

    return forwardData ? forwardData.count : 0;
  } catch (error) {
    console.error("Error fetching forwarded count:", error);
    return null;
  }
};

export default getForwardedCount;
