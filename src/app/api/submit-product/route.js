import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/config/db';
import ProductModel from '@/lib/model/Product.model';
import jwt from 'jsonwebtoken';
import sendDiscordNotification from '../../../lib/utils/webhook';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Function to upload an image to imgBB using base64 encoding
 * @param {string} base64Image - The base64-encoded image string
 * @returns {Promise<string>} - The URL of the uploaded image
 */
async function uploadImage(base64Image) {
  const API_KEY = 'dcf61c7abd01f1d764140f9cdb3d36cc';
  const IMG_API_URL = `https://api.imgbb.com/1/upload?key=${API_KEY}`;

  try {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const formData = new FormData();
    formData.append('image', base64Data);

    const response = await fetch(IMG_API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return result.data.url;
    } else {
      console.error('Failed to upload image:', result);
      throw new Error(result.status || 'Image upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error uploading image');
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const productData = await req.json();

    const token = productData.token;

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return NextResponse.json(
          { message: 'Your token has expired. Please re-login.' },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { message: 'Invalid token.', code: 601 },
          { status: 401 }
        );
      }
    }

    const ownerId = decodedToken.userId;

    const imageUrls = [];
    for (const base64Image of productData.images) {
      const imageUrl = await uploadImage(base64Image);
      imageUrls.push(imageUrl);
    }

    const product = new ProductModel({
      title: productData.title,
      description: productData.description,
      technicalDetails: productData.technicalDetails,
      reasonForSelling: productData.reasonForSelling,
      isNegotiable: productData.isNegotiable,
      category: productData.category,
      ownerId: ownerId,
      tags: productData.tags,
      priceType: productData.priceType,
      price: productData.priceType === 'fixed' ? productData.fixedPrice : null,
      startingBid: productData.priceType === 'bid' ? productData.startingBid : null,
      incrementBid: productData.priceType === 'bid' ? productData.incrementBid : null,
      bidEndDate: productData.priceType === 'bid' ? productData.bidEndDate : null,
      images: imageUrls,
      productStatus: 'active',
      productPurp: productData.projectStatus || 'selling',
    });

    console.log(product)

    const savedProduct = await product.save();
    // await sendDiscordNotification(ownerId, savedProduct);

    return NextResponse.json(
      { message: 'Product created successfully', success: true, product: savedProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in product submission API:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
