import { connectDB } from '@/lib/config/db';
import ProductModel from '@/lib/model/Product.model';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { productId, ownerId } = await req.json();

    if (!productId || !ownerId) {
      return NextResponse.json(
        { error: 'productId and ownerId are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await ProductModel.findById(productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.ownerId.toString() !== ownerId) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not own this product' },
        { status: 403 }
      );
    }

    product.productStatus = 'sold';
    await product.save();

    return NextResponse.json(
      { message: 'Project marked as sold successfully', productId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error marking product as sold:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
