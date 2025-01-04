import mongoose from 'mongoose';

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

export default mongoose.models.Bid || mongoose.model('Bid', BidSchema);
