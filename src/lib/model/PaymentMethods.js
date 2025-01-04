import mongoose from 'mongoose';

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

export default mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', PaymentMethodSchema);
