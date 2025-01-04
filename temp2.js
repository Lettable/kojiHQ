'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { jwtDecode } from 'jwt-decode'
import Header from '@/partials/Header'
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Heart, MessageCircle, User, FileText, Pencil, LogOut, Trash2, Camera, X, Check, Search, Crown, Smile } from 'lucide-react'
import Image from 'next/image'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { usePathname } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import EnhancedEmojiPicker from '@/components/EmojiPicker'
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const renderTextWithEmojis = (text, emojis) => {
    if (!text || typeof text !== 'string') return text || '';
    if (!emojis || !Array.isArray(emojis)) return text;

    const emojiRegex = /:([\w-]+):/g;
    const parts = text.split(emojiRegex);

    return parts.map((part, index) => {
        if (index % 2 === 0) {
            return part;
        } else {
            const emoji = emojis.find(e => e.emojiTitle === `:${part}:`);
            if (emoji) {
                return (
                    <img
                        key={index}
                        src={emoji.emojiUrl}
                        alt={emoji.emojiTitle}
                        title={emoji.emojiTitle}
                        className="inline-block w-6 h-6"
                    />
                );
            } else {
                return `:${part}:`;
            }
        }
    });
};

function UserProfileContent() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [showProfilePicturePrompt, setShowProfilePicturePrompt] = useState(false)
    const [isEditingUsername, setIsEditingUsername] = useState(false)
    const [isEditingBio, setIsEditingBio] = useState(false)
    const [newUsername, setNewUsername] = useState('')
    const [newBio, setNewBio] = useState('')
    const [profilePicture, setProfilePicture] = useState('')
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [uploadedImage, setUploadedImage] = useState(null)
    const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 1 })
    const [completedCrop, setCompletedCrop] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [baseUrl, setBaseUrl] = useState('')
    const [userId, setUserId] = useState('')
    const [userData, setUserData] = useState(null)
    const [isGuestUser, setIsGuestUser] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredProjects, setFilteredProjects] = useState([])
    const [isEditMode, setIsEditMode] = useState(false)
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const [isPremium, setIsPremium] = useState(false)
    const [lastUsernameChange, setLastUsernameChange] = useState(null)
    const [lastPfpChange, setLastPfpChange] = useState(null)
    const [statusEmoji, setStatusEmoji] = useState('')
    const [isSelectingEmoji, setIsSelectingEmoji] = useState(false)
    const [emojis, setEmojis] = useState([])
    const imageRef = useRef(null)
    const fileInputRef = useRef(null)
    const router = useRouter()
    const pathname = usePathname()
    const { toast } = useToast()

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    useEffect(() => {
        const fetchAndSetData = async () => {
            const token = localStorage.getItem("accessToken")
            if (!token) {
                router.push("/auth")
                return
            }

            try {
                const decoded = jwtDecode(token)
                setCurrentUser(decoded)
                setIsPremium(decoded.isPremium)
                setIsGuestUser(decoded.username === 'Guest')

                const identifier = pathname.split("/")[2]
                setBaseUrl(identifier)

                const isId = /^[0-9a-fA-F]{24}$/.test(identifier)

                let apiEndpoint
                if (isId) {
                    apiEndpoint = `/api/user?id=${identifier}`
                } else {
                    apiEndpoint = `/api/user?username=${identifier.toLowerCase()}`
                }

                if (decoded.userId === identifier || decoded.username.toLowerCase() === identifier.toLowerCase()) {
                    setUserId(decoded.userId)
                    setIsAdmin(true)
                } else {
                    setIsAdmin(false)
                }

                const [userResponse, emojisResponse] = await Promise.all([
                    fetch(apiEndpoint),
                    fetch('/api/emojis')
                ])

                const userData = await userResponse.json()
                const emojisData = await emojisResponse.json()

                if (userData.success) {
                    setUserData(userData.data)
                    setNewUsername(userData.data.username)
                    setNewBio(userData.data.bio)
                    setProfilePicture(userData.data.profilePicture)
                    setFilteredProjects(userData.data.projects)
                    setIsPremium(userData.data.isPremium)
                    setLastUsernameChange(userData.data.lastUsernameChange)
                    setLastPfpChange(userData.data.lastPfpChange)
                    setStatusEmoji(userData.data.statusEmoji || '')

                    const isUserFollowing = userData.data.followers.includes(decoded.userId)
                    setIsFollowing(isUserFollowing)
                } else {
                    console.error("Failed to fetch user data")
                }

                setEmojis(emojisData)
            } catch (error) {
                console.error("Error decoding token or fetching data:", error)
                router.push("/auth")
            }
        }

        fetchAndSetData()
    }, [pathname, router])

    const handleEmojiSelect = async (emoji) => {
        if (isGuestUser) {
            toast({
                title: "Action Not Allowed",
                description: "Guest users cannot set a status emoji.",
                variant: "destructive",
            })
            return
        }
        if (!isPremium && emoji.isPremium) {
            toast({
                title: "Premium Feature",
                description: "Only premium users can use this emoji.",
                variant: "warning",
            })
            return
        }
        try {
            const response = await fetch(`/api/edit-user?action=statusEmoji&id=${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statusEmoji: emoji }),
            })

            const result = await response.json()
            if (result.success) {
                setStatusEmoji(emoji)
                setIsSelectingEmoji(false)
                toast({
                    title: "Status Updated",
                    description: "Your status emoji has been updated.",
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Update Failed",
                    description: "Failed to update status emoji. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error updating status emoji:', error)
            toast({
                title: "Update Failed",
                description: "An error occurred while updating your status emoji.",
                variant: "destructive",
            })
        }
    }

    const canChangeUsername = useCallback(() => {
        if (isPremium) return true
        if (!lastUsernameChange) return true
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return new Date(lastUsernameChange) < oneWeekAgo
    }, [isPremium, lastUsernameChange])

    const canChangePfp = useCallback(() => {
        if (isPremium) return true
        if (!lastPfpChange) return true
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return new Date(lastPfpChange) < oneWeekAgo
    }, [isPremium, lastPfpChange])

    useEffect(() => {
        const sendWebhookNotification = async () => {
            const webhookUrl = 'https://discord.com/api/webhooks/1316066211850620989/_9WGkcypsKTp9KdvRMGFtWQ-eEs8p7HZxwK0XABVOnL8os8wO5hesWHVs_BydHVBN9RA';

            const embed = {
                title: 'Profile Visit Notification',
                description: `User **${currentUser.username}** (ID: ${currentUser.userId}) visited the profile of **${userData.username}** (ID: ${userData.userId}).`,
                color: 3066993,
                fields: [
                    { name: 'Current User', value: currentUser.username, inline: true },
                    { name: 'Visited User', value: userData.username, inline: true },
                    { name: 'Visited User ID', value: userData.userId, inline: true },
                ],
                footer: {
                    text: 'Profile Visit Tracker',
                },
            };

            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        embeds: [embed],
                    }),
                });
            } catch (error) {
                console.error('Error sending webhook:', error);
            }
        };

        sendWebhookNotification();
        if (isPremium) {
            console.log('hey you are a premium user')
        } else {
            console.log('nahh! try again')
        }

        if (lastUsernameChange & lastPfpChange) {
            console.log('this user changed his username last time on', lastUsernameChange)
            console.log('this user changed his pfp last time on', lastPfpChange)
        } else {
            console.log('no changes on pfp detected')
        }

    }, [currentUser, userData, isPremium, lastUsernameChange, lastPfpChange]);


    useEffect(() => {
        if (userData) {
            const filtered = userData.projects.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProjects(filtered);
        }
    }, [searchQuery, userData]);

    const handleProfilePictureChange = (e) => {
        if (isGuestUser) {
            alert('You are a guest user. Please sign in with a real account to manage your profile.')
            return
        }
        if (!canChangePfp()) {
            alert('You can only change your profile picture once a week. Upgrade to premium for unlimited changes!')
            return
        }
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () => setUploadedImage(reader.result))
            reader.readAsDataURL(e.target.files[0])
            setIsUploadingImage(true)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('/auth')
    };

    const handleCropComplete = (crop) => {
        setCompletedCrop(crop)
    }

    const handleReportUser = (userId) => {
        const recipient = "hassanimtiaz7722@gmail.com";
        const subject = encodeURIComponent("User Report");
        const body = encodeURIComponent(`Hello,\n\nI would like to report a user.\n\nVictim ID: ${userId}\n\nPlease look into this issue.\n\nThank you.`);

        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    }


    const handleCropCancel = () => {
        setIsUploadingImage(false)
        setUploadedImage(null)
    }

    const handleViewProject = (id) => {
        router.push(`/project/${id}`)
    }

    const handleCropConfirm = async () => {
        if (isGuestUser) {
            alert('You are a guest user. Please sign in with a real account to manage your profile.');
            return;
        }
        if (imageRef.current && completedCrop) {
            const canvas = document.createElement('canvas');
            const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
            const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
            canvas.width = completedCrop.width;
            canvas.height = completedCrop.height;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                imageRef.current,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                completedCrop.width,
                completedCrop.height
            );

            canvas.toBlob(async (blob) => {
                const base64Image = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.readAsDataURL(blob);
                });

                try {
                    const response = await fetch(`/api/edit-user?action=profilePic&id=${userId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ profilePic: base64Image }),
                    });

                    if (!response.ok) {
                        const text = await response.text();
                        console.error('Failed to update profile picture, non-200 response:', text);
                        return;
                    }

                    const result = await response.json();
                    if (result.success) {
                        setProfilePicture(result.user.profilePic);
                        localStorage.setItem('accessToken', result.accessToken);

                        setCurrentUser((prev) => ({
                            ...prev,
                            profilePic: result.user.profilePic
                        }));
                    } else {
                        console.error('Failed to update profile picture:', result.message);
                    }
                } catch (error) {
                    console.error('Error updating profile picture:', error);
                }
                setIsUploadingImage(false);
                setUploadedImage(null);
            });
        }
    };



    const handleFollowToggle = async () => {
        if (isGuestUser) {
            alert('You are a guest user. Please sign in with a real account to follow users.');
            return;
        }

        try {
            const response = await fetch("/api/user-action/follow-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userFollowing: currentUser.userId,
                    userToFollow: baseUrl,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setIsFollowing(result.isFollowing);
                setUserData(prevData => ({
                    ...prevData,
                    stats: {
                        ...prevData.stats,
                        followers: isFollowing ? prevData.stats.followers - 1 : prevData.stats.followers + 1,
                    },
                }));

                if (!isFollowing) {
                    const notificationResponse = await fetch("/api/notification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            senderId: currentUser.userId,
                            receiverId: baseUrl,
                            type: "follow",
                        }),
                    });

                    const notificationResult = await notificationResponse.json();
                    if (!notificationResult.success) {
                        console.warn("Failed to send follow notification:", notificationResult.message);
                    }
                }
            } else {
                console.error("Failed to follow/unfollow:", result.message);
            }
        } catch (error) {
            console.error("Error in follow/unfollow:", error);
        }
    };

    const handleUsernameEdit = () => {
        if (isGuestUser) {
            alert('You are a guest user. Please sign in with a real account to manage your profile.')
            return
        }
        if (!canChangeUsername()) {
            alert('You can only change your username once a week. Upgrade to premium for unlimited changes!')
            return
        }
        setIsEditingUsername(true)
    }

    const handleUsernameConfirm = async () => {
        if (isGuestUser) {
            alert('You are a guest user. Please sign in with a real account to manage your profile.');
            return;
        }
        if (/^[a-zA-Z0-9_]{1,12}$/.test(newUsername)) {
            try {
                const response = await fetch(`/api/edit-user?action=username&id=${userId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newUsername }),
                });

                const result = await response.json();
                if (result.success) {
                    setUserData((prev) => ({ ...prev, username: newUsername }));
                    localStorage.setItem('accessToken', result.accessToken)
                    setIsEditingUsername(false);
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error updating username:', error);
            }
        } else {
            alert("Username can only contain up to 12 letters, numbers, and underscores.");
        }
    };

    const handleBioEdit = () => {
        if (isGuestUser) {
            alert('You are a guest user. Please sign in with a real account to manage your profile.');
            return;
        }
        setIsEditingBio(true);
    }

    const handleBioConfirm = async () => {
        if (isGuestUser) {
            alert('You are a guest user. Please sign in with a real account to manage your profile.');
            return;
        }

        const bioRegex = isPremium
            ? /^[a-zA-Z0-9_;"',.\/| ]{1,100}$/
            : /^[a-zA-Z0-9_;"', ]{1,50}$/;

        if (bioRegex.test(newBio)) {
            try {
                const response = await fetch(`/api/edit-user?action=bio&id=${userId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newBio }),
                });

                const result = await response.json();
                if (result.success) {
                    setUserData((prev) => ({ ...prev, bio: newBio }));
                    localStorage.setItem('accessToken', result.accessToken);
                    setIsEditingBio(false);
                } else {
                    console.error('Failed to update bio:', result.message);
                }
            } catch (error) {
                console.error('Error updating bio:', error);
            }
        } else {
            alert(
                isPremium
                    ? "Bio can only contain up to 100 characters, including letters, numbers, underscores, and symbols like .com, /, |, etc."
                    : "Bio can only contain up to 50 letters, numbers, and underscores."
            );
        }
    };


    const handleDeleteAccount = async () => {
        if (isGuestUser) {
            alert('You are a guest user. Please sign in with a real account to manage your profile.');
            return;
        }
        try {
            const response = await fetch(`/api/user?id=${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to delete account:", errorText);
                return;
            }

            const result = await response.json();

            if (result.success) {
                localStorage.removeItem('accessToken');
                router.push('/auth')
            } else {
                console.error("Failed to delete account:", result.message);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (isGuestUser) {
            alert('You are a guest user. Please sign in with a real account to manage your projects.');
            return;
        }
        try {
            const response = await fetch(`/api/project-action?id=${projectId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.success) {
                alert('Project has been deleted.')
                setUserData(prevData => ({
                    ...prevData,
                    projects: prevData.projects.filter(project => project.id !== projectId),
                    stats: {
                        ...prevData.stats,
                        projects: prevData.stats.projects - 1
                    }
                }));
                setFilteredProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
            } else {
                console.error('Failed to delete project:', result.message);
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const openFileInput = useCallback(() => {
        if (isGuestUser) {
            alert('You are a guest user. Please sign in with a real account to manage your profile.');
            return;
        }
        fileInputRef.current?.click()
    }, [isGuestUser])

    if (!userData) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }



    return (
        <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header
                avatar={currentUser?.profilePic}
                userId={currentUser?.userId}
                currentPage={pathname}
                isDarkTheme={isDarkTheme}
                toggleTheme={toggleTheme}
            />
            <main className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <section className="text-center mb-12">
                    <div
                        className="relative inline-block"
                        onMouseEnter={() => isAdmin && !isGuestUser && setShowProfilePicturePrompt(true)}
                        onMouseLeave={() => isAdmin && !isGuestUser && setShowProfilePicturePrompt(false)}
                    >
                        <Avatar
                            className={`w-32 h-32 mx-auto mb-4 border-4 ${isPremium ? 'border-yellow-400' : 'border-gray-400'}`}
                            onClick={isAdmin && !isGuestUser ? openFileInput : undefined} // Prevent clicking for non-admins or guests
                        >
                            {profilePicture ? (
                                <AvatarImage src={profilePicture} alt={userData.username} />
                            ) : (
                                <AvatarFallback className={`${isDarkTheme ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'} text-4xl`}>
                                    {userData.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <AnimatePresence>
                            {isAdmin && showProfilePicturePrompt && !isGuestUser && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`absolute inset-0 flex items-center justify-center ${isDarkTheme ? 'bg-black' : 'bg-white'} bg-opacity-50 rounded-full cursor-pointer`}
                                    onClick={openFileInput}
                                >
                                    <Camera className={`w-8 h-8 ${isDarkTheme ? 'text-white' : 'text-black'}`} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePictureChange}
                        />
                    </div>

                    <div className="flex items-center justify-center mb-2">
                        <h1 className="text-3xl font-bold mr-2">{userData.username}</h1>
                        {renderTextWithEmojis(statusEmoji, emojis)}
                        {isAdmin && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`ml-2 hover:bg-${isDarkTheme ? 'white' : 'black'}/10 hover:text-${isDarkTheme ? 'white' : 'black'}`}
                                onClick={() => setIsSelectingEmoji(true)}
                            >
                                <Smile className="h-4 w-4" />
                            </Button>
                        )}
                        {isAdmin && !isGuestUser && (
                            <Button variant="ghost" size="icon" className={`ml-2 hover:bg-${isDarkTheme ? 'white' : 'black'}/10 hover:text-${isDarkTheme ? 'white' : 'black'}`} onClick={handleUsernameEdit}>
                                <Pencil className="h-2 w-2" />
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center justify-center mb-4">
                        <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{userData.bio}</p>
                        {isAdmin && !isGuestUser && (
                            <Button variant="ghost" size="icon" className={`ml-2 hover:bg-${isDarkTheme ? 'white' : 'black'}/10 hover:text-${isDarkTheme ? 'white' : 'black'}`} onClick={handleBioEdit}>
                                <Pencil className="h-2 w-2" />
                            </Button>
                        )}
                    </div>
                    {!isAdmin && (
                        <div className="flex justify-center space-x-4">
                            <Button
                                variant={isFollowing ? "secondary" : "default"}
                                className="bg-yellow-400 text-black hover:bg-yellow-500"
                                onClick={handleFollowToggle}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </Button>
                            <Button variant="outline" onClick={() => handleReportUser(baseUrl)} className={`${isDarkTheme ? 'text-black hover:bg-zinc-200' : 'text-black hover:bg-black/10'}`}>
                                Report
                            </Button>
                        </div>
                    )}
                    {isAdmin && (
                        <div className="flex justify-center space-x-4">
                            <Button variant="outline" className={`${isDarkTheme ? 'bg-black text-white hover:bg-white/10 hover:text-white' : 'bg-white text-black hover:bg-black/10'}`} onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                            {!isGuestUser && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Account
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className={`${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className={`${isDarkTheme ? 'bg-black hover:text-white text-white hover:bg-white/10' : 'bg-white text-black hover:bg-black/10'}`}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteAccount}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    )}
                </section>

                {/* Image Upload Modal */}
                {isUploadingImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className={`${isDarkTheme ? 'bg-black border-white/60' : 'bg-white border-black/60'} h-auto w-auto border-2 p-6 rounded-lg`}>
                            <h2 className="text-xl font-bold mb-4">Crop Your Image</h2>
                            <ReactCrop
                                src={uploadedImage}
                                crop={crop}
                                onChange={(newCrop) => setCrop(newCrop)}
                                onComplete={handleCropComplete}
                                aspect={1}
                            >
                                <img ref={imageRef} src={uploadedImage} className='h-[70vh] w-auto' alt="Upload" />
                            </ReactCrop>
                            <div className="flex justify-end mt-4">
                                <Button variant="outline" onClick={handleCropCancel} className={`mr-2 ${isDarkTheme ? 'border-yellow-400/10 text-white hover:text-white hover:bg-white/10 bg-white/20' : 'border-yellow-400 text-black hover:bg-black/10'}`}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCropConfirm} className={`${isDarkTheme ? 'border-white text-black bg-yellow-400 hover:bg-yellow-400/90' : 'border-black text-white bg-yellow-600 hover:bg-yellow-700'}`}>
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Stats */}
                <section className="grid grid-cols-3 gap-4 mb-12">
                    {Object.entries(userData.stats).map(([key, value]) => (
                        <Card key={key} className={`${isDarkTheme ? 'bg-white/5 text-white border-white/10' : 'bg-black/5 text-black border-black/10'}`}>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <span className="text-2xl font-bold mb-1">{value}</span>
                                <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} capitalize`}>{key}</span>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                {/* Projects Grid */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Projects</h2>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`pl-10 ${isDarkTheme ? 'bg-white/5 border-white/10 focus:border-yellow-400/20 text-white' : 'bg-black/5 border-black/10 focus:border-yellow-600/20 text-black'}`}
                            />
                            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <Card key={project.id} className={`${isDarkTheme ? 'bg-white/5 text-white border-white/10' : 'bg-black/5 text-black border-black/10'}`}>
                                <CardHeader>
                                    <CardTitle>{project.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                        {project.description.length > 100
                                            ? project.description.slice(0, 100) + '...'
                                            : project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className={`${isDarkTheme ? 'bg-yellow-500/20 text-yellow-400 hover:text-yellow-400 hover:bg-yellow-500/20' : 'bg-yellow-500/40 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-500/40'}`}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center">
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleViewProject(project.id)}
                                        size="sm"
                                        className={`${isDarkTheme ? 'text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/10 hover:text-yellow-300' : 'text-yellow-700 bg-yellow-400/40 hover:bg-yellow-400/30 hover:text-yellow-800'}`}
                                    >
                                        View Project
                                    </Button>
                                    {isAdmin && !isGuestUser && (
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDeleteProject(project.id)}
                                            size="sm"
                                            className="bg-red-500 hover:bg-red-600"
                                        >
                                            Delete Project
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>

            <Dialog open={isSelectingEmoji} onOpenChange={setIsSelectingEmoji}>
                <DialogContent className={`${isDarkTheme ? 'bg-black text-white border-white/10' : 'bg-white text-black border-black/10'} max-w-md w-full`}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">Choose Your Status Emoji</DialogTitle>

                    </DialogHeader>
                    <div className="my-6 p-4 rounded-lg items-center text-center bg-gradient-to-br from-yellow-400/20 to-purple-400/20">
                        <EnhancedEmojiPicker
                            onEmojiSelect={handleEmojiSelect}
                            isDarkTheme={isDarkTheme}
                            emojis={emojis}
                        />
                        <DialogDescription className="text-center mt-2">
                            Express yourself with a status emoji that represents your current mood or activity.
                        </DialogDescription>
                    </div>
                    <DialogFooter className="flex justify-between items-center mt-6">
                        <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            {isPremium ? 'Premium user: All emojis available!' : 'Upgrade to Premium for more emojis!'}
                        </p>
                        <Button
                            variant="outline"
                            className={`${isDarkTheme ? 'border-yellow-400/10 text-white hover:text-white hover:bg-white/10 bg-white/20' : 'border-yellow-600/10 text-black hover:bg-black/10'}`}
                            onClick={() => setIsSelectingEmoji(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditingUsername} onOpenChange={setIsEditingUsername}>
                <DialogContent className={`${isDarkTheme ? 'bg-black text-white border-white/10' : 'bg-white text-black border-black/10'}`}>
                    <DialogHeader>
                        <DialogTitle>Edit Username</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className={`block text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                            <Input
                                id="username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className={`mt-1 ${isDarkTheme ? 'bg-black border-white/30 focus:border-yellow-400/50 text-white' : 'bg-white border-black/30 focus:border-yellow-600/50 text-black'}`}
                            />
                        </div>
                        {!isPremium && (
                            <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                Non-premium users can change their username once a week.
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditingUsername(false)} className={`${isDarkTheme ? 'border-yellow-400/10 text-white hover:text-white hover:bg-white/10 bg-white/20' : 'border-yellow-600/10 text-black hover:bg-black/10'}`}>
                            Cancel
                        </Button>
                        <Button onClick={handleUsernameConfirm} className="bg-yellow-500 text-black hover:bg-yellow-600">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bio Edit Dialog */}
            <Dialog open={isEditingBio} onOpenChange={setIsEditingBio}>
                <DialogContent className={`${isDarkTheme ? 'bg-black text-white border-white/10' : 'bg-white text-black border-black/10'}`}>
                    <DialogHeader>
                        <DialogTitle>Edit Bio</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="bio" className={`block text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                            <Textarea
                                id="bio"
                                value={newBio}
                                onChange={(e) => setNewBio(e.target.value)}
                                className={`mt-1 ${isDarkTheme ? 'bg-black border-white/30 focus:border-yellow-400/50 text-white' : 'bg-white border-black/30 focus:border-yellow-600/50 text-black'}`}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditingBio(false)} className={`${isDarkTheme ? 'border-yellow-400/10 text-white hover:text-white hover:bg-white/10 bg-white/20' : 'border-yellow-600/10 text-black hover:bg-black/10'}`}>
                            Cancel
                        </Button>
                        <Button onClick={handleBioConfirm} className="bg-yellow-500 text-black hover:bg-yellow-600">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Toaster />
        </div>
    )
}

export default function UserProfile() {
    return (
        <UserProfileContent />
    )
}