import mongoose from 'mongoose';
import { connectDB } from "../config/db";
const connection = await connectDB();

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    technicalDetails: {
      type: String,
      required: true,
    },
    reasonForSelling: {
      type: String,
      trim: true,
      required: function () {
        return this.productPurp === 'selling';
      },
    },
    isNegotiable: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    priceType: {
      type: String,
      enum: ['fixed', 'bid'],
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: function () {
        return this.priceType === 'fixed';
      },
    },
    startingBid: {
      type: Number,
      min: 0,
      required: function () {
        return this.priceType === 'bid';
      },
    },
    incrementBid: {
      type: Number,
      min: 0,
      required: function () {
        return this.priceType === 'bid';
      },
    },
    bidEndDate: {
      type: Date,
      required: function () {
        return this.priceType === 'bid';
      },
    },
    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(v);
          },
          message: 'Invalid image URL',
        },
      },
    ],
    productStatus: {
      type: String,
      enum: ['active', 'sold'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    productPurp: {
      type: String,
      enum: ['selling', 'buying', 'showcasing'],
      default: 'selling',
    },
  },
  {
    timestamps: true,
  }
);

export default connection.models.Product || connection.model('Product', productSchema);
