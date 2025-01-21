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
import { Settings, User, Sliders, FileSignature, Shield, AlertTriangle, Trophy, MessageSquare, Bookmark, Star, Eye, EyeOff, Camera, Smile } from 'lucide-react';
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

const fetchUserData = async (userId) => {
  if (!userId) throw new Error('User ID is required.');

  const apiUrl = `/api/mics/statics?userId=${userId}`;

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
  const [content, setContent] = useState('')
  const [emojis, setEmojis] = useState()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (token) {
          const decoded = jwtDecode(token)
          const userId = decoded.userId
          const profilePic = decoded.profilePic
          setProfilePic(profilePic)
          const data = await fetchUserData(userId)
          setUserData(data)
          setContent(data.signature)
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
  

  
  const handleEditorChange = ({ html, text }) => {
    setContent(text);
  };

  const handleEmojiSelect = (emojiTitle) => {
    const editor = document.querySelector('.markdown-editor-container textarea');
    if (editor) {
      const cursorPosition = editor.selectionStart;
      const textBeforeCursor = content.slice(0, cursorPosition);
      const textAfterCursor = content.slice(cursorPosition);

      setContent(`${textBeforeCursor} ${emojiTitle} ${textAfterCursor}`);
    }
  };

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

  const handleDeleteAccount = async () => {
    try {
      // In a real application, you would send this request to your API
      // await api.deleteAccount(userData.userId)
      // Redirect to logout page or home page
    } catch (err) {
      // Show error message
      console.error('Failed to delete account:', err)
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
      isLoggedIn={true}
      />
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex text-white flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <Card className="lg:w-[30%] h-[390px] bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <TabsList className="flex flex-col gap-4 mt-[160px] w-full bg-transparent">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`flex items-center gap-3 w-full p-3 justify-start text-left ${activeTab === tab.id
                        ? 'bg-yellow-500 text-black'
                        : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                        }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardContent>
            </Card>

            {/* Right Content Area */}
            <Card className="lg:w-[70%] text-white bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TabsContent value="overview" className="mt-0">
                        <OverviewTab userData={userData} emojis={emojis} profilePic={profilePic} setProfilePic={setProfilePic} />
                      </TabsContent>

                      <TabsContent value="profile" className="mt-0">
                        <ProfileTab userData={userData} onSave={handleSaveProfile} />
                      </TabsContent>

                      <TabsContent value="preferences" className="mt-0">
                        <PreferencesTab userData={userData} onSave={handleSavePreferences} />
                      </TabsContent>

                      <TabsContent value="signature" className="mt-0">
                        <SignatureTab handleEditorChange={handleEditorChange} handleEmojiSelect={handleEmojiSelect} isDarkTheme={true} content={content} userData={userData} onSave={handleSaveProfile} />
                      </TabsContent>

                      <TabsContent value="security" className="mt-0">
                        <SecurityTab onChangePassword={handleChangePassword} />
                      </TabsContent>

                      <TabsContent value="danger" className="mt-0">
                        <DangerZoneTab onDeleteAccount={handleDeleteAccount} />
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

function OverviewTab({ userData, emojis, profilePic, setProfilePic }) {
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
    <div className="space-y-6">
      <Card className="bg-zinc-800 text-white border-zinc-700">
        <CardContent className="p-6">
          <div className="flex items-start text-white gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePic} />
              <AvatarFallback>{userData.username[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {userData.username}
                {/* {userData.isPremium && (
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                )} */}
                {renderTextWithEmojis(userData.statusEmoji, emojis)}
              </h2>
              <p className="text-gray-400 text-white">{userData.bio}</p>
              <p className="text-sm text-white text-gray-500">
                Joined {formatDistanceToNow(new Date(userData.createdAt))} ago
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 text-white md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-zinc-800 text-white border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-800 text-white border-zinc-700">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] text-white">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData.activityData}>
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-950 border border-zinc-800 p-2 rounded-lg">
                          <p className="text-sm">
                            {payload[0].payload.date}: {payload[0].value} posts
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line type="monotone" dataKey="posts" stroke="#EAB308" strokeWidth={2} dot={{ fill: "#EAB308" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 text-white border-zinc-700">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex text-white justify-between items-center">
            <span className="text-gray-400">Premium Status</span>
            <span className={userData.isPremium ? "text-yellow-500" : "text-gray-500"}>
              {userData.isPremium ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Last Login</span>
            <span className="text-gray-300">
              {formatDistanceToNow(new Date(userData.lastLogin))} ago
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileTab({ userData }) {
  const { toast } = useToast()
  const [newUsername, setNewUsername] = useState(userData.username)
  const [newBio, setNewBio] = useState(userData.bio)
  const [statusEmoji, setStatusEmoji] = useState(userData.statusEmoji)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
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
  
  const fileInputRef = useRef(null)
  const imageRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (newUsername !== userData.username) {
        const response = await fetch(`/api/edit-user?action=username&id=${userData.userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newUsername }),
        })
        const result = await response.json()
        if (!result.success) throw new Error(result.message)
      }

      if (newBio !== userData.bio) {
        const response = await fetch(`/api/edit-user?action=bio&id=${userData.userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newBio }),
        })
        const result = await response.json()
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
    if (imageRef.current && completedCrop) {
      const canvas = document.createElement('canvas')
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height
      canvas.width = completedCrop.width
      canvas.height = completedCrop.height
      const ctx = canvas.getContext('2d')

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
      )

      canvas.toBlob(async (blob) => {
        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result.split(',')[1])
          reader.readAsDataURL(blob)
        })

        try {
          const response = await fetch(`/api/edit-user?action=profilePic&id=${userData.userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profilePic: base64Image }),
          })

          const result = await response.json()
          if (result.success) {
            toast({
              title: "Profile Picture Updated",
              description: "Your profile picture has been successfully updated.",
              variant: "destructive",
            })
          } else {
            throw new Error(result.message)
          }
        } catch (error) {
          toast({
            title: "Update Failed",
            description: error.message || "An error occurred while updating your profile picture.",
            variant: "destructive",
          })
        }
        setIsUploadingImage(false)
        setUploadedImage('')
      })
    }
  }

  const handleEmojiSelect = async (emoji) => {
    try {
      const response = await fetch(`/api/edit-user?action=statusEmoji&id=${userData.userId}`, {
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
    <div className="max-w-5xl mx-auto">
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-7 hover:bg-white/10 hover:text-white"
              onClick={() => setIsSelectingEmoji(true)}
            >
              <Smile className="h-4 w-4" />
            </Button>
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
              <AvatarImage src={userData.profilePic} />
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
      <Dialog open={isUploadingImage} onOpenChange={setIsUploadingImage}>
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
                setIsUploadingImage(false)
                setUploadedImage('')
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
        <DialogContent className="bg-black text-white border-white/10 max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Choose Your Status Emoji</DialogTitle>
          </DialogHeader>
          <div className="my-6 p-4 rounded-lg items-center text-center bg-gradient-to-br from-yellow-400/20 to-purple-400/20">
            <EnhancedEmojiPicker
              onEmojiSelect={handleEmojiSelect}
              isDarkTheme={true}
            />
            <DialogDescription className="text-center mt-2">
              Express yourself with a status emoji that represents your current mood or activity.
            </DialogDescription>
          </div>
          <DialogFooter className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-400">
              {userData.isPremium ? 'Premium user: All emojis available!' : 'Upgrade to Premium for more emojis!'}
            </p>
            <Button
              variant="outline"
              className="border-yellow-400/10 text-white hover:text-white hover:bg-white/10 bg-white/20"
              onClick={() => setIsSelectingEmoji(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PreferencesTab({ userData, onSave }) {
  const [spotifySong, setSpotifySong] = useState(userData.favSpotifySongOrPlaylist)
  const [youtubeVideo, setYoutubeVideo] = useState(userData.favYtVideo)
  const [darkMode, setDarkMode] = useState(true) // Assuming dark mode is always on for this forum

  const handleSave = (key, value) => {
    onSave(key, value)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">Preferences</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="spotifySong">Favorite Spotify Song/Playlist</Label>
          <Input
            id="spotifySong"
            value={spotifySong}
            onChange={(e) => setSpotifySong(e.target.value)}
            onBlur={() => handleSave('favSpotifySongOrPlaylist', spotifySong)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Spotify URI"
          />
        </div>
        <div>
          <Label htmlFor="youtubeVideo">Favorite YouTube Video</Label>
          <Input
            id="youtubeVideo"
            value={youtubeVideo}
            onChange={(e) => setYoutubeVideo(e.target.value)}
            onBlur={() => handleSave('favYtVideo', youtubeVideo)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="YouTube URL"
          />
        </div>
        <div>
          <Label>Dark Mode</Label>
          <div className="flex text-white items-center space-x-2 mt-2">
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={(checked) => {
                setDarkMode(checked)
                handleSave('darkMode', checked)
              }}
            />
            <Label htmlFor="dark-mode">Enable Dark Mode</Label>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignatureTab({ isDarkTheme, handleEditorChange, handleEmojiSelect, content, userData, onSave }) {
  const [signature, setSignature] = useState(userData.signature);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ signature });
  };

  return (
    <div className={`space-y-8 p-6 rounded-lg ${isDarkTheme ? "bg-zinc-900" : "bg-white"}`}>
      <h2 className={`text-3xl font-bold ${isDarkTheme ? "text-white" : "text-gray-800"}`}>Signature</h2>
        <div className="flex items-start space-x-4">
          <div className="markdown-editor-container flex-1">
            <ReactMarkdownEditorLite
              value={content}
              onChange={handleEditorChange}
              className="w-full h-64 bg-zinc-800 text-black border-0"
              style={{ backgroundColor: '#27272a' }}
              config={{
                view: {
                  menu: true,
                  md: true,
                  html: false,
                },
                theme: 'dark',
              }}
            />
          </div>

          <EnhancedEmojiPicker
            className="w-1/3 mt-1 ml-1"
            onEmojiSelect={handleEmojiSelect}
            isDarkTheme={isDarkTheme}
          />
        </div>

        {/* Preview Section */}
        <div className="space-y-2">
          <Label className="text-lg font-semibold">Preview</Label>
          <Card className={`border-0 w-[860px] rounded-lg p-4 ${isDarkTheme ? "bg-zinc-800" : "bg-gray-100"}`}>
            <ScrollArea className={`w-full h-64 rounded-md overflow-y-auto ${isDarkTheme ? "bg-zinc-800" : "bg-gray-50"}`}>
              <MarkdownWithEmojis
                style={{ backgroundColor: isDarkTheme ? "#1E1E24" : "#FFFFFF" }}
                className="p-4"
                content={content}
              />
            </ScrollArea>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-yellow-500 mr-16 text-black hover:bg-yellow-600"
          >
            Save Signature
          </Button>
        </div>
      
    </div>
  );
}

function SecurityTab({ onChangePassword }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newPassword === confirmPassword) {
      onChangePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      // Show error message that passwords don't match
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold">Security Settings</h2>
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <Button type="submit" className="bg-yellow-500 text-black hover:bg-yellow-600">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">Enhance your account security by enabling two-factor authentication.</p>
          <Button className="bg-yellow-500 text-black hover:bg-yellow-600">
            Set Up 2FA
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function DangerZoneTab({ onDeleteAccount }) {
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
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-zinc-700 text-white hover:bg-zinc-600">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteAccount} className="bg-red-600 text-white hover:bg-red-700">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
        <Toaster/>
      </Card>
    </div>
  )
}