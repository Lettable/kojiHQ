"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FiArrowUp, FiArrowDown, FiMinus, FiSettings } from "react-icons/fi";
import CryptoSelectionDialog from '@/components/CurrencyDialog';

export default function PreferredCurrencies() {
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [previousPrices, setPreviousPrices] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Retrieve and parse preferred currencies from local storage
  const storedCurrencies = localStorage.getItem('preferredCurrencies');
  const preferredCurrencies = storedCurrencies ? JSON.parse(storedCurrencies) : []; // Parse the string into an array
  console.log(preferredCurrencies);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch(`/api/getCryptoPrices?currencies=${preferredCurrencies.join(",")}`);
        const { prices } = await response.json();

        setPreviousPrices(cryptoPrices);
        setCryptoPrices(prices);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    // Fetch prices and set interval
    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 100000);
    return () => clearInterval(interval);
  }, [preferredCurrencies, cryptoPrices]);

  // Determine price color and icon
  const getPriceIndicator = (currency) => {
    const currentPrice = parseFloat(cryptoPrices[currency]);
    const previousPrice = parseFloat(previousPrices[currency]);

    if (!previousPrice || !currentPrice) {
      return { color: "text-yellow-500", icon: <FiMinus /> }; // Neutral for loading
    }

    if (currentPrice > previousPrice) {
      return { color: "text-green-500", icon: <FiArrowUp /> }; // Price increased
    } else if (currentPrice < previousPrice) {
      return { color: "text-red-500", icon: <FiArrowDown /> }; // Price decreased
    }

    return { color: "text-yellow-500", icon: <FiMinus /> }; // No change
  };

  return (
    <Card className={`bg-zinc-900/50 flex-1 text-white border-0 shadow-lg`}>
      <CardHeader className="flex justify-between items-start">
        <div className="flex items-center">
          <CardTitle className="text-lg">Live Prices</CardTitle>
          <button
          onClick={handleOpenDialog}
          className="bg-transparent ml-2 h-4 w-4 text-white"
        >
          <FiSettings className="mr-2" />
        </button>
        <CryptoSelectionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
        </div>
        
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {preferredCurrencies.map((currency) => {
            const { color, icon } = getPriceIndicator(currency);
            return (
              <div key={currency} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-bold">{currency}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {icon}
                  <span className={`font-semibold ${color}`}>
                    {cryptoPrices[currency] ? `$${cryptoPrices[currency]}` : "Loading..."}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>

  );
}