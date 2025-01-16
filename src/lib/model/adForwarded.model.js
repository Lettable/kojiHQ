import mongoose from "mongoose";
import { connectDB } from "../config/db";

const connection = await connectDB("MAIN");

const forwardSchema = new mongoose.Schema(
  {
    user_id: { type: Number, required: true },
    count: { type: Number, required: true },
  },
  { collection: "forwarded" }
);

const Forwarded =
  connection.models.Forwarded || connection.model("Forwarded", forwardSchema);

export default Forwarded;
