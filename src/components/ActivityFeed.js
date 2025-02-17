"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, ShoppingBag, MessagesSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

const dummyData = {
  threads: [
    {
      id: 1,
      title: "Thread",
      profilePic: "https://i.postimg.cc/sxNXBXQt/photo-2025-02-16-23-24-29.jpg",
      username: "Shadow",
      usernameEffect: "olympus-effect",
      link: "/thread/1",
      createdAt: "2025-02-16T10:30:00Z",
    }
  ],
  posts: [
    {
      id: 1,
      title: "Post",
      profilePic: "https://i.postimg.cc/sxNXBXQt/photo-2025-02-16-23-24-29.jpg",
      username: "Shadow",
      usernameEffect: "pixel-effect",
      link: "/post/1",
      createdAt: "2025-02-16T10:45:00Z",
    },
  ],
  products: [
    {
      id: 1,
      title: "Product",
      profilePic: "https://i.postimg.cc/sxNXBXQt/photo-2025-02-16-23-24-29.jpg",
      username: "Shadow",
      usernameEffect: "pixel-effect",
      link: "/product/1",
      createdAt: "2025-02-16T10:50:00Z",
    },
  ],
}


export default function ActivityFeed() {
  const [activeTab, setActiveTab] = useState("threads")
  const [data, setData] = useState(dummyData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/mics/ticker');
        if (!response.ok) throw new Error("Failed to fetch data");
        const newData = await response.json();

        if (isMounted) {
          setData(newData);
        }
      } catch (error) {
        console.error("Error fetching ticker data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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
        <Image src={item.profilePic} alt={item.username} fill className="object-cover" />
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
            By <span className={`${item.usernameEffect}`}>{item.username}</span>
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
    <Card className="w-full bg-zinc-900/50 flex-1 text-white border-0 shadow-lg space-y-6 !p-0">
      <CardContent className='!p-0'>
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
              {data[activeTab]?.map(renderActivityItem)}
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

