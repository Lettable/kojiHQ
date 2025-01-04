'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bell, Search, Menu, Zap, Filter, Sun, Moon, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NotificationTab from '@/partials/Notification';
import ChatApp from '@/components/ChatApp';
import { Switch } from "@/components/ui/switch"

const Header = ({ avatar, userId, onFilterClick, onMenuClick, currentPage, isDarkTheme, isPremium, isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    router.push('/submit-project');
  };

  const handleGoLogin = () => {
    router.push('/auth');
  };

  const handleAvatarClick = () => {
    router.push(`/user/${userId}`);
  };

  const handleNotification = () => {
    router.push(`/notifications`);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/get-notification', {
          method: 'POST',
          body: JSON.stringify({ userId }),
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

    fetchNotifications();
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
          variant="ghost"
          size="icon"
          className="relative hover:bg-white/10 hover:text-white"
          onClick={handleNotification}
        >
          <Bell className="h-5 w-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full" />
          )}
        </Button>

        {/* <ChatApp isOpen={isChatOpen} setIsOpen={setIsChatOpen} /> */}
        {/* <NotificationTab isOpen={isOpen} setIsOpen={setIsOpen} userId={userId} isDarkTheme={isDarkTheme} /> */}

        {!isPremium && (
          <Button
            onClick={() => router.push('/premium')}
            className={`${isDarkTheme ? 'bg-white/10 text-white font-semibold shadow-lg hover:shadow-xl transition-all hidden md:flex' : 'bg-black/10 hover:bg-black/10 hover:shadow-xl text-black font-semibold shadow-lg transition-all hidden md:flex'}`}
          >
            <Crown className="w-5 h-5 mr-2" /> Go Premium
          </Button>
        )}

        <Button onClick={handleSubmit} className={`${isDarkTheme ? 'bg-white/10 text-white font-semibold shadow-lg hover:shadow-xl transition-all hidden md:flex' : 'bg-black/10 hover:bg-black/10 hover:shadow-xl text-black font-semibold shadow-lg transition-all hidden md:flex'}`}>
          + SUBMIT A PRODUCT
        </Button>

        {isLoggedIn && (
          <div
          onClick={handleAvatarClick}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative"
        ><img
            src={avatar}
            alt="User Avatar"
            className="object-cover w-full h-full border hover:border-2 hover:border-yellow-500"
          />
          </div>
        )}
        {!isLoggedIn && (
          <Button onClick={handleGoLogin} className={`${isDarkTheme ? 'bg-white/10 text-white font-semibold shadow-lg hover:shadow-xl transition-all hidden md:flex' : 'bg-black/10 hover:bg-black/10 hover:shadow-xl text-black font-semibold shadow-lg transition-all hidden md:flex'}`}>
          Login / Register
        </Button>
        )}
      </>
    );
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl ${isDarkTheme ? 'bg-black/50' : 'bg-white/50'} border-b ${isDarkTheme ? 'border-white/10' : 'border-black/10'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-yellow-400" />
              <div className="relative inline-block">
                <span className={`font-bold text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>Koji Marketplace</span>
                <span className="absolute -top-2 -right-2 text-yellow-500 bg-opacity-20 text-xs font-semibold rounded px-1">
                  Beta
                </span>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-4 gap-0">
              <Link href="/feed" className={`${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>Explore</Link>
              <Link href="/market" className={`${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>Marketplace</Link>
              <Link href="https://t.me/KojiHQ" className={`${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>Telegram</Link>
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