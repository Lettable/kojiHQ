'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, Clock, Pin, ChevronLeft, Plus, Reply, AlertCircle } from 'lucide-react'
import Header from '@/partials/Header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import PreferredCurrencies from '@/components/PreferedCurrencies'

export default function ForumView() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [forumData, setForumData] = useState(null)
  const [threads, setThreads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const router = useRouter()
  const pathname = usePathname()
  const forumId = pathname.split('/')[2]
  const [currencies, setCurrencies] = useState()

  useEffect(() => {
    const storedCurrencies = localStorage.getItem('preferredCurrencies');
    const initialCurrencies = storedCurrencies ? JSON.parse(storedCurrencies) : ['BTC', 'ETH', 'LTC'];
    setCurrencies(initialCurrencies);
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

    getCurrentUser();
    const storedTheme = localStorage.getItem('theme');
    setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true);
  }, [forumId]);

  useEffect(() => {
    const fetchForumData = async () => {
      if (!forumId) return;

      try {
        const response = await fetch(`/api/forum-action?forumId=${forumId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch forum data');
        }
        const data = await response.json();
        setForumData(data);
      } catch (error) {
        console.error('Error fetching forum data:', error);
        setError('Failed to load forum data');
      }
    }

    fetchForumData();
  }, [forumId]);

  useEffect(() => {
    const fetchThreads = async () => {
      if (!forumId) return;

      try {
        const response = await fetch(`/api/thread-action?forumId=${forumId}&page=${currentPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch threads');
        }
        const data = await response.json();
        setThreads(data.threads);
        setTotalPages(data.pagination.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching threads:', error);
        setError('Failed to load threads');
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [forumId, currentPage]);

  const handleCreateThread = () => {
    router.push(`/create-thread/${forumId}`);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header
          avatar={currentUser?.profilePic}
          userId={currentUser?.userId}
          currentPage="/forum"
          isDarkTheme={isDarkTheme}
          toggleTheme={toggleTheme}
          isLoggedIn={isLoggedIn}
        />

        {/* Hero Section Skeleton */}
        <section className="py-16 bg-zinc-900/50 border-b border-zinc-800/50">
          <div className="container px-4 max-w-[65%] mx-auto relative">
            <div className="h-8 w-32 bg-zinc-800/50 rounded-lg mb-6 animate-pulse"></div>
            
            <Card className="bg-zinc-900/50 border-0 shadow-xl rounded-xl overflow-hidden backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-8 space-y-3">
                  <div className="h-10 w-2/3 bg-zinc-800/50 rounded-lg animate-pulse"></div>
                  <div className="h-6 w-1/2 bg-zinc-800/50 rounded-lg animate-pulse"></div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((_, index) => (
                    <div 
                      key={index}
                      className="flex items-center px-4 py-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 animate-pulse"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="w-5 h-5 bg-zinc-700 rounded mr-3"></div>
                      <div>
                        <div className="h-5 w-20 bg-zinc-700 rounded mb-1"></div>
                        <div className="h-4 w-16 bg-zinc-700 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content Skeleton */}
        <main className="container px-4 py-12 max-w-[75%]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Left side - Threads */}
            <div className="lg:col-span-3">
              <div className="mb-8 flex items-center justify-between">
                <div className="h-10 w-32 bg-zinc-800/50 rounded-xl animate-pulse"></div>
              </div>

              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-zinc-900/50 border-0 shadow-lg backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-zinc-800/50 rounded-full animate-pulse"></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-zinc-800/50 rounded-full border-2 border-zinc-900 animate-pulse"></div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-24 bg-zinc-800/50 rounded animate-pulse"></div>
                              <div className="h-6 w-48 bg-zinc-800/50 rounded animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="h-4 w-32 bg-zinc-800/50 rounded animate-pulse"></div>
                              <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                              <div className="h-4 w-24 bg-zinc-800/50 rounded animate-pulse"></div>
                              <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                              <div className="h-4 w-20 bg-zinc-800/50 rounded animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right side - Sidebar */}
            <div className="space-y-8">
              {/* Currency Preferences Skeleton */}
              <Card className="bg-zinc-900/50 border-0 shadow-xl rounded-xl backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-6 w-40 bg-zinc-800/50 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((_, index) => (
                      <div 
                        key={index}
                        className="h-8 bg-zinc-800/50 rounded-lg animate-pulse"
                        style={{ animationDelay: `${index * 150}ms` }}
                      ></div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Guidelines Skeleton */}
              <Card className="bg-zinc-900/50 border-0 shadow-xl rounded-xl backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-6 w-32 bg-zinc-800/50 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((_, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="w-2 h-2 bg-zinc-800/50 rounded-full animate-pulse"></div>
                        <div className="h-4 flex-1 bg-zinc-800/50 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
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
        isPremium={currentUser?.isPremium}
      />

      {/* Hero Section */}
      <section className={`py-16 ${isDarkTheme ? 'bg-zinc-900/50 border-b border-zinc-800/50' : 'bg-gray-100'}`}>
        <div className="container px-4 max-w-[65%] mx-auto relative">
          <div className="absolute -top-10 left-4 w-12 h-12 bg-yellow-500 rounded-full opacity-20 blur-lg"></div>
          <div className="absolute -top-12 right-10 w-8 h-8 bg-pink-500 rounded-full opacity-20 blur-md"></div>
          <div className="absolute bottom-8 left-8 w-10 h-10 bg-red-500 rounded-full opacity-20 blur-md"></div>
          <div className="absolute bottom-6 right-10 w-14 h-14 bg-orange-500 rounded-full opacity-10 blur-lg"></div>

          <Link
            href="/"
            className="inline-flex items-center text-sm text-yellow-500 transition-colors hover:text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-lg mb-6"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Forums
          </Link>

          <Card className={`${isDarkTheme ? 'bg-zinc-900/50 hover:bg-zinc-900/70' : 'bg-white'} 
            text-white border-0 transition-all duration-200 shadow-xl rounded-xl overflow-hidden backdrop-blur-sm`}>
            <CardContent className="p-8">
              <div className="mb-8">
                <h1 className="mb-3 text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  {forumData.name}
                </h1>
                <p className="text-xl text-zinc-400">{forumData.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center px-4 py-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:bg-zinc-800/70 transition-all duration-200">
                  <MessageSquare className="mr-3 h-5 w-5 text-yellow-500" />
                  <div>
                    <span className="text-white text-lg font-medium">{forumData.totalThreads}</span>
                    <span className="text-zinc-400 ml-2">threads</span>
                  </div>
                </div>

                <div className="flex items-center px-4 py-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:bg-zinc-800/70 transition-all duration-200">
                  <Reply className="mr-3 h-5 w-5 text-yellow-500" />
                  <div>
                    <span className="text-white text-lg font-medium">{forumData.totalPosts}</span>
                    <span className="text-zinc-400 ml-2">posts</span>
                  </div>
                </div>

                <div className="flex items-center px-4 py-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:bg-zinc-800/70 transition-all duration-200">
                  <Clock className="mr-3 h-5 w-5 text-yellow-500" />
                  <div>
                    <span className="text-white text-lg font-medium">Last active</span>
                    <span className="text-zinc-400 ml-2">{forumData.lastActive}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-[65%]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left side - Threads */}
          <div className="lg:col-span-3">
            <div className="mb-8 flex items-center justify-between">
              <Button
                onClick={handleCreateThread}
                className="bg-yellow-500 text-black hover:bg-yellow-600 transition-colors px-6 py-2.5 rounded-xl font-medium"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Thread
              </Button>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {threads.map((thread) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`border-0 ${isDarkTheme ? 'bg-zinc-900/50 hover:bg-zinc-800/50' : 'bg-white hover:bg-gray-50'} 
                      transition-all duration-200 shadow-lg backdrop-blur-sm`}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12 shrink-0 ring-2 ring-zinc-800/50">
                            <AvatarImage src={thread.profilePic} />
                            <AvatarFallback>{thread.creator[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {thread.isPinned && (
                                <Badge variant="destructive" className="h-6 gap-1.5 px-2.5 bg-red-500/10 text-red-500 border-red-500/20 rounded-lg">
                                  <Pin className="h-3.5 w-3.5" />
                                  Pinned
                                </Badge>
                              )}
                              <Link
                                href={`/thread/${thread.id}`}
                                className="text-xl font-semibold text-white hover:text-yellow-500 transition-colors line-clamp-1"
                              >
                                {thread.title}
                              </Link>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                              <span className="flex items-center gap-1.5">
                                by <span className={`${thread.usernameEffect} font-medium`}>{thread.creator}</span>
                              </span>
                              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                              <span>{formatDate(thread.createdAt)}</span>
                              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                              <span className="flex items-center">
                                <MessageSquare className="mr-1.5 h-4 w-4 text-zinc-500" />
                                {thread.replies} replies
                              </span>
                              <span className="flex items-center">
                                <Users className="mr-1.5 h-4 w-4 text-zinc-500" />
                                {thread.views} views
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {threads.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-8 bg-zinc-900/50 rounded-xl border border-zinc-800/50 backdrop-blur-sm"
                >
                  <MessageSquare className="w-16 h-16 text-yellow-500/50 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Threads Found</h3>
                  <p className="text-zinc-400 text-center mb-6">Be the first one to start a thread!</p>
                </motion.div>
              )}
            </div>

            {/* Pagination */}
            {threads.length > 0 && (
              <div className="mt-8 flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl ${isDarkTheme ? 
                    'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 text-white' : 
                    'bg-white border-gray-200'}`}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl ${isDarkTheme ? 
                    'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 text-white' : 
                    'bg-white border-gray-200'}`}
                >
                  Next
                  <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
            )}
          </div>

          {/* Right side - Sidebar */}
          <div className="space-y-8">
            <PreferredCurrencies preferredCurrencies={currencies} />

            <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} border-0 text-white 
              shadow-xl sticky top-4 rounded-xl backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Forum Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-none space-y-4 text-sm">
                  <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Be respectful to other members
                  </li>
                  <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    No spamming or excessive self-promotion
                  </li>
                  <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Stay on topic within each thread
                  </li>
                  <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Report any suspicious activity
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

