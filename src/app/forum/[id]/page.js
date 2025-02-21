// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { MessageSquare, Users, Clock, Pin, ChevronLeft, Bitcoin, DollarSign, Plus } from 'lucide-react'
// import Header from '@/partials/Header'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { usePathname } from 'next/navigation'
// import { jwtDecode } from 'jwt-decode'
// import { FaEthereum } from 'react-icons/fa'
// import PreferredCurrencies from '@/components/PreferedCurrencies'

// export default function ForumView() {
//   const [currentUser, setCurrentUser] = useState(null)
//   const [isDarkTheme, setIsDarkTheme] = useState(true)
//   const [sortBy, setSortBy] = useState('latest')
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [forumData, setForumData] = useState(null)
//   const [threads, setThreads] = useState([])
//   const [cryptoPrices, setCryptoPrices] = useState({
//     BTC: "0",
//     ETH: "0",
//     LTC: "0"
//   })
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const router = useRouter()
//   const pathname = usePathname()
//   const forumId = pathname.split('/')[2]
//   const [currencies, setCurrencies] = useState()

//   useEffect(() => {
//     const storedCurrencies = localStorage.getItem('preferredCurrencies');
//     const initialCurrencies = storedCurrencies ? JSON.parse(storedCurrencies) : ['BTC', 'ETH', 'LTC'];
//     setCurrencies(initialCurrencies);
//   }, []);

//   useEffect(() => {
//     const getCurrentUser = () => {
//       const token = localStorage.getItem('accessToken');
//       if (token) {
//         const decodedToken = jwtDecode(token);
//         setCurrentUser(decodedToken);
//         setIsLoggedIn(true);
//       } else {
//         setCurrentUser(null);
//         setIsLoggedIn(false);
//       }
//     }

//     getCurrentUser();
//     const storedTheme = localStorage.getItem('theme');
//     setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true);
//   }, [forumId]);

//   useEffect(() => {
//     const fetchForumData = async () => {
//       if (!forumId) return;

//       try {
//         const response = await fetch(`/api/forum-action?forumId=${forumId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch forum data');
//         }
//         const data = await response.json();
//         setForumData(data);
//       } catch (error) {
//         console.error('Error fetching forum data:', error);
//         setError('Failed to load forum data');
//       }
//     }

//     fetchForumData();
//   }, [forumId]);

//   useEffect(() => {
//     const fetchThreads = async () => {
//       if (!forumId) return;

//       try {
//         const response = await fetch(`/api/thread-action?forumId=${forumId}&page=${currentPage}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch threads');
//         }
//         const data = await response.json();
//         setThreads(data.threads);
//         setTotalPages(data.pagination.totalPages);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching threads:', error);
//         setError('Failed to load threads');
//         setIsLoading(false);
//       }
//     };

//     fetchThreads();
//   }, [forumId, currentPage]); 

//   const handleCreateThread = () => {
//     router.push(`/create-thread/${forumId}`);
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//   }

//   const toggleTheme = () => {
//     const newTheme = !isDarkTheme;
//     setIsDarkTheme(newTheme);
//     localStorage.setItem('theme', newTheme ? 'dark' : 'light');
//   }

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-screen bg-black text-white">Loading...</div>
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center bg-black items-center h-screen">
//         <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
//         <Button className="bg-zinc-800/50 text-white hover:bg-zinc-900/50" onClick={() => router.push('/')}>Go to Home</Button>
//       </div>
//     )
//   }

//   if (!forumData) {
//     return (
//       <div className="flex flex-col justify-center bg-black items-center h-screen">
//         <h1 className="text-2xl font-bold text-white mb-4">Forum not found</h1>
//         <Button className="bg-zinc-800/50 text-white hover:bg-zinc-900/50" onClick={() => router.push('/')}>Go to Home</Button>
//       </div>
//     )
//   }

//   return (
//     <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
//       <Header
//         avatar={currentUser?.profilePic}
//         userId={currentUser?.userId}
//         currentPage='/forum'
//         isDarkTheme={isDarkTheme}
//         toggleTheme={toggleTheme}
//         isLoggedIn={isLoggedIn}
//         isPremium={currentUser?.isPremium}
//       />

//       {/* Hero Section */}
//       <section className={`py-16 text-white ${isDarkTheme ? 'bg-zinc-900/50' : 'bg-gray-100'}`}>
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto">
//             <Link href="/" className="inline-flex items-center text-yellow-500 hover:text-yellow-600 mb-4">
//               <ChevronLeft className="w-4 h-4 mr-1" />
//               Back to Forums
//             </Link>
//             <h1 className="text-4xl text-white font-bold mb-4">{forumData.name}</h1>
//             <p className={`text-xl mb-6 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{forumData.description}</p>
//             <div className="flex items-center text-white space-x-6 text-sm">
//               <span><MessageSquare className="inline-block text-white mr-1 h-4 w-4" /> {forumData.totalThreads} threads</span>
//               <span><Users className="inline-block text-white mr-1 h-4 w-4" /> {forumData.totalPosts} posts</span>
//               <span><Clock className="inline-block text-white mr-1 h-4 w-4" /> Last active {forumData.lastActive}</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left side - Threads */}
//           <div className="lg:w-3/4">
//             {/* Actions and Sorting */}
//             <div className="flex justify-between items-center mb-6">
//               <Button onClick={handleCreateThread} className="bg-yellow-500 hover:bg-yellow-600 text-black">
//                 <Plus className="w-4 h-4 mr-2" /> New Thread
//               </Button>
//             </div>

//             {/* Threads List */}
//             <div className="space-y-4">
//               {threads.length === 0 && <AnimatePresence>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                 >
//                   <p className='flex items-center text-white justify-center text-xl mt-50 pt-30'>No Threads yet!</p>
//                 </motion.div>
//               </AnimatePresence>}
//               <AnimatePresence>
//                 {threads.length > 0 && threads.map((thread) => (
//                   <motion.div
//                     key={thread.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <Card className={`${isDarkTheme ? 'bg-zinc-800/50 text-white hover:bg-zinc-700/50' : 'bg-white border-0 hover:bg-gray-50'} text-white transition-colors border border-0 `}>
//                       <CardContent className="p-6">
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <div className="flex items-center mb-2">
//                               {thread.isPinned && (
//                                 <Badge variant="destructive" className="mr-2">
//                                   <Pin className="w-3 h-3 mr-1" />
//                                   Pinned
//                                 </Badge>
//                               )}
//                               <Link href={`/thread/${thread.id}`} className="text-xl font-semibold text-white transition-colors">
//                                 {thread.title}
//                               </Link>
//                             </div>
//                             <div className="flex items-center mt-2 space-x-4 text-sm">
//                               <span className={isDarkTheme ? 'text-gray-400' : 'text-gray-500'}>
//                                 by <span className={`${thread.usernameEffect}`}>{thread.creator}</span> • {formatDate(thread.createdAt)}
//                               </span>
//                               <span><MessageSquare className="inline-block text-gray-400 mr-1 h-4 w-4" /> {thread.replies} replies</span>
//                               <span><Users className="inline-block text-gray-400 mr-1 h-4 w-4" /> {thread.views} views</span>
//                             </div>
//                           </div>
//                           <Avatar className="w-10 h-10">
//                             <AvatarImage src={thread.profilePic} />
//                             <AvatarFallback>{thread.creator[0]}</AvatarFallback>
//                           </Avatar>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>

//             {/* Pagination */}
//             {threads.length > 0 && (
//               <div className="mt-8 flex justify-center">
//               <Button
//                 className="mr-2 bg-yellow-500 hover:bg-yellow-600 text-black"
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </Button>
//               <Button
//                 className="bg-yellow-500 hover:bg-yellow-600 text-black"
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages || threads.length === 0 }
//               >
//                 Next
//               </Button>
//             </div>
//             )}
//           </div>

//           {/* Right side - Sidebar */}
//           <div className="lg:w-1/4 text-white space-y-6">
//             <PreferredCurrencies preferredCurrencies={currencies} />
//             {/* Forum Rules */}
//             <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} border-0 text-white shadow-lg`}>
//               <CardHeader>
//                 <CardTitle className="text-lg text-white">Forum Rules</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="list-disc text-white list-inside space-y-2 text-sm">
//                   <li>Be respectful to other members</li>
//                   <li>No spamming or excessive self-promotion</li>
//                   <li>Stay on topic within each thread</li>
//                   <li>Do not share personal information</li>
//                   <li>Report any suspicious activity to moderators</li>
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Users, Clock, Pin, ChevronLeft, Plus, ArrowUpDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import Header from "@/partials/Header"

export default function ForumView() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [forumData, setForumData] = useState(null)
  const [threads, setThreads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const router = useRouter()
  const pathname = usePathname()
  const forumId = pathname.split("/")[2]

  useEffect(() => {
    const getCurrentUser = () => {
      const token = localStorage.getItem("accessToken")
      if (token) {
        const decodedToken = jwtDecode(token)
        setCurrentUser(decodedToken)
      }
    }

    getCurrentUser()
    const storedTheme = localStorage.getItem("theme")
    setIsDarkTheme(storedTheme ? storedTheme === "dark" : true)
  }, [setCurrentUser])

  useEffect(() => {
    const fetchData = async () => {
      if (!forumId) return

      try {
        const [forumResponse, threadsResponse] = await Promise.all([
          fetch(`/api/forum-action?forumId=${forumId}`),
          fetch(`/api/thread-action?forumId=${forumId}&page=${currentPage}`),
        ])

        if (!forumResponse.ok || !threadsResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const forumData = await forumResponse.json()
        const threadsData = await threadsResponse.json()

        setForumData(forumData)
        setThreads(threadsData.threads)
        setTotalPages(threadsData.pagination.totalPages)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load forum data")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [forumId, currentPage])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
      </div>
    )
  }

  if (error || !forumData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black">
        <h1 className="mb-4 text-2xl font-bold text-white">{error || "Forum not found"}</h1>
        <Button variant="outline" onClick={() => router.push("/")}>
          Return Home
        </Button>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkTheme ? "bg-black text-white" : "bg-white text-black"}`}>
       <Header
         avatar={currentUser?.profilePic}
         userId={currentUser?.userId}
         currentPage='/forum'
         isDarkTheme={isDarkTheme}
         toggleTheme={toggleTheme}
         isLoggedIn={isLoggedIn}
         isPremium={currentUser?.isPremium}
       />
      <style jsx global>{`
        :root {
          font-size: 85%;
        }
      `}</style>
      {/* Hero Section */}
      <section className={`py-12 text-white ${isDarkTheme ? "bg-zinc-900/50" : "bg-gray-100"}`}>
        <div className="container px-3 max-w-[85%]">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="mb-6 inline-flex items-center text-sm text-yellow-500 transition-colors hover:text-yellow-400"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Forums
            </Link>
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold text-white">{forumData.name}</h1>
              <p className="text-lg text-zinc-400">{forumData.description}</p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-zinc-400">
              <span className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                {forumData.totalThreads} threads
              </span>
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                {forumData.totalPosts} posts
              </span>
              <span className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Last active {forumData.lastActive}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-3 py-6 max-w-[85%]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left side - Threads */}
          <div className="lg:w-[70%]">
            <div className="mb-6 flex items-center justify-between">
              <Button
                onClick={() => router.push(`/create-thread/${forumId}`)}
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Thread
              </Button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {threads.map((thread) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-0 bg-zinc-900/50 transition-colors hover:bg-zinc-800/50">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={thread.profilePic} />
                            <AvatarFallback>{thread.creator[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {thread.isPinned && (
                                <Badge variant="destructive" className="h-5 gap-1 px-1.5">
                                  <Pin className="h-3 w-3" />
                                  Pinned
                                </Badge>
                              )}
                              <Link
                                href={`/thread/${thread.id}`}
                                className="truncate text-lg font-medium text-white hover:text-yellow-500"
                              >
                                {thread.title}
                              </Link>
                            </div>
                            <div className="mt-1 flex items-center gap-4 text-sm text-zinc-400">
                              <span>
                                by <span className={thread.usernameEffect}>{thread.creator}</span>
                              </span>
                              <span>•</span>
                              <span>{formatDate(thread.createdAt)}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <MessageSquare className="mr-1 h-3 w-3" />
                                {thread.replies}
                              </span>
                              <span className="flex items-center">
                                <Users className="mr-1 h-3 w-3" />
                                {thread.views}
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
                <div className="flex items-center justify-center py-8 text-zinc-400">No threads yet</div>
              )}
            </div>

            {/* Pagination */}
            {threads.length > 0 && (
              <div className="mt-6 flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Right side - Sidebar */}
          <div className="lg:w-[28%] text-white space-y-5">
            <Card className="border-0 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Forum Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start">• Be respectful to other members</li>
                  <li className="flex items-start">• No spamming or excessive self-promotion</li>
                  <li className="flex items-start">• Stay on topic within each thread</li>
                  <li className="flex items-start">• Do not share personal information</li>
                  <li className="flex items-start">• Report any suspicious activity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

