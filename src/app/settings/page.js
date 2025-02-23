'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { Settings, User, Sliders, FileSignature, Shield, AlertTriangle, Trophy, MessageSquare, Bookmark, Star, Eye, EyeOff, Camera, Smile, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Header from '@/partials/Header';
import MarkdownWithEmojis from '@/partials/MarkdownWithEmojis';
import EnhancedEmojiPicker from '@/components/EmojiPicker';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import CryptoSelectionDialog from '@/components/CurrencyDialog';

const fetchUserData = async (token) => {
  if (!token) throw new Error('User ID is required.');

  const apiUrl = `/api/mics/statics?token=${token}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user data.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
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

const tabs = [
  { id: 'overview', label: 'Overview', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Sliders },
  { id: 'signature', label: 'Signature', icon: FileSignature },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

const usernameEffects = [
  { value: 'none', label: 'None' },
  { label: 'Sparkle', value: 'sparkle-effect' },
  { label: 'Neon', value: 'neon-effect' },
  { label: 'Rainbow', value: 'rainbow-effect' },
  { label: 'Fire', value: 'fire-effect' },
  { label: 'Snow', value: 'snow-effect' },
  { label: 'Shadow', value: 'shadow-effect' },
  { label: 'Retro', value: 'retro-effect' },
  { label: 'Cosmic', value: 'cosmic-effect' },
  { label: 'Pixel', value: 'pixel-effect' },
  { label: 'Glowing', value: 'glowing-effect' }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userData, setUserData] = useState(null)
  const [profilePic, setProfilePic] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setToken] = useState()
  const [bio, setBio] = useState()
  const [username, setUsername] = useState()
  const [statusEmoji, setStatusEmoji] = useState()
  const [content, setContent] = useState('')
  const [usernameEffect, setUsernameEffect] = useState()
  const [bannerImg, setBannerImg] = useState("")
  const [emojis, setEmojis] = useState([])

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (token) {
          setToken(token)
          const decoded = jwtDecode(token)
          const userId = decoded.userId
          const profilePic = decoded.profilePic
          setProfilePic(profilePic)
          const data = await fetchUserData(token)
          setUserData(data)
          setUsernameEffect(data.usernameEffect)
          setStatusEmoji(data.statusEmoji)
          setBannerImg(data.bannerImg || "")
          setBio(data.bio)
          setUsername(data.username)
        } else {
          throw new Error('No access token found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
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
    loadUserData()
  }, [])


  const handleSaveProfile = async (updatedData) => {
    try {
      // In a real application, you would send this data to your API
      // await api.updateProfile(userData.userId, updatedData)
      setUserData(prevData => ({ ...prevData, ...updatedData }))
      // Show success message
    } catch (err) {
      // Show error message
      console.error('Failed to update profile:', err)
    }
  }

  const handleSavePreferences = async (key, value) => {
    try {
      // In a real application, you would send this data to your API
      // await api.updatePreferences(userData.userId, { [key]: value })
      setUserData(prevData => ({ ...prevData, [key]: value }))
      // Show success message
    } catch (err) {
      // Show error message
      console.error('Failed to update preferences:', err)
    }
  }

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      // In a real application, you would send this data to your API
      // await api.changePassword(userData.userId, currentPassword, newPassword)
      // Show success message
    } catch (err) {
      // Show error message
      console.error('Failed to change password:', err)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        isDarkTheme={true}
        avatar={profilePic}
        userId={userData.userId}
        isPremium={userData.isPremium}
        isLoggedIn={true}
      />
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex text-white flex-col lg:flex-row gap-8">
            <Card className="lg:w-[30%] h-[340px] bg-zinc-900/50 backdrop-blur-lg border-white/10">
              <CardContent className="p-0">
                <div 
                  className="h-[150px] w-full rounded-t-lg"
                />
                <TabsList className="flex flex-col gap-2 px-3 py-4 w-full bg-transparent">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`flex items-center gap-3 w-full p-3 justify-start text-left rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium shadow-lg shadow-yellow-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-black' : ''}`} />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardContent>
            </Card>

            <Card className="lg:w-[70%] text-white bg-zinc-900/50 backdrop-blur-lg border-white/10">
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ 
                        duration: 0.15,
                        ease: "easeInOut"
                      }}
                      className="bg-transparent"
                    >
                      <TabsContent value="overview" className="border-0 mt-0 outline-none bg-transparent">
                        <OverviewTab token={token} userData={userData} bannerImg={bannerImg} emojis={emojis} bio={bio} username={username} statusEmoji={statusEmoji} profilePic={profilePic} setProfilePic={setProfilePic} usernameEffect={usernameEffect} />
                      </TabsContent>

                      <TabsContent value="profile" className="mt-0 outline-none bg-transparent">
                        <ProfileTab token={token} userData={userData} setProfilePic={setProfilePic} setUsername={setUsername} setBio={setBio} setStatusEmoji={setStatusEmoji} profilePic={profilePic} onSave={handleSaveProfile} />
                      </TabsContent>

                      <TabsContent value="preferences" className="mt-0 outline-none bg-transparent">
                        <PreferencesTab token={token} userData={userData} bannerImg={bannerImg} setBannerImg={setBannerImg} onSave={handleSavePreferences} setUsernameEffect={setUsernameEffect} />
                      </TabsContent>

                      <TabsContent value="signature" className="mt-0 outline-none bg-transparent">
                        <SignatureTab token={token} isDarkTheme={true} userData={userData} onSave={handleSaveProfile} />
                      </TabsContent>

                      <TabsContent value="security" className="mt-0 outline-none bg-transparent">
                        <SecurityTab token={token} onChangePassword={handleChangePassword} userData={userData} />
                      </TabsContent>

                      <TabsContent value="danger" className="mt-0 outline-none bg-transparent">
                        <DangerZoneTab userData={userData} token={token} />
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </Tabs>
        <Toaster />
      </div>
    </div>
  )
}

function OverviewTab({ token, bannerImg, userData, emojis, bio, username, statusEmoji, profilePic, setProfilePic, usernameEffect }) {
  const stats = [
    { title: "Reputation", value: userData.reputation, icon: Trophy, color: "text-yellow-500" },
    { title: "Threads", value: userData.threadCount, icon: MessageSquare, color: "text-blue-500" },
    { title: "Posts", value: userData.postCount, icon: MessageSquare, color: "text-green-500" }
  ]

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      const decoded = jwtDecode(token)
      const profilePic = decoded.profilePic
      setProfilePic(profilePic)
    } else {
      throw new Error('No access token found')
    }
  }, [])

  return (
    <div className="space-y-6 border-0">
      <Card className="bg-zinc-900/50 backdrop-blur-lg border-white/10 overflow-hidden">
        <CardContent
          className="p-6 relative"
          style={
            bannerImg && bannerImg.trim() !== ""
              ? {
                  background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${bannerImg}) no-repeat center/cover`,
                  minHeight: "150px",
                }
              : {
                  background: "linear-gradient(to right, rgba(24, 24, 27, 0.5), rgba(39, 39, 42, 0.5))",
                  minHeight: "150px",
                }
          }
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-2 ring-yellow-500/20 ring-offset-2 ring-offset-black">
                <AvatarImage src={profilePic} />
                <AvatarFallback>{username[0]}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
                <span className={usernameEffect}>{username}</span>
                <span>{renderTextWithEmojis(statusEmoji, emojis)}</span>
              </h2>
              <p className="text-zinc-300">{bio}</p>
              <p className="text-sm text-zinc-400">
                Joined {formatDistanceToNow(new Date(userData.createdAt))} ago
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-zinc-900/50 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Chart */}
      <Card className="bg-zinc-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-100">Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData.activityData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#525252" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#525252" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`} 
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-950 border border-zinc-800 p-2 rounded-lg shadow-xl">
                          <p className="text-sm text-zinc-300">
                            {payload[0].payload.date}: {payload[0].value} posts
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="posts" 
                  stroke="#EAB308" 
                  strokeWidth={2} 
                  dot={{ fill: "#EAB308" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="bg-zinc-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-100">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Premium Status</span>
            <span className={userData.isPremium ? "text-yellow-500" : "text-zinc-500"}>
              {userData.isPremium ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Last Login</span>
            <span className="text-zinc-300">
              {formatDistanceToNow(new Date(userData.lastLogin))} ago
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileTab({ token, userData, profilePic, setProfilePic, setUsername, setBio, setStatusEmoji }) {
  const { toast } = useToast()
  const [newUsername, setNewUsername] = useState(userData.username)
  const [newBio, setNewBio] = useState(userData.bio)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const [newProfilePic, setNewProfilePic] = useState()
  const [uploadedImage, setUploadedImage] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isSelectingEmoji, setIsSelectingEmoji] = useState(false)
  const [completedCrop, setCompletedCrop] = useState()
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  })
  const [emojis, setEmojis] = useState([])

  useEffect(() => {
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
  }, [])

  const fileInputRef = useRef(null)
  const imageRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (newUsername !== userData.username) {
        const response = await fetch(`/api/edit-user?action=username&token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newUsername }),
        })
        const result = await response.json()
        if (result.success) {
          setUsername(newUsername)
          localStorage.setItem('accessToken', result.accessToken)
        }
        if (!result.success) throw new Error(result.message)
      }

      if (newBio !== userData.bio) {
        const response = await fetch(`/api/edit-user?action=bio&token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newBio }),
        })
        const result = await response.json()
        if (result.success) {
          setBio(newBio)
          localStorage.setItem('accessToken', result.accessToken)
        }
        if (!result.success) throw new Error(result.message)
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      })
    }
  }

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop)
  }

  const handleCropConfirm = async () => {
    let base64Image;

    // If there's no uploaded image, exit early
    if (!uploadedImage) {
      toast({
        title: "Error",
        description: "No image selected.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isGifFile = uploadedImage instanceof File && uploadedImage.type === 'image/gif';
      const isGifBase64 = typeof uploadedImage === 'string' && uploadedImage.startsWith('data:image/gif');

      if (isGifFile || isGifBase64) {
        if (isGifFile) {
          base64Image = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(uploadedImage);
          });
        } else {
          base64Image = uploadedImage;
        }
      } else {
        // For non-GIF images, use the uploaded image directly if no crop is made
        if (!completedCrop) {
          base64Image = uploadedImage;
        } else if (imageRef.current && completedCrop) {
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

          base64Image = canvas.toDataURL('image/png');
        }
      }

      if (!base64Image) {
        throw new Error("Failed to process the image.");
      }

      const response = await fetch(`/api/edit-user?action=profilePic&token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePic: base64Image }),
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('accessToken', result.accessToken);
        setProfilePic(result.user.profilePic);
        toast({
          title: "Success",
          description: "Your profile picture has been successfully updated.",
          variant: "destructive",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating your profile picture.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(false);
    setUploadedImage(null);
  };

  const handleEmojiSelect = async (emoji) => {
    try {
      const response = await fetch(`/api/edit-user?action=statusEmoji&token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusEmoji: emoji }),
      })

      const result = await response.json()
      if (result.success) {
        localStorage.setItem('accessToken', result.accessToken)
        setStatusEmoji(emoji)
        setIsSelectingEmoji(false)
        toast({
          title: "Status Updated",
          description: "Your status emoji has been updated.",
          variant: "destructive",
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating your status emoji.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-5xl mx-auto border-0">
      <form onSubmit={handleSubmit} className="grid grid-cols-[1fr,300px] gap-8">
        {/* Left side - Input fields */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="username" className="text-sm font-medium text-gray-200">
                Username
              </Label>
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="flex flex-col items-start mt-7">
              <div className="flex items-center gap-2">
                <EnhancedEmojiPicker 
                  onEmojiSelect={handleEmojiSelect}
                  isDarkTheme={true}
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="default"
                      className="bg-zinc-800 px-4 py-1 hover:bg-white/10 hover:text-white flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        {userData.statusEmoji ? (
                          <>
                            {renderTextWithEmojis(userData.statusEmoji, emojis)}
                            <span className="text-xs text-zinc-400">(change)</span>
                          </>
                        ) : (
                          <>
                            <Smile className="h-4 w-4" />
                            <span className="text-sm text-zinc-400">Add status</span>
                          </>
                        )}
                      </div>
                    </Button>
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="text-sm font-medium text-gray-200">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
              rows={4}
              maxLength={150}
            />
            <p className="text-xs text-gray-400 mt-1">
              {newBio.length}/150 characters
            </p>
          </div>

          <Button type="submit" className="bg-yellow-500 text-black hover:bg-yellow-600">
            Save Changes
          </Button>
        </div>

        {/* Right side - Profile Picture */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-200">
            Profile Picture
          </Label>
          <div
            className="relative w-64 h-64 mx-auto"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
          >
            <Avatar className="w-full h-full">
              <AvatarImage src={profilePic} />
              <AvatarFallback>{userData.username[0]}</AvatarFallback>
            </Avatar>

            <AnimatePresence>
              {isHoveringAvatar && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8 text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setUploadedImage(reader.result)
                    setIsUploadingImage(true)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
          </div>
          <p className="text-xs text-gray-400 text-center">
            Click the avatar to upload a new picture
          </p>
        </div>
      </form>

      {/* Image Crop Dialog */}
      <Dialog open={isUploadingImage} onOpenChange={(open) => {
        setIsUploadingImage(open);
        if (!open) {
          setUploadedImage(null);
        }
      }}>
        <DialogContent className="bg-zinc-900 border-0 text-white">
          <DialogHeader>
            <DialogTitle>Crop Your Image</DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <ReactCrop
              src={uploadedImage}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={handleCropComplete}
              aspect={1}
            >
              <img
                ref={imageRef}
                src={uploadedImage}
                alt="Upload"
                style={{ maxHeight: '60vh' }}
              />
            </ReactCrop>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-zinc-800 text-white hover:bg-zinc-700"
              onClick={() => {
                setIsUploadingImage(false);
                setUploadedImage(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-500 text-black hover:bg-yellow-600"
              onClick={handleCropConfirm}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emoji Selection Dialog */}
      <Dialog open={isSelectingEmoji} onOpenChange={setIsSelectingEmoji}>
        <DialogContent className="bg-zinc-900/50 backdrop-blur-lg border-white/10 max-w-[400px] w-full">
          <DialogHeader className="space-y-2 pb-4">
            <DialogTitle className="text-lg font-semibold text-white">Status Emoji</DialogTitle>
            <DialogDescription className="text-sm text-zinc-400">
              Choose an emoji to display next to your username
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative rounded-lg bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-purple-500/5 rounded-lg" />
            <div className="relative p-2">
              <EnhancedEmojiPicker
                onEmojiSelect={handleEmojiSelect}
                isDarkTheme={true}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {userData.isPremium ? (
              <div className="flex items-center gap-2 text-xs text-yellow-500">
                <Star className="h-3.5 w-3.5" />
                <span>Premium: All emojis available</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Lock className="h-3.5 w-3.5" />
                <span>Upgrade for more emojis</span>
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => setIsSelectingEmoji(false)}
              className="bg-zinc-800 text-white hover:bg-zinc-700 border-white/10"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


function PreferencesTab({ token, userData, onSave, setUsernameEffect, bannerImg, setBannerImg }) {
  const [youtubeVideo, setYoutubeVideo] = useState(userData.favYtVideo);
  const [telegramId, setTelegramId] = useState(userData.telegramUID || "");
  const [discordId, setDiscordId] = useState(userData.discordId || "");
  const [newUsernameEffect, setNewUsernameEffect] = useState(userData.usernameEffect);
  const [btcAddress, setBtcAddress] = useState(userData.btcAddress || "")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [favSpotifyTrack, setFavSpotifyTrack] = useState(userData.favSpotifyTrack || "")
  const { toast } = useToast()

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  function isValidUrl(url) {
    try {
      new URL(url);
      return /\.(jpeg|jpg|gif|png|webp|svg|bmp|gif)$/i.test(url);
    } catch {
      return false;
    }
  }

  function isValidSpotifyTrackUrl(url) {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.hostname === "open.spotify.com" &&
        parsedUrl.pathname.startsWith("/track/")
      );
    } catch {
      return false;
    }
  }


  const handleSave = async () => {
    const updatedData = {
      favYtVideo: youtubeVideo,
      telegramId,
      discordId,
      usernameEffect: newUsernameEffect,
      btcAddress: btcAddress,
      bannerImg: bannerImg,
      favSpotifyTrack: favSpotifyTrack
    };

    try {
      const response = await fetch(`/api/mics/update-preferences?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      const result = await response.json();
      if (result.success) {
        setDiscordId(result.user.discordId)
        setTelegramId(result.user.telegramUID)
        setYoutubeVideo(result.user.favYtVideo)
        setNewUsernameEffect(result.user.usernameEffect)
        setUsernameEffect(result.user.usernameEffect)
        setBtcAddress(result.user.btcAddress)
        setFavSpotifyTrack(result.user.favSpotifyTrack || "")
        setBannerImg(result.user.bannerImg)
        toast({
          title: "Preferences Updated",
          description: "Your preferences have been successfully updated.",
          variant: "destructive",
        })
      } else {
        console.log(result.error)
      }

    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to update preferences. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">Preferences</h2>
      <div className="space-y-4">
        {/* YouTube Video */}
        <div>
          <Label htmlFor="youtubeVideo">Favorite YouTube Video (optional)</Label>
          <Input
            id="youtubeVideo"
            value={youtubeVideo}
            onChange={(e) => setYoutubeVideo(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="YouTube URL (optional)"
          />
        </div>

        <div>
          <Label htmlFor="bannerImg">Banner Image/GIF URL (optional)</Label>
          <Input
            id="bannerImg"
            value={bannerImg}
            onChange={(e) => setBannerImg(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Enter a valid image or GIF link for your banner (optional)"
          />
        </div>

        <div>
          <Label htmlFor="spotifySong">Favorite Spotify Song (Optional)</Label>
          <Input
            id="spotifySong"
            value={favSpotifyTrack}
            onChange={(e) => setFavSpotifyTrack(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Enter a Spotify track URL (optional)"
          />
          <p className="text-sm text-zinc-400 mt-2">
            Example: <span className="underline">https://open.spotify.com/track/6nRCWTNboe0qbrXTO0QbzX</span>
          </p>
        </div>

        <div>
          <Label htmlFor="btcaddress">BTC Address (optional)</Label>
          <Input
            id="btcaddress"
            value={btcAddress}
            onChange={(e) => setBtcAddress(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Your BTC Address (optional)"
          />
        </div>

        {/* Telegram ID */}
        <div>
          <Label htmlFor="telegramId">Telegram ID</Label>
          <Input
            id="telegramId"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Your Telegram ID"
          />
        </div>

        {/* Discord ID */}
        <div>
          <Label htmlFor="discordId">Discord ID (optional)</Label>
          <Input
            id="discordId"
            value={discordId}
            onChange={(e) => setDiscordId(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Your Discord ID (optional)"
          />
        </div>

        <div>
          <CardTitle className="text-sm">Live Prices</CardTitle>
          <div className="flex justify-start">
            <Button
              type="submit"
              onClick={handleOpenDialog}
              className="bg-yellow-500 mt-2 text-black hover:bg-yellow-600"
            >
              Customize Live Prices
            </Button>
          </div>
          <CryptoSelectionDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </div>

        {/* Username Effect */}
        <div>
          <Label htmlFor="usernameEffect">Username Effect</Label>
          <Select
            value={newUsernameEffect}
            onValueChange={setNewUsernameEffect}
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Select an effect" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-0">
              {userData.storedUsernameEffects.map((effect) => (
                <SelectItem
                  key={effect.value}
                  className={`${effect.value} hover:bg-transparent`}
                  value={effect.value}
                >
                  {effect.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            onClick={() => {
              if (
                (!bannerImg || (bannerImg && isValidUrl(bannerImg))) &&
                (!favSpotifyTrack || (favSpotifyTrack && isValidSpotifyTrackUrl(favSpotifyTrack)))
              ) {
                handleSave();
              } else {
                alert('Please enter valid URLs for the banner image and/or Spotify track.');
              }
            }}
            className="bg-yellow-500 mt-6 text-black hover:bg-yellow-600"
          >
            Save Preference
          </Button>
        </div>
      </div>
    </div>
  );
}


function SignatureTab({ token, isDarkTheme, userData, onSave }) {
  const [signature, setSignature] = useState(userData.signature);
  const [emojis, setEmojis] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await fetch('/api/emojis');
        const data = await response.json();
        setEmojis(data);
      } catch (error) {
        console.error('Error fetching emojis:', error);
        toast({
          title: "Error",
          description: "Failed to load emojis",
          variant: "destructive",
        });
      }
    };

    fetchEmojis();
  }, []);

  const handleEditorChange = ({ text }) => {
    setSignature(text);
  };

  const handleEmojiSelect = (emoji) => {
    const textArea = document.querySelector('.rc-md-editor textarea');
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const newText = signature.slice(0, start) + `:${emoji}:` + signature.slice(end);
      setSignature(newText);
      
      setTimeout(() => {
        textArea.focus();
        const newPosition = start + emoji.length + 2;
        textArea.setSelectionRange(newPosition, newPosition);
      }, 0);
    } else {
      setSignature((prev) => prev + `:${emoji}:`);
    }
  };

  const CustomMarkdown = ({ content }) => {
    if (!content) return null;

    const processContent = (text) => {
      if (!text || typeof text !== 'string') return text;
      
      const parts = text.split(/(:[\w-]+:)/g);
      return parts.map((part, index) => {
        const emojiMatch = part.match(/^:([\w-]+):$/);
        if (emojiMatch) {
          const emojiName = emojiMatch[1];
          const emoji = emojis.find(e => e.emojiTitle === `:${emojiName}:`);
          if (emoji) {
            return (
              <img
                key={`emoji-${index}`}
                src={emoji.emojiUrl}
                alt={emoji.emojiTitle}
                title={emoji.emojiTitle}
                className="inline-block w-6 h-6 align-middle"
              />
            );
          }
        }
        return part;
      });
    };

    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-4">
              {Array.isArray(children) 
                ? children.map((child, index) => (
                    <span key={index}>
                      {typeof child === 'string' ? processContent(child) : child}
                    </span>
                  ))
                : processContent(children)}
            </p>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4">
              {Array.isArray(children) 
                ? children.map((child, index) => (
                    <span key={index}>
                      {typeof child === 'string' ? processContent(child) : child}
                    </span>
                  ))
                : processContent(children)}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-3">
              {Array.isArray(children) 
                ? children.map((child, index) => (
                    <span key={index}>
                      {typeof child === 'string' ? processContent(child) : child}
                    </span>
                  ))
                : processContent(children)}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold mb-2">
              {Array.isArray(children) 
                ? children.map((child, index) => (
                    <span key={index}>
                      {typeof child === 'string' ? processContent(child) : child}
                    </span>
                  ))
                : processContent(children)}
            </h3>
          ),
          ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
          li: ({ children }) => (
            <li className="mb-1">
              {Array.isArray(children) 
                ? children.map((child, index) => (
                    <span key={index}>
                      {typeof child === 'string' ? processContent(child) : child}
                    </span>
                  ))
                : processContent(children)}
            </li>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
              {Array.isArray(children) 
                ? children.map((child, index) => (
                    <span key={index}>
                      {typeof child === 'string' ? processContent(child) : child}
                    </span>
                  ))
                : processContent(children)}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm">{children}</code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-zinc-600 pl-4 italic my-4">
              {Array.isArray(children) 
                ? children.map((child, index) => (
                    <span key={index}>
                      {typeof child === 'string' ? processContent(child) : child}
                    </span>
                  ))
                : processContent(children)}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold">
              {Array.isArray(children) 
                ? children.map((child, index) => (
                    <span key={index}>
                      {typeof child === 'string' ? processContent(child) : child}
                    </span>
                  ))
                : processContent(children)}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic">
              {Array.isArray(children) 
                ? children.map((child, index) => (
                    <span key={index}>
                      {typeof child === 'string' ? processContent(child) : child}
                    </span>
                  ))
                : processContent(children)}
            </em>
          ),
          hr: () => <hr className="my-4 border-zinc-700" />,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/mics/sign?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature }),
      });

      if (!response.ok) {
        throw new Error("Failed to update signature");
      }

      const result = await response.json();
      setSignature(result.user.signature);
      toast({
        title: "Signature Updated",
        description: "Your signature has been updated successfully.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error updating signature:", error);
      toast({
        title: "Error",
        description: "Failed to update signature. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Signature</h2>
          <p className="text-zinc-400 mt-1">Customize your forum signature with markdown support</p>
        </div>
        <div className="flex items-center gap-2">
          <EnhancedEmojiPicker 
            onEmojiSelect={handleEmojiSelect}
            isDarkTheme={true}
          />
          <Button
            onClick={handleSubmit}
            className="bg-yellow-500 text-black hover:bg-yellow-600"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Editor</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="markdown-editor-container">
              <ReactMarkdownEditorLite
                value={signature}
                onChange={handleEditorChange}
                className="w-full min-h-[300px] bg-zinc-800/50 rounded-lg overflow-hidden border border-white/10"
                renderHTML={text => <ReactMarkdown>{text}</ReactMarkdown>}
                config={{
                  view: {
                    menu: true,
                    md: true,
                    html: false,
                  },
                  canView: {
                    menu: true,
                    md: true,
                    html: false,
                    fullScreen: false,
                    hideMenu: false,
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-invert max-w-none">
              <div className="bg-zinc-800/50 text-white rounded-lg p-4 min-h-[300px] border border-white/10">
                <CustomMarkdown content={signature} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Tips & Formatting</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-white">Markdown Tips</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Use ** ** for <span className="font-bold">bold</span></li>
                <li>• Use * * for <span className="italic">italic</span></li>
                <li>• Use ` ` for <code className="bg-zinc-800 px-1 rounded">code</code></li>
                <li>• Use # for headers</li>
                <li>• Use - for bullet points</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-white">Guidelines</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Keep it concise</li>
                <li>• Avoid excessive formatting</li>
                <li>• Use emojis sparingly</li>
                <li>• Check preview before saving</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function SecurityTab({ token, onChangePassword, userData }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/auth/change-password?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Password changed successfully.",
          variant: "destructive",
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Security Settings</h2>
        <p className="text-zinc-400 mt-1">Manage your account security preferences</p>
      </div>

      <Card className="bg-zinc-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-white/80">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-zinc-800/50 border-white/10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white/80">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-zinc-800/50 border-white/10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/80">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-zinc-800/50 border-white/10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-yellow-500 text-black hover:bg-yellow-600">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function DangerZoneTab({ userData, token }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onDeleteAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/mics/delete?userId=${userData.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }
      localStorage.removeItem('accessToken');
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">Danger Zone</h2>
      <Card className="bg-red-900/20 border-red-900">
        <CardHeader>
          <CardTitle className="text-red-500">Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={loading}>
                {loading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 text-white border-0 border-zinc-800">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-zinc-700 text-white hover:text-white border-0 hover:border-0 hover:bg-zinc-600">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteAccount} className="bg-red-600 text-white hover:text-white border-0 hover:border-0 hover:bg-red-700">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}