import mongoose from "mongoose";
import { connectDB } from "../config/db";
const connection = await connectDB();

const SubcategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: false
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true, // Links to the parent category
    },
    index: {
      type: Number,
      required: true, // Determines vertical placement within a category
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Subcategory = connection.models.Subcategory || connection.model('Subcategory', SubcategorySchema);
  export default Subcategory;
  