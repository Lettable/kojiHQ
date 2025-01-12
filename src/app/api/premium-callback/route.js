import { NextResponse } from 'next/server';

const API_KEY = process.env.CRYPTOMUS_API_KEY;
const MERCHANT_ID = '4884514a-4a42-466f-a231-d1534b6bb9e4';
const CRYPTOMUS_BASE_URL = process.env.CRYPTOMUS_API_BASE_URL ||'https://api.cryptomus.com/v1/payment';

function DecodeUniqueOID(UniqueOID) {
  const parts = UniqueOID.split('-');

  if (parts.length !== 3) {
      throw new Error("Invalid UniqueOID format");
  }

  return {
      userId: parts[0],
      telegramUID: parts[1],
      timestamp: parseInt(parts[2]),
  };
}

export async function POST(req) {
  try {
      const { name, description, amount, currency, userId, redirectUrl, telegramUID } = await req.json();

      const UniqueOID = EncodeUniqueOID(userId, telegramUID);
      const DecodedData = DecodeUniqueOID(UniqueOID);

      console.log('Original UID:', userId);
      console.log('Telegram UID:', telegramUID);
      console.log('Timestamp:', DecodedData.timestamp);
      console.log('Unique OID:', UniqueOID);
      console.log('Decoded OID:', DecodedData);


    const chargeData = {
      amount: amount.toString(),
      currency: currency || 'USD',
      network: 'tron',
      order_id: UniqueOID,
      url_return: redirectUrl,
      url_callback: `${process.env.SERVER_URL}/api/webhook-payments`,
      description: description || `Payment for ${name}`,
    };

    console.log('Charge Data:', chargeData);

    const jsonData = JSON.stringify(chargeData).replace(/\//g, "\\/");
    const base64Body = Buffer.from(jsonData).toString('base64');

    const crypto = require('crypto');
    const sign = crypto.createHash('md5').update(base64Body + API_KEY).digest('hex');

    console.log('Generated Sign:', sign);

    const response = await fetch(CRYPTOMUS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': MERCHANT_ID,
        'sign': sign,
      },
      body: jsonData,
    });

    const responseData = await response.json();

    console.log(responseData)

    if (!response.ok) {
      console.error('Cryptomus API Error:', responseData);
      throw new Error(`Failed to create Cryptomus payment: ${responseData.message || 'Unknown error'}`);
    }

    if (responseData && responseData.result && responseData.result.url) {
      console.log('Charge Created:', responseData);

      return NextResponse.json({
        success: true,
        charge: {
          payment_url: responseData.result.url,
          order_id: chargeData.order_id,
        },
      }, { status: 200 });
    } else {
      throw new Error('Missing payment URL in Cryptomus response');
    }

  } catch (error) {
    console.error('Error creating charge:', error.message || error);

    return NextResponse.json({
      success: false,
      message: 'Error creating Cryptomus payment',
      error: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
