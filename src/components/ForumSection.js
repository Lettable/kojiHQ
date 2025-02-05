// 'use client'

// import * as React from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"


// export function ForumSection({ forumData, setForumCategories, isDarkTheme }) {
//   const [activeCategory, setActiveCategory] = React.useState(forumData[0]?._id || '')

//   React.useEffect(() => {
//     const fetchForumData = async () => {
//       try {
//         const response = await fetch('/api/home-forum');
//         const data = await response.json();
//         console.log('Data direct from API', data)
//         setForumCategories(data);
//         setActiveCategory(data[0]._id);
//       } catch (error) {
//         setError(err.message)
//         console.error('Error fetching forum data:', error);
//       }
//     };

//     fetchForumData();
//   }, [setForumCategories]);

//   console.log(forumData)
//   return (
//     <div className="space-y-6">
//       <Tabs 
//         defaultValue={activeCategory} 
//         onValueChange={setActiveCategory}
//         className="w-full"
//       >
//         <div className="border-b border-zinc-800">
//           <ScrollArea className="w-full">
//             <div className="flex pb-0.5">
//               <TabsList className="h-14 bg-transparent p-0 justify-start">
//                 {forumData.map((category) => (
//                   <TabsTrigger
//                     key={category._id}
//                     value={category._id}
//                     className="data-[state=active]:bg-transparent data-[state=active]:text-yellow-500 relative px-4 py-2 text-white transition-colors hover:text-yellow-500 data-[state=active]:shadow-none"
//                   >
//                     {category.name}
//                     {/* Active indicator line */}
//                     <motion.div
//                       className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
//                       initial={false}
//                       animate={{
//                         opacity: activeCategory === category._id ? 1 : 0
//                       }}
//                       transition={{ duration: 0.2 }}
//                     />
//                   </TabsTrigger>
//                 ))}
//               </TabsList>
//             </div>
//           </ScrollArea>
//         </div>

//         <AnimatePresence mode="wait">
//           {forumData.length > 0 ? (
//             forumData.map((category) => (
//               <TabsContent 
//                 key={category._id} 
//                 value={category._id}
//                 className="mt-6 space-y-6"
//               >
//                 {category.subcategories.map((subcategory) => (
//                   <motion.div
//                     key={subcategory._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
//                       <CardHeader>
//                         <CardTitle className="text-xl">{subcategory.name}</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="space-y-2">
//                           {subcategory.forums.map((forum) => (
//                             <a
//                               href={`/forum/${forum._id}`}
//                               key={forum._id}
//                               className={`flex items-center text-white justify-between p-4 rounded-lg bg-zinc-800/10 ${
//                                 isDarkTheme ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50'
//                               } transition-colors cursor-pointer`}
//                             >
//                               <div className="flex-1">
//                                 <h3 className="font-semibold">{forum.name}</h3>
//                                 <p className={`text-sm ${
//                                   isDarkTheme ? 'text-gray-400' : 'text-gray-600'
//                                 }`}>
//                                   {forum.description}
//                                 </p>
//                               </div>
//                               <div className={`text-sm ${
//                                 isDarkTheme ? 'text-gray-400' : 'text-gray-600'
//                               }`}>
//                                 <p>
//                                   Last post by{' '}
//                                   <span className={`${forum.latestPost?.usernameEffect || ''}`}>
//                                     {forum.latestPost?.user}
//                                   </span>
//                                 </p>
//                                 <p className="text-right">{forum.latestPost?.time}</p>
//                               </div>
//                             </a>
//                           ))}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </TabsContent>
//             ))
//           ) : (
//             <div>
//               <span className="text-center text-white">No Forum found.</span>
//             </div>
//           )}
//         </AnimatePresence>
//       </Tabs>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import LoadingIndicator from './LoadingIndicator'
import { useRouter } from 'next/navigation'

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

export function ForumSection({ isDarkTheme }) {
  const [forumData, setForumData] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [error, setError] = useState(null)
  const [activeUsers, setActiveUsers] = useState([]);
  const [emojis, setEmojis] = useState([])
  const [activeUserCount, setActiveUserCount] = useState(0);
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
    return <div className="text-white">Error: {error}</div>
  }

  if (forumData.length === 0) {
    return <div className='text-center justify-center items-center flex h-96'>
      <LoadingIndicator />
    </div>
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <div className="border-b border-zinc-800">
          <ScrollArea className="w-full">
            <div className="flex pb-0.5">
              <TabsList className="h-14 bg-transparent p-0 justify-start">
                {forumData.map((category) => (
                  <TabsTrigger
                    key={category._id}
                    value={category._id}
                    className="data-[state=active]:bg-transparent data-[state=active]:text-yellow-500 relative px-4 py-2 text-white transition-colors hover:text-yellow-500 data-[state=active]:shadow-none"
                  >
                    {category.name}
                    {/* Active indicator line */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                      initial={false}
                      animate={{
                        opacity: activeCategory === category._id ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </ScrollArea>
        </div>

        <AnimatePresence mode="wait">
          {forumData.length > 0 ? (
            forumData.map((category) => (
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
                    <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
                      <CardHeader>
                        <CardTitle className="text-xl">{subcategory.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {subcategory.forums.map((forum) => (
                            <a
                              href={`/forum/${forum._id}`}
                              key={forum._id}
                              className={`flex items-center text-white justify-between p-4 rounded-lg bg-zinc-800/10 ${isDarkTheme ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50'
                                } transition-colors cursor-pointer`}
                            >
                              <div className="flex-1">
                                <h3 className="font-semibold">{forum.name}</h3>
                                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                  {forum.description}
                                </p>
                              </div>
                              <div className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <p>
                                  Last post by{' '}
                                  <span className={`${forum.latestPost?.usernameEffect || ''}`}>
                                    {forum.latestPost?.user}
                                  </span>
                                </p>
                                <p className="text-right">{forum.latestPost?.time}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
            ))
          ) : (
            <div className='text-center justify-center items-center flex h-96'>
              <LoadingIndicator />
            </div>
          )}
          {/* Member Activity Section */}
          <div className="bg-zinc-900/50 rounded-lg mt-4 overflow-hidden">
            <div className="bg-yellow-500 px-4 py-2">
              <h2 className="text-black font-medium">Member Activity</h2>
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-400 mb-4">
                {activeUserCount} USERS ACTIVE TODAY OUT OF {activeUsers.length} MEMBERS. WE DON&apos;T STORE GUEST&apos;S USERS DATA.
              </p>
              {/* <div className="flex flex-wrap gap-2 mb-4">
                {activeUsers.map((user, index) => (
                  <span
                    key={user.username}
                    className={`
                      ${user.usernameEffect}
                      hover:underline cursor-pointer
                    `}
                  >
                    {user.username}
                    {index < activeUsers.length - 1 && <span className="text-gray-600 ml-1">,</span>}
                  </span>
                ))}
              </div> */}
              <div className="flex flex-wrap gap-2 mb-4">
                {activeUsers.map((user, index) => (
                  <span key={user.username}>
                    <span
                      onClick={() => router.push(`/user/${user.username}`)}
                      className={`text-zinc-300 ${user.usernameEffect} hover:underline cursor-pointer text-inherit`}
                    >
                      {user.username}
                    </span>
                    {user.statusEmoji && (
                      <span className="ml-1">
                        {renderTextWithEmojis(user.statusEmoji, emojis)}
                      </span>
                    )}
                    {index < activeUsers.length - 1 && <span className="text-zinc-300 ml-1">,</span>}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}