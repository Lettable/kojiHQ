'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"


export function ForumSection({ forumData, setForumCategories, isDarkTheme }) {
  const [activeCategory, setActiveCategory] = React.useState(forumData[0]?._id || '')

  React.useEffect(() => {
    const fetchForumData = async () => {
      try {
        const response = await fetch('/api/home-forum');
        const data = await response.json();
        console.log('Data direct from API', data)
        setForumCategories(data);
      } catch (error) {
        setError(err.message)
        console.error('Error fetching forum data:', error);
      }
    };
    
    fetchForumData();
  }, [])

  console.log(forumData)
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue={activeCategory} 
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
                            className={`flex items-center text-white justify-between p-4 rounded-lg bg-zinc-800/10 ${
                              isDarkTheme ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50'
                            } transition-colors cursor-pointer`}
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold">{forum.name}</h3>
                              <p className={`text-sm ${
                                isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {forum.description}
                              </p>
                            </div>
                            <div className={`text-sm ${
                              isDarkTheme ? 'text-gray-400' : 'text-gray-600'
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
          ))}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}