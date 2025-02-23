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
import { Calendar, MessageCircle, FileText, Award, ThumbsUp, Activity, Check, ThumbsDown, Users, Clock, UserX, History, MessageSquare, User, Trophy, Bitcoin, Clipboard, Video } from 'lucide-react'
import { FaCoins } from 'react-icons/fa'
import { FaTelegram, FaDiscord } from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import { FaBan } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { sendNotification } from '@/lib/utils/notifications'

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
    const [repDialogOpen, setRepDialogOpen] = useState(false)
    const [repType, setRepType] = useState("positive")
    const [repMessage, setRepMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isReputationDialogOpen, setIsReputationDialogOpen] = useState(false)

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

    const handleRepSubmit = async () => {
        if (!userData || !currentUser) return

        try {
            const response = await fetch('/api/user-action/rep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userGiving: currentUser.userId,
                    userToGiveRep: userData.userId,
                    message: repMessage,
                    type: repType
                }),
            })

            const notificationData = {
                senderId: currentUser.userId,
                receiverId: userData.userId,
                type: "rep",
                value: repType
            };

            await sendNotification(notificationData);

            if (!response.ok) throw new Error('Failed to give reputation')
            const result = await response.json()

            setUserData(prevData => ({
                ...prevData,
                stats: {
                    ...prevData.stats,
                    reputation: result.hasGivenRep
                        ? prevData.stats.reputation + (repType === 'positive' ? 1 : -1)
                        : prevData.stats.reputation - (repType === 'positive' ? 1 : -1)
                },
                reputation: result.hasGivenRep
                    ? [...prevData.reputation, currentUser.userId]
                    : prevData.reputation.filter(id => id !== currentUser.userId)
            }))

            toast({
                title: 'Success',
                description: result.message,
                variant: 'default',
            })
            setRepDialogOpen(false)
            setRepMessage("")
            setRepType("positive")
        } catch (error) {
            console.error('Error giving reputation:', error)
            toast({
                title: 'Error',
                description: 'Failed to give reputation',
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

    const ReputationCard = () => (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="bg-zinc-900/50 text-white border-0 shadow-lg hover:bg-zinc-900/70 transition-all duration-300 backdrop-blur-sm group cursor-pointer">
                    <CardContent className="pt-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-300">
                                    <ThumbsUp className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="font-medium">Reputation</p>
                                    <p className="text-xs text-zinc-400">Community standing</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-yellow-500">
                                {userData.stats.reputation}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-900/50 text-white max-w-3xl backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        Reputation History
                    </DialogTitle>
                    <div className="text-sm text-muted-foreground flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 rounded-lg">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <span className="text-white font-medium">{userData.stats.reputation}</span>
                            <span className="text-zinc-400">Total Reputation</span>
                        </div>
                        <div className="h-6 w-px bg-zinc-800/50"></div>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/5 rounded-lg">
                                <ThumbsUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-500 font-medium">
                                    +{userData.reputationGivers?.filter(r => r.type === 'positive').length || 0}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/5 rounded-lg">
                                <ThumbsDown className="h-4 w-4 text-red-500" />
                                <span className="text-red-500 font-medium">
                                    -{userData.reputationGivers?.filter(r => r.type === 'negative').length || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="mt-6 h-[500px] pr-4">
                    {userData.reputationGivers && userData.reputationGivers.length > 0 ? (
                        <div className="space-y-4">
                            {userData.reputationGivers.map((giver, index) => (
                                <div
                                    key={index}
                                    className={`
                                        relative rounded-lg border backdrop-blur-sm transition-colors duration-200
                                        ${giver.type === 'positive'
                                            ? 'border-green-500/20 bg-green-500/5 hover:bg-green-500/10'
                                            : 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10'}
                                    `}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-10 w-10 ring-2 ring-zinc-800">
                                                <AvatarImage src={giver.profilePic} />
                                                <AvatarFallback>{giver.username[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <a
                                                        href={`/user/${giver.username}`}
                                                        className={`font-medium hover:underline ${giver.usernameEffect}`}
                                                    >
                                                        {giver.username}
                                                    </a>
                                                    <Badge
                                                        variant={giver.type === 'positive' ? 'success' : 'destructive'}
                                                        className={`
                                                            px-2 py-0.5 text-xs font-medium
                                                            ${giver.type === 'positive'
                                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                                : 'bg-red-500/10 text-red-500 border-red-500/20'}
                                                        `}
                                                    >
                                                        {giver.type === 'positive' ? '+1' : '-1'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-zinc-300 break-words">
                                                    {giver.message || "No message provided"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Clock className="h-3 w-3 text-zinc-500" />
                                                    <span className="text-xs text-zinc-500">
                                                        {new Date(giver.givenAt).toLocaleDateString()} at{' '}
                                                        {new Date(giver.givenAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`
                                            absolute top-4 right-4 h-2 w-2 rounded-full
                                            ${giver.type === 'positive' ? 'bg-green-500' : 'bg-red-500'}
                                        `}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Award className="h-12 w-12 text-zinc-700 mb-3" />
                            <p className="text-zinc-500 text-center">No reputation history yet</p>
                            <p className="text-zinc-600 text-sm text-center mt-1">
                                Be active in the community to earn reputation
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );

    const ReputationDialog = () => {
        const existingRep = userData.reputationGivers?.find(
            rep => rep.userId === currentUser?.userId
        );

        const [localRepType, setLocalRepType] = useState('positive');
        const [localRepMessage, setLocalRepMessage] = useState('');
        const [open, setOpen] = useState(false);

        const handleOpenChange = (newOpen) => {
            setOpen(newOpen);
            if (!newOpen) {
                setLocalRepType('positive');
                setLocalRepMessage('');
            }
        };

        const handleLocalSubmit = async () => {
            setIsSubmitting(true);
            try {
                const response = await fetch('/api/user-action/rep', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userGiving: currentUser.userId,
                        userToGiveRep: userData.userId,
                        message: localRepMessage,
                        type: localRepType
                    }),
                });

                if (!response.ok) throw new Error('Failed to give reputation');
                const result = await response.json();

                setUserData(prevData => ({
                    ...prevData,
                    stats: {
                        ...prevData.stats,
                        reputation: result.hasGivenRep
                            ? prevData.stats.reputation + (localRepType === 'positive' ? 1 : -1)
                            : prevData.stats.reputation - (localRepType === 'positive' ? 1 : -1)
                    },
                    reputationGivers: result.hasGivenRep
                        ? [...(prevData.reputationGivers || []), {
                            userId: currentUser.userId,
                            username: currentUser.username,
                            profilePic: currentUser.profilePic,
                            message: localRepMessage,
                            type: localRepType,
                            givenAt: new Date()
                        }]
                        : (prevData.reputationGivers || []).filter(rep => rep.userId !== currentUser.userId)
                }));

                toast({
                    title: 'Success',
                    description: result.message,
                    variant: 'default',
                });
                setOpen(false);
            } catch (error) {
                console.error('Error giving reputation:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to give reputation',
                    variant: 'destructive',
                });
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        variant={existingRep ? "destructive" : "default"}
                        className={`
                            ${existingRep
                                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                                : 'bg-yellow-500 text-black hover:bg-yellow-600'}
                                transition-colors duration-200
                        `}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                                {existingRep ? 'Removing...' : 'Submitting...'}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                {existingRep ? (
                                    <>
                                        <UserX className="h-4 w-4 mr-2" />
                                        Remove Reputation
                                    </>
                                ) : (
                                    <>
                                        <Award className="h-4 w-4 mr-2" />
                                        Give Reputation
                                    </>
                                )}
                            </div>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>
                            {existingRep ? 'Remove Reputation' : 'Give Reputation'}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            {existingRep
                                ? 'Are you sure you want to remove your reputation?'
                                : 'Choose the type of reputation and add a message'}
                        </DialogDescription>
                    </DialogHeader>
                    {!existingRep ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setLocalRepType('positive')}
                                    className={`
                                        relative p-4 rounded-lg border-2 transition-all duration-200
                                        ${localRepType === 'positive'
                                            ? 'border-yellow-500 bg-yellow-500/10'
                                            : 'border-zinc-700 bg-zinc-800/50 hover:border-yellow-500/50'}
                                    `}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`
                                            p-3 rounded-full transition-colors duration-200
                                            ${localRepType === 'positive'
                                                ? 'bg-yellow-500/20'
                                                : 'bg-zinc-700'}
                                        `}>
                                            <ThumbsUp className={`
                                                w-6 h-6 transition-colors duration-200
                                                ${localRepType === 'positive'
                                                    ? 'text-yellow-500'
                                                    : 'text-zinc-400'}
                                            `} />
                                        </div>
                                        <span className={`
                                            font-medium transition-colors duration-200
                                            ${localRepType === 'positive'
                                                ? 'text-yellow-500'
                                                : 'text-zinc-400'}
                                        `}>
                                            Positive
                                        </span>
                                        <span className={`
                                            text-sm transition-colors duration-200
                                            ${localRepType === 'positive'
                                                ? 'text-yellow-500/70'
                                                : 'text-zinc-500'}
                                        `}>
                                            +1 Reputation
                                        </span>
                                    </div>
                                    {localRepType === 'positive' && (
                                        <div className="absolute -top-2 -right-2">
                                            <div className="bg-yellow-500 rounded-full p-1">
                                                <Check className="w-3 h-3 text-black" />
                                            </div>
                                        </div>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setLocalRepType('negative')}
                                    className={`
                                        relative p-4 rounded-lg border-2 transition-all duration-200
                                        ${localRepType === 'negative'
                                            ? 'border-red-500 bg-red-500/10'
                                            : 'border-zinc-700 bg-zinc-800/50 hover:border-red-500/50'}
                                    `}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`
                                            p-3 rounded-full transition-colors duration-200
                                            ${localRepType === 'negative'
                                                ? 'bg-red-500/20'
                                                : 'bg-zinc-700'}
                                        `}>
                                            <ThumbsDown className={`
                                                w-6 h-6 transition-colors duration-200
                                                ${localRepType === 'negative'
                                                    ? 'text-red-500'
                                                    : 'text-zinc-400'}
                                            `} />
                                        </div>
                                        <span className={`
                                            font-medium transition-colors duration-200
                                            ${localRepType === 'negative'
                                                ? 'text-red-500'
                                                : 'text-zinc-400'}
                                        `}>
                                            Negative
                                        </span>
                                        <span className={`
                                            text-sm transition-colors duration-200
                                            ${localRepType === 'negative'
                                                ? 'text-red-500/70'
                                                : 'text-zinc-500'}
                                        `}>
                                            -1 Reputation
                                        </span>
                                    </div>
                                    {localRepType === 'negative' && (
                                        <div className="absolute -top-2 -right-2">
                                            <div className="bg-red-500 rounded-full p-1">
                                                <Check className="w-3 h-3 text-black" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </div>

                            <Textarea
                                placeholder="Enter your reputation message..."
                                value={localRepMessage}
                                onChange={(e) => setLocalRepMessage(e.target.value)}
                                className={`
                                    w-full min-h-[100px] bg-zinc-800 border-2 rounded-lg p-3 
                                    transition-colors duration-200
                                    ${localRepType === 'positive'
                                        ? 'focus:border-yellow-500/50'
                                        : 'focus:border-red-500/50'}
                                    ${localRepType === 'positive'
                                        ? 'border-yellow-500/20'
                                        : 'border-red-500/20'}
                                `}
                            />
                        </div>
                    ) : (
                        <div className="text-zinc-400 mb-4">
                            This will remove your {existingRep.type === 'positive' ? '+1' : '-1'} reputation from {userData.username}.
                        </div>
                    )}
                    <Button
                        onClick={handleLocalSubmit}
                        disabled={isSubmitting}
                        className={`w-full ${existingRep
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-yellow-500 hover:bg-yellow-600'} text-black`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                                {existingRep ? 'Removing...' : 'Submitting...'}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                {existingRep ? (
                                    <>
                                        <UserX className="h-4 w-4 mr-2" />
                                        Remove Reputation
                                    </>
                                ) : (
                                    <>
                                        <Award className="h-4 w-4 mr-2" />
                                        Give Reputation
                                    </>
                                )}
                            </div>
                        )}
                    </Button>
                </DialogContent>
            </Dialog>
        );
    };

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
                {/* Ban Notice - Moved to top */}
                {userData.isBanned && (
                    <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                        <div className="flex items-center space-x-3">
                            <FaBan className="h-6 w-6 text-red-500" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-500">Account Permanently Banned</h3>
                                <p className="text-zinc-300">This user has been permanently banned from the platform.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Grid Layout */}
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${userData.isBanned ? 'opacity-50 pointer-events-none' : ''}`}>
                    {/* Main Profile Section - Spans 8 columns */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Profile Banner Card */}
                        <Card className="bg-zinc-900/50 text-white border-0 shadow-lg backdrop-blur-sm overflow-hidden">
                            <CardContent
                                className="pt-6 relative"
                                style={
                                    userData.bannerImg && userData.bannerImg.trim() !== "" && !userData.isBanned
                                        ? {
                                            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${userData.bannerImg}) no-repeat center/cover`,
                                            minHeight: "200px",
                                        }
                                        : {
                                            background: "rgba(24, 24, 27, 0.05)",
                                            minHeight: "200px",
                                        }
                                }
                            >
                                <div className="flex items-start justify-between relative z-10 p-6">
                                    <div className="flex items-start gap-6">
                                        <Avatar className={`w-28 h-28 ring-4 ${userData.isBanned ? 'grayscale ring-red-500/20' : 'ring-yellow-500/30'} ring-offset-4 ring-offset-black/50 transition-all duration-300 shadow-xl`}>
                                            <AvatarImage
                                                src={userData.isBanned
                                                    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2-flKQOIE8ribInudJWpIsy94v1B7LMCemuBf8RcjpIY1Pt3hLHZR5r78rXBFW0cIhVg&usqp=CAU"
                                                    : userData.profilePicture
                                                }
                                                alt={userData.username}
                                                className={`${userData.isBanned ? 'opacity-50' : ''} object-cover`}
                                            />
                                            <AvatarFallback>{userData.username[0]}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col mt-2">
                                            <div className={`text-3xl font-bold flex items-center gap-3 ${userData.isBanned ? 'line-through text-red-500' : ''}`}>
                                                <span className={`${userData.isBanned ? '' : userData.usernameEffect} transition-all duration-300`}>
                                                    {userData.username}
                                                </span>
                                                {!userData.isBanned && renderTextWithEmojis(userData.statusEmoji, emojis)}
                                            </div>

                                            {!userData.isBanned && (
                                                <>
                                                    <p className="text-lg text-zinc-300 mt-2">
                                                        {userData.bio === "Edit your bio..." ? "Bio not set" : userData.bio}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-3">
                                                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                            <Calendar className="w-4 h-4" />
                                                            Joined {new Date(userData.createdAt).toLocaleDateString()}
                                                        </div>
                                                        {userData.isSuspended && (
                                                            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                                                                <AlertCircle className="w-4 h-4" />
                                                                Suspended until {new Date(userData.suspendUntil).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reputation Button */}
                                    {currentUser && currentUser.userId !== userData.userId && !userData.isBanned && (
                                        <div className="flex-shrink-0 flex flex-col gap-2">
                                            <Button
                                                variant="default"
                                                className="bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-800/50 transition-colors duration-200"
                                                onClick={() => {
                                                    fetch('/api/start-chat', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                                                        },
                                                        body: JSON.stringify({
                                                            starterId: currentUser.userId,
                                                            recipientId: userData.userId
                                                        })
                                                    })
                                                        .then(response => response.json())
                                                        .then(data => {
                                                            if (data.success) {
                                                                window.location.href = `/chat?user=${userData.userId}`;
                                                            } else {
                                                                toast({
                                                                    title: "Error",
                                                                    description: "Failed to start chat",
                                                                    variant: "destructive",
                                                                });
                                                            }
                                                        })
                                                        .catch(error => {
                                                            console.error('Error starting chat:', error);
                                                            toast({
                                                                title: "Error",
                                                                description: "Failed to start chat",
                                                                variant: "destructive",
                                                            });
                                                        });
                                                }}
                                            >
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Message
                                            </Button>
                                            <ReputationDialog />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ReputationCard />
                            {[
                                {
                                    title: "Threads",
                                    value: userData.stats.threads,
                                    icon: FileText,
                                    color: "blue",
                                    description: "Total threads"
                                },
                                {
                                    title: "Posts",
                                    value: userData.stats.posts,
                                    icon: MessageCircle,
                                    color: "green",
                                    description: "Total posts"
                                },
                                {
                                    title: "Credits",
                                    value: userData.credits.toFixed(2),
                                    icon: FaCoins,
                                    color: "purple",
                                    description: "Available balance"
                                }
                            ].map((stat, index) => (
                                <Card
                                    key={index}
                                    className="bg-zinc-900/50 text-white border-0 shadow-lg hover:bg-zinc-900/70 transition-all duration-300 backdrop-blur-sm group"
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`p-2.5 rounded-lg bg-${stat.color}-500/10 group-hover:bg-${stat.color}-500/20 transition-colors duration-300`}>
                                                    <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{stat.title}</p>
                                                    <p className="text-xs text-zinc-400">{stat.description}</p>
                                                </div>
                                            </div>
                                            <p className={`text-2xl font-bold text-${stat.color}-500`}>
                                                {stat.value}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Groups Section - Moved up */}
                        <Card className="bg-zinc-900/50 text-white border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-yellow-500" />
                                    Groups
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-3">
                                    {userData.groups.map((group, index) => {
                                        const groupKey = group.groupName.toLowerCase();
                                        const imageUrl = groupData[groupKey];
                                        return (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={imageUrl}
                                                    alt={group.groupName}
                                                    style={{ width: '150px', height: '50px' }}
                                                    className="rounded-md transition-transform duration-200 group-hover:scale-105 group-hover:opacity-70"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:cursor-default group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                                                    <span className="text-white text-lg font-medium uppercase">{group.groupName}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity - Moved from sidebar */}
                        <Card className="bg-zinc-900/50 text-white border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <History className="h-5 w-5 text-yellow-500" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {userData.activity.threads.length > 0 || userData.activity.posts.length > 0 ? (
                                    <div className="space-y-4">
                                        {userData.activity.threads.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-zinc-400 mb-2">Latest Threads</h4>
                                                <div className="space-y-2">
                                                    {userData.activity.threads.slice(0, 3).map((thread) => (
                                                        <a
                                                            key={thread._id}
                                                            href={`/thread/${thread._id}`}
                                                            className="block p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70 transition-all duration-200"
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <MessageSquare className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                                                                <div className="min-w-0">
                                                                    <h3 className="font-medium text-sm text-white line-clamp-1">
                                                                        {thread.title}
                                                                    </h3>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Clock className="h-3 w-3 text-zinc-500" />
                                                                        <span className="text-xs text-zinc-500">
                                                                            {new Date(thread.createdAt).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {userData.activity.posts.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-zinc-400 mb-2">Latest Posts</h4>
                                                <div className="space-y-2">
                                                    {userData.activity.posts.slice(0, 3).map((post) => (
                                                        <a
                                                            key={post._id}
                                                            href={`/thread/${post.threadId}`}
                                                            className="block p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70 transition-all duration-200"
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <MessageCircle className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                                                                <div className="min-w-0">
                                                                    <h3 className="font-medium text-sm text-white line-clamp-1">
                                                                        {post.threadTitle || "Untitled Thread"}
                                                                    </h3>
                                                                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                                                                        {renderTextWithEmojis(post.content, emojis)}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Clock className="h-3 w-3 text-zinc-500" />
                                                                        <span className="text-xs text-zinc-500">
                                                                            {new Date(post.createdAt).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <History className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                                        <p className="text-sm text-zinc-500">No recent activity</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Signature Section */}
                        {userData.signature && (
                            <Card className="bg-zinc-900/50 text-white border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-yellow-500" />
                                        Signature
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-invert max-w-none">
                                        <MarkdownWithEmojis content={userData.signature} />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar - Spans 4 columns */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* About User Card */}
                        <Card className="bg-zinc-900/50 text-white border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-yellow-500" />
                                    About {userData.username}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Join Date */}
                                    <div className="flex items-center p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70  transition-all duration-200">
                                        <Calendar className="mr-3 h-4 w-4 text-yellow-500" />
                                        <div>
                                            <span className="text-sm text-zinc-400">Joined</span>
                                            <p className="text-white">{new Date(userData.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Posts & Threads */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70  transition-all duration-200">
                                            <MessageCircle className="mr-3 h-4 w-4 text-yellow-500" />
                                            <div>
                                                <span className="text-sm text-zinc-400">Posts</span>
                                                <p className="text-white">{userData.stats.posts}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70  transition-all duration-200">
                                            <FileText className="mr-3 h-4 w-4 text-yellow-500" />
                                            <div>
                                                <span className="text-sm text-zinc-400">Threads</span>
                                                <p className="text-white">{userData.stats.threads}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Level & Score */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70  transition-all duration-200">
                                            <Award className="mr-3 h-4 w-4 text-yellow-500" />
                                            <div>
                                                <span className="text-sm text-zinc-400">Level</span>
                                                <p className="text-white">{Math.floor(userData.stats.posts / 10) + 1}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70  transition-all duration-200">
                                            <Trophy className="mr-3 h-4 w-4 text-yellow-500" />
                                            <div>
                                                <span className="text-sm text-zinc-400">Score</span>
                                                <p className="text-white">{userScore}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Credits */}
                                    <div className="flex items-center p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70  transition-all duration-200">
                                        <FaCoins className="mr-3 h-4 w-4 text-yellow-500" />
                                        <div>
                                            <span className="text-sm text-zinc-400">Credits</span>
                                            <p className="text-white">{userData.credits.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    {(userData.telegramUID || userData.discordId) && (
                                        <div className="grid grid-cols-1 gap-3">
                                            {userData.telegramUID && userData.telegramUID.trim() !== "" && (
                                                <div className="flex items-center p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70  transition-all duration-200">
                                                    <FaTelegram className="mr-3 h-4 w-4 text-[#0088cc]" />
                                                    <div>
                                                        <span className="text-sm text-zinc-400">Telegram</span>
                                                        <p className="text-white">{userData.telegramUID}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {userData.discordId && userData.discordId.trim() !== "" && (
                                                <div className="flex items-center p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70  transition-all duration-200">
                                                    <FaDiscord className="mr-3 h-4 w-4 text-[#5865F2]" />
                                                    <div>
                                                        <span className="text-sm text-zinc-400">Discord</span>
                                                        <p className="text-white">{userData.discordId}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* BTC Address */}
                                    {userData.btcAddress && userData.btcAddress.length > 0 && (
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70  transition-all duration-200 group">
                                            <div className="flex items-center flex-1 min-w-0">
                                                <Bitcoin className="mr-3 h-4 w-4 text-[#F7931A]" />
                                                <div className="overflow-hidden">
                                                    <span className="text-sm text-zinc-400 block">BTC Address</span>
                                                    <p className="text-white truncate">
                                                        {`${userData.btcAddress.slice(0, 6)}...${userData.btcAddress.slice(-4)}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                className="ml-2 p-2 rounded-full bg-zinc-700/50 hover:bg-zinc-700 transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(userData.btcAddress);
                                                    toast({
                                                        title: "Copied!",
                                                        description: "BTC Address has been copied to clipboard",
                                                        variant: "success",
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

                        {/* Latest Visitors */}
                        <Card className="bg-zinc-900/50 text-white border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5 text-yellow-500" />
                                    Latest Visitors
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {userData.latestVisitors.length > 0 ? (
                                    <div className="space-y-3">
                                        {userData.latestVisitors.map((visitor) => (
                                            <div
                                                key={visitor.userId}
                                                className="flex items-center p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/70 transition-all duration-200"
                                            >
                                                <Avatar className="h-10 w-10 border-2 border-zinc-800">
                                                    <AvatarImage src={visitor.profilePic} alt={visitor.username} />
                                                    <AvatarFallback>{visitor.username[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="ml-3 min-w-0 flex items-center gap-2">
                                                    <a
                                                        href={`/user/${visitor.userId}`}
                                                        className={`font-medium hover:underline ${visitor.usernameEffect}`}
                                                    >
                                                        {visitor.username}
                                                    </a>
                                                    {visitor.statusEmoji && (
                                                        <div className="ml-auto">
                                                            {renderTextWithEmojis(visitor.statusEmoji, emojis)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <User className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                                        <p className="text-zinc-500">No recent visitors</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Spotify Track - If exists */}
                        {userData.favSpotifyTrack && !userData.isBanned && (
                            <iframe
                                style={{ borderRadius: "12px" }}
                                src={`https://open.spotify.com/embed/track/${extractSpotifyTrackId(userData.favSpotifyTrack)}?utm_source=generator&theme=0`}
                                width="100%"
                                height="152"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            ></iframe>
                        )}

                        {/* Favorite Video - Moved to sidebar */}
                        {userData.favYtVideo && (
                            <Card className="bg-zinc-900/50 text-white border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Video className="h-5 w-5 text-yellow-500" />
                                        Favorite Video
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
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
                                            <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-zinc-800/50 flex items-center justify-center">
                                                <p className="text-zinc-400">Invalid YouTube video link</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
                <Toaster />
            </main>
        </div>
    )
}