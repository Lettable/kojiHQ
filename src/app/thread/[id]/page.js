'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Download, FileText, Heart, ImageIcon, MessageSquare, Plus, Reply, Video, Eye, Bitcoin, DollarSign, X, Clock } from 'lucide-react'
import Header from '@/partials/Header'
import { FaEthereum } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import remarkGfm from 'remark-gfm'
import MarkdownPreview from '@uiw/react-markdown-preview';
import MarkdownWithEmojis from '@/partials/MarkdownWithEmojis'
import PreferredCurrencies from '@/components/PreferedCurrencies'

export default function ThreadView() {
    const [currentUser, setCurrentUser] = useState(null)
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const [sortBy, setSortBy] = useState('latest')
    const [replyTo, setReplyTo] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [thread, setThread] = useState(null)
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const pathname = usePathname()
    const [currencies, setCurrencies] = useState()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const replyBoxRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        const storedCurrencies = localStorage.getItem('preferredCurrencies');
        const initialCurrencies = storedCurrencies ? JSON.parse(storedCurrencies) : ['BTC', 'ETH', 'LTC'];
        setCurrencies(initialCurrencies);
    }, []);

    useEffect(() => {
        const getCurrentUser = () => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                const decodedToken = jwtDecode(token)
                setCurrentUser(decodedToken)
                setIsLoggedIn(true)
            } else {
                setCurrentUser(null)
                setIsLoggedIn(false)
            }
        }
        getCurrentUser()

        const threadId = pathname.split('/')[2]
        if (threadId) {
            fetchThreadById(threadId)
            fetchPosts(threadId)
        } else {
            setError('No thread ID provided')
            setIsLoading(false)
        }

        const storedTheme = localStorage.getItem('theme')
        setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true)
    }, [pathname])

    const fetchThreadById = async (id) => {
        try {
            const response = await fetch(`/api/thread?threadId=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            if (!response.ok) {
                throw new Error('Failed to fetch thread')
            }
            const threadData = await response.json()
            setThread(threadData)
        } catch (error) {
            console.error('Error fetching thread:', error)
            setError('Failed to load thread')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchPosts = async (threadId) => {
        try {
            const response = await fetch(`/api/post?threadId=${threadId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            if (!response.ok) {
                throw new Error('Failed to fetch posts')
            }
            const postsData = await response.json()
            setPosts(postsData)
        } catch (error) {
            console.error('Error fetching posts:', error)
            setError('Failed to load posts')
        }
    }

    const handleReply = (postId = null) => {
        setReplyTo(postId)
        setIsDialogOpen(true)
        setTimeout(() => {
            replyBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
    }

    const submitReply = async () => {
        if (isSubmitting) return
        
        try {
            setIsSubmitting(true)
            const response = await fetch('/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    userId: currentUser.userId,
                    threadId: thread._id,
                    content: replyContent,
                    replyPostId: replyTo
                })
            })

            if (!response.ok) {
                throw new Error('Failed to submit reply')
            }

            const newPost = await response.json()
            setPosts(prev => [...prev, newPost])
            setIsDialogOpen(false)
            setReplyContent('')
            setReplyTo(null)
        } catch (error) {
            console.error('Error submitting reply:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const sortPosts = (posts) => {
        return [...posts].sort((a, b) => {
            if (sortBy === 'latest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            return b.likes.length - a.likes.length
        })
    }

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />
        if (fileType.startsWith('video/')) return <Video className="w-5 h-5" />
        return <FileText className="w-5 h-5" />
    }

    const organizePostsIntoTree = (posts) => {
        const postMap = new Map();
        const rootPosts = [];

        posts.forEach(post => {
            post.replies = [];
            postMap.set(post._id, post);
        });

        posts.forEach(post => {
            if (post.replyPost) {
                const parentPost = postMap.get(post.replyPost);
                if (parentPost) {
                    parentPost.replies.push(post);
                }
            } else {
                rootPosts.push(post);
            }
        });

        return rootPosts;
    };

    const PostComponent = ({ post, level = 0, isDarkTheme, handleReply, formatDate }) => {
        const [showAllReplies, setShowAllReplies] = useState(false);
        const [isExpanded, setIsExpanded] = useState(true);
        const visibleReplies = showAllReplies ? post.replies : post.replies.slice(0, 3);
        const hasMoreReplies = post.replies.length > 3;

        return (
            <div className={`relative ${level > 0 ? 'ml-8' : ''} ${level > 0 ? 'mt-4' : ''}`}>
                {level > 0 && (
                    <div 
                        className="absolute left-[-24px] top-0 bottom-0 w-[2px] group cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className={`
                            absolute inset-0
                            ${isExpanded ? 'bg-yellow-500/30' : 'bg-zinc-700/30'}
                            group-hover:bg-yellow-500/50
                            transition-all duration-300
                        `} />
                    </div>
                )}

                <Card className={`${isDarkTheme ? 'bg-zinc-900/50 hover:bg-zinc-900/70' : 'bg-white hover:bg-gray-50'} 
                    border-0 text-white transition-all duration-300 backdrop-blur-sm
                    ${level > 0 ? 'border-l border-yellow-500/20' : ''}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                            <div className="relative group">
                                <Avatar className="w-10 h-10 ring-2 ring-yellow-500/20 transition-all duration-300 group-hover:ring-yellow-500/40">
                                    <AvatarImage src={post.author.profilePic} />
                                    <AvatarFallback>{post.author.username}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span onClick={() => router.push(`/user/${post.author.username}`)} className={`font-semibold truncate ${post.author.usernameEffect} hover:text-yellow-500 transition-colors duration-300`}>
                                        {post.author.username}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(post.createdAt)}
                                    </span>
                                </div>
                                <div className="prose prose-invert max-w-none text-white mt-2 prose-p:leading-relaxed prose-a:text-yellow-500">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {post.content}
                                    </ReactMarkdown>
                                </div>
                                <div className="mt-4 flex items-center gap-4">
                                    <Button
                                        onClick={() => handleReply(post._id)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 
                                            transition-all duration-300 rounded-md gap-2"
                                    >
                                        <Reply className="w-4 h-4" />
                                        Reply
                                    </Button>
                                    {post.replies.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className={`text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 
                                                transition-all duration-300 rounded-md gap-2
                                                ${isExpanded ? 'bg-yellow-500/5' : ''}`}
                                        >
                                            <MessageSquare className={`w-4 h-4 ${isExpanded ? 'text-yellow-500' : ''}`} />
                                            {isExpanded ? (
                                                <span className="text-yellow-500">
                                                    Hide {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                                                </span>
                                            ) : (
                                                <span>
                                                    Show {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                                                </span>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <AnimatePresence initial={false}>
                    {isExpanded && visibleReplies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ 
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                            className="space-y-4 overflow-hidden"
                        >
                            {visibleReplies.map((reply, index) => (
                                <motion.div
                                    key={reply._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <PostComponent
                                        post={reply}
                                        level={level + 1}
                                        isDarkTheme={isDarkTheme}
                                        handleReply={handleReply}
                                        formatDate={formatDate}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!showAllReplies && hasMoreReplies && isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="ml-8 mt-4"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-yellow-500 
                                hover:bg-yellow-500/10 transition-all duration-300 
                                rounded-md relative group gap-2"
                            onClick={() => setShowAllReplies(true)}
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            Load {post.replies.length - 3} more {post.replies.length - 3 === 1 ? 'reply' : 'replies'}
                        </Button>
                    </motion.div>
                )}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-3/4 space-y-6">
                            <div className="bg-zinc-900/50 rounded-xl p-8 animate-pulse">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-14 h-14 bg-zinc-800 rounded-full"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                                            <div className="h-3 w-24 bg-zinc-800 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="h-4 w-16 bg-zinc-800 rounded"></div>
                                        <div className="h-4 w-16 bg-zinc-800 rounded"></div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-center mb-8">
                                    <div className="h-8 w-2/3 bg-zinc-800 rounded"></div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="h-4 w-full bg-zinc-800 rounded"></div>
                                    <div className="h-4 w-5/6 bg-zinc-800 rounded"></div>
                                    <div className="h-4 w-4/6 bg-zinc-800 rounded"></div>
                                </div>
                            </div>

                            {[1, 2, 3].map((_, index) => (
                                <div 
                                    key={index}
                                    className="bg-zinc-900/50 rounded-xl p-6 animate-pulse"
                                    style={{
                                        animationDelay: `${index * 150}ms`
                                    }}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-zinc-800 rounded-full"></div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                                                <div className="h-3 w-32 bg-zinc-800 rounded"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-full bg-zinc-800 rounded"></div>
                                                <div className="h-4 w-5/6 bg-zinc-800 rounded"></div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="h-8 w-24 bg-zinc-800 rounded-md"></div>
                                                <div className="h-8 w-32 bg-zinc-800 rounded-md"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:w-1/4 space-y-6">
                            <div className="bg-zinc-900/50 rounded-xl p-6 animate-pulse">
                                <div className="h-6 w-40 bg-zinc-800 rounded mb-4"></div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center justify-between"
                                            style={{
                                                animationDelay: `${index * 150}ms`
                                            }}
                                        >
                                            <div className="h-4 w-20 bg-zinc-800 rounded"></div>
                                            <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-zinc-900/50 rounded-xl p-6 animate-pulse">
                                <div className="h-6 w-40 bg-zinc-800 rounded mb-4"></div>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((_, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center gap-3"
                                            style={{
                                                animationDelay: `${index * 150}ms`
                                            }}
                                        >
                                            <div className="w-2 h-2 bg-zinc-800 rounded-full"></div>
                                            <div className="h-4 w-full bg-zinc-800 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center bg-black items-center h-screen">
                <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
                <Button className="bg-zinc-800/50 text-white hover:bg-zinc-900/50" onClick={() => router.push('/')}>Go to Home</Button>
            </div>
        )
    }

    if (!thread) {
        return (
            <div className="flex flex-col justify-center bg-black items-center h-screen">
                <h1 className="text-2xl font-bold text-white mb-4">Thread not found</h1>
                <Button className="bg-zinc-800/50 text-white hover:bg-zinc-900/50" onClick={() => router.push('/')}>Go to Home</Button>
            </div>
        )
    }

    return (
        <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header
                avatar={currentUser?.profilePic}
                userId={currentUser?.userId}
                currentPage='/thread'
                isDarkTheme={isDarkTheme}
                toggleTheme={() => setIsDarkTheme(!isDarkTheme)}
                isLoggedIn={isLoggedIn}
                isPremium={currentUser?.isPremium}
            />

            <div className="container mx-auto text-white px-4 py-8">
                <div className="flex flex-col text-white lg:flex-row gap-8">
                    <div className="lg:w-3/4 space-y-6">
                        <Card className={`${isDarkTheme ? 'bg-zinc-900/50 hover:bg-zinc-900/50' : 'bg-white'} 
                            text-white border-0 transition-all duration-200 shadow-xl rounded-xl overflow-hidden`}>
                            <CardContent className="p-8">
                                <div className="flex items-center text-white justify-between mb-8">
                                    <div className="flex items-center text-white space-x-4">
                                        <div className="relative group">
                                            <Avatar className="w-14 h-14 ring-4 ring-yellow-500/20 transition-all duration-200 group-hover:ring-yellow-500/40">
                                                <AvatarImage src={thread.author.profilePic} />
                                                <AvatarFallback>{thread.author.username}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-zinc-900"></div>
                                        </div>
                                        <div>
                                            <span onClick={() => router.push(`/user/${thread.author.username}`)} className={`text-xl font-semibold ${thread.author.usernameEffect} hover:text-yellow-500 transition-colors duration-200`}>
                                                {thread.author.username}
                                            </span>
                                            <p className="text-sm text-gray-400">{formatDate(thread.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6 text-sm">
                                        <span className="flex items-center text-gray-400 group">
                                            <Eye className="w-5 h-5 mr-2 group-hover:text-yellow-500 transition-colors duration-200" />
                                            <span className="group-hover:text-yellow-500 transition-colors duration-200">{thread.views}</span>
                                        </span>
                                        <span className="flex items-center text-gray-400 group">
                                            <MessageSquare className="w-5 h-5 mr-2 group-hover:text-yellow-500 transition-colors duration-200" />
                                            <span className="group-hover:text-yellow-500 transition-colors duration-200">{thread.repliesCount}</span>
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                    {thread.title}
                                </h1>

                                {currentUser ? (
                                    <div className={`prose ${isDarkTheme ? 'prose-invert' : ''} max-w-none mb-8 
                                        p-6 rounded-xl bg-zinc-800/30 border border-yellow-500/10 hover:border-yellow-500/20 
                                        transition-all duration-200`}>
                                        <MarkdownWithEmojis content={thread.content} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 bg-zinc-800/50 
                                        text-[#c9d1d9] rounded-xl border border-zinc-700/50 backdrop-blur-sm">
                                        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4 animate-pulse" />
                                        <p className="text-xl font-semibold mb-3">🔒 Please sign in to view this thread</p>
                                        <p className="text-sm text-gray-400 mb-6">Join our community to access all content!</p>

                                        <Button 
                                            onClick={() => { window.location.href = '/auth'; }} 
                                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold 
                                                transition-all duration-200 shadow-lg hover:shadow-yellow-500/20 
                                                px-8 py-2 rounded-md"
                                        >
                                            Login / Register
                                        </Button>
                                    </div>
                                )}

                                {currentUser && thread.attachments.length > 0 && (
                                    <div className="space-y-3 mt-8">
                                        <h3 className="text-lg text-white font-semibold mb-4">Attachments</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {thread.attachments.map((file) => (
                                                <div
                                                    key={file._id}
                                                    className={`flex items-center text-white justify-between p-4 rounded-xl
                                                        ${isDarkTheme ? 'bg-zinc-800/50' : 'bg-gray-100'}
                                                        border border-yellow-500/10 hover:border-yellow-500/30
                                                        transition-all duration-200`}
                                                >
                                                    <div className="flex items-center text-white space-x-3">
                                                        {getFileIcon(file.fileType)}
                                                        <span className="text-sm truncate max-w-[200px]">{file.fileName}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => window.open(file.fileUrl, '_blank')}
                                                        className="hover:bg-yellow-500/10 hover:text-yellow-500 rounded-full"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <AnimatePresence>
                                {posts.length === 0 && currentUser && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <p className="flex items-center text-white justify-center text-xl mt-30 pt-30">
                                            No posts found!
                                        </p>
                                    </motion.div>
                                )}

                                {!currentUser && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <p className="flex items-center text-white justify-center text-xl mt-30 pt-30">
                                            Please log in to see the posts.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {currentUser && posts.length > 0 && organizePostsIntoTree(sortPosts(posts)).map((post) => (
                                    <motion.div
                                        key={post._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <PostComponent
                                            post={post}
                                            isDarkTheme={isDarkTheme}
                                            handleReply={handleReply}
                                            formatDate={formatDate}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {currentUser && (
                                <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-xl`}>
                                    <CardContent className="p-6">
                                        <div className="relative">
                                            {replyTo && (
                                                <div className="mb-4 bg-zinc-800/50 rounded-xl border border-yellow-500/20 overflow-hidden">
                                                    <div className="p-4 bg-yellow-500/5 border-b border-yellow-500/20 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Reply className="w-4 h-4 text-yellow-500" />
                                                            <span className="text-sm font-medium text-gray-400">Replying to:</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setReplyTo(null)}
                                                            className="hover:bg-zinc-700/70 hover:text-white p-1.5 h-7 w-7 rounded-full"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    
                                                    <div className="p-4">
                                                        {(() => {
                                                            const replyingTo = posts.find(p => p._id === replyTo);
                                                            if (!replyingTo) return null;
                                                            
                                                            return (
                                                                <div className="flex gap-4">
                                                                    <Avatar className="w-10 h-10 ring-2 ring-yellow-500/20">
                                                                        <AvatarImage src={replyingTo.author.profilePic} />
                                                                        <AvatarFallback>{replyingTo.author.username[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className={`font-medium ${replyingTo.author.usernameEffect}`}>
                                                                                {replyingTo.author.username}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">
                                                                                {formatDate(replyingTo.createdAt)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-sm text-gray-400 line-clamp-2 break-all">
                                                                            {replyingTo.content}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                            <Textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="Write your reply here..."
                                                className={`min-h-[100px] mb-4 resize-none rounded-xl transition-all duration-200
                                                    ${isDarkTheme 
                                                        ? 'bg-zinc-800/50 text-white border-zinc-700/50 focus:border-yellow-500/50 focus:ring-yellow-500/20' 
                                                        : 'bg-white text-black border-zinc-200 focus:border-yellow-600/50 focus:ring-yellow-600/20'
                                                    } hover:border-yellow-500/30`}
                                            />
                                            <div className="flex justify-end items-center">
                                                <Button
                                                    onClick={() => submitReply()}
                                                    className={`bg-yellow-500 hover:bg-yellow-600 text-black 
                                                        transition-all duration-200 rounded-xl px-6 shadow-lg hover:shadow-yellow-500/20
                                                        disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
                                                        ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                                                    disabled={!replyContent.trim() || isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                                            <span>Posting...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Reply className="w-4 h-4" />
                                                            Post Reply
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    <div className="lg:w-1/4 space-y-6">
                        <PreferredCurrencies preferredCurrencies={currencies} />

                        <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} border-0 text-white 
                            shadow-xl sticky top-4 rounded-xl`}>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                    Forum Guidelines
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-none text-white space-y-4 text-sm">
                                    <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        Be respectful to other members
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        No spamming or excessive self-promotion
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        Stay on topic within each thread
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        Report any suspicious activity
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}