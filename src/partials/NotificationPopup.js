'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { Bell, MessageCircle, ThumbsUp, AtSign, Reply, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const notificationIcons = {
  comment: <MessageCircle className="h-4 w-4" />,
  rep: <ThumbsUp className="h-4 w-4" />,
  message: <MessageCircle className="h-4 w-4" />,
  mention: <AtSign className="h-4 w-4" />,
  reply: <Reply className="h-4 w-4" />,
}

export default function NotificationPopup({ isOpen, onClose, userId, isDarkTheme }) {
  const [notifications, setNotifications] = useState([])
  const popupRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/get-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        })
        const data = await response.json()
        if (data.success) {
          const exampleNotifications = [
            {
              _id: '1',
              type: 'reply',
              message: 'John_Doe replied to your thread "Best Mining Strategies 2024"',
              read: false,
              createdAt: new Date(Date.now() - 1000 * 60 * 5),
              projectId: 'thread-1'
            },
            {
              _id: '2',
              type: 'rep',
              message: 'CryptoExpert gave you +1 reputation for your helpful answer',
              read: false,
              createdAt: new Date(Date.now() - 1000 * 60 * 30),
              projectId: 'thread-2'
            },
            {
              _id: '3',
              type: 'mention',
              message: '@BlockchainDev mentioned you in "Security Best Practices"',
              read: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
              projectId: 'thread-3'
            },
            {
              _id: '4',
              type: 'comment',
              message: 'New comment on your guide: "Excellent explanation!"',
              read: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
              projectId: 'thread-4'
            },
            {
              _id: '5',
              type: 'message',
              message: 'You received a new private message from Alice_Chain',
              read: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
              projectId: 'thread-5'
            }
          ];
          setNotifications(exampleNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    if (isOpen && userId) {
      fetchNotifications()
    }
  }, [isOpen, userId])

  const viewAllNotifications = () => {
    router.push('/notifications')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`absolute right-0 mt-2 w-96 max-w-[90vw] rounded-xl shadow-xl ${
            isDarkTheme 
              ? 'bg-zinc-900/50 border-0' 
              : 'bg-white/95 border-0'
          } backdrop-blur-xl overflow-hidden z-50`}
        >
          <div className={`flex items-center justify-between p-4 border-b ${
            isDarkTheme ? 'border-zinc-800' : 'border-zinc-200'
          }`}>
            <div className="space-y-1">
              <h3 className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                Notifications
              </h3>
              <p className="text-sm text-zinc-400">Recent activity</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`rounded-lg hover:text-zinc-200 hover:bg-zinc-800/50`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="max-h-[400px]">
            {notifications.length > 0 ? (
              <div className="divide-y divide-zinc-800">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 hover:bg-zinc-500/5 transition-colors cursor-pointer ${
                      !notification.read 
                        ? isDarkTheme 
                          ? 'bg-zinc-700/20' 
                          : 'bg-zinc-100/80' 
                        : isDarkTheme
                          ? 'hover:bg-zinc-800'
                          : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-xl transition-colors ${
                        isDarkTheme 
                          ? 'bg-zinc-900 text-zinc-400' 
                          : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {notificationIcons[notification.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          isDarkTheme ? 'text-zinc-200' : 'text-zinc-700'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            isDarkTheme ? 'text-zinc-400' : 'text-zinc-500'
                          }`}>
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                          {notification.projectId && (
                            <Link href={`/thread/${notification.projectId}`}>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="hover:bg-zinc-800/50 hover:text-yellow-500 rounded-lg transition-colors duration-200"
                                onClick={onClose}
                              >
                                View Thread
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-12 h-12 text-zinc-500 mb-4" />
                <h3 className="text-lg font-medium text-zinc-300 mb-2">No notifications</h3>
                <p className="text-sm text-zinc-500">
                  You're all caught up!
                </p>
              </div>
            )}
          </ScrollArea>

          <div className={`p-3 border-t ${
            isDarkTheme ? 'border-zinc-800' : 'border-zinc-200'
          }`}>
            <Button
              onClick={viewAllNotifications}
              className="w-full rounded-lg bg-zinc-800/50 text-white hover:bg-zinc-800 transition-colors duration-200"
            >
              View All Notifications
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 