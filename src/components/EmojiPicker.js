'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, X, Search, Lock } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function EnhancedEmojiPicker({ onEmojiSelect, isDarkTheme, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [emojis, setEmojis] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState('bottom');
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsPremiumUser(decodedToken.isPremium);
    }

    fetch('/api/emojis')
      .then(response => response.json())
      .then(data => setEmojis(data));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (buttonRef.current && isOpen) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        const pickerHeight = 350;

        if (spaceBelow < pickerHeight && spaceAbove > spaceBelow) {
          setPosition('top');
        } else {
          setPosition('bottom');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const handleEmojiClick = (emoji) => {
    if (emoji.isPremium && !isPremiumUser) {
      return;
    }
    if (onEmojiSelect) {
      onEmojiSelect(emoji.emojiTitle);
    }
    setIsOpen(false);
  };
  

  const filteredEmojis = emojis.filter(emoji =>
    emoji.emojiTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative inline-block">
      {trigger ? (
        <div ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
      ) : (
        <Button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="icon"
          className={`text-white hover:text-white m-3 hover:bg-white/10 ${
            isDarkTheme ? 'bg-white/0 text-white' : 'bg-white text-black border-zinc-500 hover:text-black hover:bg-zinc-200'
          }`}
        >
          <Smile className="h-5 w-5" />
        </Button>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={pickerRef}
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-72 ${isDarkTheme ? 'bg-black/90 text-white' : 'bg-white text-black border-zinc-500'} backdrop-blur-xl border border-white/10 rounded-lg shadow-lg overflow-hidden z-50`}
          >
            <div className="p-4">
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search emojis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full bg-white/5 border-white/20 ${isDarkTheme ? 'text-white' : 'text-black border-zinc-500'}  placeholder-white/50 p-2 rounded-md`}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              </div>
              
              <hr className={`border-t ${isDarkTheme ? 'border-white/20' : 'border-black/10'}`} />
            </div>
            <div className="max-h-60 overflow-y-auto p-4 grid grid-cols-4 gap-4">
              {filteredEmojis.map((emoji, index) => (
                <TooltipProvider key={`${emoji.id}-${index}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => handleEmojiClick(emoji)}
                        className={`relative flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all hover:bg-black/10 hover:scale-110 ${emoji.isPremium && !isPremiumUser ? 'opacity-50' : ''}`}
                      >
                        <img
                          src={emoji.emojiUrl}
                          alt={emoji.emojiTitle}
                          className="w-8 h-8"
                        />
                        {emoji.isPremium && !isPremiumUser && (
                          <Lock className="absolute top-0 right-0 h-4 w-4 text-yellow-500" />
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {emoji.isPremium && !isPremiumUser
                        ? "Subscribe to premium to use this emoji"
                        : emoji.emojiTitle}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}