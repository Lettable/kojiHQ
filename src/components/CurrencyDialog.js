// // // 'use client'

// // // import { useState, useEffect } from 'react'
// // // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// // // import { Button } from "@/components/ui/button"
// // // import { ScrollArea } from "@/components/ui/scroll-area"
// // // import { Checkbox } from "@/components/ui/checkbox"
// // // import { Bitcoin, EclipseIcon as Ethereum, DollarSign } from 'lucide-react'

// // // const cryptocurrencies = [
// // //   { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', icon: Bitcoin },
// // //   { id: 'ETH', name: 'Ethereum', symbol: 'ETH', icon: Ethereum },
// // //   { id: 'USDT', name: 'Tether', symbol: 'USDT', icon: DollarSign },
// // //   { id: 'BNB', name: 'Binance Coin', symbol: 'BNB', icon: DollarSign },
// // //   { id: 'USDC', name: 'USD Coin', symbol: 'USDC', icon: DollarSign },
// // //   { id: 'XRP', name: 'Ripple', symbol: 'XRP', icon: DollarSign },
// // //   { id: 'ADA', name: 'Cardano', symbol: 'ADA', icon: DollarSign },
// // //   { id: 'DOGE', name: 'Dogecoin', symbol: 'DOGE', icon: DollarSign },
// // //   { id: 'SOL', name: 'Solana', symbol: 'SOL', icon: DollarSign },
// // //   { id: 'TRX', name: 'TRON', symbol: 'TRX', icon: DollarSign },
// // //   { id: 'DOT', name: 'Polkadot', symbol: 'DOT', icon: DollarSign },
// // //   { id: 'DAI', name: 'Dai', symbol: 'DAI', icon: DollarSign },
// // //   { id: 'MATIC', name: 'Polygon', symbol: 'MATIC', icon: DollarSign },
// // //   { id: 'LTC', name: 'Litecoin', symbol: 'LTC', icon: DollarSign },
// // //   { id: 'SHIB', name: 'Shiba Inu', symbol: 'SHIB', icon: DollarSign },
// // // ]


// // // export default function CryptoSelectionDialog({ open, onOpenChange }) {
// // //   const [selectedCurrencies, setSelectedCurrencies] = useState([])

// // //   useEffect(() => {
// // //     const stored = localStorage.getItem('preferredCurrencies')
// // //     if (stored) {
// // //       setSelectedCurrencies(JSON.parse(stored))
// // //     }
// // //   }, [])

// // //   const handleToggle = (id) => {
// // //     setSelectedCurrencies(prev => {
// // //       if (prev.includes(id)) {
// // //         return prev.filter(currencyId => currencyId !== id)
// // //       } else {
// // //         return [...prev, id]
// // //       }
// // //     })
// // //   }

// // //   const handleSave = () => {
// // //     localStorage.setItem('preferredCurrencies', JSON.stringify(selectedCurrencies))
// // //     onOpenChange(false)
// // //   }

// // //   return (
// // //     <Dialog open={open} onOpenChange={onOpenChange}>
// // //       <DialogContent className="sm:max-w-[70vw] bg-zinc-900 border-zinc-800 text-white">
// // //         <DialogHeader>
// // //           <DialogTitle className="text-xl font-bold">Select Preferred Cryptocurrencies</DialogTitle>
// // //         </DialogHeader>
// // //         <ScrollArea className="h-[60vh] pr-4">
// // //           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
// // //             {cryptocurrencies.map((crypto) => (
// // //               <div
// // //                 key={crypto.id}
// // //                 className="flex items-center space-x-4 p-4 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700/50 transition-colors"
// // //               >
// // //                 <Checkbox
// // //                   id={crypto.id}
// // //                   checked={selectedCurrencies.includes(crypto.id)}
// // //                   onCheckedChange={() => handleToggle(crypto.id)}
// // //                   className="border-zinc-600"
// // //                 />
// // //                 <div className="flex items-center space-x-3 flex-1">
// // //                   {/* <crypto.icon className="h-8 w-8 text-yellow-500" /> */}
// // //                   <div>
// // //                     <label
// // //                       htmlFor={crypto.id}
// // //                       className="text-sm font-medium leading-none cursor-pointer"
// // //                     >
// // //                       {crypto.name}
// // //                     </label>
// // //                     <p className="text-sm text-zinc-400">{crypto.symbol}</p>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </ScrollArea>
// // //         <DialogFooter className="sm:justify-end gap-2 mt-4">
// // //           <Button
// // //             variant="outline"
// // //             onClick={() => onOpenChange(false)}
// // //             className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
// // //           >
// // //             Cancel
// // //           </Button>
// // //           <Button
// // //             onClick={handleSave}
// // //             className="bg-yellow-500 text-black hover:bg-yellow-600"
// // //           >
// // //             Save Preferences
// // //           </Button>
// // //         </DialogFooter>
// // //       </DialogContent>
// // //     </Dialog>
// // //   )
// // // }
// // "use client"

// // import { useState, useEffect } from 'react';
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import { Checkbox } from "@/components/ui/checkbox";

// // export default function CryptoSelectionDialog({ open, onOpenChange }) {
// //   const [selectedCurrencies, setSelectedCurrencies] = useState([]);
// //   const [cryptocurrencies, setCryptocurrencies] = useState([]);

// //   useEffect(() => {
// //     const stored = localStorage.getItem('preferredCurrencies');
// //     if (stored) {
// //       setSelectedCurrencies(JSON.parse(stored));
// //     }

// //     // Fetch cryptocurrencies from CoinGecko API
// //     const fetchCryptocurrencies = async () => {
// //       try {
// //         const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
// //         const data = await response.json();
// //         setCryptocurrencies(data);
// //       } catch (error) {
// //         console.error('Error fetching cryptocurrencies:', error);
// //       }
// //     };

// //     fetchCryptocurrencies();
// //   }, []);

// //   const handleToggle = (id) => {
// //     setSelectedCurrencies(prev => {
// //       if (prev.includes(id)) {
// //         return prev.filter(currencyId => currencyId !== id);
// //       } else {
// //         return [...prev, id];
// //       }
// //     });
// //   };

// //   const handleSave = () => {
// //     localStorage.setItem('preferredCurrencies', JSON.stringify(selectedCurrencies));
// //     onOpenChange(false);
// //   };

// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       <DialogContent className="sm:max-w-[70vw] bg-zinc-900 border-zinc-800 text-white">
// //         <DialogHeader>
// //           <DialogTitle className="text-xl font-bold">Select Preferred Cryptocurrencies</DialogTitle>
// //         </DialogHeader>
// //         <ScrollArea className="h-[60vh] pr-4">
// //           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
// //             {cryptocurrencies.map((crypto) => (
// //               <div
// //                 key={crypto.id}
// //                 className="flex items-center space-x-4 p-4 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700/50 transition-colors"
// //               >
// //                 <Checkbox
// //                   id={crypto.id}
// //                   checked={selectedCurrencies.includes(crypto.id)}
// //                   onCheckedChange={() => handleToggle(crypto.id)}
// //                   className="border-zinc-600"
// //                 />
// //                 <div className="flex items-center space-x-3 flex-1">
// //                   <img src={crypto.image} alt={crypto.name} className="h-8 w-8" />
// //                   <div>
// //                     <label
// //                       htmlFor={crypto.id}
// //                       className="text-sm font-medium leading-none cursor-pointer"
// //                     >
// //                       {crypto.name}
// //                     </label>
// //                     <p className="text-sm text-zinc-400">{crypto.symbol.toUpperCase()}</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </ScrollArea>
// //         <DialogFooter className="sm:justify-end gap-2 mt-4">
// //           <Button
// //             variant="outline"
// //             onClick={() => onOpenChange(false)}
// //             className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
// //           >
// //             Cancel
// //           </Button>
// //           <Button
// //             onClick={handleSave}
// //             className="bg-yellow-500 text-black hover:bg-yellow-600"
// //           >
// //             Save Preferences
// //           </Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// "use client"

// import { useState, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Checkbox } from "@/components/ui/checkbox";

// export default function CryptoSelectionDialog({ open, onOpenChange }) {
//   const [selectedCurrencies, setSelectedCurrencies] = useState([]);
//   const [cryptocurrencies, setCryptocurrencies] = useState([]);

//   useEffect(() => {
//     const stored = localStorage.getItem('preferredCurrencies');
//     if (stored) {
//       setSelectedCurrencies(JSON.parse(stored));
//     }

//     // Fetch cryptocurrencies from CoinCap API
//     const fetchCryptocurrencies = async () => {
//       try {
//         const response = await fetch('https://api.coincap.io/v2/assets');
//         const data = await response.json();
//         setCryptocurrencies(data.data); // Access the data array
//       } catch (error) {
//         console.error('Error fetching cryptocurrencies:', error);
//       }
//     };

//     fetchCryptocurrencies();
//   }, []);

//   const handleToggle = (symbol) => {
//     setSelectedCurrencies(prev => {
//       if (prev.includes(symbol)) {
//         return prev.filter(currencySymbol => currencySymbol !== symbol);
//       } else {
//         return [...prev, symbol];
//       }
//     });
//   };

//   const handleSave = () => {
//     localStorage.setItem('preferredCurrencies', JSON.stringify(selectedCurrencies));
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[70vw] bg-zinc-900 border-zinc-800 text-white">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-bold">Select Preferred Cryptocurrencies</DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="h-[60vh] pr-4">
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
//             {cryptocurrencies.map((crypto) => (
//               <div
//                 key={crypto.id}
//                 className="flex items-center space-x-4 p-4 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700/50 transition-colors"
//               >
//                 <Checkbox
//                   id={crypto.symbol}
//                   checked={selectedCurrencies.includes(crypto.symbol)}
//                   onCheckedChange={() => handleToggle(crypto.symbol)}
//                   className="border-zinc-600"
//                 />
//                 <div className="flex items-center space-x-3 flex-1">
//                   <img src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`} alt={crypto.name} className="h-8 w-8" />
//                   <div>
//                     <label
//                       htmlFor={crypto.symbol}
//                       className="text-sm font-medium leading-none cursor-pointer"
//                     >
//                       {crypto.name}
//                     </label>
//                     <p className="text-sm text-zinc-400">{crypto.symbol.toUpperCase()}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>
//         <DialogFooter className="sm:justify-end gap-2 mt-4">
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSave}
//             className="bg-yellow-500 text-black hover:bg-yellow-600"
//           >
//             Save Preferences
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

export default function CryptoSelectionDialog({ open, onOpenChange }) {
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [cryptocurrencies, setCryptocurrencies] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('preferredCurrencies');
    if (stored) {
      setSelectedCurrencies(JSON.parse(stored));
    }

    const fetchCryptocurrencies = async () => {
      try {
        const response = await fetch('https://api.coincap.io/v2/assets');
        const data = await response.json();
        setCryptocurrencies(data.data);
      } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
      }
    };

    fetchCryptocurrencies();
  }, []);

  const handleToggle = (symbol) => {
    setSelectedCurrencies(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(currencySymbol => currencySymbol !== symbol);
      } else {
        return [...prev, symbol];
      }
    });
  };

  const handleSave = () => {
    if (selectedCurrencies.length <= 5) {
      localStorage.setItem('preferredCurrencies', JSON.stringify(selectedCurrencies));
      onOpenChange(false);
    } else {
      alert('You can only select up to 5 Live currencies');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[70vw] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Select Preferred Cryptocurrencies</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
            {cryptocurrencies.map((crypto) => (
              <div
                key={crypto.id}
                className="flex items-center space-x-4 p-4 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700/50 transition-colors"
              >
                <Checkbox
                  id={crypto.symbol}
                  checked={selectedCurrencies.includes(crypto.symbol)}
                  onCheckedChange={() => handleToggle(crypto.symbol)}
                  className="border-zinc-600"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <img src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`} alt={crypto.name} className="h-8 w-8" />
                  <div>
                    <label
                      htmlFor={crypto.symbol}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {crypto.name}
                    </label>
                    <p className="text-sm text-zinc-400">{crypto.symbol.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-yellow-500 text-black hover:bg-yellow-600"
          >
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}