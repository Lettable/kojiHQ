import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
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
  
  const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);
  export default Subcategory;
  