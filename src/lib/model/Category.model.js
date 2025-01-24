import mongoose from "mongoose";
import { connectDB } from "../config/db";
const connection = await connectDB();

const CategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    index: {
      type: Number,
      required: true, // Determines horizontal placement
    },
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Category = connection.models.Category || connection.model('Category', CategorySchema);
  export default Category;
  