'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bell, Search, Menu, Zap, Filter, Sun, Moon, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NotificationTab from '@/partials/Notification';
import ChatApp from '@/components/ChatApp';
import { Switch } from "@/components/ui/switch"
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropDown';
import { FaTelegram, FaFacebookMessenger, FaBell } from 'react-icons/fa';
import NotificationPopup from './NotificationPopup'

const Header = ({ avatar, userId, onFilterClick, onMenuClick, currentPage, isDarkTheme, isPremium, isLoggedIn }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    router.push('/submit-product');
  };

  const handleGoLogin = () => {
    router.push('/auth');
  };

  const handleCreateThread = () => {
    router.push('/create-thread/6777b1e1da5ff8bd42fbbbd8')
  }

  const handleAvatarClick = () => {
    router.push(`/user/${userId}`);
  };

  const handleNotification = () => {
    router.push(`/notifications`);
  };

  useEffect(() => {
    const fetchNotifications = async (userId) => {
      try {
        const response = await fetch('/api/get-notification', {
          method: 'POST',
          body: JSON.stringify({ userId: userId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (data.success && data.data.some(notification => !notification.read)) {
          setHasUnreadNotifications(true);
        } else {
          setHasUnreadNotifications(false);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications(userId);
  }, [userId]);

  const renderHeaderButtons = () => {
    if (currentPage && currentPage === '/chat-box') {
      return null;
    }

    if (currentPage && currentPage === '/ranking') {
      return (
        <div
          onClick={handleAvatarClick}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative"
        >
          <img
            src={avatar}
            alt="User Avatar"
            className="object-cover w-full h-full"
          />
        </div>
      );
    }

    if (currentPage && currentPage === '/submit-project') {
      return null;
    }

    if (currentPage && currentPage === '/chat') {
      return null;
    }

    if (currentPage && currentPage === 'admin') {
      return null;
    }

    if (currentPage && currentPage.startsWith('/project/')) {
      return null;
    }

    if (currentPage && currentPage.startsWith('/user/')) {
      return null;
    }

    return (
      <>
        <Button 
          onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
          className={`relative ${isDarkTheme ? 'bg-white/10 text-white font-semibold shadow-lg hover:shadow-xl transition-all hidden md:flex' : 'bg-black/10 hover:bg-black/10 hover:shadow-xl text-black font-semibold shadow-lg transition-all hidden md:flex'}`}
        >
          <FaBell />
          {hasUnreadNotifications && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 rounded-full" />
          )}
        </Button>

        <Button onClick={() => { router.push('/chat') }} className={`${isDarkTheme ? 'bg-white/10 text-white font-semibold shadow-lg hover:shadow-xl transition-all hidden md:flex' : 'bg-black/10 hover:bg-black/10 hover:shadow-xl text-black font-semibold shadow-lg transition-all hidden md:flex'}`}>
          <FaFacebookMessenger />
        </Button>

        <Button onClick={() => { router.push('https://t.me/suizedto') }} className={`${isDarkTheme ? 'bg-white/10 text-white font-semibold shadow-lg hover:shadow-xl transition-all hidden md:flex' : 'bg-black/10 hover:bg-black/10 hover:shadow-xl text-black font-semibold shadow-lg transition-all hidden md:flex'}`}>
          <FaTelegram /> Join Telegram
        </Button>

        {!isPremium && isLoggedIn && (
          <Button
            onClick={() => router.push('/premium')}
            className={`${isDarkTheme ? 'bg-white/10 text-white font-semibold shadow-lg hover:shadow-xl transition-all hidden md:flex' : 'bg-black/10 hover:bg-black/10 hover:shadow-xl text-black font-semibold shadow-lg transition-all hidden md:flex'}`}
          >
            <Crown className="w-5 h-5 mr-2" /> Go Premium
          </Button>
        )}

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <motion.div
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer ${isProfileDropdownOpen ? 'ring-2 ring-yellow-500' : ''}`}
              >
                <img
                  src={avatar || "/placeholder.svg"}
                  alt="User Avatar"
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <ProfileDropdown
                    isOpen={isProfileDropdownOpen}
                    onClose={() => setIsProfileDropdownOpen(false)}
                    avatar={avatar}
                    userId={userId}
                    isPremium={isPremium}
                    hasUnreadNotifications={hasUnreadNotifications}
                    isDarkTheme={isDarkTheme}
                  />
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button onClick={handleGoLogin} className={`${isDarkTheme ? 'bg-white/10 text-white font-semibold shadow-lg hover:shadow-xl transition-all hidden md:flex' : 'bg-black/10 hover:bg-black/10 hover:shadow-xl text-black font-semibold shadow-lg transition-all hidden md:flex'}`}>
              Login / Register
            </Button>
          )}
        </div>

        <div className="relative">
          <NotificationPopup
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            userId={userId}
            isDarkTheme={isDarkTheme}
          />
        </div>
      </>
    );
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl ${isDarkTheme ? 'bg-black/50' : 'bg-white/50'} border-b ${isDarkTheme ? 'border-white/10' : 'border-black/10'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              
              <img
                src="https://i.postimg.cc/85s7TkJz/suize-364-424-og-white-logo.png"
                alt="Logo"
                className="w-10 h-10 object-cover"
              />
              <div className="relative inline-block">
                <span className={`font-bold text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>Suized</span>
                <span className="absolute -top-2 -right-2 text-yellow-500 bg-opacity-20 text-xs font-semibold rounded px-1">
                  Beta
                </span>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-4 gap-0">
              <Link href="/feed" className={`${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>Explore</Link>
              <Link href="/market" className={`${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>Marketplace</Link>
              <Link href="/about-us" className={`${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>About Us</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {renderHeaderButtons()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;