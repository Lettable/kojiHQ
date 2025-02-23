'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import LoadingIndicator from './LoadingIndicator'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'

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
            className="inline-block w-4 h-4"
            style={{
              height: "12px",
              width: "12px",
            }}
            title={emoji.emojiTitle}
          />
        )
      } else {
        return `:${part}:`
      }
    }
  })
}

export function ForumSection({ isDarkTheme }) {
  const [forumData, setForumData] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [error, setError] = useState(null)
  const [activeUsers, setActiveUsers] = useState([])
  const [emojis, setEmojis] = useState([])
  const [activeUserCount, setActiveUserCount] = useState(0)
  const router = useRouter()

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch("/api/mics/users");
      if (!response.ok) throw new Error("Failed to fetch active users");
      const users = await response.json();

      const shuffledUsers = shuffleArray(users);

      setActiveUsers(shuffledUsers);
    } catch (error) {
      console.error("Error fetching active users:", error);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchEmojis = async () => {
    try {
      const response = await fetch('/api/emojis')
      const data = await response.json()
      setEmojis(data)
    } catch (error) {
      console.error('Error fetching emojis:', error)
    }
  }

  const fetchActiveUserCount = async () => {
    try {
      const response = await fetch("/api/mics/active");
      if (!response.ok) throw new Error("Failed to fetch active user count");
      const data = await response.json();
      setActiveUserCount(data.activeUsersCount);
    } catch (error) {
      console.error("Error fetching active user count:", error);
    }
  };

  const fetchForumData = async () => {
    try {
      const response = await fetch('/api/home-forum');
      const data = await response.json();
      console.log('Data direct from API', data)
      setForumData(data);
      if (data.length > 0) {
        setActiveCategory(data[0]._id);
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching forum data:', err);
    }
  };

  useEffect(() => {
    fetchEmojis();
    fetchForumData();
    fetchActiveUsers();
    fetchActiveUserCount();
  }, []);


  if (error) {
    return (
      <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-500">
        Error: {error}
      </div>
    )
  }

  if (forumData.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-zinc-900/30 rounded-xl backdrop-blur-sm">
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <div className="bg-zinc-900/50 rounded-xl backdrop-blur-sm border border-zinc-800/50">
          <ScrollArea className="w-full">
            <div className="flex p-1">
              <TabsList className="h-14 bg-transparent justify-start gap-2 p-2">
                {forumData.map((category) => (
                  <TabsTrigger
                    key={category._id}
                    value={category._id}
                    className="relative px-6 py-2.5 rounded-lg text-zinc-400 transition-all duration-200
                      data-[state=active]:bg-yellow-500/10
                      data-[state=active]:text-yellow-500
                      hover:text-yellow-500/80
                      hover:bg-zinc-800/50"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </ScrollArea>
        </div>

        <AnimatePresence mode="wait">
          {forumData.map((category) => (
            <TabsContent
              key={category._id}
              value={category._id}
              className="mt-6 space-y-6"
            >
              {category.subcategories.map((subcategory) => (
                <motion.div
                  key={subcategory._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-zinc-900/50 border border-zinc-800/50 shadow-lg backdrop-blur-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-zinc-800/50 bg-zinc-900/50 py-4">
                      <CardTitle className="text-xl text-white">{subcategory.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {subcategory.forums.map((forum) => (
                          <a
                            href={`/forum/${forum._id}`}
                            key={forum._id}
                            className="block group"
                          >
                            <div className="flex items-center justify-between p-4 rounded-xl
                              bg-zinc-800/30 hover:bg-zinc-800/50 
                              transition-all duration-200 backdrop-blur-sm
                              border border-zinc-700/30 hover:border-yellow-500/20
                              hover:shadow-lg hover:shadow-yellow-500/5"
                            >
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white group-hover:text-yellow-500 transition-colors">
                                  {forum.name}
                                </h3>
                                <p className="text-sm text-zinc-400 truncate mt-1">
                                  {forum.description}
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0 text-right">
                                <p className="text-sm text-zinc-400">
                                  Last post by{' '}
                                  <span className={`${forum.latestPost?.usernameEffect || ''} text-white`}>
                                    {forum.latestPost?.user}
                                  </span>
                                </p>
                                <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-500 mt-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {forum.latestPost?.time}
                                </div>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          ))}
        </AnimatePresence>

        <div className="mt-6">
          <Card className="bg-zinc-900/50 border border-zinc-800/50 shadow-lg backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="bg-yellow-500/10 px-4 py-3 border-b border-yellow-500/20">
              <h2 className="text-yellow-500 font-medium">Member Activity</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-zinc-400 mb-4">
                {activeUserCount} USERS ACTIVE TODAY OUT OF {activeUsers.length} MEMBERS
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeUsers.map((user, index) => (
                  <span key={user.username}>
                    <span
                      onClick={() => router.push(`/user/${user.username}`)}
                      className={`text-zinc-300 text-xs ${user.usernameEffect} 
                        hover:underline cursor-pointer hover:text-yellow-500 transition-colors`}
                    >
                      {user.username}
                    </span>
                    {user.statusEmoji && (
                      <span className="ml-1">
                        {renderTextWithEmojis(user.statusEmoji, emojis)}
                      </span>
                    )}
                    {index < activeUsers.length - 1 && (
                      <span className="text-zinc-500 text-xs mx-1">•</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}