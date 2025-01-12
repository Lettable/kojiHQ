import mongoose from 'mongoose';
import { connectDB } from "../config/db";
const connection = await connectDB();

const PaymentMethodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    currency: {
        type: String,
        required: true,
        enum: ['BTC', 'ETH', 'USDC', 'LTC', 'BCH', 'DAI'],
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    lastUsed: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});

export default connection.models.PaymentMethod || connection.model('PaymentMethod', PaymentMethodSchema);
