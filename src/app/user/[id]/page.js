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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const groupData = {
    "admin": "https://images.ctfassets.net/49i3hw7ggo6y/3OkSp11XO91MOQtGUptuVg/25987da20092116b791efd3b3c8f5e21/SyTqJLO.png?fm=webp&w=225&h=75&q=100&fit=fill",
    "contributor": "https://images.ctfassets.net/49i3hw7ggo6y/7sKOblJXtyf8YR1aNp6NXk/78adef95a04390195381a1fca1596313/support.webp?fm=webp&w=225&h=75&q=100&fit=fill",
    "galactic": "https://images.ctfassets.net/49i3hw7ggo6y/5Mh8K3UQyTFfp1sTWpqPcg/40e93b2c7933ec385f4a69b119737cbe/5sNGdAL.png?fm=webp&w=225&h=75&q=100&fit=fill",
    "godlike": "https://images.ctfassets.net/49i3hw7ggo6y/2IL92NOuNK3ufF4JFSMFo/089fb56e993f6a676ae699dc38812e19/fRCBfPu.gif?fm=webp&w=225&h=75&q=100&fit=fill",
    "heaven": "https://images.ctfassets.net/49i3hw7ggo6y/3QsgBLBMNfu1PltPoEWZOT/40eb7e51de1a36a8a577390614839e1c/WPnWq0L.png?fm=webp&w=225&h=75&q=100&fit=fill",
    "infinity": "https://images.ctfassets.net/49i3hw7ggo6y/2LeTt6bXPzHGICIEL5HvVH/8cbb3bf7f0e263f539f4dfd93c47fda5/vkIVNSd.png?fm=webp&w=225&h=75&q=100&fit=fill",
    "member": "https://images.ctfassets.net/49i3hw7ggo6y/623jSob0Jrcm3ZE1MVbzdE/0a1bf5b0bcb589b1179c3209abb5d915/0kkt6E5.gif?fm=webp&w=225&h=75&q=100&fit=fill",
    "mod": "https://images.ctfassets.net/49i3hw7ggo6y/lYIccvwCjhEnkLHFaoX2a/f764d06f2bc9d5bd6ebf5193c5bd5562/5lWeWt2.png?fm=webp&w=225&h=75&q=100&fit=fill",
    "trial": "https://images.ctfassets.net/49i3hw7ggo6y/7ARwDCuCYhErV0PlCzHBXr/479096a0bea3bad91ab2dfb071b3d1e0/fHXLiyP.png?fm=webp&w=225&h=75&q=100&fit=fill",
    "premium": "https://images.ctfassets.net/49i3hw7ggo6y/5l5AwxH2WjSN11MHl4tfgT/42276b950617188b3cb36413ad4023f4/4jnzT1l.png?fm=webp&w=225&h=75&q=100&fit=fill",
    "supreme": "https://images.ctfassets.net/49i3hw7ggo6y/4lUBsvc6yACiX2KiuBDjsc/d4e3a1d497cd99ce388d4ed6f9ae22c3/361Ft8A.png?fm=webp&w=225&h=75&q=100&fit=fill",
    "staff": "https://images.ctfassets.net/49i3hw7ggo6y/2XxGlPPfYa1sLppIinPaU9/286a84a43365ece32959b47b835c6adf/br0lUXL.png?fm=webp&w=225&h=75&q=100&fit=fill",
    "cosmo": "https://images.ctfassets.net/49i3hw7ggo6y/4fgQmj0a3JewpJvHd4y4Uh/8e003ccd8f95f733788d878abf26d1b0/uSU0vt7.gif?fm=webp&w=225&h=75&q=100&fit=fill",
    "cove": "https://images.ctfassets.net/49i3hw7ggo6y/5I6hsCgTiX1keqznJG4cvY/9b8bd7d05136c45360d343d1151d041e/g47n2HH.gif?fm=webp&w=225&h=75&q=100&fit=fill",
    "coolcat": "https://images.ctfassets.net/49i3hw7ggo6y/1cJntr8SpHyMzKIDE4x4No/63a8231b4d80232d97bfa3c1e767f611/g5iepBV.png?fm=webp&w=225&h=75&q=100&fit=fill",
    "comet": "https://images.ctfassets.net/49i3hw7ggo6y/iT7RYxSQnGEzQPI4QeaC9/756939bd02c4681f657616cf9f87cfc6/KKIJfcM.gif?fm=webp&w=225&h=75&q=100&fit=fill",
    "bog": "https://images.ctfassets.net/49i3hw7ggo6y/3emSjA0JzihY44CFZ5I2mq/62cfa2293a39d83005dc92cb3da0baef/1cjcRlE.png?fm=webp&w=225&h=75&q=100&fit=fill"

}

export default function ForumUserProfile() {
    const [userData, setUserData] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [emojis, setEmojis] = useState()
    const router = useRouter()
    const { toast } = useToast()
    const pathname = usePathname()
    const [repMessage, setRepMessage] = useState('');
    const [showRepDialog, setShowRepDialog] = useState(false);

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
        if (!userData || !currentUser) return;

        if (!userData.reputation?.includes(currentUser.userId)) {
            setShowRepDialog(true);
            return;
        }

        submitRep('');
    };

    const submitRep = async (message) => {
        try {
            const response = await fetch('/api/user-action/rep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userGiving: currentUser.userId,
                    userToGiveRep: userData.userId,
                    message: message
                }),
            });

            if (!response.ok) throw new Error('Failed to toggle reputation');
            const result = await response.json();

            setUserData(prevData => {
                if (!prevData) return null;
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
            });

            setShowRepDialog(false);
            setRepMessage('');

            toast({
                title: result.hasGivenRep ? 'Reputation Given' : 'Reputation Removed',
                description: result.message,
                variant: 'default',
            });
        } catch (error) {
            console.error('Error toggling reputation:', error);
            toast({
                title: 'Error',
                description: 'Failed to update reputation',
                variant: 'destructive',
            });
        }
    };

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
                <Header
                    avatar={currentUser?.profilePic}
                    userId={currentUser?.userId}
                    currentPage="/profile"
                    isDarkTheme={isDarkTheme}
                    toggleTheme={() => setIsDarkTheme(!isDarkTheme)}
                    isLoggedIn={isLoggedIn}
                />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/4">
                            <div className="bg-zinc-900/50 rounded-lg p-6 mb-4">
                                <div className="h-7 bg-zinc-800 rounded w-1/2 mb-6 animate-pulse"></div>
                                <div className="space-y-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="w-5 h-5 bg-zinc-800 rounded animate-pulse"></div>
                                            <div className="h-5 bg-zinc-800 rounded w-2/3 animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-zinc-900/50 rounded-lg p-6">
                                <div className="h-7 bg-zinc-800 rounded w-1/2 mb-6 animate-pulse"></div>
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-zinc-800 rounded-full animate-pulse"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-zinc-800 rounded w-1/2 mb-2 animate-pulse"></div>
                                                <div className="h-3 bg-zinc-800 rounded w-1/3 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <div className="bg-zinc-900/50 rounded-lg p-6 mb-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-24 h-24 bg-zinc-800 rounded-lg mr-4 animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-8 bg-zinc-800 rounded w-1/2 mb-3 animate-pulse"></div>
                                        <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="bg-zinc-800/50 rounded-lg p-4">
                                            <div className="h-5 bg-zinc-800 rounded w-1/2 mb-2 animate-pulse"></div>
                                            <div className="h-7 bg-zinc-800 rounded w-1/3 animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <div className="h-6 bg-zinc-800 rounded w-1/4 mb-4 animate-pulse"></div>
                                    <div className="h-20 bg-zinc-800 rounded w-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/4">
                            <div className="bg-zinc-900/50 rounded-lg p-6 mb-6">
                                <div className="h-7 bg-zinc-800 rounded w-1/2 mb-6 animate-pulse"></div>
                                <div className="space-y-6">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="h-5 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                                            <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse"></div>
                                            <div className="h-4 bg-zinc-800 rounded w-full animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-zinc-900/50 rounded-lg p-6">
                                <div className="h-7 bg-zinc-800 rounded w-1/2 mb-6 animate-pulse"></div>
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-zinc-800 rounded-full animate-pulse"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-zinc-800 rounded w-1/2 mb-2 animate-pulse"></div>
                                                <div className="h-3 bg-zinc-800 rounded w-1/3 animate-pulse"></div>
                                            </div>
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
                        <Card className={`bg-zinc-900/50 border-0 mb-4 text-zinc-200 ${userData.isBanned ? 'opacity-50 pointer-events-none' : ''}`}>
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
                                    ) : null}
                                    {userData.discordId && userData.discordId.trim() !== "" ? (
                                        <div className="flex items-center">
                                            <FaDiscord className="mr-2 h-4 w-4" />
                                            <span>Discord UID: {userData.discordId}</span>
                                        </div>
                                    ) : null}

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

                        <Card className={`bg-zinc-900/50 text-white border-0 shadow-lg rounded-lg ${userData.isBanned ? 'opacity-50 pointer-events-none' : ''}`}>
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

                    <div className="lg:w-1/2">
                        {userData.isBanned && (
                            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-4 rounded-md">
                                <div className="container mx-auto flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FaBan className="h-6 w-6 text-red-500" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-red-500">Account Permanently Banned</h3>
                                            <p className="text-zinc-300">This user has been permanently banned from the platform.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Card className={`bg-zinc-900/50 text-white border-0 shadow-lg mb-6 ${userData.isBanned ? 'opacity-50' : ''}`}>
                            <CardContent className="pt-6">
                                <Card className={`bg-zinc-900/50 text-white border-0 shadow-lg mb-4 ${userData.isBanned ? 'grayscale' : ''}`}>
                                    <CardContent className="pt-6" style={
                                        userData.bannerImg && userData.bannerImg.trim() !== "" && !userData.isBanned
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
                                                <Avatar className={`w-24 h-24 mr-4 ${userData.isBanned ? 'grayscale' : ''}`}>
                                                    <AvatarImage
                                                        src={userData.isBanned 
                                                            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2-flKQOIE8ribInudJWpIsy94v1B7LMCemuBf8RcjpIY1Pt3hLHZR5r78rXBFW0cIhVg&usqp=CAU"
                                                            : userData.profilePicture
                                                        }
                                                        alt={userData.username}
                                                        className={userData.isBanned ? 'opacity-50' : ''}
                                                    />
                                                    <AvatarFallback>{userData.username[0]}</AvatarFallback>
                                                </Avatar>

                                                <div className="flex flex-col">
                                                    <div className={`text-2xl font-bold flex items-center gap-2 ${userData.isBanned ? 'line-through text-red-500' : ''}`}>
                                                        <span className={userData.isBanned ? '' : userData.usernameEffect}>
                                                            {userData.username}
                                                        </span>
                                                        {!userData.isBanned && renderTextWithEmojis(userData.statusEmoji, emojis)}
                                                    </div>

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
                                                    {userData.isBanned && (
                                                        <p className="text-red-500 italic mt-1">
                                                            This account has been permanently banned
                                                        </p>
                                                    )}
                                                </div>
                                            </div>


                                            {/* Reputation Button */}
                                            {currentUser && currentUser.userId !== userData.userId && !userData.isBanned && (
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
                                        {userData.groups.map((group, index) => {
                                            const groupKey = group.groupName.toLowerCase();
                                            const imageUrl = groupData[groupKey];

                                            return (
                                                <img
                                                    key={index}
                                                    src={imageUrl}
                                                    alt={group.groupName}
                                                    style={{ width: '150px', height: '50px' }}
                                                    className="mr-1"
                                                />
                                            );
                                        })}

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
                        <Card className={`bg-zinc-900/50 text-white border-0 shadow-lg mb-6 ${userData.isBanned ? 'opacity-50 pointer-events-none' : ''}`}>
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

                        {userData.favSpotifyTrack && userData.favSpotifyTrack.trim() !== "" && !userData.isBanned ? (
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



                        <Card className={`bg-zinc-900/50 text-white border-0 shadow-lg rounded-lg mb-6 ${userData.isBanned ? 'opacity-50 pointer-events-none' : ''}`}>
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
                {showRepDialog && (
                    <Dialog open={showRepDialog} onOpenChange={setShowRepDialog}>
                        <DialogContent className="bg-zinc-900/95 border border-zinc-800 text-white shadow-xl backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
                                    <ThumbsUp className="w-5 h-5 text-yellow-500" />
                                    Give Reputation
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="repMessage" className="text-zinc-400">Message (optional)</Label>
                                    <Textarea
                                        id="repMessage"
                                        placeholder="e.g., +rep very good person"
                                        value={repMessage}
                                        onChange={(e) => setRepMessage(e.target.value)}
                                        className="min-h-[100px] bg-zinc-800/50 border-zinc-700/50 focus:border-yellow-500/50 
                                            placeholder:text-zinc-500 text-white resize-none rounded-xl transition-all duration-200
                                            focus:ring-yellow-500/20 hover:border-yellow-500/30"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setShowRepDialog(false)}
                                    className="bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={() => submitRep(repMessage)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black transition-all duration-200 
                                        rounded-xl px-6 shadow-lg hover:shadow-yellow-500/20"
                                >
                                    Give Rep
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </main>
        </div>
    )
}