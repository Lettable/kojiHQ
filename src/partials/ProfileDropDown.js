import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Settings, Bell, Crown, PlusCircle, LogOut, MessageSquare, Rocket } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'

export function ProfileDropdown({
  isOpen,
  onClose,
  avatar,
  isPremium,
  userId,
  hasUnreadNotifications,
  isDarkTheme
}) {
  const router = useRouter()
  const [username, setUsername] = useState()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      const decodedToken = jwtDecode(token)
      setUsername(decodedToken.username)
    } else {
      setUsername('Unknown')
    }
  }, []) 
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  const handleNotification = () => {
    router.push(`/notifications`);
    onClose()
  };

  const handleUsernameEffect = () => {
    router.push('/mics/username-effect')
    onClose()
  }

  const handleCreateThread = () => {
    router.push('/create-thread/6792a8101faf1d9895979003')
    onClose()
  }

  const handleSubmitProduct = () => {
    router.push('/submit-product')
    onClose()
  }

  const handleAdBot = () => {
    router.push('/ad-bot')
    onClose()
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    router.push('/auth')
    onClose()
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={dropdownVariants}
      transition={{ duration: 0.2 }}
      className={`absolute right-0 top-14 w-72 rounded-md shadow-lg py-1 bg-zinc-900/50 ring-1 ring-black ring-opacity-5 z-50`}
    >
      <div className="px-4 py-3">
        <div className="flex items-center">
          <img className="h-10 w-10 rounded-full" src={avatar} alt="" />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{username}</p>
            {/* <p className="text-xs font-medium text-gray-400 cursor-pointer hover:text-yellow-500" onClick={() => { router.push(`/user/${userId}`); onClose(); }}>View Profile</p> */}
            <p className="text-xs font-medium text-gray-400 cursor-pointer hover:text-yellow-500"><a className='text-gray-400' href={`/user/${userId}`}>View Profile</a></p>
          </div>
        </div>
      </div>

      <Separator className="my-2 bg-zinc-700" />

      <div className="px-2 py-2 space-y-1">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800 hover:text-yellow-500" onClick={() => { router.push(`/user/${userId}`); onClose(); }}>
          <User className="mr-2 h-4 w-4" /> Profile
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800 hover:text-yellow-500" onClick={() => { router.push('/settings'); onClose(); }}>
          <Settings className="mr-2 h-4 w-4" /> Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800 hover:text-yellow-500 relative" onClick={handleNotification}>
          <Bell className="mr-2 h-4 w-4" /> Notifications
          {hasUnreadNotifications && (
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 h-2 w-2 bg-yellow-500 rounded-full" />
          )}
        </Button>
      </div>

      <Separator className="my-2 bg-zinc-700" />

      <div className="px-2 py-2 space-y-1">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800 hover:text-yellow-500" onClick={handleCreateThread}>
          <MessageSquare className="mr-2 h-4 w-4" /> Create Thread
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800 hover:text-yellow-500" onClick={handleSubmitProduct}>
          <PlusCircle className="mr-2 h-4 w-4" /> Submit Product
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800 hover:text-yellow-500" onClick={handleUsernameEffect}>
          <Crown className="mr-2 h-4 w-4" /> Username Effects
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800 hover:text-yellow-500" onClick={handleAdBot}>
          <Rocket className="mr-2 h-4 w-4" /> Ad Bot
        </Button>
      </div>

      {!isPremium && (
        <>
          <Separator className="my-2 text-white bg-zinc-700" />
          <div className="px-2 py-2">
            <Button 
              variant="premium" 
              className="w-full justify-start bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold hover:bg-zinc-800 hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
              onClick={() => { router.push('/premium'); onClose(); }}
            >
              <Crown className="mr-2 h-4 w-4" /> Go Premium
            </Button>
          </div>
        </>
      )}

      <Separator className="my-2 bg-zinc-700" />

      <div className="px-2 py-2">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800 hover:text-yellow-500" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Log Out
        </Button>
      </div>
    </motion.div>
  )
}

export default ProfileDropdown;