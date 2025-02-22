"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import CryptoSelectionDialog from "@/components/CurrencyDialog";
import { TbArrowBigUpFilled, TbArrowBigDownFilled } from "react-icons/tb";
import Image from "next/image";
import { Clock } from "lucide-react";

const cryptoColors = {
  BTC: "text-[#F7931A]",
  ETH: "text-[#627EEA]",
  XRP: "text-[#00AAE4]",
  USDT: "text-[#26A17B]",
  BNB: "text-[#F3BA2F]",
  SOL: "text-[#14F195]",
  USDC: "text-[#2775CA]",
  DOGE: "text-[#C2A633]",
  ADA: "text-[#0033AD]",
  STETH: "text-[#00A3FF]",
  
  TRX: "text-[#FF0013]",
  WBTC: "text-[#F7931A]",
  LINK: "text-[#2A5ADA]",
  AVAX: "text-[#E84142]",
  SUI: "text-[#6fbcf0]",
  XLM: "text-[#14B6E7]",
  LTC: "text-[#345D9D]",
  SHIB: "text-[#FFA409]",
  HYPE: "text-[#00FF00]",
  DOT: "text-[#E6007A]",

  OM: "text-[#44B8B5]",
  BCH: "text-[#8DC351]",
  UNI: "text-[#FF007A]",
  DAI: "text-[#F5AC37]",
  XMR: "text-[#FF6600]",
  NEAR: "text-[#000000]",
  PEPE: "text-[#00B300]",
  AAVE: "text-[#B6509E]",
  ONDO: "text-[#2775CA]",
  TAO: "text-[#00FF00]",

  APT: "text-[#32C5FF]",
  ICP: "text-[#29ABE2]",
  TRUMP: "text-[#FF4444]",
  HBAR: "text-[#00ADED]",
  ETC: "text-[#328332]",
  OKB: "text-[#2D60E0]",
  KAS: "text-[#7B68EE]",
  VET: "text-[#15B0E8]",
  POL: "text-[#8247E5]",
  FTM: "text-[#1969FF]",

  ALGO: "text-[#000000]",
  CRO: "text-[#103F68]",
  FIL: "text-[#0090FF]",
  ARB: "text-[#28A0F0]",
  TIA: "text-[#00FF00]",
  GT: "text-[#2354E6]",
  FET: "text-[#1D1D1B]",
  ATOM: "text-[#2E3148]",
  DEXE: "text-[#0E76FD]",
  LDO: "text-[#00A3FF]",

  KCS: "text-[#23AF91]",
  STX: "text-[#5546FF]",
  THETA: "text-[#2AB8E6]",
  GRT: "text-[#6747ED]",
  MKR: "text-[#1AAB9B]",
  RAY: "text-[#00C2FF]",
  QNT: "text-[#000000]",
  INJ: "text-[#17EAD9]",
  XDC: "text-[#286090]",
  EOS: "text-[#000000]",

  TEL: "text-[#14C8FF]",
  XTZ: "text-[#2C7DF7]",
  SAND: "text-[#00ADEF]",
  NEXO: "text-[#1A4199]",
  GALA: "text-[#00D8E1]",
  FLOW: "text-[#00EF8B]",
  IOTA: "text-[#242424]",
  NEO: "text-[#00E599]",
  BSV: "text-[#EAB300]",
  WIF: "text-[#FF69B4]",

  CAKE: "text-[#D1884F]",
  AXS: "text-[#0055D5]",
  CRV: "text-[#FF1E1E]",
  AR: "text-[#222326]",
  HNT: "text-[#474DFF]",
  FTT: "text-[#11A9BC]",
  MANA: "text-[#FF2D55]",
  CFX: "text-[#1F1F1F]",
  PENDLE: "text-[#3FB68B]",
  MATIC: "text-[#8247E5]",

  PENGU: "text-[#00A3FF]",
  ZEC: "text-[#ECB244]",
  EGLD: "text-[#1B46C2]",
  AIOZ: "text-[#4C6FFF]",
  XEC: "text-[#3C3C3D]",
  RUNE: "text-[#00CC9B]",
  CHZ: "text-[#CD0124]",
  TUSD: "text-[#1B31FF]",
  RSR: "text-[#000000]",
  COMP: "text-[#00D395]",

  KAVA: "text-[#FF564F]",
  GNO: "text-[#00A6C4]",
  AKT: "text-[#E16E38]",
  AMP: "text-[#2ABFDC]",
  MINA: "text-[#2D2D2D]",
  TWT: "text-[#3375BB]",
  NXM: "text-[#1B1B1B]",
  "1INCH": "text-[#1B314F]",
  KSM: "text-[#000000]",
  SUPER: "text-[#FF3B3B]"
};

export default function PreferredCurrencies() {
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [previousPrices, setPreviousPrices] = useState({});
  const [priceChanges, setPriceChanges] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [preferredCurrencies, setPreferredCurrencies] = useState(["BTC", "ETH", "LTC"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCurrencies = localStorage.getItem("preferredCurrencies");
    const initialCurrencies = storedCurrencies ? JSON.parse(storedCurrencies) : ["BTC", "ETH", "LTC"];
    setPreferredCurrencies(initialCurrencies);
  }, []);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const prices = {};
        const changes = {};
        
        for (const currency of preferredCurrencies) {
          const priceResponse = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${currency}USDT`);
          const priceData = await priceResponse.json();
          
          const statsResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${currency}USDT`);
          const statsData = await statsResponse.json();
          
          prices[currency] = parseFloat(priceData.price);
          changes[currency] = {
            priceChange: parseFloat(statsData.priceChange).toFixed(2),
            priceChangePercent: parseFloat(statsData.priceChangePercent).toFixed(2),
            volume: parseFloat(statsData.volume).toFixed(2),
            high: parseFloat(statsData.highPrice).toFixed(2),
            low: parseFloat(statsData.lowPrice).toFixed(2),
          };
        }

        setPreviousPrices(cryptoPrices);
        setCryptoPrices(prices);
        setPriceChanges(changes);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
        setIsLoading(false);
      }
    };

    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 10000);
    return () => clearInterval(interval);
  }, [preferredCurrencies]);

  const getPriceChangeColor = (current, previous) => {
    if (!previous || current === previous) return "text-gray-400";
    return current > previous ? "text-green-500" : "text-red-500";
  };

  return (
    <Card className="bg-zinc-900/50 flex-1 text-white border-0 shadow-lg backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Crypto Prices</CardTitle>
          <motion.button
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsDialogOpen(true)}
            className="bg-transparent text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <FiSettings className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Live Updates
          </span>
        </div>
      </CardHeader>

      <CardContent className="py-2">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-4"
            >
              <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {preferredCurrencies.map((currency) => {
                const change = priceChanges[currency];
                const isPositive = change?.priceChangePercent > 0;
                const iconUrl = `https://assets.coincap.io/assets/icons/${currency.toLowerCase()}@2x.png`;

                return (
                  <motion.div
                    key={currency}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group cursor-pointer"
                  >
                    <div className="bg-zinc-900/50 rounded-lg p-3 hover:bg-zinc-900/70 transition-all duration-300 hover:border-yellow-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="relative w-8 h-8"
                          >
                            <Image
                              src={iconUrl}
                              alt={currency}
                              width={32}
                              height={32}
                              className="rounded-full"
                              onError={(e) => {
                                e.target.src = "https://assets.coincap.io/assets/icons/generic@2x.png";
                              }}
                            />
                          </motion.div>
                          <div className="flex flex-col">
                            <span className={`font-bold ${cryptoColors[currency] || 'text-white'}`}>{currency}</span>
                            <motion.span 
                              className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 0.5 }}
                            >
                              {isPositive ? (
                                <TbArrowBigUpFilled className="w-3 h-3" />
                              ) : (
                                <TbArrowBigDownFilled className="w-3 h-3" />
                              )}
                              {change?.priceChangePercent}%
                            </motion.span>
                          </div>
                        </div>
                        <motion.div
                          key={cryptoPrices[currency]}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-right"
                        >
                          <span className={`font-medium text-lg ${getPriceChangeColor(
                            cryptoPrices[currency],
                            previousPrices[currency]
                          )}`}>
                            ${cryptoPrices[currency]?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="flex flex-col bg-zinc-800/30 rounded-lg p-2.5 transition-all duration-300 hover:bg-zinc-900/50">
                          <span className="text-xs text-gray-400 mb-1">24h High</span>
                          <span className="text-sm font-medium text-green-500">
                            ${parseFloat(change?.high).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </div>
                        <div className="flex flex-col bg-zinc-800/30 rounded-lg p-2.5 transition-all duration-300 hover:bg-zinc-900/50">
                          <span className="text-xs text-gray-400 mb-1">24h Low</span>
                          <span className="text-sm font-medium text-red-500">
                            ${parseFloat(change?.low).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      
      <CryptoSelectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  );
}
