import axios from "axios";
import { NextResponse } from "next/server";

const BINANCE_API = "https://api.binance.com/api/v3/ticker/price";

export async function GET(req) {
  try {
    const currencies = req.nextUrl.searchParams.get('currencies');

    if (!currencies) {
      return NextResponse.json(
        { error: "No currencies provided" },
        { status: 400 }
      );
    }

    const currencyList = currencies.split(",");
    const pricePromises = currencyList.map((currency) =>
      axios.get(`${BINANCE_API}?symbol=${currency}USDT`).catch(() => null)
    );

    const responses = await Promise.all(pricePromises);
    const prices = responses.reduce((acc, response, index) => {
      if (response && response.data) {
        acc[currencyList[index]] = parseFloat(response.data.price).toFixed(2);
      }
      return acc;
    }, {});

    return NextResponse.json({ prices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
