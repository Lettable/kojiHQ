import mongoose from "mongoose";

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
  
  const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
  export default Category;
  