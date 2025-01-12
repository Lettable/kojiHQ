import mongoose from 'mongoose';
import { connectDB } from "../config/db";

const BidSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  bidderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bidAmount: {
    type: Number,
    required: true,
  },
  bidDate: {
    type: Date,
    default: Date.now,
  },
});


const connection = await connectDB();
export default connection.models.Bid || connection.model('Bid', BidSchema);
