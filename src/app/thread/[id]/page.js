'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Download, FileText, Heart, ImageIcon, MessageSquare, Plus, Reply, Video, Eye, Bitcoin, DollarSign } from 'lucide-react'
import Header from '@/partials/Header'
import { FaEthereum } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import remarkGfm from 'remark-gfm'
import MarkdownPreview from '@uiw/react-markdown-preview';
import MarkdownWithEmojis from '@/partials/MarkdownWithEmojis'

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
    const [cryptoPrices, setCryptoPrices] = useState({
        BTC: "0",
        ETH: "0",
        LTC: "0"
    })
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const fetchCryptoPrices = async () => {
            try {
                const [btcResponse, ethResponse, ltcResponse] = await Promise.all([
                    fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
                    fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'),
                    fetch('https://api.binance.com/api/v3/ticker/price?symbol=LTCUSDT')
                ]);

                const btcData = await btcResponse.json();
                const ethData = await ethResponse.json();
                const ltcData = await ltcResponse.json();

                setCryptoPrices({
                    BTC: Number(btcData.price).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                    ETH: Number(ethData.price).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                    LTC: Number(ltcData.price).toLocaleString(undefined, { maximumFractionDigits: 2 })
                });
            } catch (error) {
                console.error('Error fetching crypto prices:', error);
            }
        };

        fetchCryptoPrices();
        const interval = setInterval(fetchCryptoPrices, 50000);

        return () => clearInterval(interval);
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
    }

    const submitReply = async () => {
        try {
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

            const ws = new WebSocket('wss://kojihq-ws.onrender.com');
            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: 'post',
                    _id: thread._id,
                    content: replyContent
                }));
                ws.close();
            };

            const newPost = await response.json()
            setPosts(prev => [...prev, newPost])
            setIsDialogOpen(false)
            setReplyContent('')
            setReplyTo(null)
        } catch (error) {
            console.error('Error submitting reply:', error)
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

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-black text-white">Loading...</div>
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
                    {/* Main Content */}
                    <div className="lg:w-3/4 space-y-6">
                        {/* Thread Content */}
                        <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0`}>
                            <CardContent className="p-6 pb-4">
                                <div className="flex items-center text-white justify-between mb-4">
                                    <div className="flex items-center text-white space-x-4">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={thread.author.profilePic} />
                                            <AvatarFallback>{thread.author.username}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h2 className="text-lg font-semibold">{thread.author.username}</h2>
                                            <p className="text-sm text-gray-400">{formatDate(thread.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span className="flex items-center text-gray-400">
                                            <Eye className="w-4 h-4 mr-1" />
                                            {thread.views}
                                        </span>
                                        <span className="flex items-center text-gray-400">
                                            <MessageSquare className="w-4 h-4 mr-1" />
                                            {thread.repliesCount}
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-3xl text-white text-center justify-center mt-2 items-center font-bold mb-6">{thread.title}</h1>

                                {/* <div className={`prose ${isDarkTheme ? 'prose-invert' : ''} max-w-none mb-6`}>
                                    <MarkdownPreview
                                    style={{ backgroundColor: 'rgba(24, 24, 27, 0.5)' }}
                                        className="m-0 bg-[#0d1117] text-[#c9d1d9] p-4 rounded-md markdown-body"
                                        source={thread.content}
                                    />
                                </div> */}

                                {currentUser ? (
                                    <div className={`prose ${isDarkTheme ? 'prose-invert' : ''} max-w-none mb-6`}>
                                        {/* <MarkdownPreview
                                            style={{ backgroundColor: 'rgba(24, 24, 27, 0.5)' }}
                                            className="m-0 bg-[#0d1117] text-[#c9d1d9] p-4 rounded-md markdown-body"
                                            source={thread.content}
                                        /> */}
                                        <MarkdownWithEmojis content={thread.content} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-6 bg-zinc-800/50 text-[#c9d1d9] rounded-md">
                                        <p className="text-lg font-semibold">🔒 Please sign in to view this thread</p>
                                        <p className="text-sm text-gray-400">It only takes 30 seconds to create an account!</p>
                                        
                                        <Button onClick={() => { window.location.href = '/auth'; }} className={`${isDarkTheme ? 'bg-zinc-800/50 mt-4 px-4 py-2 hover:bg-zinc-800/20 text-white font-semibold shadow-lg hover:shadow-xl transition-all hidden md:flex' : 'bg-black/10 hover:bg-black/10 hover:shadow-xl text-black font-semibold shadow-lg transition-all hidden md:flex'}`}>
                                            Login / Register
                                        </Button>
                                    </div>
                                )}


                                {currentUser && thread.attachments.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-lg text-white font-semibold mb-2">Attachments</h3>
                                        {thread.attachments.map((file) => (
                                            <div
                                                key={file._id}
                                                className={`flex items-center text-white justify-between p-3 rounded-lg ${isDarkTheme ? 'bg-zinc-800/50' : 'bg-gray-100'
                                                    }`}
                                            >
                                                <div className="flex items-center text-white space-x-3">
                                                    {getFileIcon(file.fileType)}
                                                    <span className="text-sm">{file.fileName}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(file.fileUrl, '_blank')}
                                                    className="hover:bg-zinc-400/10 hover:text-white"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Posts Section */}
                        <div className="flex justify-between text-white items-center mb-6">
                            <Button
                                onClick={() => handleReply()}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Post
                            </Button>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className={`w-[180px] ${isDarkTheme ? 'bg-zinc-800 border-0' : 'bg-white'}`}>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-0 hover:bg-zinc-800">
                                    <SelectItem className="text-white border-0" value="latest">Latest</SelectItem>
                                    <SelectItem className="text-white border-0" value="mostLikes">Top</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4 text-white">
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
                                {posts.length > 0 && sortPosts(posts).map((post) => (
                                    <motion.div
                                        key={post._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} border-0 text-white`}>
                                            <CardContent className="p-6">
                                                {post.replyPost && (
                                                    <div className="mb-2 text-sm text-gray-400">
                                                        Replied to {posts.find(p => p._id === post.replyPost)?.author.username}&apos;s post
                                                    </div>
                                                )}
                                                <div className="flex items-start text-white justify-between">
                                                    <div className="flex items-start text-white space-x-4">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarImage src={post.author.profilePic} />
                                                            <AvatarFallback>{post.author.username}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 text-white">
                                                            <div className="flex items-center">
                                                                <span className="font-semibold">{post.author.username}</span>
                                                                <span className="mx-2">•</span>
                                                                <span className="text-sm text-gray-400">
                                                                    {formatDate(post.createdAt)}
                                                                </span>
                                                            </div>
                                                            <div className={`prose ${isDarkTheme ? 'prose-invert' : ''} max-w-none text-white mt-2`}>
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                                                            </div>
                                                            <div className="flex items-center mt-4 space-x-4">
                                                                {/* <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleLike('post', post._id)}
                                                                    className={`${
                                                                        post.likes.includes(currentUser?._id)
                                                                        ? 'text-yellow-500'
                                                                        : 'text-gray-400'
                                                                    }`}
                                                                >
                                                                    <Heart className="w-4 h-4 mr-2" />
                                                                    <span>{post.likes.length}</span>
                                                                </Button> */}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleReply(post._id)}
                                                                    className="text-gray-400 hover:bg-zinc-700/10 hover:text-white"
                                                                >
                                                                    <Reply className="w-4 h-4 mr-2" />
                                                                    <span>Reply</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:w-1/4 space-y-6">
                        <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
                            <CardHeader>
                                <CardTitle className="text-lg">Live Prices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Bitcoin className="h-4 w-4 mr-2" />
                                            <span>BTC</span>
                                        </div>
                                        <span>${cryptoPrices.BTC}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FaEthereum className="h-4 w-4 mr-2" />
                                            <span>ETH</span>
                                        </div>
                                        <span>${cryptoPrices.ETH}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            <span>LTC</span>
                                        </div>
                                        <span>${cryptoPrices.LTC}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} border-0 text-white shadow-lg`}>
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Forum Rules</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc text-white list-inside space-y-2 text-sm">
                                    <li>Be respectful to other members</li>
                                    <li>No spamming or excessive self-promotion</li>
                                    <li>Stay on topic within each thread</li>
                                    <li>Report any suspicious activity</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Reply Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className={`${isDarkTheme ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
                    <DialogHeader>
                        <DialogTitle>
                            {replyTo ? 'Reply to Post' : 'Create New Post'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <Textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your reply... (Markdown supported)"
                            className={`min-h-[100px] ${isDarkTheme ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={submitReply}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                disabled={!replyContent.trim()}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}