import mongoose from 'mongoose';
import { connectDB } from "../config/db";

const SiteConfig = new mongoose.Schema({
  status: {
    type: String,
    enum: ['open', 'closed', 'maintenance', 'update'],
    default: 'open',
  },
  message: {
    type: String,
    default: '',
  },
  countdownTimestamp: {
    type: Date,
  },
}, { timestamps: true });

const connection = await connectDB();
export default connection.models.SiteConfig || connection.model('SiteConfig', SiteConfig);
