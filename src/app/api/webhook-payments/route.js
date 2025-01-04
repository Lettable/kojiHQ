import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the incoming JSON payload
    const payload = await req.json();

    // Log the webhook data
    console.log('Received Webhook Data:', payload);

    // Send a 200 OK response back to Cryptomus
    return NextResponse.json({ success: true, message: 'Webhook received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error.message);

    // Send a 500 Internal Server Error if something goes wrong
    return NextResponse.json({ success: false, message: 'Webhook processing failed' }, { status: 500 });
  }
}
