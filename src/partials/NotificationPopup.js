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
          setNotifications(data.data.slice(0, 10))
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
          className={`absolute right-0 mt-2 w-96 max-w-[90vw] rounded-lg shadow-lg ${
            isDarkTheme 
              ? 'bg-zinc-900/95 border border-white/10' 
              : 'bg-white/95 border border-black/10'
          } backdrop-blur-xl overflow-hidden z-50`}
        >
          <div className={`flex items-center justify-between p-4 border-b ${
            isDarkTheme ? 'border-white/10' : 'border-black/10'
          }`}>
            <h3 className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
              Notifications
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`rounded-md hover:bg-${isDarkTheme ? 'white' : 'black'}/10`}
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
                    className={`p-4 ${
                      !notification.read 
                        ? isDarkTheme 
                          ? 'bg-yellow-400/10' 
                          : 'bg-yellow-50' 
                        : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-md ${
                        isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-100'
                      }`}>
                        {notificationIcons[notification.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${
                          isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            isDarkTheme ? 'text-zinc-500' : 'text-zinc-400'
                          }`}>
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                          {notification.projectId && (
                            <Link 
                              href={`/product/${notification.projectId}`}
                              onClick={onClose}
                              className={`text-xs font-medium ${
                                isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'
                              } hover:underline`}
                            >
                              View Product
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={`p-4 text-center ${
                isDarkTheme ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                No notifications
              </div>
            )}
          </ScrollArea>

          <div className={`p-3 border-t ${
            isDarkTheme ? 'border-white/10' : 'border-black/10'
          }`}>
            <Button
              onClick={viewAllNotifications}
              className="w-full rounded-md bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
            >
              View All Notifications
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 