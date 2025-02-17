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
import { FaTelegram } from 'react-icons/fa'
import Header from '@/partials/Header'
import Shoutbox from '@/components/ShoutBox'
import { FaEthereum } from 'react-icons/fa'
import { jwtDecode } from 'jwt-decode'
import PreferredCurrencies from '@/components/PreferedCurrencies'
import CryptoSelectionDialog from '@/components/CurrencyDialog'
import { ForumSection } from '@/components/ForumSection'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import ActivityFeed from '@/components/ActivityFeed'

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
  const [userStats, setUserStats] = useState({ reputation: 0, totalPosts: 0, totalThreads: 0, credits: 0 })
  const [error, setError] = useState(null);
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const storedCurrencies = localStorage.getItem('preferredCurrencies');
    const initialCurrencies = storedCurrencies ? JSON.parse(storedCurrencies) : ['BTC', 'ETH', 'LTC'];
    setCurrencies(initialCurrencies);
  }, []);


  const fetchEmojis = async () => {
    try {
      const response = await fetch('/api/emojis')
      const data = await response.json()
      setEmojis(data)
    } catch (error) {
      console.error('Error fetching emojis:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        if (!userId) throw new Error('User ID not found in token.');

        setCurrentUser(decodedToken);
        setIsLoggedIn(true);

        fetchNewToken(userId, token)
          .then((newToken) => {
            const newDecoded = jwtDecode(newToken);

            setCurrentUser(newDecoded);
            localStorage.setItem('accessToken', newToken);

            fetchEmojis();
          })
          .catch((error) => {
            console.error('Error fetching new token:', error.message);
            setCurrentUser(null);
            setIsLoggedIn(false);
          });

        fetchUserStats(userId);
      } catch (error) {
        console.error('Error decoding token:', error.message);
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
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

  // async function fetchNewToken(userId) {
  //   try {
  //     const response = await fetch('/api/generate-token', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ userId }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Failed to fetch new token.');
  //     }

  //     const { token } = await response.json();
  //     return token;
  //   } catch (error) {
  //     console.error('Error updating token:', error.message);
  //     throw error;
  //   }
  // }
  async function fetchNewToken(userId, token) {
    try {
      const response = await fetch('/api/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          if (data.message?.includes('banned') || data.message?.includes('suspended')) {
            localStorage.removeItem('accessToken');
            router.push('/auth');
          }
        }
        throw new Error(data.error || 'Failed to fetch new token.');
      }

      const { token: newToken } = data;
      return newToken;
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

  const renderTextWithEmojis = (text, emojis) => {
    if (!text || typeof text !== 'string') return text || ''
    if (!emojis || !Array.isArray(emojis)) return text

    const emojiRegex = /:([\w-]+):/g
    const parts = text.split(emojiRegex)

    return parts.map((part, index) => {
      if (index % 2 === 0) {
        return part
      } else {
        const emoji = emojis.find(e => e.emojiTitle === `:${part}:`)
        if (emoji) {
          return (
            <img
              key={index}
              src={emoji.emojiUrl}
              alt={emoji.emojiTitle}
              title={emoji.emojiTitle}
              className="inline-block w-6 h-6"
            />
          )
        } else {
          return `:${part}:`
        }
      }
    })
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
      {/* <section className={`relative py-16 overflow-hidden ${isDarkTheme ? 'bg-zinc-900/10 text-white border-zinc-300' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 relative text-center">

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center relative">
            🎉 Welcome to Koji HQ 🎆
          </h1>

          <p className="text-lg md:text-xl text-zinc-400">
            Your <b>hub for knowledge, cracking, and discussions.</b>
            🔥 Start the new year with exciting conversations!
          </p>

          <div className="absolute -top-10 left-4 w-12 h-12 bg-yellow-500 rounded-full opacity-20 blur-lg"></div>
          <div className="absolute -top-12 right-10 w-8 h-8 bg-pink-500 rounded-full opacity-20 blur-md"></div>
          <div className="absolute bottom-8 left-8 w-10 h-10 bg-red-500 rounded-full opacity-20 blur-md"></div>
          <div className="absolute bottom-6 right-10 w-14 h-14 bg-orange-500 rounded-full opacity-10 blur-lg"></div>


          <div className="absolute left-2 top-10 w-6 h-6 bg-yellow-400 rounded-full opacity-20 blur-md"></div>
          <div className="absolute right-2 top-20 w-8 h-8 bg-pink-400 rounded-full opacity-15 blur-md"></div>
          <div className="absolute left-4 bottom-12 w-10 h-10 bg-red-400 rounded-full opacity-10 blur-md"></div>
          <div className="absolute right-4 bottom-6 w-12 h-12 bg-orange-400 rounded-full opacity-10 blur-lg"></div>

        </div>


      </section> */}
      {/* <section className="relative bg-black mb-2 overflow-hidden font-orbitron">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070"
            alt="Cyberpunk city"
            fill
            className="object-cover opacity-20"
            priority
          />
          <Image
            src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2070"
            alt="Tech overlay"
            fill
            className="object-cover opacity-10 mix-blend-screen"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-8">
          <div className="flex justify-center gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-[60px] w-[300px] bg-zinc-900/80 rounded-md border border-yellow-500/20 overflow-hidden group"
            >
              <Image
                src="https://imgur.com/7qVS4nc.gif"
                alt="RD2D.CC"
                width={300}
                height={60}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-[60px] w-[300px] bg-zinc-900/80 rounded-md border border-yellow-500/20 overflow-hidden group"
            >
              <Image
                src="https://s13.gifyu.com/images/b2KLi.gif"
                alt="Gaming Ad"
                width={300}
                height={60}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-8"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-2 tracking-wider"

              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 5,
                ease: "linear",
              }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700">
                Suized
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600"></span>
            </motion.h1>
            <motion.div
              className="text-yellow-500 text-lg md:text-xl font-light tracking-[0.2em] uppercase"
            >
              Seized by Knowledge
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto mb-8 overflow-hidden"
          >
            <div className="py-2 px-4 bg-zinc-900/80 border-l-4 border-yellow-500 rounded backdrop-blur-sm">
              <div className="animate-marquee whitespace-nowrap text-yellow-300 font-light tracking-wider text-sm">
                <span className="text-yellow-500 font-medium mr-2">LATEST:</span>
                Exciting updates ahead! We&apos;re rolling out new features, optimizing performance, and adding the final touches to launch a revolutionary forum. Stay tuned for something big!
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="max-w-4xl mx-auto mt-8 h-[90px] mb-2  bg-zinc-900/80 rounded-md border border-yellow-500/20 overflow-hidden group"
          >
            <Image
              src="https://i.imgur.com/UwZXDoG.gif"
              alt="Bottom Ad"
              width={100}
              height={90}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
            />
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0),rgba(0,0,0,0.7))]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        </div>
      </section> */}
      <section className="relative bg-black mb-2 overflow-hidden font-orbitron">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070"
            alt="Cyberpunk city"
            fill
            className="object-cover opacity-70"
            priority
          />
          <Image
            src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2070"
            alt="Tech overlay"
            fill
            className="object-cover opacity-50 mix-blend-screen"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-8">
          {/* Top Ad Banner */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-[60px] w-[300px] bg-zinc-900/80 rounded-md border border-yellow-500/20 overflow-hidden group"
            >
              <Image
                src="https://imgur.com/7qVS4nc.gif"
                alt="RD2D.CC"
                width={300}
                height={60}
                className="w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-[60px] w-[300px] bg-zinc-900/80 rounded-md border border-yellow-500/20 overflow-hidden group"
            >
              <Image
                src="https://s13.gifyu.com/images/b2KLi.gif"
                alt="Gaming Ad"
                width={300}
                height={60}
                className="w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          </div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-8 select-none"
          >
            <motion.div
              className="relative inline-block cursor-pointer"
              whileHover={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              onClick={() => (window.location.href = "/")}
            >
              {/* Overlay for Hover Effect */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-yellow-500 text-lg md:text-xl font-light tracking-[0.2em] uppercase opacity-0 hover:opacity-100 transition-opacity duration-300"
              >
                Seized, but Never Silenced
              </motion.div>

              {/* Logo Image */}
              <Image
                src="https://i.postimg.cc/hjs7pc6G/suizedto-OG-hero-Logo.png"
                alt="Suized Logo"
                width={400}
                height={100}
                className="drop-shadow-[0_0_25px_rgba(234,179,8,0.3)] pointer-events-none"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
              />
            </motion.div>
          </motion.div>

          {/* Status Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto mb-8 overflow-hidden"
          >
            <div className="py-2 px-4 bg-zinc-900/80 border-l-4 border-yellow-500 rounded backdrop-blur-sm">
              <div className="animate-marquee whitespace-nowrap text-yellow-300 font-light tracking-wider text-sm">
                <span className="text-yellow-500 font-medium mr-2">LATEST:</span>
                Exciting updates ahead! We&apos;re rolling out new features, optimizing performance, and adding the final touches to launch a revolutionary forum. Stay tuned for something big!
              </div>
            </div>
          </motion.div>

          {/* Bottom Ad Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="max-w-4xl mx-auto mt-8 h-[90px] mb-2 bg-zinc-900/80 rounded-md border border-yellow-500/20 overflow-hidden group"
          >
            <Image
              src="https://i.imgur.com/UwZXDoG.gif"
              alt="Bottom Ad"
              width={100}
              height={90}
              className="w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity"
            />
          </motion.div>
        </div>

        {/* Animated Overlay */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0),rgba(0,0,0,0.7))]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        </div>
      </section>

      <Separator className={`${isDarkTheme ? 'bg-white/10' : 'bg-zinc-300'}`} />

      {/* <section className="relative py-12 overflow-hidden bg-black text-white">
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-mono mb-6"
          >
            <p className="text-sm mb-2">$ ./access_koji</p>
            <h1 className="text-4xl md:text-6xl font-bold">KOJI HQ</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-white mb-8 font-mono"
          >
            &gt; Where Code Meets Liberation
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="font-mono text-sm"
          >
            <p className="mb-1">&gt; initializing_kernel_exploit</p>
            <p className="mb-1">&gt; bypassing_security_protocols</p>
            <p>&gt; access_granted<span className="animate-pulse">_</span></p>
          </motion.div>
        </div>
      </div>
      
    </section> */}






      <div className="container text-white mx-auto px-4 py-8">
        <div className="flex flex-col text-white lg:flex-row gap-8">
          <div className="lg:w-3/4 text-white space-y-8">
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
              <CardHeader className="pt-5 pl-10 pr-10 pb-5">
                <CardTitle className="text-xl">Shoutbox</CardTitle>
              </CardHeader>
              <CardContent className="h-[480px] p-1">
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
                  <div className="flex justify-between">
                    <span>Credits</span>
                    <span>{userStats.credits.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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

            <ActivityFeed />

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
                          <span className={`${staff.usernameEffect}`}>{staff.username} </span>{renderTextWithEmojis(staff.statusEmoji, emojis)}
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
      <footer className="bg-zinc-900/50 border-t border-zinc-800/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Social Links */}
            <div className="flex space-x-6">
              <a
                href="https://telegram.dog/suizedto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-yellow-500 transition-colors"
              >
                <FaTelegram className="w-6 h-6" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-zinc-500 text-sm text-center">
              © Suized - {new Date().getFullYear()} | All Rights Reserved.
              <br />
              <span className="text-zinc-600">Made with ❤️ for the community.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}