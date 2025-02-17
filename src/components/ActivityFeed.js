"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, ShoppingBag, MessagesSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

export default function ActivityFeed() {
  const [activeTab, setActiveTab] = useState('')
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/mics/ticker');
        if (!response.ok) throw new Error("Failed to fetch data");
        const newData = await response.json();
        setData(newData);
      } catch (error) {
        console.error("Error fetching ticker data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const interval = setInterval(fetchData, 5000);
    fetchData();
  
    return () => clearInterval(interval);
  }, []);
  

  const renderActivityItem = (item) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group"
    >
      <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
        <Image src={item.profilePic || "/placeholder.svg"} alt={item.username} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={item.link}
          className="block text-sm font-medium text-zinc-100 truncate group-hover:text-yellow-500 transition-colors"
        >
          {item.title}
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-zinc-400">
            By <span className="text-yellow-500/70">{item.username}</span>
          </span>
          <span className="text-xs text-zinc-500">•</span>
          <span className="text-xs text-zinc-400">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </motion.div>
  )

  return (
    <Card className="w-full p-0 bg-zinc-900/50 flex-1 text-white border-0 shadow-lg space-y-6">
      <CardContent>
        <div className="w-full rounded-xl backdrop-blur-sm">
          <Tabs defaultValue="threads" className="w-full" onValueChange={setActiveTab}>
            <div className="border-b border-zinc-800/50">
              <TabsList className="h-14 w-full bg-transparent flex justify-between px-6">
                <TabsTrigger
                  value="threads"
                  className="data-[state=active]:bg-zinc-800/50 data-[state=active]:text-yellow-500 transition-all text-yellow-500/70"
                >
                  <MessageSquare className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:bg-zinc-800/50 data-[state=active]:text-yellow-500 transition-all text-yellow-500/70"
                >
                  <MessagesSquare className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="data-[state=active]:bg-zinc-800/50 data-[state=active]:text-yellow-500 transition-all text-yellow-500/70"
                >
                  <ShoppingBag className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="p-3 space-y-1">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-8"
                  >
                    <div className="h-6 w-6 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                  </motion.div>
                ) : (
                  data[activeTab]?.map(renderActivityItem)
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

