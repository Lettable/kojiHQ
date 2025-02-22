'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { jwtDecode } from 'jwt-decode'
import { ChevronDown, Search, Send, UserX, Plus, CornerUpLeft, X, Pin, PinOff } from 'lucide-react'
import Header from '@/partials/Header'
import EnhancedEmojiPicker from '@/components/EmojiPicker'
import { useRouter } from 'next/navigation'
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster";

const renderTextWithEmojis = (text, emojis) => {
  if (!emojis || !Array.isArray(emojis)) {
    return text
  }

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
            className={`inline-block w-4 h-4 ${emoji.isAnimated ? 'animate-pulse' : ''}`}
          />
        )
      } else {
        return `:${part}:`
      }
    }
  })
}

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState({})
  const [currentUserID, setCurrentUserID] = useState({})
  const [token, setToken] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState({})
  const [newMessage, setNewMessage] = useState('')
  const [blockedUsers, setBlockedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredChats, setFilteredChats] = useState([])
  const [isStartChatOpen, setIsStartChatOpen] = useState(false)
  const [searchUserQuery, setSearchUserQuery] = useState('')
  const [searchUserResults, setSearchUserResults] = useState([])
  const [emojis, setEmojis] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [allChats, setAllChats] = useState([])
  const [replyTo, setReplyTo] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [IsCurrentUserPremium, SetCurrentUserAsPremium] = useState()
  const [pinnedChats, setPinnedChats] = useState([])
  const messageEndRef = useRef(null)
  const scrollAreaRef = useRef(null)
  const messageRefs = useRef({})
  const router = useRouter()
  const wsRef = useRef(null)
  const audioRef = useRef(null)
  const longPressTimerRef = useRef(null)
  const [isReordering, setIsReordering] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    audioRef.current = new Audio('/emojis/notify.mp3')
    audioRef.current.load()
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const storedTheme = localStorage.getItem('theme')
    setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true)
    const storedPinnedChats = JSON.parse(localStorage.getItem('pinnedChats') || '[]')
    setPinnedChats(storedPinnedChats)

    if (!token) {
      router.push('/auth')
    } else {
      setToken(token)
      try {
        const decoded = jwtDecode(token)
        setCurrentUser(decoded)
        setCurrentUserID(decoded.userId)
        SetCurrentUserAsPremium(decoded.isPremium)
        initializeWebSocket(decoded.userId)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [router])

  useEffect(() => {
    if (currentUser.userId) {
      fetchLastMessages()
      fetchBlockedUsers()
      fetchEmojis()
    }
  }, [currentUser.userId])

  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat)
      scrollToBottom()
    }
  }, [selectedChat, scrollToBottom])

  const initializeWebSocket = (userId) => {
    wsRef.current = new WebSocket(`wss://kojihq-ws.onrender.com/p2p?userId=${userId}`)

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established')
    }

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (!blockedUsers.includes(message.senderId)) {
        setMessages(prev => ({
          ...prev,
          [message.senderId]: [
            ...(prev[message.senderId] || []),
            {
              ...message,
              parentId: message.parentId || null,
              parentMessageContent: message.parentMessageContent || null,
            },
          ],
        }))

        if (message.senderId !== selectedChat) {
          updateUnreadCount(message.senderId)
        }
        updateLastMessage(message.senderId, message.content)

        if (selectedChat === message.senderId) {
          scrollToBottom()
        }
      }
    }

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed')
    }

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  const updateUnreadCount = (senderId) => {
    if (!blockedUsers.includes(senderId)) {
      setAllChats(prev => prev.map(chat =>
        chat.userId === senderId
          ? { ...chat, unread: (chat.unread || 0) + 1 }
          : chat
      ))
    }
  }

  const updateLastMessage = (senderId, content) => {
    if (!blockedUsers.includes(senderId)) {
      setAllChats(prev => {
        const updatedChats = prev.map(chat =>
          chat.userId === senderId
            ? {
              ...chat,
              lastMessage: content,
              timestamp: new Date().toISOString(),
              unread: senderId !== selectedChat ? (chat.unread || 0) + 1 : 0
            }
            : chat
        )

        if (!updatedChats.some(chat => chat.userId === senderId)) {
          const newUser = searchUserResults.find(user => user.id === senderId)
          if (newUser) {
            updatedChats.unshift({
              userId: newUser.id,
              name: newUser.username,
              profilePic: newUser.profilePic,
              lastMessage: content,
              timestamp: new Date().toISOString(),
              unread: 1
            })
          }
        }

        return updatedChats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      })
    }
  }

  const fetchLastMessages = async () => {
    try {
      const response = await fetch('/api/get-last-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: currentUserID })
      })
      const data = await response.json()
      if (data.success) {
        const filteredData = data.data.filter(chat => !blockedUsers.includes(chat.userId))
        setAllChats(filteredData)
        setFilteredChats(filteredData)
      }
    } catch (error) {
      console.error('Error fetching last messages:', error)
    }
  }

  useEffect(() => {
    const filtered = allChats.filter(chat =>
      !blockedUsers.includes(chat.userId) &&
      (chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredChats(filtered)
  }, [searchQuery, allChats, blockedUsers])

  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch('/api/get-blocked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: currentUser.userId })
      })
      const data = await response.json()
      if (data.success) {
        setBlockedUsers(data.blockedUsers.map(user => user._id))
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error)
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

  const fetchMessages = async (recipientId) => {
    try {
      const response = await fetch('/api/get-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: currentUser.userId, recipientId })
      })
      const data = await response.json()
      if (data.success) {
        setMessages(prev => ({ ...prev, [recipientId]: data.data }))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() && selectedChat) {
      if (selectedChat === currentUser.userId) {
        toast({
          title: "Error",
          description: "You cannot send messages to yourself.",
          variant: "destructive",
        });
        return;
      }

      const emojiRegex = /:([\w-]+):/g;
      const foundEmojis = newMessage.match(emojiRegex) || [];

      for (const emojiTitle of foundEmojis) {
        const emojiData = emojis.find((e) => e.emojiTitle === emojiTitle);
        if (emojiData && emojiData.isPremium && !IsCurrentUserPremium) {
          alert(`Subscribe to Premium to use premium emojis like ${emojiTitle}`);
          return;
        }
      }

      try {
        const messageData = {
          recipientId: selectedChat,
          content: newMessage,
          parentId: replyTo ? replyTo._id : null,
        };

        wsRef.current.send(JSON.stringify(messageData));

        const newMessageObj = {
          _id: Date.now().toString(),
          senderId: currentUser.userId,
          ...messageData,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), newMessageObj],
        }));

        updateLastMessage(selectedChat, newMessage);
        setNewMessage("");
        setReplyTo(null);
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleReply = (message) => {
    setReplyTo(message)
  }

  const handleCancelReply = () => {
    setReplyTo(null)
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const scrollToMessage = (messageId) => {
    const messageElement = messageRefs.current[messageId]
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleBlockUser = async () => {
    if (selectedChat) {
      try {
        const response = await fetch('/api/block-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: currentUser.userId,
            recipientId: selectedChat,
            action: blockedUsers.includes(selectedChat) ? 'unblock' : 'block'
          })
        })
        const data = await response.json()
        if (data.success) {
          if (blockedUsers.includes(selectedChat)) {
            setBlockedUsers(prev => prev.filter(id => id !== selectedChat))
            toast({
              title: "User Unblocked",
              description: "You have unblocked this user.",
              variant: "destructive",
            })
          } else {
            setBlockedUsers(prev => [...prev, selectedChat])
            setAllChats(prev => prev.map(chat =>
              chat.userId === selectedChat
                ? { ...chat, lastMessage: "You blocked this user" }
                : chat
            ))
            toast({
              title: "User Blocked",
              description: "You have blocked this user.",
              variant: "destructive",
            })
          }
          fetchLastMessages()
        }
      } catch (error) {
        console.error('Error blocking/unblocking user:', error)
      }
    }
  }

  const handleStartChat = async (recipientId) => {
    if (recipientId === currentUser.userIrecipientId === currentUser.userId) {
      toast({
        title: "Error",
        description: "You cannot start a chat with yourself.",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/start-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ starterId: currentUser.userId, recipientId })
      })
      const data = await response.json()
      if (data.success) {
        setIsStartChatOpen(false)
        const newUser = searchUserResults.find(user => user.id === recipientId)
        if (newUser) {
          const newChat = {
            userId: newUser.id,
            name: newUser.username,
            profilePic: newUser.profilePic,
            lastMessage: '',
            timestamp: new Date().toISOString(),
            unread: 0
          }
          setAllChats(prev => [newChat, ...prev])
        }
        setSelectedChat(recipientId)
        toast({
          title: "Chat Started",
          description: `You can now chat with ${newUser?.username}.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error starting chat:', error)
    }
  }

  const handleSearchUsers = async () => {
    try {
      const response = await fetch('/api/user-action/search-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: searchUserQuery })
      })
      const data = await response.json()
      if (data.success) {
        setSearchUserResults(data.data.filter(user => user.id !== currentUser.userId))
      }
    } catch (error) {
      console.error('Error searching users:', error)
    }
  }

  const handleEmojiSelect = (emojiTitle) => {
    setNewMessage(prev => `${prev} ${emojiTitle}`)
  }

  const handlePinChat = (chatId) => {
    setPinnedChats(prev => {
      const newPinnedChats = prev.includes(chatId)
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
      localStorage.setItem('pinnedChats', JSON.stringify(newPinnedChats))
      return newPinnedChats
    })
  }

  const handleLongPress = (chatId) => {
    longPressTimerRef.current = setTimeout(() => {
      setIsReordering(true)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }
  }

  const reorderChats = (reorderedChats) => {
    setAllChats(reorderedChats)
  }

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Header
        setIsOpen={() => { }}
        avatar={currentUser.profilePic}
        userId={currentUser.userId}
        currentPage='/chat'
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex h-[85vh] rounded-xl overflow-hidden border shadow-lg backdrop-blur-xl ${
            isDarkTheme 
              ? 'border-white/10 bg-black/40' 
              : 'border-black/10 bg-white/40'
          }`}
        >
          {/* Chat list sidebar */}
          <AnimatePresence>
            {(!isMobile || !selectedChat) && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`${isMobile ? 'w-full' : 'w-1/4'} border-r ${
                  isDarkTheme ? 'border-white/10' : 'border-black/10'
                }`}
              >
                <div className="p-4 flex items-center space-x-2">
                  <Input
                    placeholder="Search chats"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${
                      isDarkTheme
                        ? 'bg-white/5 border-white/10 focus:border-blue-400/50'
                        : 'bg-black/5 border-black/10 focus:border-blue-600/50'
                    } rounded-md transition-colors`}
                  />
                  <Button
                    onClick={() => setIsStartChatOpen(true)}
                    variant="ghost"
                    size="icon"
                    className={`rounded-md hover:bg-${isDarkTheme ? 'white' : 'black'}/10 hover:text-white`}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <ScrollArea className="h-[calc(85vh-4rem)]">
                  <Reorder.Group axis="y" values={filteredChats} onReorder={reorderChats}>
                    {filteredChats.map((chat) => (
                      <Reorder.Item key={chat.userId} value={chat}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-4 hover:bg-${isDarkTheme ? 'white' : 'black'}/10 cursor-pointer transition-colors ${selectedChat === chat.userId ? `bg-${isDarkTheme ? 'white' : 'black'}/10` : ''
                            }`}
                          onClick={() => {
                            setSelectedChat(chat.userId)
                            setAllChats(prev => prev.map(c =>
                              c.userId === chat.userId ? { ...c, unread: 0 } : c
                            ))
                          }}
                          onTouchStart={() => handleLongPress(chat.userId)}
                          onTouchEnd={handleTouchEnd}
                          onMouseDown={() => handleLongPress(chat.userId)}
                          onMouseUp={handleTouchEnd}
                          onMouseLeave={handleTouchEnd}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={chat.profilePic} />
                              <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className={`${chat.nameEffect}`}>
                                  {chat.name} {chat.statusEmoji && renderTextWithEmojis(chat.statusEmoji, emojis)}
                                </span>
                                <span className={`text-xs ${isDarkTheme ? 'text-white/50' : 'text-black/50'}`}>
                                  {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className={`text-sm ${isDarkTheme ? 'text-white/70' : 'text-black/70'} truncate`}>
                                {/* {blockedUsers.includes(chat.userId) ? "You blocked this user" : renderTextWithEmojis(chat.lastMessage, emojis)} */}
                                {blockedUsers.includes(chat.userId) ? "You blocked this user" : renderTextWithEmojis(chat.lastMessage.length > 20 ? `${chat.lastMessage.slice(0, 20)}...` : chat.lastMessage, emojis)}
                              </p>
                            </div>
                            {!blockedUsers.includes(chat.userId) && chat.unread > 0 && (
                              <Badge className="bg-blue-500 text-white">{chat.unread}</Badge>
                            )}
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePinChat(chat.userId)
                              }}
                            >
                              {pinnedChats.includes(chat.userId) ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                            </Button> */}
                          </div>
                        </motion.div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat window */}
          <AnimatePresence>
            {(!isMobile || selectedChat) && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex-1 flex flex-col"
              >
                {selectedChat ? (
                  <>
                    {/* Chat header */}
                    <div className={`p-4 border-b ${isDarkTheme ? 'border-white/10 backdrop-blur-md bg-white/5' : 'border-black/10 backdrop-blur-md bg-black/5'
                      } flex justify-between items-center`}>
                      <div className="flex items-center space-x-3">
                        {isMobile && (
                          <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}>
                            <ChevronDown className="h-5 w-5" />
                          </Button>
                        )}
                        <Avatar>
                          <AvatarImage src={filteredChats.find(c => c.userId === selectedChat)?.profilePic} />
                          <AvatarFallback>{filteredChats.find(c => c.userId === selectedChat)?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className={`${filteredChats.find(c => c.userId === selectedChat)?.nameEffect}`}>
                          {filteredChats.find(c => c.userId === selectedChat)?.name} {filteredChats.find(c => c.userId === selectedChat)?.statusEmoji && renderTextWithEmojis(filteredChats.find(c => c.userId === selectedChat)?.statusEmoji, emojis)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={handleBlockUser}>
                          <UserX className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                      {blockedUsers.includes(selectedChat) ? (
                        <div className="flex items-center justify-center h-full">
                          <p className={isDarkTheme ? 'text-white/50' : 'text-black/50'}>You have blocked this user.</p>
                        </div>
                      ) : (
                        <>
                          {messages[selectedChat]?.map((message) => (
                            <div
                              key={message._id}
                              className={`group mb-4 flex ${message.senderId === currentUser.userId ? 'justify-end' : 'justify-start'}`}
                              ref={(el) => (messageRefs.current[message._id] = el)}
                            >
                              <div
                                className={`relative max-w-[70%] p-4 rounded-2xl ${
                                  message.senderId === currentUser.userId
                                    ? 'bg-blue-600 text-white'
                                    : isDarkTheme
                                      ? 'bg-white/10 text-white'
                                      : 'bg-black/5 text-black'
                                } shadow-sm hover:shadow-md transition-shadow`}
                              >
                                {message.parentId && (
                                  <div
                                    className={`text-xs mb-2 p-2 rounded-lg cursor-pointer ${
                                      isDarkTheme ? 'bg-black/20' : 'bg-white/20'
                                    } hover:opacity-80 transition-opacity`}
                                    onClick={() => scrollToMessage(message.parentId)}
                                  >
                                    Replying to: {message.parentMessageContent || "Your own message"}
                                  </div>
                                )}
                                <div className="message-content">{renderTextWithEmojis(message.content, emojis)}</div>
                                <span className={`text-xs ${isDarkTheme ? 'text-white/50' : 'text-black/50'} mt-2 block`}>
                                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReply(message)}
                                className={`relative opacity-0 group-hover:opacity-100 rounded-md hover:bg-${
                                  isDarkTheme ? 'white' : 'black'
                                }/10 hover:text-white transition-all duration-200 ${
                                  message.senderId === currentUser.userId ? 'mr-2' : 'ml-2'
                                }`}
                              >
                                <CornerUpLeft className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}

                          <div ref={messageEndRef} />
                        </>
                      )}
                    </ScrollArea>

                    {/* Message input */}
                    {!blockedUsers.includes(selectedChat) && (
                      <form
                        onSubmit={handleSendMessage}
                        className={`p-4 border-t ${
                          isDarkTheme
                            ? 'border-white/10 bg-black/20'
                            : 'border-black/10 bg-white/20'
                        } backdrop-blur-md`}
                      >
                        {replyTo && (
                          <div className={`flex items-center justify-between mb-2 p-2 rounded-md ${
                            isDarkTheme ? 'bg-white/5' : 'bg-black/5'
                          }`}>
                            <span className={`text-sm ${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>
                              Replying to: {replyTo.content}
                            </span>
                            <Button variant="ghost" size="sm" onClick={handleCancelReply} className="rounded-md hover:text-white">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className={`flex-1 rounded-md ${
                              isDarkTheme
                                ? 'bg-white/5 border-white/10 focus:border-blue-400/50'
                                : 'bg-black/5 border-black/10 focus:border-blue-600/50'
                            } transition-colors`}
                          />
                          <div onClick={(e) => { e.stopPropagation(); }}>
                            <EnhancedEmojiPicker onEmojiSelect={handleEmojiSelect} isDarkTheme={isDarkTheme} />
                          </div>
                          <Button 
                            type="submit" 
                            variant="ghost" 
                            disabled={!newMessage.trim()} 
                            size="icon"
                            className="rounded-md hover:bg-blue-500/20 hover:text-white transition-colors"
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        </div>
                      </form>
                    )}
                  </>
                ) : (
                  <div className={`flex-1 flex items-center justify-center ${isDarkTheme ? 'text-white/50' : 'text-black/50'}`}>
                    Select a chat to start messaging
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Start Chat Dialog */}
      <Dialog open={isStartChatOpen} onOpenChange={setIsStartChatOpen}>
        <DialogContent className={`${isDarkTheme
          ? 'bg-black border-white/10 text-white backdrop-blur-lg bg-white/5'
          : 'bg-white border-black/10 text-black backdrop-blur-lg bg-black/5'
          }`}>
          <DialogHeader>
            <DialogTitle>Start a New Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search users"
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                className={`${isDarkTheme
                  ? 'bg-white/5 border-white/10 focus:border-blue-400/50'
                  : 'bg-black/5 border-black/10 focus:border-blue-600/50'
                  } transition-colors`}
              />
              <Button onClick={handleSearchUsers} variant="ghost">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="h-64">
              {searchUserResults.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 hover:bg-${isDarkTheme ? 'white' : 'black'}/10 cursor-pointer transition-colors flex items-center space-x-2`}
                  onClick={() => handleStartChat(user.id)}
                >
                  <Avatar>
                    <AvatarImage src={user.profilePic} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex'>
                    <div className={`font-semibold ${user.usernameEffect}`}>{user.username}</div>
                    {user?.statusEmoji && (
                      <span className='ml-2'>{renderTextWithEmojis(user.statusEmoji, emojis)}</span>
                    )}

                  </div>
                </motion.div>
              ))}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}