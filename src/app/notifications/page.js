'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MessageCircle, ThumbsUp, AtSign, Reply, Filter, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import Header from '@/partials/Header'

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
    const [currentUser, setCurrentUser] = useState(null)
    const router = useRouter()
    
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
                router.push('/auth');
            }
        }

        getCurrentUser()
    }, [])

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!currentUser?.userId) return;
            
            try {
                const response = await fetch('/api/get-notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: currentUser.userId }),
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
                    setUnreadCount(exampleNotifications.filter(n => !n.read).length);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error)
                // Set example notifications on error as well
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
                setUnreadCount(exampleNotifications.filter(n => !n.read).length);
            }
        }

        fetchNotifications()
    }, [currentUser])

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
            <Header
                avatar={currentUser?.profilePic}
                userId={currentUser?.userId}
                currentPage="/notifications"
                isDarkTheme={isDarkTheme}
                toggleTheme={() => setIsDarkTheme(!isDarkTheme)}
                isLoggedIn={isLoggedIn}
            />

            <div className="container mx-auto px-4 py-8">
                <Card className={`w-full max-w-4xl mx-auto border-0 shadow-xl ${
                    isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'
                } backdrop-blur-xl`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-zinc-800">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
                            <p className="text-sm text-zinc-400">Manage your notifications and preferences</p>
                        </div>
                        <Badge variant="secondary" className={`px-3 py-1.5 ${
                            isDarkTheme 
                                ? 'bg-zinc-800 text-yellow-500 hover:bg-zinc-800' 
                                : 'bg-zinc-100 text-zinc-900'
                        }`}>
                            {unreadCount} Unread
                        </Badge>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className={`w-full sm:w-[180px] ${
                                    isDarkTheme 
                                        ? 'bg-zinc-800/50 border-zinc-700 text-white' 
                                        : 'bg-white border-zinc-200'
                                }`}>
                                    <Filter className="w-4 h-4 mr-2 opacity-50" />
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Notifications</SelectItem>
                                    <SelectItem value="comment">Comments</SelectItem>
                                    <SelectItem value="rep">Reputation</SelectItem>
                                    <SelectItem value="message">Messages</SelectItem>
                                    <SelectItem value="mention">Mentions</SelectItem>
                                    <SelectItem value="reply">Replies</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className={`w-full sm:w-[180px] ${
                                    isDarkTheme 
                                        ? 'bg-zinc-800/50 border-zinc-700 text-white' 
                                        : 'bg-white border-zinc-200'
                                }`}>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Latest First</SelectItem>
                                    <SelectItem value="unread">Unread First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <ScrollArea className="h-[600px] rounded-xl">
                            <AnimatePresence>
                                {filteredNotifications.length > 0 ? (
                                    filteredNotifications.map((notification) => (
                                        <motion.div
                                            key={notification._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.2 }}
                                            className={`p-4 border-b bg-zinc-900/40 last:border-0 transition-colors duration-200 ${
                                                isDarkTheme ? 'border-zinc-800' : 'border-zinc-100'
                                            } ${
                                                !notification.read 
                                                    ? isDarkTheme 
                                                        ? 'bg-zinc-900/40' 
                                                        : 'bg-zinc-50'
                                                    : ''
                                            }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className={`p-2 rounded-xl ${
                                                    isDarkTheme 
                                                        ? 'bg-zinc-900 text-zinc-400' 
                                                        : 'bg-zinc-100 text-zinc-600'
                                                }`}>
                                                    {notificationIcons[notification.type]}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className={`text-sm ${
                                                        isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'
                                                    }`}>
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <p className={`text-xs ${
                                                            isDarkTheme ? 'text-zinc-500' : 'text-zinc-400'
                                                        }`}>
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-12 text-center"
                                    >
                                        <AlertCircle className="w-12 h-12 text-zinc-500 mb-4" />
                                        <h3 className="text-lg font-medium text-zinc-300 mb-2">No notifications found</h3>
                                        <p className="text-sm text-zinc-500">
                                            {filter === 'all' 
                                                ? "You don't have any notifications yet" 
                                                : "No notifications match the selected filter"}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}