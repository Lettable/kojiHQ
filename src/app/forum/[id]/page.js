'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Users, Clock, Pin, ChevronLeft, Bitcoin, DollarSign, Plus } from 'lucide-react'
import Header from '@/partials/Header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { FaEthereum } from 'react-icons/fa'

export default function ForumView() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [sortBy, setSortBy] = useState('latest')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [forumData, setForumData] = useState(null)
  const [threads, setThreads] = useState([])
  const [cryptoPrices, setCryptoPrices] = useState({
    BTC: "0",
    ETH: "0",
    LTC: "0"
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const router = useRouter()
  const pathname = usePathname()
  const forumId = pathname.split('/')

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const [btcResponse, ethResponse, ltcResponse] = await Promise.all([
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=LTCUSDT')
        ]);

        const btcData = await btcResponse.json();
        const ethData = await ethResponse.json();
        const ltcData = await ltcResponse.json();

        setCryptoPrices({
          BTC: Number(btcData.price).toLocaleString(undefined, { maximumFractionDigits: 2 }),
          ETH: Number(ethData.price).toLocaleString(undefined, { maximumFractionDigits: 2 }),
          LTC: Number(ltcData.price).toLocaleString(undefined, { maximumFractionDigits: 2 })
        });
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getCurrentUser = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        setCurrentUser(decodedToken);
        setIsLoggedIn(true);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    }

    getCurrentUser()
    const storedTheme = localStorage.getItem('theme')
    setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true)

    if (forumId) {
      fetchForumData()
      fetchThreads()
    } else {
      setError('No forum ID provided')
      setIsLoading(false)
    }
  }, [forumId])

  const fetchForumData = async () => {
    try {
      const response = await fetch(`/api/forum-action?forumId=${forumId}`, {
        headers: {
          'x-auth-token': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch forum data')
      }
      const data = await response.json()
      setForumData(data)
    } catch (error) {
      console.error('Error fetching forum data:', error)
      setError('Failed to load forum data')
    }
  }

  const fetchThreads = async () => {
    try {
      const response = await fetch(`/api/thread-action?forumId=${forumId}&page=${currentPage}`, {
        headers: {
          'x-auth-token': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch threads')
      }
      const data = await response.json()
      setThreads(data.threads)
      setTotalPages(data.pagination.totalPages)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching threads:', error)
      setError('Failed to load threads')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (forumId) {
      fetchThreads()
    }
  }, [currentPage, sortBy, forumId])

  const handleCreateThread = () => {
    router.push(`/create-thread?forumId=${forumId}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center bg-black items-center h-screen">
        <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
        <Button className="bg-zinc-800/50 text-white hover:bg-zinc-900/50" onClick={() => router.push('/')}>Go to Home</Button>
      </div>
    )
  }

  if (!forumData) {
    return (
      <div className="flex flex-col justify-center bg-black items-center h-screen">
        <h1 className="text-2xl font-bold text-white mb-4">Forum not found</h1>
        <Button className="bg-zinc-800/50 text-white hover:bg-zinc-900/50" onClick={() => router.push('/')}>Go to Home</Button>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Header
        avatar={currentUser?.profilePic}
        userId={currentUser?.userId}
        currentPage='/forum'
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
      />

      {/* Hero Section */}
      <section className={`py-16 text-white ${isDarkTheme ? 'bg-zinc-900/50' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center text-yellow-500 hover:text-yellow-600 mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Forums
            </Link>
            <h1 className="text-4xl text-white font-bold mb-4">{forumData.name}</h1>
            <p className={`text-xl mb-6 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{forumData.description}</p>
            <div className="flex items-center text-white space-x-6 text-sm">
              <span><MessageSquare className="inline-block text-white mr-1 h-4 w-4" /> {forumData.totalThreads} threads</span>
              <span><Users className="inline-block text-white mr-1 h-4 w-4" /> {forumData.totalPosts} posts</span>
              <span><Clock className="inline-block text-white mr-1 h-4 w-4" /> Last active {forumData.lastActive}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Threads */}
          <div className="lg:w-3/4">
            {/* Actions and Sorting */}
            <div className="flex justify-between items-center mb-6">
              <Button onClick={handleCreateThread} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="w-4 h-4 mr-2" /> New Thread
              </Button>
              {/* <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-zinc-800/50 border-0 w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-0 hover:bg-zinc-800">
                  <SelectItem className="text-white border-0" value="latest">Latest</SelectItem>
                  <SelectItem className="text-white border-0" value="mostReplies">Most Replies</SelectItem>
                  <SelectItem className="text-white border-0" value="mostViews">Most Views</SelectItem>
                </SelectContent>
              </Select> */}
            </div>

            {/* Threads List */}
            <div className="space-y-4">
              {threads.length === 0 && <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className='flex items-center text-white justify-center text-xl mt-50 pt-30'>No Threads yet!</p>
                </motion.div>
              </AnimatePresence>}
              <AnimatePresence>
                {threads.length > 0 && threads.map((thread) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`${isDarkTheme ? 'bg-zinc-800/50 text-white hover:bg-zinc-700/50' : 'bg-white border-0 hover:bg-gray-50'} text-white transition-colors border border-0 `}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              {thread.isPinned && (
                                <Badge variant="destructive" className="mr-2">
                                  <Pin className="w-3 h-3 mr-1" />
                                  Pinned
                                </Badge>
                              )}
                              <Link href={`/thread/${thread.id}`} className="text-xl font-semibold text-white transition-colors">
                                {thread.title}
                              </Link>
                            </div>
                            <div className="flex items-center mt-2 space-x-4 text-sm">
                              <span className={isDarkTheme ? 'text-gray-400' : 'text-gray-500'}>
                                by {thread.creator} • {formatDate(thread.createdAt)}
                              </span>
                              <span><MessageSquare className="inline-block text-gray-400 mr-1 h-4 w-4" /> {thread.replies} replies</span>
                              <span><Users className="inline-block text-gray-400 mr-1 h-4 w-4" /> {thread.views} views</span>
                            </div>
                          </div>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={thread.profilePic} />
                            <AvatarFallback>{thread.creator[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {threads.length > 0 && (
              <div className="mt-8 flex justify-center">
              <Button
                className="mr-2 bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || threads.length === 0 }
              >
                Next
              </Button>
            </div>
            )}
          </div>

          {/* Right side - Sidebar */}
          <div className="lg:w-1/4 text-white space-y-6">
            {/* Crypto Prices */}
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
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
            </Card>

            {/* Forum Rules */}
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} border-0 text-white shadow-lg`}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Forum Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc text-white list-inside space-y-2 text-sm">
                  <li>Be respectful to other members</li>
                  <li>No spamming or excessive self-promotion</li>
                  <li>Stay on topic within each thread</li>
                  <li>Do not share personal information</li>
                  <li>Report any suspicious activity to moderators</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}