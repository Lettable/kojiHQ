'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import Header from '@/partials/Header'
import MarkdownWithEmojis from '@/partials/MarkdownWithEmojis'
import { Calendar, MessageCircle, FileText, Award, ThumbsUp, Activity } from 'lucide-react'
import { Clipboard, CoinsIcon } from 'lucide-react'
import { FaCoins } from 'react-icons/fa'
import { FaTelegram, FaDiscord } from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import { FaBan } from 'react-icons/fa'

export default function ForumUserProfile() {
    const [userData, setUserData] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [emojis, setEmojis] = useState()
    const router = useRouter()
    const { toast } = useToast()
    const pathname = usePathname()

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                setIsLoggedIn(true)
                const decoded = jwtDecode(token)
                setCurrentUser(decoded)

                try {
                    const identifier = pathname.split("/")[2]
                    const isId = /^[0-9a-fA-F]{24}$/.test(identifier)
                    const apiEndpoint = isId ? `/api/user?id=${identifier}&token=${token}` : `/api/user?username=${identifier.toLowerCase()}&token=${token}`
                    const response = await fetch(apiEndpoint)
                    if (!response.ok) throw new Error('Failed to fetch user data')
                    const data = await response.json()
                    setUserData(data.data)
                } catch (error) {
                    console.error('Error fetching user data:', error)
                    toast({
                        title: 'Error',
                        description: 'Failed to load user data',
                        variant: 'destructive',
                    })
                }
            } else {
                toast({
                    title: 'Warning',
                    description: 'You are not signed In.',
                    variant: 'destructive',
                })
            }
        }

        const fetchEmojis = async () => {
            try {
                const response = await fetch('/api/emojis')
                const data = await response.json()
                setEmojis(data)
            } catch (error) {
                console.error('Error fetching emojis:', error)
            }
        }
        fetchEmojis()
        fetchUserData()
    }, [router, toast, pathname])

    function extractSpotifyTrackId(url) {
        try {
            const trackIdMatch = url.match(/\/track\/([^?]+)/);
            return trackIdMatch ? trackIdMatch[1] : null;
        } catch (error) {
            console.error('Invalid URL provided', error);
            return null;
        }
    }

    const getYouTubeVideoId = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const handleRepToggle = async () => {
        if (!userData || !currentUser) return

        try {
            const response = await fetch('/api/user-action/rep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userGiving: currentUser.userId,
                    userToGiveRep: userData.userId,
                }),
            })

            if (!response.ok) throw new Error('Failed to toggle reputation')
            const result = await response.json()

            setUserData(prevData => {
                if (!prevData) return null
                return {
                    ...prevData,
                    stats: {
                        ...prevData.stats,
                        reputation: result.hasGivenRep ? prevData.stats.reputation + 1 : prevData.stats.reputation - 1
                    },
                    reputation: result.hasGivenRep
                        ? [...prevData.reputation, currentUser.userId]
                        : prevData.reputation.filter(id => id !== currentUser.userId)
                }
            })

            toast({
                title: result.hasGivenRep ? 'Reputation Given' : 'Reputation Removed',
                description: result.message,
                variant: 'destructive',
            })
        } catch (error) {
            console.error('Error toggling reputation:', error)
            toast({
                title: 'Error',
                description: 'Failed to update reputation',
                variant: 'destructive',
            })
        }
    }

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

    if (!userData) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/4">
                            <div className="bg-zinc-900/50 rounded-lg p-6 mb-4">
                                <div className="h-6 bg-zinc-800 rounded mb-4 animate-pulse"></div>
                                <div className="space-y-3">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="flex items-center">
                                            <div className="w-4 h-4 bg-zinc-800 rounded mr-2 animate-pulse"></div>
                                            <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <div className="bg-zinc-900/50 rounded-lg p-6 mb-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-24 h-24 bg-zinc-800 rounded-full mr-4 animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-8 bg-zinc-800 rounded w-1/2 mb-2 animate-pulse"></div>
                                        <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="bg-zinc-900/50 rounded-lg p-4">
                                            <div className="h-5 bg-zinc-800 rounded w-1/2 mb-2 animate-pulse"></div>
                                            <div className="h-4 bg-zinc-800 rounded w-1/4 animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/4">
                            <div className="bg-zinc-900/50 rounded-lg p-6 mb-6">
                                <div className="h-6 bg-zinc-800 rounded mb-4 animate-pulse"></div>
                                <div className="space-y-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i}>
                                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2 animate-pulse"></div>
                                            <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse"></div>
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

    const userScore = userData.stats.posts * 2 + userData.stats.threads * 5 + userData.stats.reputation * 10
    const videoId = getYouTubeVideoId(userData.favYtVideo);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header
                avatar={currentUser?.profilePic}
                userId={currentUser?.userId}
                currentPage="/profile"
                isDarkTheme={isDarkTheme}
                toggleTheme={() => setIsDarkTheme(!isDarkTheme)}
                isLoggedIn={isLoggedIn}
                isPremium={userData.isPremium}
            />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/4">
                        <Card className='bg-zinc-900/50 border-0 mb-4 text-zinc-200'>
                            <CardHeader>
                                <CardTitle>About {userData.username}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>Joined on {new Date(userData.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        <span>{userData.stats.posts} post(s)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>{userData.stats.threads} thread(s)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Award className="mr-2 h-4 w-4" />
                                        <span>Level {Math.floor(userData.stats.posts / 10) + 1}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Award className="mr-2 h-4 w-4" />
                                        <span>Overall Score {userScore}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaCoins className="mr-2 h-4 w-4" />
                                        <span>Credits: {userData.credits.toFixed(2)}</span>
                                    </div>
                                    {userData.telegramUID && userData.telegramUID.trim() !== "" ? (
                                        <div className="flex items-center">
                                            <FaTelegram className="mr-2 h-4 w-4" />
                                            <span>Telegram UID: {userData.telegramUID}</span>
                                        </div>
                                    ) :  null}
                                    {userData.discordId && userData.discordId.trim() !== "" ? (
                                        <div className="flex items-center">
                                            <FaDiscord className="mr-2 h-4 w-4" />
                                            <span>Discord UID: {userData.discordId}</span>
                                        </div>
                                    ) :  null}

                                    {/* BTC Address with Copy Function */}
                                    {userData.btcAddress && userData.btcAddress.length > 0 && (
                                        <div className="flex items-center">
                                            <FileText className="mr-2 h-4 w-4 text-zinc-300" />
                                            <span className="mr-2 truncate text-zinc-300">{`${userData.btcAddress.slice(0, 6)}...${userData.btcAddress.slice(-4)}`}</span>
                                            <button
                                                className="bg-transparent hover:bg-zinc-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(userData.btcAddress);
                                                    toast({
                                                        title: "Copied!",
                                                        description: "BTC Address has been copied to clipboard!",
                                                        variant: "destructive",
                                                    });
                                                }}
                                            >
                                                <Clipboard className="h-4 w-4 text-zinc-300 hover:text-white" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 text-white border-0 shadow-lg rounded-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Recent Reputation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[200px] overflow-y-auto">
                                    {userData.reputationGivers.map((giver) => (
                                        <div key={giver.userId} className="flex items-center mb-4">
                                            <Avatar className="w-10 h-10 mr-3">
                                                <AvatarImage src={giver.profilePic} alt={giver.username} />
                                                <AvatarFallback>{giver.username[0]}</AvatarFallback>
                                            </Avatar>
                                            <a href={`/user/${giver.username}`} className='text-white hover:text-blue-400 transition-colors duration-200'>
                                                <span className={`font-medium ${giver.usernameEffect}`}>{giver.username}</span> {renderTextWithEmojis(giver.statusEmoji, emojis)}
                                            </a>
                                            <hr className='my-2 border-zinc-700' />
                                        </div>
                                    ))}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Center Column - User Stats and Groups */}
                    <div className="lg:w-1/2">
                        <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-6">
                            <CardContent className="pt-6">
                                <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-4">
                                    <CardContent className="pt-6" style={
                                        userData.bannerImg && userData.bannerImg.trim() !== ""
                                            ? {
                                                background: `url(${userData.bannerImg}) no-repeat`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                width: "100%",
                                                borderRadius: "16px",
                                                opacity: 0.8,
                                            }
                                            : {}
                                    }>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Avatar className="w-24 h-24 mr-4">
                                                    <AvatarImage
                                                        src={
                                                            userData.isBanned
                                                                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2-flKQOIE8ribInudJWpIsy94v1B7LMCemuBf8RcjpIY1Pt3hLHZR5r78rXBFW0cIhVg&usqp=CAU"
                                                                : userData.profilePicture
                                                        }
                                                        alt={userData.username}
                                                    />
                                                    <AvatarFallback>{userData.username[0]}</AvatarFallback>
                                                </Avatar>

                                                <div className="flex flex-col">
                                                    {userData.isBanned ? (
                                                        <div className="text-2xl font-bold line-through text-white flex items-center gap-2">
                                                            {userData.username}
                                                        </div>
                                                    ) : (
                                                        <div className="text-2xl font-bold flex items-center gap-2">
                                                            <span className={userData.isSuspended ? "" : userData.usernameEffect}>
                                                                {userData.username}
                                                            </span>
                                                            {renderTextWithEmojis(userData.statusEmoji, emojis)}
                                                        </div>
                                                    )}

                                                    {!userData.isBanned && (
                                                        <>
                                                            <p className="text-white">
                                                                {userData.bio === "Edit your bio..." ? "Bio not set" : userData.bio}
                                                            </p>
                                                            {userData.isSuspended && (
                                                                <div className="flex items-center gap-2 mt-1 self-start">
                                                                    <span className="text-xs text-white">
                                                                        This user is suspended until {new Date(userData.suspendUntil).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>


                                            {/* Reputation Button */}
                                            {currentUser && currentUser.userId !== userData.userId && (
                                                <div className="flex-shrink-0">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    onClick={handleRepToggle}
                                                                    variant={userData.reputation.includes(currentUser.userId) ? "destructive" : "default"}
                                                                    className={`
                                                                        ${userData.reputation.includes(currentUser.userId)
                                                                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                                            : 'bg-yellow-500 text-black hover:bg-yellow-600'}
                                                                            transition-colors duration-200
                                                                        `}>
                                                                    {userData.reputation.includes(currentUser.userId) ? "Remove Rep" : "Give Rep"}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-zinc-800 border-zinc-700">
                                                                <p className="text-white">
                                                                    {userData.reputation.includes(currentUser.userId)
                                                                        ? "Remove your reputation point"
                                                                        : "Give a reputation point"}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-2 hover:bg-zinc-900/70 transition-all duration-300 backdrop-blur-sm">
                                        <CardContent className="pt-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ThumbsUp className="h-4 w-4 text-yellow-500" />
                                                    <p className="font-semibold">Reputation</p>
                                                </div>
                                                <p className='text-2xl font-bold text-white/80'>{userData.stats.reputation}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-2 hover:bg-zinc-900/70 transition-all duration-300 backdrop-blur-sm">
                                        <CardContent className="pt-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FileText className="h-4 w-4 text-yellow-500" />
                                                    <p className="font-semibold">Threads</p>
                                                </div>
                                                <p className='text-2xl font-bold text-white/80'>{userData.stats.threads}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-2 hover:bg-zinc-900/70 transition-all duration-300 backdrop-blur-sm">
                                        <CardContent className="pt-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FileText className="h-4 w-4 text-yellow-500" />
                                                    <p className="font-semibold">Posts</p>
                                                </div>
                                                <p className='text-2xl font-bold text-white/80'>{userData.stats.posts}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-2 hover:bg-zinc-900/70 transition-all duration-300 backdrop-blur-sm">
                                        <CardContent className="pt-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaCoins className="h-4 w-4 text-yellow-500" />
                                                    <p className="font-semibold">Credits</p>
                                                </div>
                                                <p className='text-2xl font-bold text-white/80'>{userData.credits.toFixed(2)}</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                </div>
                                <div className="mb-4">
                                    <p className="font-semibold mb-2">Groups</p>
                                    <div className="flex flex-wrap gap-2">
                                        {userData.groups.map((group, index) => (
                                            <img
                                                key={index} // Add a key for each mapped element
                                                src={`/groupimgs/${group.groupName.toLowerCase()}.png`}
                                                alt={group.groupName}
                                                style={{ width: '150px', height: '50px' }} // Set inline styles
                                                className="mr-1" // Keep margin class if needed
                                            />
                                        ))}
                                    </div>
                                </div>
                                {userData.signature &&
                                    <div>
                                        <p className="font-semibold mb-2">Signature</p>
                                        <MarkdownWithEmojis content={userData.signature} />
                                    </div>}
                                {userData.favYtVideo && (
                                    <Card className="bg-zinc-900/50 text-white border-0 mt-4 shadow-lg mb-4">
                                        <CardContent className="pt-6">
                                            <p className="font-semibold mb-4">Favorite Video</p>
                                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                                {videoId ? (
                                                    <iframe
                                                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        title="YouTube video"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <p className="text-gray-400 text-center">Nigga set Invalid YouTube video link.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:w-1/4">
                        <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-6 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px] overflow-y-auto pr-4">
                                    {userData.activity.threads.length > 0 || userData.activity.posts.length > 0 ? (
                                        <>
                                            {userData.activity.threads.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-lg mb-2 text-yellow-500">Threads</h4>
                                                    {userData.activity.threads.map((thread) => (
                                                        <div key={thread._id} className="mb-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200">
                                                            <a href={`/thread/${thread._id}`} className='text-white hover:text-yellow-500 transition-colors duration-200'>
                                                                <h3 className="font-semibold">{thread.title}</h3>
                                                            </a>
                                                            <p className="text-sm text-gray-400">
                                                                {new Date(thread.createdAt).toLocaleDateString()}
                                                            </p>
                                                            <p className="text-sm mt-1 text-gray-300">{renderTextWithEmojis(thread.content.substring(0, 100), emojis)}...</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {userData.activity.posts.length > 0 && (
                                                <div className="mt-6">
                                                    <h4 className="font-semibold text-lg mb-2 text-yellow-500">Posts</h4>
                                                    {userData.activity.posts.map((post) => (
                                                        <div key={post._id} className="mb-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200">
                                                            <a href={`/thread/${post.threadId}`} className='text-white hover:text-yellow-500 transition-colors duration-200'>
                                                                <h3 className="font-semibold">{post.threadTitle || "Untitled Thread"}</h3>
                                                            </a>
                                                            <p className="text-sm text-gray-400">
                                                                {new Date(post.createdAt).toLocaleDateString()}
                                                            </p>
                                                            <p className="text-sm mt-1 text-gray-300">{renderTextWithEmojis(post.content.substring(0, 100), emojis)}...</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-400 text-center text-sm">
                                            No recent activity yet.
                                        </p>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {userData.favSpotifyTrack && userData.favSpotifyTrack.trim() !== "" ? (
                            <iframe
                                style={{ borderRadius: "12px" }}
                                src={`https://open.spotify.com/embed/track/${extractSpotifyTrackId(userData.favSpotifyTrack)}?utm_source=generator&theme=0`}
                                width="100%"
                                height="152"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                className="mb-6 mt-6"
                            ></iframe>
                        ) : null}



                        <Card className="bg-zinc-900/50 text-white border-0 shadow-lg rounded-lg mb-6">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Latest Visitors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px] overflow-y-auto">
                                    {userData.latestVisitors.length > 0 ? (
                                        userData.latestVisitors.map((visitor) => (
                                            <div key={visitor.userId} className="flex items-center mb-4">
                                                <Avatar className="w-10 h-10 mr-3">
                                                    <AvatarImage src={visitor.profilePic} alt={visitor.username} />
                                                    <AvatarFallback>{visitor.username[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <a href={`/user/${visitor.userId}`} className='text-white hover:text-blue-400 transition-colors duration-200'>
                                                        <span className={`font-medium ${visitor.usernameEffect}`}>{visitor.username}</span> {renderTextWithEmojis(visitor.statusEmoji, emojis)}
                                                    </a>
                                                </div>
                                                <hr className='my-2 border-zinc-700' />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center text-sm">
                                            No recent visitors yet.
                                        </p>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Toaster />
            </main>
        </div>
    )
}