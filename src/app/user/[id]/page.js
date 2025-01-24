// 'use client'

// import { useState, useEffect, useRef, useCallback } from 'react'
// import { useRouter, usePathname } from 'next/navigation'
// import { jwtDecode } from 'jwt-decode'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Camera, Pencil, LogOut, Trash2, MessageCircle, ThumbsUp, Award, Calendar, FileText, Smile } from 'lucide-react'
// import Header from '@/partials/Header'
// import { useToast } from "@/hooks/use-toast"
// import ReactCrop from 'react-image-crop'
// import 'react-image-crop/dist/ReactCrop.css'
// import EnhancedEmojiPicker from '@/components/EmojiPicker'
// import { Toaster } from '@/components/ui/toaster'
// import ReactMarkdown from 'react-markdown'
// import { motion, AnimatePresence } from 'framer-motion'
// import { FaEye } from 'react-icons/fa'

// export default function ForumUserProfile() {
//     const [currentUser, setCurrentUser] = useState(null);
//     const [userData, setUserData] = useState(null);
//     const [isDarkTheme, setIsDarkTheme] = useState(true);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [isEditingUsername, setIsEditingUsername] = useState(false);
//     const [isEditingBio, setIsEditingBio] = useState(false);
//     const [newUsername, setNewUsername] = useState('');
//     const [isRepping, setIsRepping] = useState();
//     const [newBio, setNewBio] = useState('');
//     const [reputation, setReputation] = useState(0);
//     const [isUploadingImage, setIsUploadingImage] = useState(false);
//     const [uploadedImage, setUploadedImage] = useState(null);
//     const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 1 });
//     const [completedCrop, setCompletedCrop] = useState(null);
//     const [showProfilePicturePrompt, setShowProfilePicturePrompt] = useState(false);
//     const [statusEmoji, setStatusEmoji] = useState('');
//     const [isSelectingEmoji, setIsSelectingEmoji] = useState(false);
//     const [userId, setUserId] = useState('');
//     const [repHistory, setRepHistory] = useState({})
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [emojis, setEmojis] = useState([]);
//     const [isPremium, setIsPremium] = useState(false);
//     const [isPreview, setIsPreview] = useState(false)
//     const imageRef = useRef(null);
//     const router = useRouter();
//     const pathname = usePathname();
//     const { toast } = useToast();
//     const fileInputRef = useRef(null)

//     useEffect(() => {
//         const storedTheme = localStorage.getItem('theme')
//         setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true)

//         const fetchUserData = async () => {
//             const token = localStorage.getItem("accessToken")
//             if (token) {
//                 setIsLoggedIn(true)
//             }

//             try {
//                 const decoded = jwtDecode(token)
//                 setCurrentUser(decoded)
//                 setUserId(decoded.userId)

//                 const identifier = pathname.split("/")[2]
//                 const isId = /^[0-9a-fA-F]{24}$/.test(identifier)
//                 const apiEndpoint = isId ? `/api/user?id=${identifier}` : `/api/user?username=${identifier.toLowerCase()}`

//                 const [userResponse, emojisResponse] = await Promise.all([
//                     fetch(apiEndpoint),
//                     fetch('/api/emojis')
//                 ])

//                 const userData = await userResponse.json()
//                 const emojisData = await emojisResponse.json()

//                 if (userData.success) {
//                     setUserData(userData.data)
//                     setNewUsername(userData.data.username)
//                     setNewBio(userData.data.bio)
//                     setIsAdmin(decoded.userId === userData.data.userId)
//                     setReputation(userData.data.reputation || 0)
//                     setStatusEmoji(userData.data.statusEmoji || '')
//                     setRepHistory(userData.data.reputation)
//                     setIsPremium(userData.data.isPremium)
//                     const isUserRaped = userData.data.reputation.includes(decoded.userId)
//                     setIsRepping(isUserRaped)
//                 } else {
//                     console.error("Failed to fetch user data")
//                 }

//                 setEmojis(emojisData)
//             } catch (error) {
//                 console.error("Error fetching user data:", error)
//                 router.push("/auth")
//             }
//         }

//         fetchUserData()
//     }, [pathname, router])

//     const handleImageLoad = (e) => {
//         setImageRef(e.target)
//     }

//     const toggleTheme = () => {
//         const newTheme = !isDarkTheme
//         setIsDarkTheme(newTheme)
//         localStorage.setItem('theme', newTheme ? 'dark' : 'light')
//     }

//     const handleUsernameEdit = () => setIsEditingUsername(true)
//     const handleBioEdit = () => setIsEditingBio(true)

//     const handleRepToggle = async () => {
//         try {
//             const response = await fetch("/api/user-action/rep", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     userGiving: currentUser.userId,
//                     userToGiveRep: userData.userId,
//                 }),
//             });

//             const result = await response.json();

//             if (response.ok && result.success) {
//                 setIsRepping(result.hasGivenRep);
//                 setUserData(prevData => ({
//                     ...prevData,
//                     stats: {
//                         ...prevData.stats,
//                         reputation: result.hasGivenRep ? prevData.stats.reputation + 1 : prevData.stats.reputation - 1
//                     },
//                 }));

//                 if (!result.hasGivenRep) {
//                     const notificationResponse = await fetch("/api/notification", {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                             senderId: currentUser.userId,
//                             receiverId: userData.userId,
//                             type: "reputation",
//                         }),
//                     });

//                     const notificationResult = await notificationResponse.json();
//                     if (!notificationResult.success) {
//                         console.warn("Failed to send reputation notification:", notificationResult.message);
//                     }
//                 }

//                 toast({
//                     title: result.hasGivenRep ? "Reputation Given" : "Reputation Removed",
//                     description: result.message,
//                     variant: "destructive",
//                 });
//             } else {
//                 toast({
//                     title: "Action Failed",
//                     description: result.message,
//                     variant: "destructive",
//                 });
//             }
//         } catch (error) {
//             console.error("Error in reputation action:", error);
//             toast({
//                 title: "Error",
//                 description: "Failed to process reputation action",
//                 variant: "destructive",
//             });
//         }
//     };

//     const getGreeting = () => {
//         const hour = new Date().getHours()
//         if (hour < 12) return "Good morning"
//         if (hour < 18) return "Good afternoon"
//         return "Good evening"
//     }

//     const handleUsernameConfirm = async () => {
//         try {
//             const response = await fetch(`/api/edit-user?action=username&id=${userData.userId}`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ newUsername }),
//             })

//             const result = await response.json()
//             if (result.success) {
//                 setUserData((prev) => ({ ...prev, username: newUsername }))
//                 localStorage.setItem('accessToken', result.accessToken)
//                 setIsEditingUsername(false)
//                 toast({
//                     title: "Username Updated",
//                     description: "Your username has been successfully updated.",
//                     variant: "destructive",
//                 })
//             } else {
//                 toast({
//                     title: "Update Failed",
//                     description: result.message,
//                     variant: "destructive",
//                 })
//             }
//         } catch (error) {
//             console.error('Error updating username:', error)
//             toast({
//                 title: "Update Failed",
//                 description: "An error occurred while updating your username.",
//                 variant: "destructive",
//             })
//         }
//     }

//     const handleBioConfirm = async () => {
//         try {
//             const response = await fetch(`/api/edit-user?action=bio&id=${userData.userId}`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ newBio }),
//             })

//             const result = await response.json()
//             if (result.success) {
//                 setUserData((prev) => ({ ...prev, bio: newBio }))
//                 localStorage.setItem('accessToken', result.accessToken)
//                 setIsEditingBio(false)
//                 toast({
//                     title: "Bio Updated",
//                     description: "Your bio has been successfully updated.",
//                     variant: "destructive",
//                 })
//             } else {
//                 toast({
//                     title: "Update Failed",
//                     description: result.message,
//                     variant: "destructive",
//                 })
//             }
//         } catch (error) {
//             console.error('Error updating bio:', error)
//             toast({
//                 title: "Update Failed",
//                 description: "An error occurred while updating your bio.",
//                 variant: "destructive",
//             })
//         }
//     }

//     const handleReputation = async (action) => {
//         try {
//             const response = await fetch("/api/user-action/reputation", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     userId: currentUser.userId,
//                     targetUserId: userData.userId,
//                     action: action,
//                 }),
//             })

//             const result = await response.json()
//             if (result.success) {
//                 setReputation(result.newReputation)
//                 toast({
//                     title: action === 'plus' ? "Reputation Increased" : "Reputation Decreased",
//                     description: `You've ${action === 'plus' ? 'given' : 'taken'} a reputation point ${action === 'plus' ? 'to' : 'from'} this user.`,
//                     variant: "destructive",
//                 })
//             } else {
//                 toast({
//                     title: "Action Failed",
//                     description: result.message,
//                     variant: "destructive",
//                 })
//             }
//         } catch (error) {
//             console.error('Error updating reputation:', error)
//             toast({
//                 title: "Action Failed",
//                 description: "An error occurred while updating reputation.",
//                 variant: "destructive",
//             })
//         }
//     }

//     const handleLogout = () => {
//         localStorage.removeItem('accessToken')
//         router.push('/auth')
//     }

//     const handleProfilePictureChange = (e) => {
//         if (e.target.files && e.target.files.length > 0) {
//             const reader = new FileReader()
//             reader.addEventListener('load', () => setUploadedImage(reader.result))
//             reader.readAsDataURL(e.target.files[0])
//             setIsUploadingImage(true)
//         }
//     }

//     const handleCropComplete = (crop) => {
//         setCompletedCrop(crop)
//     }

//     const handleCropCancel = () => {
//         setIsUploadingImage(false)
//         setUploadedImage(null)
//     }

//     const handleCropConfirm = async () => {
//         if (imageRef.current && completedCrop) {
//             const canvas = document.createElement('canvas')
//             const scaleX = imageRef.current.naturalWidth / imageRef.current.width
//             const scaleY = imageRef.current.naturalHeight / imageRef.current.height
//             canvas.width = completedCrop.width
//             canvas.height = completedCrop.height
//             const ctx = canvas.getContext('2d')

//             ctx.drawImage(
//                 imageRef.current,
//                 completedCrop.x * scaleX,
//                 completedCrop.y * scaleY,
//                 completedCrop.width * scaleX,
//                 completedCrop.height * scaleY,
//                 0,
//                 0,
//                 completedCrop.width,
//                 completedCrop.height
//             )

//             canvas.toBlob(async (blob) => {
//                 const base64Image = await new Promise((resolve) => {
//                     const reader = new FileReader()
//                     reader.onloadend = () => resolve(reader.result.split(',')[1])
//                     reader.readAsDataURL(blob)
//                 })

//                 try {
//                     const response = await fetch(`/api/edit-user?action=profilePic&id=${userData.userId}`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ profilePic: base64Image }),
//                     })

//                     const result = await response.json()
//                     if (result.success) {
//                         setUserData((prev) => ({ ...prev, profilePicture: result.user.profilePic }))
//                         localStorage.setItem('accessToken', result.accessToken)
//                         toast({
//                             title: "Profile Picture Updated",
//                             description: "Your profile picture has been successfully updated.",
//                             variant: "destructive",
//                         })
//                     } else {
//                         toast({
//                             title: "Update Failed",
//                             description: result.message,
//                             variant: "destructive",
//                         })
//                     }
//                 } catch (error) {
//                     console.error('Error updating profile picture:', error)
//                     toast({
//                         title: "Update Failed",
//                         description: "An error occurred while updating your profile picture.",
//                         variant: "destructive",
//                     })
//                 }
//                 setIsUploadingImage(false)
//                 setUploadedImage(null)
//             })
//         }
//     }

//     const handleEmojiSelect = async (emoji) => {
//         try {
//             const response = await fetch(`/api/edit-user?action=statusEmoji&id=${userData.userId}`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ statusEmoji: emoji }),
//             })

//             const result = await response.json()
//             if (result.success) {
//                 setStatusEmoji(emoji)
//                 setIsSelectingEmoji(false)
//                 toast({
//                     title: "Status Updated",
//                     description: "Your status emoji has been updated.",
//                     variant: "destructive",
//                 })
//             } else {
//                 toast({
//                     title: "Update Failed",
//                     description: "Failed to update status emoji. Please try again.",
//                     variant: "destructive",
//                 })
//             }
//         } catch (error) {
//             console.error('Error updating status emoji:', error)
//             toast({
//                 title: "Update Failed",
//                 description: "An error occurred while updating your status emoji.",
//                 variant: "destructive",
//             })
//         }
//     }

//     const openFileInput = useCallback(() => {
//         fileInputRef.current?.click()
//     }, [])

//     const renderTextWithEmojis = (text, emojis) => {
//         if (!text || typeof text !== 'string') return text || ''
//         if (!emojis || !Array.isArray(emojis)) return text

//         const emojiRegex = /:([\w-]+):/g
//         const parts = text.split(emojiRegex)

//         return parts.map((part, index) => {
//             if (index % 2 === 0) {
//                 return part
//             } else {
//                 const emoji = emojis.find(e => e.emojiTitle === `:${part}:`)
//                 if (emoji) {
//                     return (
//                         <img
//                             key={index}
//                             src={emoji.emojiUrl}
//                             alt={emoji.emojiTitle}
//                             title={emoji.emojiTitle}
//                             className="inline-block w-6 h-6"
//                         />
//                     )
//                 } else {
//                     return `:${part}:`
//                 }
//             }
//         })
//     }

//     if (!userData) {
//         return <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center`}>Loading...</div>
//     }

//     const handlePreviewProfile = () => {
//         if (isAdmin) {
//             setIsAdmin(false)
//             setIsPreview(true)
//         } else {
//             setIsAdmin(true)
//             setIsPreview(false)
//         }
//     }

//     return (
//         <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
//             <Header
//                 avatar={currentUser?.profilePic}
//                 userId={currentUser?.userId}
//                 currentPage={pathname}
//                 isDarkTheme={isDarkTheme}
//                 toggleTheme={toggleTheme}
//             />
//             <main className="container mx-auto px-4 py-8">
//                 <div className="flex flex-col md:flex-row gap-8">
//                     {/* Left Column - User Info */}
//                     <div className="md:w-1/3">
//                         <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
//                             <CardHeader className="text-center">
//                                 <div
//                                     className="relative inline-block mx-auto"
//                                     onMouseEnter={() => isAdmin && setShowProfilePicturePrompt(true)}
//                                     onMouseLeave={() => isAdmin && setShowProfilePicturePrompt(false)}
//                                 >
//                                     <Avatar
//                                         className={`w-32 h-32 mx-auto mb-4 border-4 ${isPremium ? 'border-yellow-400' : 'border-gray-400'}`}
//                                         onClick={isAdmin ? openFileInput : undefined}
//                                     >
//                                         <AvatarImage src={userData.profilePicture} alt={userData.username} />
//                                         <AvatarFallback className={`${isDarkTheme ? 'bg-zinc-700' : 'bg-gray-200'} text-4xl`}>
//                                             {userData.username.charAt(0).toUpperCase()}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                     {/* {isAdmin && showProfilePicturePrompt && (
//                                         <div className={`absolute inset-0 flex items-center justify-center ${isDarkTheme ? 'bg-black' : 'bg-white'} bg-opacity-50 rounded-full`}>
//                                             <Camera className={`w-8 h-8 ${isDarkTheme ? 'text-white' : 'text-black'}`} />
//                                         </div>
//                                     )}
//                                     <input
//                                         ref={fileInputRef}
//                                         type="file"
//                                         accept="image/*"
//                                         className="hidden"
//                                         onChange={handleProfilePictureChange}
//                                     /> */}
//                                     <AnimatePresence>
//                                         {isAdmin && showProfilePicturePrompt && (
//                                             <motion.div
//                                                 initial={{ opacity: 0 }}
//                                                 animate={{ opacity: 1 }}
//                                                 exit={{ opacity: 0 }}
//                                                 className={`absolute inset-0 flex items-center justify-center ${isDarkTheme ? 'bg-black' : 'bg-white'} bg-opacity-50 rounded-full cursor-pointer`}
//                                                 onClick={openFileInput}
//                                             >
//                                                 <Camera className={`w-8 h-8 ${isDarkTheme ? 'text-white' : 'text-black'}`} />
//                                             </motion.div>
//                                         )}
//                                     </AnimatePresence>
//                                     <input
//                                         ref={fileInputRef}
//                                         type="file"
//                                         accept="image/*"
//                                         className="hidden"
//                                         onChange={handleProfilePictureChange}
//                                     />
//                                 </div>
//                                 <CardTitle className="text-2xl font-bold flex items-center justify-center">
//                                     <h1 className="text-3xl font-bold mr-2">{userData.username}</h1>
//                                     {renderTextWithEmojis(statusEmoji, emojis)}
//                                     {isAdmin && (
//                                         <Button variant="ghost" size="icon" className={`ml-2 hover:bg-${isDarkTheme ? 'white' : 'black'}/10 hover:text-${isDarkTheme ? 'white' : 'black'}`} onClick={handleUsernameEdit}>
//                                             <Pencil className="h-4 w-4" />
//                                         </Button>
//                                     )}
//                                     {isAdmin && (
//                                         <Button
//                                             variant="ghost"
//                                             size="sm"
//                                             className={`ml-2 hover:bg-${isDarkTheme ? 'white' : 'black'}/10 hover:text-${isDarkTheme ? 'white' : 'black'}`}
//                                             onClick={() => setIsSelectingEmoji(true)}
//                                         >
//                                             <Smile className="h-4 w-4" />
//                                         </Button>
//                                     )}
//                                 </CardTitle>
//                                 <div className="flex items-center justify-center mb-4">
//                                     {!isAdmin && userData.bio === 'Edit your bio...' ? (
//                                         <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>No bio set</p>
//                                     ) : (
//                                         <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{userData.bio}</p>
//                                     )}
//                                     {isAdmin && (
//                                         <Button variant="ghost" size="icon" className={`ml-2 hover:bg-${isDarkTheme ? 'white' : 'black'}/10 hover:text-${isDarkTheme ? 'white' : 'black'}`} onClick={handleBioEdit}>
//                                             <Pencil className="h-2 w-2" />
//                                         </Button>
//                                     )}
//                                 </div>
//                                 <div className="flex justify-center space-x-2 mt-2 mb-1">
//                                     <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-500 text-black  hover:text-black">
//                                         Level {Math.floor(userData.stats.posts / 10) + 1}
//                                     </Badge>
//                                     <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-500  hover:text-blacl text-black">
//                                         {userData.isPremium ? 'Premium' : 'Member'}
//                                     </Badge>
//                                 </div>
//                                 <div className="flex items-center justify-center mt-2">
//                                 </div>
//                             </CardHeader>
//                             <CardContent>

//                                 <div className="h-px w-full bg-zinc-300/30 my-4 mt-0" />
//                                 <Card className='bg-zinc-900/50 border-0 mt-4 mb-4 text-zinc-200'>
//                                     <CardHeader>
//                                         <CardTitle>About {userData.username}</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <div className="space-y-4">
//                                             <div className="flex items-center">
//                                                 <Calendar className="mr-2 h-4 w-4" />
//                                                 <span>Joined on {new Date(userData.createdAt).toLocaleDateString()}</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <MessageCircle className="mr-2 h-4 w-4" />
//                                                 <span>{userData.stats.posts} posts</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <FileText className="mr-2 h-4 w-4" />
//                                                 <span>{userData.stats.threads} threads</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <Award className="mr-2 h-4 w-4" />
//                                                 <span>Level {Math.floor(userData.stats.posts / 10) + 1}</span>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                                 <div className="h-px w-full bg-zinc-300/30 my-4 mt-0" />
//                                 {!isAdmin && !isPreview && (
//                                     <div className="flex items-center justify-center space-x-2">
//                                         <Button
//                                             variant={isRepping ? "secondary" : "default"}
//                                             className="bg-yellow-400 text-black hover:bg-yellow-500"
//                                             onClick={handleRepToggle}
//                                         >
//                                             {isRepping ? "Cancel Rep" : "Give Rep"}
//                                         </Button>
//                                     </div>
//                                 )}
//                                 {(isAdmin && !isPreview) || (!isAdmin && isPreview) ? (
//                                     <>
//                                         <Button className="w-full bg-blue-500 hover:bg-blue-500/90 mt-0 mb-2" onClick={handlePreviewProfile}>
//                                             <FaEye className="mr-2 h-4 w-4" />{isPreview ? 'Un-Preview' : 'Preview'}
//                                         </Button>
//                                         <Button variant="destructive" className="w-full mt-0" onClick={handleLogout}>
//                                             <LogOut className="mr-2 h-4 w-4" /> Logout
//                                         </Button>
//                                     </>
//                                 ) : null}

//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* Right Column - User Activity */}
//                     <div className="md:w-2/3">
//                         <Tabs defaultValue="threads" className="h-[60vh] w-full">
//                             <TabsList className="grid bg-zinc-900/50 border border-zinc-500/50 w-full grid-cols-4">
//                                 <TabsTrigger value="threads">Threads</TabsTrigger>
//                                 <TabsTrigger value="posts">Posts</TabsTrigger>
//                                 <TabsTrigger value="reputation">Reputation</TabsTrigger>
//                                 <TabsTrigger value="about">About</TabsTrigger>
//                             </TabsList>
//                             <TabsContent value="threads">
//                                 <Card className='bg-zinc-900/50 border-0 h-[80vh] text-zinc-200'>
//                                     <CardHeader>
//                                         <CardTitle>Recent Threads</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <ScrollArea className="h-[65vh] ">
//                                             {userData.activity.threads.map((thread) => (
//                                                 <>
//                                                     <div key={thread._id} className="mb-4 p-4">
//                                                         <h3 className="font-semibold">{thread.title}</h3>
//                                                         <p className="text-sm text-gray-400">Posted on {new Date(thread.createdAt).toLocaleDateString()}</p>
//                                                         {/* <p className="mt-2">{thread.content.length > 100 ? `${thread.content.slice(0, 100)}...` : thread.content}</p> */}
//                                                         <ReactMarkdown className="mt-2">{thread.content.length > 100 ? `${thread.content.slice(0, 100)}...` : thread.content}</ReactMarkdown>
//                                                         <div className="mt-2 flex space-x-4">
//                                                             <span className="text-sm text-gray-400">Views: {thread.views}</span>
//                                                             <span className="text-sm text-gray-400">Replies: {thread.replies}</span>
//                                                         </div>
//                                                     </div>
//                                                     <div className="h-px w-full bg-zinc-300/30 my-4 mt-0" />
//                                                 </>
//                                             ))}
//                                         </ScrollArea>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>
//                             <TabsContent value="posts">
//                                 <Card className='bg-zinc-900/50 border-0 text-zinc-200'>
//                                     <CardHeader>
//                                         <CardTitle>Recent Posts</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <ScrollArea className="h-[400px]">
//                                             {userData.activity.posts.map((post) => (
//                                                 <>
//                                                     <div key={post._id} className="mb-4 p-4">
//                                                         <p className="text-sm text-gray-400">Posted on {new Date(post.createdAt).toLocaleDateString()} in thread: {post.threadTitle}</p>
//                                                         {/* <p className="mt-2">{post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content}</p> */}
//                                                         <ReactMarkdown className="mt-2">{post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content}</ReactMarkdown>
//                                                     </div>
//                                                     <div className="h-px w-full bg-zinc-300/30 my-4 mt-0" />
//                                                 </>
//                                             ))}
//                                         </ScrollArea>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>
//                             <TabsContent value="reputation">
//                                 <Card className='bg-zinc-900/50 border-0 text-zinc-200'>
//                                     <CardHeader>
//                                         <CardTitle>Reputation History</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <ScrollArea className="h-[400px]">
//                                             {repHistory.map((rep) => (
//                                                 <>
//                                                     <div key={rep} className="mb-4 p-4 flex justify-between items-center">
//                                                         <div>
//                                                             <p className="font-semibold">Received from {rep}</p>
//                                                         </div>
//                                                         <Badge className="bg-green-500/20 hover:bg-green-500/20 text-green-400">+1</Badge>
//                                                     </div>
//                                                     <div className="h-px w-full bg-zinc-300/30 my-4 mt-0" />
//                                                 </>
//                                             ))}
//                                         </ScrollArea>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>
//                             <TabsContent value="about">
//                                 <Card className='bg-zinc-900/50 border-0 text-zinc-200'>
//                                     <CardHeader>
//                                         <CardTitle>About {userData.username}</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <div className="space-y-4">
//                                             <div className="flex items-center">
//                                                 <Calendar className="mr-2 h-4 w-4" />
//                                                 <span>Joined on {new Date(userData.createdAt).toLocaleDateString()}</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <MessageCircle className="mr-2 h-4 w-4" />
//                                                 <span>{userData.stats.posts} posts</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <FileText className="mr-2 h-4 w-4" />
//                                                 <span>{userData.stats.threads} threads</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <Award className="mr-2 h-4 w-4" />
//                                                 <span>Level {Math.floor(userData.stats.posts / 10) + 1}</span>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>
//                         </Tabs>
//                     </div>
//                     <div className="lg:w-1/4 text-white space-y-6">
//                         {/* Greeting Card */}
//                         <Card className={`${isDarkTheme ? 'bg-zinc-900/50' : 'bg-white'} text-white border-0 shadow-lg`}>
//                             <CardContent className="p-6">
//                                 <h2 className="text-2xl font-bold mb-2">{getGreeting()} {currentUser && currentUser.username}</h2>
//                                 <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
//                                     What&apos;s new today? Stay updated with the latest news and announcements.
//                                 </p>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </main>

//             {/* Edit Username Dialog */}
//             <Dialog open={isEditingUsername} onOpenChange={setIsEditingUsername}>
//                 <DialogContent className={`${isDarkTheme ? 'bg-zinc-900 border-0 text-white' : 'bg-white text-black'}`}>
//                     <DialogHeader>
//                         <DialogTitle>Edit Username</DialogTitle>
//                     </DialogHeader>
//                     <Input
//                         value={newUsername}
//                         onChange={(e) => setNewUsername(e.target.value)}
//                         className={`${isDarkTheme ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-black'}`}
//                     />
//                     <DialogFooter>
//                         <Button className='bg-zinc-800 text-white hover:bg-zinc-900' onClick={() => setIsEditingUsername(false)}>Cancel</Button>
//                         <Button className='bg-zinc-800 text-white hover:bg-zinc-900' onClick={handleUsernameConfirm}>Save Changes</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Edit Bio Dialog */}
//             <Dialog open={isEditingBio} onOpenChange={setIsEditingBio}>
//                 <DialogContent className={`${isDarkTheme ? 'bg-zinc-900 border-0 text-white' : 'bg-white text-black'}`}>
//                     <DialogHeader>
//                         <DialogTitle>Edit Bio</DialogTitle>
//                     </DialogHeader>
//                     <Textarea
//                         value={newBio}
//                         onChange={(e) => setNewBio(e.target.value)}
//                         className={`${isDarkTheme ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-black'}`}
//                     />
//                     <DialogFooter>
//                         <Button className='bg-zinc-800 text-white hover:bg-zinc-900' onClick={() => setIsEditingBio(false)}>Cancel</Button>
//                         <Button className='bg-zinc-800 text-white hover:bg-zinc-900' onClick={handleBioConfirm}>Save Changes</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Image Upload Modal */}
//             {isUploadingImage && (
//                 <Dialog open={isUploadingImage} onOpenChange={setIsUploadingImage}>
//                     <DialogContent className={`${isDarkTheme ? 'bg-zinc-900 border-0 text-white' : 'bg-white text-black'}`}>
//                         <DialogHeader>
//                             <DialogTitle>Crop Your Image</DialogTitle>
//                         </DialogHeader>
//                         <div className="my-4">
//                             <ReactCrop
//                                 src={uploadedImage}
//                                 crop={crop}
//                                 onChange={(newCrop) => setCrop(newCrop)}
//                                 onComplete={handleCropComplete}
//                                 aspect={1}
//                             >
//                                 <img ref={imageRef} src={uploadedImage} alt="Upload" style={{ maxHeight: '60vh' }} />
//                             </ReactCrop>
//                         </div>
//                         <DialogFooter>
//                             <Button className='bg-zinc-800 text-white hover:bg-zinc-900' onClick={handleCropCancel}>Cancel</Button>
//                             <Button className='bg-zinc-800 text-white hover:bg-zinc-900' onClick={handleCropConfirm}>Confirm</Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>
//             )}

//             {/* Emoji Selection Dialog */}
//             {/* <Dialog open={isSelectingEmoji} onOpenChange={setIsSelectingEmoji}>
//                 <DialogContent className={`${isDarkTheme ? 'bg-zinc-900 text-white' : 'bg-white text-black'} max-w-md w-full`}>
//                     <DialogHeader>
//                         <DialogTitle className="text-2xl font-bold text-center">Choose Your Status Emoji</DialogTitle>
//                     </DialogHeader>
//                     <div className="my-6 p-4 rounded-lg items-center text-center bg-gradient-to-br from-yellow-400/20 to-purple-400/20">
//                         <EnhancedEmojiPicker
//                             onEmojiSelect={handleEmojiSelect}
//                             isDarkTheme={isDarkTheme}
//                             emojis={emojis}
//                         />
//                     </div>
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setIsSelectingEmoji(false)}>Cancel</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog> */}

//             <Dialog open={isSelectingEmoji} onOpenChange={setIsSelectingEmoji}>
//                 <DialogContent className={`${isDarkTheme ? 'bg-black text-white border-white/10' : 'bg-white text-black border-black/10'} max-w-md w-full`}>
//                     <DialogHeader>
//                         <DialogTitle className="text-2xl font-bold text-center">Choose Your Status Emoji</DialogTitle>

//                     </DialogHeader>
//                     <div className="my-6 p-4 rounded-lg items-center text-center bg-gradient-to-br from-yellow-400/20 to-purple-400/20">
//                         <EnhancedEmojiPicker
//                             onEmojiSelect={handleEmojiSelect}
//                             isDarkTheme={isDarkTheme}
//                             emojis={emojis}
//                         />
//                         <DialogDescription className="text-center mt-2">
//                             Express yourself with a status emoji that represents your current mood or activity.
//                         </DialogDescription>
//                     </div>
//                     <DialogFooter className="flex justify-between items-center mt-6">
//                         <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
//                             {isPremium ? 'Premium user: All emojis available!' : 'Upgrade to Premium for more emojis!'}
//                         </p>
//                         <Button
//                             variant="outline"
//                             className={`${isDarkTheme ? 'border-yellow-400/10 text-white hover:text-white hover:bg-white/10 bg-white/20' : 'border-yellow-600/10 text-black hover:bg-black/10'}`}
//                             onClick={() => setIsSelectingEmoji(false)}
//                         >
//                             Cancel
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//             <Toaster />
//         </div>
//     )
// }

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
import { Calendar, MessageCircle, FileText, Award, ThumbsUp } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

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
                    const apiEndpoint = isId ? `/api/user?id=${identifier}` : `/api/user?username=${identifier.toLowerCase()}`
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
                router.push('/auth')
            }
        }
        ``
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
    }, [router, toast])

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
        return <div className="flex items-center justify-center min-h-screen bg-black text-white">Loading...</div>
    }

    const userScore = userData.stats.posts * 2 + userData.stats.threads * 5 + userData.stats.reputation * 10

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
                    {/* Left Column - User Overview */}
                    <div className="lg:w-1/4">
                        {/* <Card className="bg-zinc-900/50 text-white border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>User Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-lg font-semibold">Joined</p>
                                    <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold">Overall Score</p>
                                    <p>{userScore}</p>
                                </div>
                            </CardContent>
                        </Card> */}
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
                                        <Award className="mr-2 h-4 w-4" /> Overall Score {userScore}
                                    </div>
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
                                            <a href={`/user/${giver.userId}`} className='text-white hover:text-blue-400 transition-colors duration-200'>
                                                <span className="font-medium">{giver.username}</span>
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
                                    <CardContent className="pt-6">
                                        <div className="flex items-center">
                                            <Avatar className="w-24 h-24 mr-4">
                                                <AvatarImage src={userData.profilePicture} alt={userData.username} />
                                                <AvatarFallback>{userData.username[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h1 className={`text-2xl font-bold ${userData.usernameEffect}`}>
                                                    {userData.username} <span>{renderTextWithEmojis(userData.statusEmoji, emojis)}</span>
                                                </h1>
                                                <p className="text-gray-400">{userData.bio === "Edit your bio..." ? "Bio not set" : userData.bio}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-2">
                                        <CardContent className="pt-6">
                                            <div>
                                                <p className="font-semibold">Reputation</p>
                                                <p className='mt-2'>{userData.stats.reputation}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-2">
                                        <CardContent className="pt-6">
                                            <div>
                                                <p className="font-semibold">Threads</p>
                                                <p className='mt-2'>{userData.stats.threads}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-2">
                                        <CardContent className="pt-6">
                                            <div>
                                                <p className="font-semibold">Posts</p>
                                                <p className='mt-2'>{userData.stats.posts}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-2">
                                        <CardContent className="pt-6">
                                            <div>
                                                <p className="font-semibold">Trust Scan Value</p>
                                                <p className='mt-2'>{Math.min(100, Math.floor(userScore / 10))}%</p>
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
                                                style={{ width: '150px', height: '150px' }} // Set inline styles
                                                className="mr-1" // Keep margin class if needed
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold mb-2">Signature</p>
                                    <MarkdownWithEmojis content={userData.signature} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - User Content */}
                    <div className="lg:w-1/4">
                        <Card className={`mb-4 ${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    Looking suspecious!?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    If this user seems a scam to you or have done something unusual with you dont hasitate to report our moderators to get him ban!
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-900/50 text-white border-0 shadow-lg mb-6">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px]">
                                    {userData.activity.threads.map((thread) => (
                                        <div key={thread._id} className="mb-4">
                                            <a href={`/thread/${thread._id}`} className='text-white hover:text-blue-400 transition-colors duration-200'>
                                                <h3 className="font-semibold">{thread.title}</h3>
                                            </a>
                                            <p className="text-sm text-gray-400">
                                                {new Date(thread.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm mt-1">{renderTextWithEmojis(thread.content.substring(0, 100), emojis)}...</p>
                                        </div>
                                    ))}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {currentUser && currentUser.userId !== userData.userId && (
                    <div className="mt-6 flex justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleRepToggle}
                                        variant={userData.reputation.includes(currentUser.userId) ? "secondary" : "default"}
                                    >
                                        {userData.reputation.includes(currentUser.userId) ? "Remove Rep" : "Give Rep"}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{userData.reputation.includes(currentUser.userId) ? "Remove your reputation point" : "Give a reputation point"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </main>
        </div>
    )
}