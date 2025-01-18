// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { formatDistanceToNow } from 'date-fns';
// import { Bell, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// const NotificationTab = ({ isOpen, setIsOpen, userId, isDarkTheme }) => {
//   const [notifications, setNotifications] = useState([]);
//   const notificationRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     const handleEscapeKey = (event) => {
//       if (event.key === 'Escape') {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     document.addEventListener('keydown', handleEscapeKey);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('keydown', handleEscapeKey);
//     };
//   }, [setIsOpen]);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch('/api/get-notification', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ userId }),
//         });
//         const data = await response.json();
//         if (data.success) {
//           const sortedNotifications = data.data.sort((a, b) => {
//             if (a.read === b.read) {
//               return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//             }
//             return a.read ? 1 : -1;
//           });
//           setNotifications(sortedNotifications.slice(0, 8));
//         }
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     };

//     if (isOpen) {
//       fetchNotifications();
//     }
//   }, [isOpen, userId]);

//   const renderNotification = (notification) => {
//     const formattedDate = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

//     return (
//       <div
//         key={notification._id}
//         className={`p-4 border-b ${
//           isDarkTheme
//             ? `border-white/10 ${notification.read ? 'bg-transparent' : 'bg-yellow-400/10'}`
//             : `border-black/10 ${notification.read ? 'bg-transparent' : 'bg-yellow-100'}`
//         }`}
//       >
//         <div className="flex items-start space-x-3">
//           <img
//             src={notification.senderId.profilePic}
//             alt={notification.senderId.username}
//             className="w-10 h-10 rounded-full mr-3"
//           />
//           <div className="flex-1">
//             <p
//               className={`text-sm ${
//                 notification.read
//                   ? isDarkTheme
//                     ? 'text-white/70'
//                     : 'text-black/70'
//                   : isDarkTheme
//                   ? 'text-white font-semibold'
//                   : 'text-black font-semibold'
//               }`}
//             >
//               {notification.message}
//             </p>
//             <p
//               className={`text-xs mt-1 ${
//                 isDarkTheme ? 'text-white/50' : 'text-black/50'
//               }`}
//             >
//               {formattedDate}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           ref={notificationRef}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.2 }}
//           className={`absolute top-16 right-4 w-80 max-w-[90vw] ${
//             isDarkTheme
//               ? 'bg-black/90 border-white/10'
//               : 'bg-white border-black/10'
//           } backdrop-blur-xl border rounded-lg shadow-lg overflow-hidden`}
//         >
//           <div
//             className={`flex justify-between items-center p-4 border-b ${
//               isDarkTheme ? 'border-white/10' : 'border-black/10'
//             }`}
//           >
//             <h2
//               className={`text-lg font-semibold ${
//                 isDarkTheme ? 'text-white' : 'text-black'
//               }`}
//             >
//               Notifications
//             </h2>
//             <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
//               <X className={`h-5 w-5 ${isDarkTheme ? 'text-white' : 'text-black'}`} />
//             </Button>
//           </div>
//           <div className="max-h-[300px] overflow-y-auto">
//             {notifications.length > 0 ? (
//               notifications.map(renderNotification)
//             ) : (
//               <p
//                 className={`p-4 text-center ${
//                   isDarkTheme ? 'text-white/50' : 'text-black/50'
//                 }`}
//               >
//                 No notifications
//               </p>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default NotificationTab;


'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MessageCircle, ThumbsUp, AtSign, Reply, Filter } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'

const notificationIcons = {
    comment: <MessageCircle className="h-4 w-4" />,
    rep: <ThumbsUp className="h-4 w-4" />,
    message: <MessageCircle className="h-4 w-4" />,
    mention: <AtSign className="h-4 w-4" />,
    reply: <Reply className="h-4 w-4" />,
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([])
    const [filter, setFilter] = useState('all')
    const [sortBy, setSortBy] = useState('latest')
    const [unreadCount, setUnreadCount] = useState(0)
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUserId, setCurrentUserId] = useState("")
    const router = useRouter()
    
    // useEffect(() => {
    //     const getCurrentUser = () => {
    //         const token = localStorage.getItem('accessToken');
    //         if (token) {
    //             const decodedToken = jwtDecode(token);
    //             setCurrentUserId(decodedToken.userId);
    //             setIsLoggedIn(true);
    //         } else {
    //             setCurrentUser(null);
    //             setIsLoggedIn(false);
    //         }
    //     }
    //     getCurrentUser()
    // }, [])

    useEffect(() => {
        const fetchNotifications = async (userId) => {
            try {
                const response = await fetch('/api/get-notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userId }),
                })
                const data = await response.json()
                if (data.success) {
                    setNotifications(data.data)
                    setUnreadCount(data.data.filter((n) => !n.read).length)
                }
            } catch (error) {
                console.error('Error fetching notifications:', error)
            }
        }

        const getCurrentUser = () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                setCurrentUserId(decodedToken.userId);
                setIsLoggedIn(true);
                return decodedToken.userId
            } else {
                setCurrentUserId(null);
                setIsLoggedIn(false);
                router.push('/auth');
            }
        }

        const userId = getCurrentUser()

        fetchNotifications(userId)
    }, [])

    const filteredNotifications = notifications
        .filter(n => filter === 'all' || n.type === filter)
        .sort((a, b) => {
            if (sortBy === 'latest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            } else {
                return a.read === b.read ? 0 : a.read ? 1 : -1
            }
        })

    return (
        <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="container mx-auto px-4 py-8">
                <Card className={`w-full text-white max-w-4xl mx-auto ${isDarkTheme ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <CardHeader className="flex flex-row text-white items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl text-white font-bold">Notifications</CardTitle>
                        <Badge variant="secondary" className={isDarkTheme ? 'bg-yellow-400/20 hover:bg-yellow-400/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800'}>
                            {unreadCount} Unread
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="flex text-white justify-between items-center mb-4">
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className={`w-[180px] text-white ${isDarkTheme ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-300'}`}>
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="comment">Comments</SelectItem>
                                    <SelectItem value="rep">Rep</SelectItem>
                                    <SelectItem value="message">Messages</SelectItem>
                                    <SelectItem value="mention">Mentions</SelectItem>
                                    <SelectItem value="reply">Replies</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className={`w-[180px] ${isDarkTheme ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-300'}`}>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Latest</SelectItem>
                                    <SelectItem value="unread">Unread first</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <ScrollArea className="h-[600px] rounded-md">
                            <AnimatePresence>
                                {filteredNotifications.map((notification) => (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className={`p-4 border-b ${isDarkTheme ? 'border-zinc-800' : 'border-zinc-200'} ${!notification.read ? (isDarkTheme ? 'bg-yellow-400/10' : 'bg-yellow-50') : ''
                                            }`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-2 rounded-full ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                                {notificationIcons[notification.type]}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className={`text-sm ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <p className={`text-xs ${isDarkTheme ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </p>
                                                    {notification.projectId && (
                                                        <Link href={`/product/${notification.projectId}`}>
                                                            <Button variant="link" size="sm" className={isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}>
                                                                View Project
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}