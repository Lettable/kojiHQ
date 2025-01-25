// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import { MessageSquare, Users, TrendingUp, Clock, AlertTriangle, Bitcoin, EclipseIcon as Ethereum, DollarSign, MessageCircle, BookMarkedIcon, CoinsIcon, MessageSquareQuote, MessageSquareReply } from 'lucide-react'
// import Header from '@/partials/Header'
// import Shoutbox from '@/components/ShoutBox'
// import { FaMoneyBill, FaEthereum } from 'react-icons/fa'
// import { jwtDecode } from 'jwt-decode'

// // Forum categories and their respective forums
// const forumCategories = {
//   "Marketplace": [
//     { id: 1, title: "Accounts & Services", threads: 1234, posts: 5678, lastPost: { user: "trader123", time: "5m ago" } },
//     { id: 2, title: "Digital Products", threads: 890, posts: 3456, lastPost: { user: "seller456", time: "15m ago" } },
//     { id: 3, title: "Requests & Offers", threads: 567, posts: 2345, lastPost: { user: "buyer789", time: "1h ago" } },
//   ],
//   "Community": [
//     { id: 4, title: "General Discussion", threads: 2345, posts: 9012, lastPost: { user: "chat345", time: "2m ago" } },
//     { id: 5, title: "Tutorials & Guides", threads: 789, posts: 4567, lastPost: { user: "guru567", time: "30m ago" } },
//     { id: 6, title: "News & Updates", threads: 432, posts: 1890, lastPost: { user: "news123", time: "45m ago" } },
//   ],
//   "Support": [
//     { id: 7, title: "Help & Support", threads: 678, posts: 2345, lastPost: { user: "helper890", time: "10m ago" } },
//     { id: 8, title: "Suggestions", threads: 345, posts: 1234, lastPost: { user: "idea456", time: "3h ago" } },
//     { id: 9, title: "Report Issues", threads: 123, posts: 567, lastPost: { user: "mod789", time: "1h ago" } },
//   ]
// }

// const announcements = [
//   { id: 1, title: "New marketplace features released!", time: "2h ago" },
//   { id: 2, title: "December community event announcement", time: "1d ago" },
//   { id: 3, title: "Important security update", time: "2d ago" },
// ]

// const staffOnline = [
//   { id: 1, name: "AdminOne", role: "Administrator", status: "online" },
//   { id: 2, name: "ModTwo", role: "Moderator", status: "online" },
//   { id: 3, name: "SupThree", role: "Support", status: "away" },
// ]

// const latestActivity = [
//   { id: 1, type: "thread", title: "New marketplace guide", author: "guide123", time: "5m ago" },
//   { id: 2, type: "post", title: "RE: Trading tips", author: "trader456", time: "15m ago" },
//   { id: 3, type: "product", title: "Premium Account Package", author: "seller789", time: "30m ago" },
// ]

// export default function HomePage() {
//   const [currentUser, setCurrentUser] = useState(null)
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isDarkTheme, setIsDarkTheme] = useState(true)
//   const [cryptoPrices, setCryptoPrices] = useState({
//     BTC: "0",
//     ETH: "0",
//     LTC: "0"
//   })

//   useEffect(() => {
//     const fetchCryptoPrices = async () => {
//       try {
//         const [btcResponse, ethResponse, ltcResponse] = await Promise.all([
//           fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
//           fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'),
//           fetch('https://api.binance.com/api/v3/ticker/price?symbol=LTCUSDT')
//         ]);

//         const btcData = await btcResponse.json();
//         const ethData = await ethResponse.json();
//         const ltcData = await ltcResponse.json();

//         setCryptoPrices({
//           BTC: Number(btcData.price).toLocaleString(undefined, { maximumFractionDigits: 2 }),
//           ETH: Number(ethData.price).toLocaleString(undefined, { maximumFractionDigits: 2 }),
//           LTC: Number(ltcData.price).toLocaleString(undefined, { maximumFractionDigits: 2 })
//         });
//       } catch (error) {
//         console.error('Error fetching crypto prices:', error);
//       }
//     };

//     fetchCryptoPrices();
//     const interval = setInterval(fetchCryptoPrices, 30000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       setCurrentUser(decodedToken);
//       setIsLoggedIn(true);
//     } else {
//       setCurrentUser(null);
//       setIsLoggedIn(false);
//     }
//   }, []);

//   const getGreeting = () => {
//     const hour = new Date().getHours()
//     if (hour < 12) return "Good morning"
//     if (hour < 18) return "Good afternoon"
//     return "Good evening"
//   }

//   return (
//     <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
//       <Header
//         setIsOpen={() => { }}
//         avatar={currentUser && currentUser.profilePic}
//         userId={currentUser && currentUser.userId}
//         currentPage='/forum'
//         isDarkTheme={isDarkTheme}
//         toggleTheme={() => setIsDarkTheme(!isDarkTheme)}
//         isLoggedIn={isLoggedIn}
//       />

//       {/* Hero Section */}
//       <section className={`py-16 ${isDarkTheme ? 'bg-zinc-900/10 text-white border-zinc-300' : 'bg-gray-100'}`}>
//         <div className="container mx-auto px-4">
//           <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">Welcome to Koji HQ</h1>
//           <div className="max-w-2xl mx-auto relative"></div>
//         </div>
//       </section>
//       <Separator className={`${isDarkTheme ? 'bg-white/10' : 'bg-zinc-300'}`} />

//       <div className="container text-white mx-auto px-4 py-8">
//         <div className="flex flex-col text-white lg:flex-row gap-8">
//           <div className="lg:w-3/4 text-white space-y-8">
//             <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
//               <CardHeader className="pt-5 pl-10 pr-10 pb-5">
//                 <CardTitle className="text-xl">Shoutbox</CardTitle>
//               </CardHeader>
//               <CardContent className="h-[440px] p-1">
//                 <Shoutbox />
//               </CardContent>
//             </Card>

//             <div className="grid grid-cols-1 bg-zinc-900/50 p-5 rounded-xl md:grid-cols-3 gap-4">
//               <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white p-3 hover:bg-zinc-800/50 border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform`}
//                 onClick={() => window.location.href = '/marketplace'}>
//                 <CardContent className="flex flex-col items-center justify-center p-6">
//                   <CoinsIcon className="h-12 w-12 mb-4" />
//                   <h3 className="text-xl font-semibold">Marketplace</h3>
//                   <p className='text-sm'>Marketplace of digital products</p>
//                 </CardContent>
//               </Card>

//               <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white p-3 border-0 hover:bg-zinc-800/50 shadow-lg cursor-pointer hover:scale-105 transition-transform`}
//                 onClick={() => window.location.href = '/product'}>
//                 <CardContent className="flex flex-col items-center justify-center p-6">
//                   <BookMarkedIcon className="h-12 w-12 mb-4" />
//                   <h3 className="text-xl font-semibold">Products</h3>
//                   <p className='text-sm'>Explore digital products</p>
//                 </CardContent>
//               </Card>

//               <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white p-3 border-0 hover:bg-zinc-800/50 shadow-lg cursor-pointer hover:scale-105 transition-transform`}
//                 onClick={() => window.location.href = '/chat'}>
//                 <CardContent className="flex flex-col items-center justify-center p-6">
//                   <MessageCircle className="h-12 w-12 mb-4" />
//                   <h3 className="text-xl font-semibold">Chat</h3>
//                   <p className='text-sm'>Chat with someone privately</p>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Forums List */}
//             <div className="text-white space-y-6">
//               {Object.entries(forumCategories).map(([category, forums]) => (
//                 <Card key={category} className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
//                   <CardHeader>
//                     <CardTitle className="text-xl">{category}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-white space-y-2">
//                       {forums.map(forum => (
//                         <div
//                           key={forum.id}
//                           className={`flex items-center text-white justify-between p-4 rounded-lg bg-zinc-800/10 ${isDarkTheme ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50'
//                             } transition-colors cursor-pointer`}
//                         >
//                           <div className="flex-1">
//                             <h3 className="font-semibold">{forum.title}</h3>
//                             <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
//                               {forum.threads} threads • {forum.posts} posts
//                             </p>
//                           </div>
//                           <div className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
//                             <p>Last post by {forum.lastPost.user}</p>
//                             <p className="text-right">{forum.lastPost.time}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>

//           {/* Right Side - Stats & Info */}
//           <div className="lg:w-1/4 text-white space-y-6">
//             {/* Greeting Card */}
//             <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
//               <CardContent className="p-6">
//                 <h2 className="text-2xl font-bold mb-2">{getGreeting()} {currentUser && currentUser.username}</h2>
//                 <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
//                   What&apos;s new today? Stay updated with the latest news and announcements.
//                 </p>
//               </CardContent>
//             </Card>

//             {/* User Stats */}
//             <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} border-0 text-white shadow-lg`}>
//               <CardHeader>
//                 <CardTitle className="text-lg">Your Stats</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Reputation</span>
//                     <span>1,234</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Posts</span>
//                     <span>567</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Likes</span>
//                     <span>890</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Crypto Prices */}
//             <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
//               <CardHeader>
//                 <CardTitle className="text-lg">Live Prices</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <Bitcoin className="h-4 w-4 mr-2" />
//                       <span>BTC</span>
//                     </div>
//                     <span>${cryptoPrices.BTC}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <FaEthereum className="h-4 w-4 mr-2" />
//                       <span>ETH</span>
//                     </div>
//                     <span>${cryptoPrices.ETH}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <DollarSign className="h-4 w-4 mr-2" />
//                       <span>LTC</span>
//                     </div>
//                     <span>${cryptoPrices.LTC}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Announcements */}
//             <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
//               <CardHeader>
//                 <CardTitle className="text-lg">Announcements</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {announcements.map(announcement => (
//                     <div key={announcement.id} className="border-b last:border-0 pb-2 last:pb-0">
//                       <h4 className="font-medium">{announcement.title}</h4>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Latest Activity */}
//             <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
//               <CardHeader>
//                 <CardTitle className="text-lg">Latest Activity</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-white space-y-3">
//                   {latestActivity.map(activity => (
//                     <div key={activity.id} className="flex border-b last:border-0 pb-2 last:pb-0 items-start space-x-2">
//                       <Badge className={`${activity.type === 'thread' ? 'bg-zinc-700 hover:bg-zinc-700 text-white hover:text-white' : activity.type === 'post' ? 'bg-zinc-200 hover:bg-zinc-200 text-black hover:text-black' : 'bg-yellow-500 hover:bg-yellow-500 text-black hover:text-black'}`}>
//                         {activity.type === 'thread' ? <MessageSquareQuote size={16} /> : activity.type === 'post' ? <MessageSquareReply size={16} /> : <FaMoneyBill size={16} />}
//                       </Badge>
//                       <div>
//                         <p className="text-sm mt-0 font-medium">{activity.title}</p>
//                         <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
//                           by {activity.author} • {activity.time}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Staff */}
//             <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
//               <CardHeader>
//                 <CardTitle className="text-lg">Staff</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {staffOnline.map(staff => (
//                     <div key={staff.id} className="flex text-white items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <div className={`w-2 h-2 rounded-full ${staff.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
//                           }`} />
//                         <span>{staff.name}</span>
//                       </div>
//                       <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
//                         {staff.role}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Users, Clock, Bitcoin, DollarSign, MessageCircle, BookMarkedIcon, CoinsIcon } from 'lucide-react'
import Header from '@/partials/Header'
import Shoutbox from '@/components/ShoutBox'
import { FaEthereum } from 'react-icons/fa'
import { jwtDecode } from 'jwt-decode'
import PreferredCurrencies from '@/components/PreferedCurrencies'
import CryptoSelectionDialog from '@/components/CurrencyDialog'
import { ForumSection } from '@/components/ForumSection'

// const renderTextWithEmojis = (text, emojis) => {
//   if (!text || typeof text !== 'string') return text || '';
//   if (!emojis || !Array.isArray(emojis)) return text;

//   const emojiRegex = /:([\w-]+):/g;
//   const parts = text.split(emojiRegex);

//   return parts.map((part, index) => {
//     if (index % 2 === 0) {
//       return part;
//     } else {
//       const emoji = emojis.find(e => e.emojiTitle === `:${part}:`);
//       if (emoji) {
//         return (
//           <img
//             key={index}
//             src={emoji.emojiUrl}
//             alt={emoji.emojiTitle}
//             title={emoji.emojiTitle}
//             className="inline-block w-6 h-6"
//           />
//         );
//       } else {
//         return `:${part}:`;
//       }
//     }
//   });
// };

const renderTextWithEmojis = (text, emojis) => {
  if (!text || typeof text !== 'string') return text || '';

  if (!Array.isArray(emojis)) return text;

  const emojiRegex = /:([\w-]+):/g;
  const parts = text.split(emojiRegex);

  if (parts.length === 0) {
    return text;
  }

  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else {
      const emoji = emojis.find(e => e.emojiTitle === `:${part}:`);
      if (emoji) {
        return (
          <img
            key={index}
            src={emoji.emojiUrl}
            alt={emoji.emojiTitle}
            title={emoji.emojiTitle}
            className="inline-block w-6 h-6"
          />
        );
      } else {
        return `:${part}:`;
      }
    }
  });
};

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [emojis, setEmojis] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState({
    BTC: "0",
    ETH: "0",
    LTC: "0"
  })
  const [forumCategories, setForumCategories] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [staffOnline, setStaffOnline] = useState([])
  const [currencies, setCurrencies] = useState()
  const [userStats, setUserStats] = useState({ reputation: 0, totalPosts: 0, totalThreads: 0 })
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedCurrencies = localStorage.getItem('preferredCurrencies');
    const initialCurrencies = storedCurrencies ? JSON.parse(storedCurrencies) : ['BTC', 'ETH', 'LTC'];
    setCurrencies(initialCurrencies);
  }, []);


  const fetchEmojis = async () => {
    try {
      const response = await fetch('/api/emojis')
      const data = await response.json()
      setEmojis(data.length > 0 ? data : [
        {
          "id": "14785236901",
          "emojiTitle": ":success:",
          "emojiUrl": "/emojis/success.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "25896314702",
          "emojiTitle": ":troll:",
          "emojiUrl": "/emojis/troll.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "36985214703",
          "emojiTitle": ":nike:",
          "emojiUrl": "/emojis/nike.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "47852136904",
          "emojiTitle": ":steam:",
          "emojiUrl": "/emojis/steam.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "58963214705",
          "emojiTitle": ":kubernetes:",
          "emojiUrl": "/emojis/kubernetes.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "69874512306",
          "emojiTitle": ":facebook:",
          "emojiUrl": "/emojis/facebook.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "74185296307",
          "emojiTitle": ":slack:",
          "emojiUrl": "/emojis/slack.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "85296374108",
          "emojiTitle": ":google:",
          "emojiUrl": "/emojis/google.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "96325874109",
          "emojiTitle": ":instagram:",
          "emojiUrl": "/emojis/instagram.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "10254789610",
          "emojiTitle": ":nodejs:",
          "emojiUrl": "/emojis/nodejs.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "1025498673203",
          "emojiTitle": ":verified:",
          "emojiUrl": "https://emoji.discadia.com/emojis/e068c349-96c2-4688-8d4b-69d08adfb375.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "11365824711",
          "emojiTitle": ":typescript:",
          "emojiUrl": "/emojis/typescript.png",
          "isAnimated": false,
          "isPremium": false
        },
        {
          "id": "102547829376",
          "emojiTitle": ":osama_bin_laden:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/1494-osama.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254786667",
          "emojiTitle": ":troll_pakistan:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/4083-trollpakistan.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "87282304737",
          "emojiTitle": ":kashmir:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/6034-flag-ks.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "876547829376",
          "emojiTitle": ":pakistan_ball:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/6540-pakistanball.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "102547823476",
          "emojiTitle": ":parrot_pakistan:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/4484_pakistanparrot.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "102540093476",
          "emojiTitle": ":peep_shy:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/2330-peeposhy.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "12478953612",
          "emojiTitle": ":youtube:",
          "emojiUrl": "/emojis/youtube.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "13589624713",
          "emojiTitle": ":dabbing:",
          "emojiUrl": "/emojis/dabbing.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "14695872314",
          "emojiTitle": ":thinking:",
          "emojiUrl": "/emojis/thinking.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "15796284315",
          "emojiTitle": ":watching-you:",
          "emojiUrl": "/emojis/watching-you.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "16845392716",
          "emojiTitle": ":facepalm:",
          "emojiUrl": "/emojis/facepalm.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "17984256317",
          "emojiTitle": ":party:",
          "emojiUrl": "/emojis/party.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "18936527418",
          "emojiTitle": ":depressed:",
          "emojiUrl": "/emojis/depressed.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "19045736219",
          "emojiTitle": ":lol:",
          "emojiUrl": "/emojis/lol.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "20147385920",
          "emojiTitle": ":fb-laugh:",
          "emojiUrl": "/emojis/fb-laugh.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "21298546321",
          "emojiTitle": ":amongus:",
          "emojiUrl": "/emojis/amongus.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "102547447876",
          "emojiTitle": ":horney_peep:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/5379-horny.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "1025478946344",
          "emojiTitle": ":peep_deku:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/16875-peepodeku.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "1022343946344",
          "emojiTitle": ":peepodeku:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/16875-peepodeku.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "1025478899879",
          "emojiTitle": ":peep_toxic:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/3465-peepo-anxious.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "102234394394",
          "emojiTitle": ":duage:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/13595-duage.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "102547096876",
          "emojiTitle": ":peep_susge_gang:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/59382-pepesusgesquad.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "22387459622",
          "emojiTitle": ":space-float:",
          "emojiUrl": "/emojis/space_float.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "23479658123",
          "emojiTitle": ":amongus-dance:",
          "emojiUrl": "/emojis/among_us_orange_dance.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "24589317624",
          "emojiTitle": ":amongus-halloween:",
          "emojiUrl": "/emojis/amongustwerkhalloween.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "25639874125",
          "emojiTitle": ":amongus-pet:",
          "emojiUrl": "/emojis/among_us_pet.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "26749835226",
          "emojiTitle": ":amongus-sus:",
          "emojiUrl": "/emojis/among_us_sus.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "27834956127",
          "emojiTitle": ":venting:",
          "emojiUrl": "/emojis/venting.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "28934765228",
          "emojiTitle": ":alert:",
          "emojiUrl": "/emojis/alert.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "29046785329",
          "emojiTitle": ":party-blob:",
          "emojiUrl": "/emojis/party_blob.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "30154789630",
          "emojiTitle": ":dumpster-fire:",
          "emojiUrl": "/emojis/dumpster-fire.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "31298654731",
          "emojiTitle": ":high-level:",
          "emojiUrl": "/emojis/high-level.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "32384976132",
          "emojiTitle": ":typing-cat:",
          "emojiUrl": "/emojis/typingcat.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "33495768233",
          "emojiTitle": ":bugs-bunny:",
          "emojiUrl": "/emojis/bugs_bunny.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "34589713634",
          "emojiTitle": ":cat-jam:",
          "emojiUrl": "/emojis/catjam.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "35674829335",
          "emojiTitle": ":blob-yes:",
          "emojiUrl": "/emojis/blob-yes.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "36798254336",
          "emojiTitle": ":clapclap:",
          "emojiUrl": "/emojis/clapclap-e.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "37859461237",
          "emojiTitle": ":cool-doge:",
          "emojiUrl": "/emojis/cool-doge.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "38941675338",
          "emojiTitle": ":cheers:",
          "emojiUrl": "/emojis/cheers.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "39072846139",
          "emojiTitle": ":smart:",
          "emojiUrl": "/emojis/smart.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "40178954640",
          "emojiTitle": ":partyparrot:",
          "emojiUrl": "/emojis/partyparrot.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789641",
          "emojiTitle": ":fingergun:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/73097-fingerguns.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789642",
          "emojiTitle": ":peeprobotdance:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/9796-vampirepeped.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "40178954641",
          "emojiTitle": ":peep-e-q:",
          "emojiUrl": "/emojis/peep-e-q.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "41289654742",
          "emojiTitle": ":peepjail:",
          "emojiUrl": "/emojis/peepojail.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "42359764843",
          "emojiTitle": ":peepotalk:",
          "emojiUrl": "/emojis/peepotalk.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "43475876944",
          "emojiTitle": ":peepo-okq:",
          "emojiUrl": "/emojis/peepo-okq.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "44586957845",
          "emojiTitle": ":peepo-lq:",
          "emojiUrl": "/emojis/peepo1q.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "45697848946",
          "emojiTitle": ":peepochat:",
          "emojiUrl": "/emojis/peepochat.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "46758969147",
          "emojiTitle": ":peepoclap:",
          "emojiUrl": "/emojis/peepoclap.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "48975982349",
          "emojiTitle": ":peepojamq:",
          "emojiUrl": "/emojis/peepojamq.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "49068793450",
          "emojiTitle": ":peepom16q:",
          "emojiUrl": "/emojis/peepom16q.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "50187904551",
          "emojiTitle": ":peeponotes:",
          "emojiUrl": "/emojis/peeponotes.jpg",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "51290715652",
          "emojiTitle": ":peepgaming:",
          "emojiUrl": "/emojis/peepgaming.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "52309826753",
          "emojiTitle": ":peeposad:",
          "emojiUrl": "/emojis/peeposad.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "53410937854",
          "emojiTitle": ":peeposhrug:",
          "emojiUrl": "/emojis/peeposhrug.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "54521048955",
          "emojiTitle": ":peeposq:",
          "emojiUrl": "/emojis/peeposq.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "56743260157",
          "emojiTitle": ":peepoq2:",
          "emojiUrl": "/emojis/peepoq.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "57854371258",
          "emojiTitle": ":peeps:",
          "emojiUrl": "/emojis/peeps.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "58965482359",
          "emojiTitle": ":0pepo-runq:",
          "emojiUrl": "/emojis/0pepo_runq.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "59076593460",
          "emojiTitle": ":peepo2:",
          "emojiUrl": "/emojis/peepo.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "61298715662",
          "emojiTitle": ":patrickq:",
          "emojiUrl": "/emojis/01_patrickq.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "63410937864",
          "emojiTitle": ":dancing-cat:",
          "emojiUrl": "/emojis/01-dancing-cat.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "64521048965",
          "emojiTitle": ":done:",
          "emojiUrl": "/emojis/done.jpg",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "66743260167",
          "emojiTitle": ":loading:",
          "emojiUrl": "/emojis/loading.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "69076593470",
          "emojiTitle": ":thankyou:",
          "emojiUrl": "/emojis/thankyou.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "70187604571",
          "emojiTitle": ":panic-intensifies:",
          "emojiUrl": "/emojis/mild-panic-intensifies.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "71298715672",
          "emojiTitle": ":trihard:",
          "emojiUrl": "/emojis/trihard.jpg",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "72309826773",
          "emojiTitle": ":kappa:",
          "emojiUrl": "/emojis/kappa.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789674",
          "emojiTitle": ":muslimpepe:",
          "emojiUrl": "/emojis/muslim_pepoeq.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10836493943",
          "emojiTitle": ":bluegrinch:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/88521-bluegrinch.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789489",
          "emojiTitle": ":decreux_sad:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/95290-decreux-sad.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789484",
          "emojiTitle": ":decreux_shh:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/94391-decreux-shh.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789490",
          "emojiTitle": ":i_like_all_dit:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/19908-i-like-all-dit.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789491",
          "emojiTitle": ":cat_heart:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/91307-cat-heart.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789492",
          "emojiTitle": ":stretched_skull:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/81197-stretched-skull.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789493",
          "emojiTitle": ":nerdgeo:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/24934-nerdgeo.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789494",
          "emojiTitle": ":skeleton_stairing:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/54199-berserkskeletonmeme1.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789495",
          "emojiTitle": ":cockroach_dancing:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/34027-cockroach-rainbows.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789496",
          "emojiTitle": ":dancingskeleton:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/62409-dancingskeleton.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789497",
          "emojiTitle": ":fuck_you_finger:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/22460-fuckyou.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789498",
          "emojiTitle": ":happy_happy_happy:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/89119-happy.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789499",
          "emojiTitle": ":memechewcat:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/32315-memechew.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789500",
          "emojiTitle": ":SorryFrogStonks:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/44998-sorryfrogstonks.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789501",
          "emojiTitle": ":shy_joe:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/22867-shy-joe.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789502",
          "emojiTitle": ":oiiaooiia:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/21384-oiiaooiia.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789503",
          "emojiTitle": ":elmofire:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/81562-elmofire.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789504",
          "emojiTitle": ":cool_glass_smog:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/81562-elmofire.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789505",
          "emojiTitle": ":actually_dog:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/16076-actuallydog.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789506",
          "emojiTitle": ":what_the_f:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/58082-what-the.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": "10254789507",
          "emojiTitle": ":crazy_cockroach_dancing:",
          "emojiUrl": "https://cdn3.emoji.gg/emojis/52709-cockroach-dancing.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 1,
          "emojiTitle": ":woman-yelling:",
          "emojiUrl": "/emojis/woman-yelling.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 2,
          "emojiTitle": ":watch-out:",
          "emojiUrl": "/emojis/watch_out.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 3,
          "emojiTitle": ":yuno:",
          "emojiUrl": "/emojis/yuno.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 4,
          "emojiTitle": ":you-no:",
          "emojiUrl": "/emojis/y_u_no.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 5,
          "emojiTitle": ":you-dont-say:",
          "emojiUrl": "/emojis/you_dont_say.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 6,
          "emojiTitle": ":whoa-guys:",
          "emojiUrl": "/emojis/whoa_guys.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 7,
          "emojiTitle": ":okay:",
          "emojiUrl": "/emojis/okay.jpg",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 8,
          "emojiTitle": ":panik:",
          "emojiUrl": "/emojis/panik.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 9,
          "emojiTitle": ":feels:",
          "emojiUrl": "/emojis/feels.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 10,
          "emojiTitle": ":epic-win:",
          "emojiUrl": "/emojis/epic_win.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 11,
          "emojiTitle": ":lol:",
          "emojiUrl": "/emojis/lol.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 12,
          "emojiTitle": ":rage:",
          "emojiUrl": "/emojis/rage.jpg",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 13,
          "emojiTitle": ":no:",
          "emojiUrl": "/emojis/no.jpg",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 14,
          "emojiTitle": ":notbad:",
          "emojiUrl": "/emojis/notbad.jpg",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 15,
          "emojiTitle": ":me-gusta:",
          "emojiUrl": "/emojis/megusta.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 16,
          "emojiTitle": ":see-what-you-did:",
          "emojiUrl": "/emojis/i_see_what_you_did_there.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 17,
          "emojiTitle": ":facepalm:",
          "emojiUrl": "/emojis/facepalm.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 18,
          "emojiTitle": ":crycat:",
          "emojiUrl": "/emojis/crycat.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 19,
          "emojiTitle": ":let-me-in:",
          "emojiUrl": "/emojis/let_me_in.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 20,
          "emojiTitle": ":woohoo-bananadance:",
          "emojiUrl": "/emojis/woohoo-bananadance.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 21,
          "emojiTitle": ":amd:",
          "emojiUrl": "/emojis/amd.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 22,
          "emojiTitle": ":amazon:",
          "emojiUrl": "/emojis/amazon.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 23,
          "emojiTitle": ":android:",
          "emojiUrl": "/emojis/android.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 24,
          "emojiTitle": ":golang:",
          "emojiUrl": "/emojis/golang.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 25,
          "emojiTitle": ":blob-salute:",
          "emojiUrl": "/emojis/blob_salute.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 26,
          "emojiTitle": ":blob-dance:",
          "emojiUrl": "/emojis/blob-dance.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 27,
          "emojiTitle": ":sadblob:",
          "emojiUrl": "/emojis/sadblob.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 28,
          "emojiTitle": ":blob-aww:",
          "emojiUrl": "/emojis/blob_aww.png",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 29,
          "emojiTitle": ":blue-blob-jump:",
          "emojiUrl": "/emojis/blueblob_jump.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 30,
          "emojiTitle": ":party-blob:",
          "emojiUrl": "/emojis/party-blob.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 31,
          "emojiTitle": ":fb-angry:",
          "emojiUrl": "/emojis/fb-angry.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 32,
          "emojiTitle": ":fb-wow:",
          "emojiUrl": "/emojis/fbwow.gif",
          "isAnimated": false,
          "isPremium": true
        },
        {
          "id": 33,
          "emojiTitle": ":banana-dance-duo:",
          "emojiUrl": "/emojis/bananadance_duo.gif",
          "isAnimated": false,
          "isPremium": true
        }
      ])
    } catch (error) {
      console.error('Error fetching emojis:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser(decodedToken);
      setIsLoggedIn(true);

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        if (!userId) throw new Error('User ID not found in token.');

        fetchNewToken(userId, token)
          .then((newToken) => {
            const newDecoded = jwtDecode(newToken);
            setCurrentUser(newDecoded);
            localStorage.setItem('accessToken', newToken);
            fetchEmojis();
          })
          .catch((error) => {
            console.error('Error fetching new token:', error.message);
          });

      } catch (error) {
        console.error('Error decoding token:', error);
      }

      fetchUserStats(decodedToken.userId);
    } else {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }

    const fetchForumData = async () => {
      try {
        const response = await fetch('/api/home-forum');
        const data = await response.json();
        setForumCategories(data);
      } catch (error) {
        setError(err.message)
        console.error('Error fetching forum data:', error);
      }
    };
    
    fetchForumData();
    fetchAnnouncements();
    fetchStaffStatus();
  }, []);

  async function fetchNewToken(userId, token) {
    try {
      const response = await fetch('/api/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch new token.');
      }

      const { token } = await response.json();
      return token;
    } catch (error) {
      console.error('Error updating token:', error.message);
      throw error;
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/get-ann');
      const data = await response.json();
      setAnnouncements(data.announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchStaffStatus = async () => {
    try {
      const response = await fetch('/api/get-staff-status');
      const data = await response.json();
      setStaffOnline(data.data);
    } catch (error) {
      console.error('Error fetching staff status:', error);
    }
  };

  const fetchUserStats = async (userId) => {
    try {
      const response = await fetch(`/api/get-stats?userId=${userId}`);
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Header
        setIsOpen={() => { }}
        avatar={currentUser && currentUser.profilePic}
        userId={currentUser && currentUser.userId}
        currentPage='/forum'
        isDarkTheme={isDarkTheme}
        toggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        isLoggedIn={isLoggedIn}
        isPremium={currentUser && currentUser.isPremium}
      />

      {/* Hero Section */}
      <section className={`relative py-16 overflow-hidden ${isDarkTheme ? 'bg-zinc-900/10 text-white border-zinc-300' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 relative text-center">

          {/* Title with a Slight Glow */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center relative">
            🎉 Welcome to Koji HQ 🎆
          </h1>

          {/* Festive Subtitle */}
          <p className="text-lg md:text-xl text-zinc-400">
            Your <b>hub for knowledge, cracking, and discussions.</b>
            🔥 Start the new year with exciting conversations!
          </p>

          {/* Floating Confetti-like Decorations */}
          <div className="absolute -top-10 left-4 w-12 h-12 bg-yellow-500 rounded-full opacity-20 blur-lg"></div>
          <div className="absolute -top-12 right-10 w-8 h-8 bg-pink-500 rounded-full opacity-20 blur-md"></div>
          <div className="absolute bottom-8 left-8 w-10 h-10 bg-red-500 rounded-full opacity-20 blur-md"></div>
          <div className="absolute bottom-6 right-10 w-14 h-14 bg-orange-500 rounded-full opacity-10 blur-lg"></div>

          {/* Vertical Glowing Side Borders */}

          {/* Additional Spark Effects for Boundaries */}
          <div className="absolute left-2 top-10 w-6 h-6 bg-yellow-400 rounded-full opacity-20 blur-md"></div>
          <div className="absolute right-2 top-20 w-8 h-8 bg-pink-400 rounded-full opacity-15 blur-md"></div>
          <div className="absolute left-4 bottom-12 w-10 h-10 bg-red-400 rounded-full opacity-10 blur-md"></div>
          <div className="absolute right-4 bottom-6 w-12 h-12 bg-orange-400 rounded-full opacity-10 blur-lg"></div>

        </div>


      </section>

      <Separator className={`${isDarkTheme ? 'bg-white/10' : 'bg-zinc-300'}`} />



      <div className="container text-white mx-auto px-4 py-8">
        <div className="flex flex-col text-white lg:flex-row gap-8">
          <div className="lg:w-3/4 text-white space-y-8">
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
              <CardHeader className="pt-5 pl-10 pr-10 pb-5">
                <CardTitle className="text-xl">Shoutbox</CardTitle>
              </CardHeader>
              <CardContent className="h-[440px] p-1">
                <Shoutbox />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 bg-zinc-900/50 p-5 rounded-xl md:grid-cols-3 gap-4">
              <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white p-3 hover:bg-zinc-800/50 border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => window.location.href = '/market'}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <CoinsIcon className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-semibold">Marketplace</h3>
                  <p className='text-sm'>Marketplace of digital products</p>
                </CardContent>
              </Card>

              <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white p-3 border-0 hover:bg-zinc-800/50 shadow-lg cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => window.location.href = '/feed'}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <BookMarkedIcon className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-semibold">Products</h3>
                  <p className='text-sm'>Explore digital products</p>
                </CardContent>
              </Card>

              <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white p-3 border-0 hover:bg-zinc-800/50 shadow-lg cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => window.location.href = '/chat'}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <MessageCircle className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-semibold">Chat</h3>
                  <p className='text-sm'>Chat with someone privately</p>
                </CardContent>
              </Card>
            </div>

            {/* Forums List */}
            <div className="text-white space-y-6">
              {/* {error && (
                <div className="p-4 rounded-lg bg-red-500 text-white">
                  <p>{error}</p>
                </div>
              )}
              {Object.keys(forumCategories).length > 0 ? (
                Object.entries(forumCategories).map(([category, forums]) => (
                  <Card key={category} className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
                    <CardHeader>
                      <CardTitle className="text-xl">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-white space-y-2">
                        <div className="text-white space-y-2">
                          {forums.length > 0 ? (
                            forums.map(forum => (
                              <a
                                href={`/forum/${forum.id}`}
                                key={forum.id}
                                className={`flex items-center text-white justify-between p-4 rounded-lg bg-zinc-800/10 ${isDarkTheme ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                              >
                                <div className="flex-1">
                                  <h3 className="font-semibold">{forum.title}</h3>
                                  <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {forum.threads} threads • {forum.posts} posts
                                  </p>
                                </div>
                                <div className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <p>
                                    Last post by <span className={`${forum.lastPost.usernameEffect}`}>{forum.lastPost.user}</span>
                                  </p>
                                  <p className="text-right">{forum.lastPost.time}</p>
                                </div>
                              </a>
                            ))
                          ) : (
                            <div className="p-4 rounded-lg bg-red-500 text-white">
                              <p>No forums found or error fetching forums.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))) : (
                <div className="p-4 rounded-lg bg-red-500 text-white">
                  <p>No categories found or error fetching categories.</p>
                </div>
              )} */}
              <div className="text-white space-y-6">
                {error ? (
                  <div className="p-4 rounded-lg bg-red-500 text-white">
                    <p>{error}</p>
                  </div>
                ) : (
                  <ForumSection
                    forumData={forumCategories}
                    isDarkTheme={isDarkTheme}
                    setForumCategories={setForumCategories}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Stats & Info */}
          <div className="lg:w-1/4 text-white space-y-6">
            {/* Greeting Card */}
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">{getGreeting()} <span className={`${currentUser && currentUser.usernameEffect}`}>{currentUser && currentUser.username}</span></h2>
                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  What&apos;s new today? Stay updated with the latest news and announcements.
                </p>
                <p className={`text-sm mt-3 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}><b>Friendly Reminder: </b>Make sure you use English in the shoutbox.</p>
              </CardContent>
            </Card>

            {/* User Stats */}
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} border-0 text-white shadow-lg`}>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Reputation</span>
                    <span>{userStats.reputation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posts</span>
                    <span>{userStats.totalPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Threads</span>
                    <span>{userStats.totalThreads}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crypto Prices */}
            {/* <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
              <CardHeader>
                <CardTitle className="text-lg">Live Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bitcoin className="h-4 w-4 mr-2" />
                      <span>BTC</span>
                    </div>
                    <span>${cryptoPrices.BTC}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaEthereum className="h-4 w-4 mr-2" />
                      <span>ETH</span>
                    </div>
                    <span>${cryptoPrices.ETH}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>LTC</span>
                    </div>
                    <span>${cryptoPrices.LTC}</span>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            <PreferredCurrencies preferredCurrencies={currencies} />

            {/* Announcements */}
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
              <CardHeader>
                <CardTitle className="text-lg">Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.length > 0 ? (
                    announcements.map(announcement => (
                      <div key={announcement._id} className="border-b last:border-0 pb-2 last:pb-0">
                        <a
                          href={announcement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-500 hover:text-yellow-600 transition-colors"
                        >
                          {announcement.title}
                        </a>
                        <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-transparent text-white">
                      <p>No announcements found or error fetching announcements.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Staff */}
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
              <CardHeader>
                <CardTitle className="text-lg">Staff Online</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffOnline.length > 0 ? (
                    staffOnline.map(staff => (
                      <div key={staff.userId} className="flex text-white items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${staff.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <span className={`${staff.usernameEffect}`}>{staff.username}</span>{renderTextWithEmojis(staff.statusEmoji, emojis)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-transparent text-white">
                      <p>No staff found or error fetching staff.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}