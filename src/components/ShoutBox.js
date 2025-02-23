"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { jwtDecode } from "jwt-decode"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Send, PencilIcon, Trash2Icon } from "lucide-react"
import EnhancedEmojiPicker from "@/components/EmojiPicker"
import Link from "next/link"
import LoadingIndicator from "@/components/LoadingIndicator"
import MarkdownWithEmojis from "@/partials/MarkdownWithEmojis"
import GifPicker from "./gifPicker"
import ImageUploader from "./imgUpload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const MAX_MESSAGE_LENGTH = 500
const MAX_DISPLAYED_MESSAGES = 40

const formatTimestamp = (date) => {
  const now = new Date()
  const messageDate = new Date(date)
  const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diffDays < 7) {
    return (
      messageDate.toLocaleDateString([], { weekday: "short" }) +
      " " +
      messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    )
  } else {
    return (
      messageDate.toLocaleDateString([], { month: "short", day: "numeric" }) +
      " " +
      messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    )
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

export default function Shoutbox({ isSettingsDialogOpen, setIsSettingsDialogOpen }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [user, setUser] = useState(null)
  const [statusEmoji, setStatusEmoji] = useState(null)
  const [emojis, setEmojis] = useState([])
  const [userData, setUserData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [editContent, setEditContent] = useState("")
  const [fva, setFva] = useState("/emojis/notify.mp3")
  const [msb, setMsb] = useState(false)
  const [timeOffset, setTimeOffset] = useState(0)

  const scrollAreaRef = useRef(null)
  const wsRef = useRef(null)
  const usernameRef = useRef("")
  const audioRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const res = await fetch("/api/mics/s-t")
        const data = await res.json()
        const serverTime = new Date(data.serverTime).getTime()
        const clientTime = Date.now()
        setTimeOffset(serverTime - clientTime)
      } catch (error) {
        console.error("Error fetching server time:", error)
      }
    }

    fetchServerTime()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFva = localStorage.getItem("fva") || "/emojis/notify.mp3"
      const storedMsb = localStorage.getItem("msb") === "true"
      setFva(storedFva)
      setMsb(storedMsb)
      if (!storedMsb) {
        audioRef.current = new Audio(storedFva)
        audioRef.current.load()
      }
    }
  }, [])

  const VB88_COMMAND_REGEX = /^\/vb88\s+(https?:\/\/.+\.mp3)$/i;
  const GIFT_COMMAND_REGEX = /^\/gift\s+(\d+)\s+@(\w+)\s*$/i;
  const BAN_COMMAND_REGEX = /^\/ban\s+@(\w+)\s*$/i;
  const UNBAN_COMMAND_REGEX = /^\/unban\s+@(\w+)\s*$/i;

  const boss = {
    username: "Suized",
    userId: "67a5f8eb3707affe11e788a8",
    profilePic: "https://i.ibb.co/mrXm4rxg/0730b41d8ab7.png",
    usernameEffect: "olympus-effect",
    statusEmoji: ":suized:"
  }

  const handleVB88Command = (messageContent) => {
    const match = messageContent.match(VB88_COMMAND_REGEX)
    if (match) {
      const audioUrl = match[1]
      const comSigma = `**A new [song](${audioUrl}) started by @${user.username}**`;
      const correctedTime = new Date(Date.now() + timeOffset).toISOString();
      const messageData = {
        username: boss.username,
        type: "vb88_command",
        audioUrl: audioUrl,
        usernameEffect: boss.usernameEffect,
        content: comSigma,
        userId: boss.userId,
        statusEmoji: boss.statusEmoji,
        profilePic: boss.profilePic,
        createdAt: correctedTime,
      };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(messageData))
      }
      setNewMessage('');
      return true
    }
    return false
  }

  const handleGiftCommand = async (messageContent) => {
    if (messageContent.startsWith('/gift')) {
      if (!GIFT_COMMAND_REGEX.test(messageContent)) {
        const errorMessage = `Incorrect command format asshole. Correct usage: /gift 10 @Suized`;
        const correctedTime = new Date(Date.now() + timeOffset).toISOString();
        const userShit = {
          username: user.username,
          usernameEffect: user.usernameEffect ? user.usernameEffect : "regular-effect",
          content: newMessage.slice(0, MAX_MESSAGE_LENGTH),
          userId: user.userId,
          statusEmoji: statusEmoji,
          profilePic: user.profilePic,
          createdAt: correctedTime,
        };
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(userShit));
        }
        const bossData = {
          username: boss.username,
          userId: boss.userId,
          profilePic: boss.profilePic,
          usernameEffect: boss.usernameEffect,
          statusEmoji: boss.statusEmoji,
          content: errorMessage,
          createdAt: correctedTime,
          type: 'gift_command_error'
        };
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(bossData));
        }
        return true;
      }

      const match = messageContent.match(GIFT_COMMAND_REGEX);
      if (match) {
        const amount = Number(match[1]);
        const targetUsername = match[2];
        const token = localStorage.getItem('accessToken');
        const requestBody = {
          uid: user.userId,
          am: amount,
          to: targetUsername,
          tk: token,
        };

        try {
          const res = await fetch('/api/mics/gf-cmd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });
          const result = await res.json();

          let bossMessage = '';
          if (!result.success) {
            if (result.message.toLowerCase().includes("not enough credits")) {
              bossMessage = `You gotta top up before gifting @${targetUsername}!`;
            } else if (result.message.toLowerCase().includes("target user not found")) {
              bossMessage = `@${targetUsername} doesn't exist. Check the username and try again!`;
            } else if (result.message.toLowerCase().includes("unauthorized")) {
              bossMessage = `Unauthorized action Nigga, @${user.username}!`;
            } else if (result.message.toLowerCase().includes("invalid token")) {
              bossMessage = `Your session is invalid. Please log in again, @${user.username}.`;
            } else {
              bossMessage = result.message;
            }
          } else {
            bossMessage = `The gift of ${amount} credits has been transferred to @${targetUsername}!`;
          }

          const correctedTime = new Date(Date.now() + timeOffset).toISOString();
          const userShit = {
            username: user.username,
            usernameEffect: user.usernameEffect ? user.usernameEffect : "regular-effect",
            content: newMessage.slice(0, MAX_MESSAGE_LENGTH),
            userId: user.userId,
            statusEmoji: statusEmoji,
            profilePic: user.profilePic,
            createdAt: correctedTime,
          };
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(userShit));
          }
          const bossData = {
            username: boss.username,
            userId: boss.userId,
            profilePic: boss.profilePic,
            usernameEffect: boss.usernameEffect,
            statusEmoji: boss.statusEmoji,
            content: bossMessage,
            createdAt: correctedTime,
            type: 'gift_command'
          };

          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(bossData));
          }
          return true;
        } catch (error) {
          console.error("Gift command error:", error);
          return false;
        }
      }
    }
    return false;
  };

  const handleBanCommand = async (messageContent) => {
    if (messageContent.startsWith('/ban')) {
      if (!BAN_COMMAND_REGEX.test(messageContent)) {
        const errorMessage = `Incorrect command format. Correct usage: /ban @username`;
        const correctedTime = new Date(Date.now() + timeOffset).toISOString();
        const bossError = {
          username: boss.username,
          userId: boss.userId,
          profilePic: boss.profilePic,
          usernameEffect: boss.usernameEffect,
          statusEmoji: boss.statusEmoji,
          content: errorMessage,
          createdAt: correctedTime,
          type: 'ban_command_error',
        };
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(bossError));
        }
        return true;
      }

      const match = messageContent.match(BAN_COMMAND_REGEX);
      if (match) {
        const targetUsername = match[1];
        const token = localStorage.getItem('accessToken');
        const requestBody = {
          uid: user.userId,
          tk: token,
          t: targetUsername,
        };

        try {
          const res = await fetch('/api/mics/b0-nu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });
          const result = await res.json();

          let bossMessage = '';
          if (!result.success) {
            if (result.message.toLowerCase().includes("user not found")) {
              bossMessage = `Target user @${targetUsername} not found.`;
            } else if (result.message.toLowerCase().includes("unauthorized")) {
              bossMessage = `Unauthorized action, @${user.username}!`;
            } else {
              bossMessage = result.message;
            }
          } else {
            bossMessage = `User @${targetUsername} has been banned by @${user.username}. They will be logged out and not be able to log in.`;
          }

          const correctedTime = new Date(Date.now() + timeOffset).toISOString();
          const bossData = {
            username: boss.username,
            userId: boss.userId,
            profilePic: boss.profilePic,
            usernameEffect: boss.usernameEffect,
            statusEmoji: boss.statusEmoji,
            content: bossMessage,
            createdAt: correctedTime,
            type: 'ban_command',
          };

          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(bossData));
          }
          return true;
        } catch (error) {
          console.error("Ban command error:", error);
          return false;
        }
      }
    }
    return false;
  };

  const handleUnbanCommand = async (messageContent) => {
    if (messageContent.startsWith('/unban')) {
      if (!UNBAN_COMMAND_REGEX.test(messageContent)) {
        const errorMessage = `Incorrect command format. Correct usage: /unban @username`;
        const correctedTime = new Date(Date.now() + timeOffset).toISOString();
        const bossError = {
          username: boss.username,
          userId: boss.userId,
          profilePic: boss.profilePic,
          usernameEffect: boss.usernameEffect,
          statusEmoji: boss.statusEmoji,
          content: errorMessage,
          createdAt: correctedTime,
          type: 'unban_command_error',
        };
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(bossError));
        }
        return true;
      }

      const match = messageContent.match(UNBAN_COMMAND_REGEX);
      if (match) {
        const targetUsername = match[1];
        const token = localStorage.getItem('accessToken');
        const requestBody = {
          uid: user.userId,
          tk: token,
          t: targetUsername,
        };

        try {
          const res = await fetch('/api/mics/unb4n', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });
          const result = await res.json();

          let bossMessage = '';
          if (!result.success) {
            if (result.message.toLowerCase().includes("user not found")) {
              bossMessage = `Target user @${targetUsername} not found.`;
            } else if (result.message.toLowerCase().includes("unauthorized")) {
              bossMessage = `Unauthorized action, @${user.username}!`;
            } else if (result.message.toLowerCase().includes("not banned")) {
              bossMessage = `User @${targetUsername} is not banned.`;
            } else {
              bossMessage = result.message;
            }
          } else {
            bossMessage = `User @${targetUsername} has been unbanned by @${user.username}. They can now log in again.`;
          }

          const correctedTime = new Date(Date.now() + timeOffset).toISOString();
          const bossData = {
            username: boss.username,
            userId: boss.userId,
            profilePic: boss.profilePic,
            usernameEffect: boss.usernameEffect,
            statusEmoji: boss.statusEmoji,
            content: bossMessage,
            createdAt: correctedTime,
            type: 'unban_command',
          };

          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(bossData));
          }
          return true;
        } catch (error) {
          console.error("Unban command error:", error);
          return false;
        }
      }
    }
    return false;
  };

  const connectWebSocket = useCallback(() => {
    if (typeof window === "undefined") return
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return

    wsRef.current = new WebSocket("wss://kojihq-ws.onrender.com")

    wsRef.current.onopen = () => {
      console.log("WebSocket connected")
      setIsWebSocketConnected(true)
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }

    wsRef.current.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data)
        if (parsedData.message.type === "vb88_command") {
          if (!msb && audioRef.current) {
            audioRef.current = new Audio(parsedData.message.audioUrl)
            audioRef.current.load()
            audioRef.current.currentTime = 0
            audioRef.current.play().catch((error) => {
              console.error("Error playing audio:", error)
            })
          }
        }

        if (parsedData.message.type === "vb88_command") {
          if (!msb && audioRef.current) {
            audioRef.current = new Audio(parsedData.message.audioUrl);
            audioRef.current.load();
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((error) => {
              console.error("Error playing audio:", error);
            });
          }
        }

        if (parsedData.message.type === "ban_command" && user) {
          const bannedUsernameRegex = /@(\w+)/gi;
          let match;
          let isBanned = false;
          while ((match = bannedUsernameRegex.exec(parsedData.message.content)) !== null) {
            if (match[1].toLowerCase() === user.username.toLowerCase()) {
              isBanned = true;
              break;
            }
          }
          if (isBanned) {
            window.location.reload();
            return;
          }
        }

        const newMsg = parsedData.message
        if (!newMsg || !newMsg.content) return

        setMessages((prev) => {
          const updatedMessages = [...prev, { ...newMsg, _id: newMsg._id || `temp-${Date.now()}` }]
          return updatedMessages.slice(-MAX_DISPLAYED_MESSAGES)
        })
        scrollToBottom()
      } catch (error) {
        console.error("Error handling WebSocket message:", error)
      }
    }

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    wsRef.current.onclose = (event) => {
      console.log("WebSocket disconnected", event.reason)
      setIsWebSocketConnected(false)
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000)
    }
  }, [msb])

  const scrollToBottom = useCallback(() => {
    if (typeof window === "undefined") return
    requestAnimationFrame(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
        if (scrollContainer) {
          const scrollHeight = scrollContainer.scrollHeight
          const clientHeight = scrollContainer.clientHeight
          const maxScroll = scrollHeight - clientHeight

          scrollContainer.scrollTo({
            top: maxScroll,
            behavior: 'smooth'
          })
        }
      }
    })
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [emojisResponse, messagesResponse, userDataResponse] = await Promise.all([
          fetch("/api/emojis"),
          fetch("/api/messages"),
          fetch("/api/mics/mention-regex"),
        ])

        if (!emojisResponse.ok || !messagesResponse.ok || !userDataResponse.ok) {
          throw new Error("Failed to fetch emojis, messages, or user data")
        }

        const emojisData = await emojisResponse.json()
        const messagesData = await messagesResponse.json()
        const userfuckingData = await userDataResponse.json()

        setUserData(userfuckingData.data)
        setEmojis(emojisData)
        setMessages(messagesData.messages.slice(-MAX_DISPLAYED_MESSAGES))

        requestAnimationFrame(scrollToBottom)

        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken")
          if (token) {
            const decoded = jwtDecode(token)
            usernameRef.current = decoded.username
            setUser(decoded)

            const authResponse = await fetch(`/api/check-authorization?userId=${decoded.userId}`)
            if (!authResponse.ok) {
              throw new Error("Failed to check authorization")
            }
            const authData = await authResponse.json()
            setUser((prev) => ({ ...prev, isAuthorized: authData.isAuthorized }))

            const statusResponse = await fetch(`/api/mics/status?userId=${decoded.userId}`)
            if (!statusResponse.ok) {
              throw new Error("Failed to fetch user status")
            }
            const data = await statusResponse.json()
            setStatusEmoji(data.statusEmoji)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    if (typeof window !== "undefined") {
      connectWebSocket()
      const storedTheme = localStorage.getItem("theme")
      setIsDarkTheme(storedTheme ? storedTheme === "dark" : true)
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket, scrollToBottom])

  const sendMessage = async () => {
    if (!user || !newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    const correctedTime = new Date(Date.now() + timeOffset).toISOString()

    if (handleVB88Command(newMessage.trim())) {
      setNewMessage("")
      scrollToBottom()
      return
    }

    if (await handleGiftCommand(newMessage.trim())) {
      setNewMessage("")
      scrollToBottom()
      return
    }

    if (await handleBanCommand(newMessage.trim())) {
      setNewMessage("")
      scrollToBottom()
      return
    }

    if (await handleUnbanCommand(newMessage.trim())) {
      setNewMessage("")
      scrollToBottom()
      return
    }

    const messageData = {
      username: user.username,
      usernameEffect: user.usernameEffect ? user.usernameEffect : "regular-effect",
      content: newMessage.slice(0, MAX_MESSAGE_LENGTH),
      userId: user.userId,
      statusEmoji: statusEmoji,
      profilePic: user.profilePic,
      createdAt: correctedTime,
    }

    wsRef.current.send(JSON.stringify(messageData))
    setNewMessage("")
    scrollToBottom()
  }

  const handleDeleteClick = (message) => {
    setSelectedMessage(message)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const body = JSON.stringify({
        u: user.userId,
        c: selectedMessage.content,
        t: token,
      })
      const res = await fetch("/api/mics/d-m", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })
      const data = await res.json()
      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== selectedMessage._id))
      }
    } catch (error) {
      console.error("Error deleting message:", error)
    }
    setShowDeleteModal(false)
    setSelectedMessage(null)
  }

  const handleEditClick = (message) => {
    setSelectedMessage(message)
    setEditContent(message.content)
    setShowEditModal(true)
  }

  const confirmEdit = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const body = JSON.stringify({
        u: user.userId,
        t: token,
        tz: selectedMessage.createdAt,
        c: editContent,
      })
      const res = await fetch("/api/mics/e-m", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })
      const data = await res.json()
      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === selectedMessage._id ? { ...msg, content: editContent } : msg)),
        )
      }
    } catch (error) {
      console.error("Error editing message:", error)
    }
    setShowEditModal(false)
    setSelectedMessage(null)
    setEditContent("")
  }

  const handleImageUpload = (imageUrl) => {
    setNewMessage((prevMessage) => prevMessage + " " + imageUrl)
  }

  const handleGifSelect = (gifUrl) => {
    setNewMessage((prevMessage) => prevMessage + " " + gifUrl)
  }

  const handleEmojiSelect = (emojiTitle) => {
    setNewMessage((prev) => `${prev} ${emojiTitle}`.slice(0, MAX_MESSAGE_LENGTH))
  }

  return (
    <div className="flex flex-col h-full w-full">
      <main className="flex-grow flex flex-col overflow-hidden">
        <ScrollArea
          className="flex-grow bg-black/20 backdrop-blur-sm"
          ref={scrollAreaRef}
          style={{ height: "500px" }}
        >
          <div className="p-4 space-y-4">
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-start space-x-3 group ${message.userId === user?.userId ? "justify-end" : "justify-start"
                      }`}
                  >
                    {message.userId === user?.userId && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                        <button
                          onClick={() => handleEditClick(message)}
                          className="p-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(message)}
                          className="p-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Trash2Icon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {message.userId !== user?.userId && (
                      <Link href={`/user/${message.username}`}>
                        <img
                          src={message.profilePic || "/placeholder.svg?height=32&width=32"}
                          alt={message.username}
                          className="w-9 h-9 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        />
                      </Link>
                    )}
                    <div className={`flex flex-col ${message.userId === user?.userId ? "items-end" : "items-start"}`}>
                      <div className="relative group">
                        <div
                          className={`px-4 py-2.5 rounded-lg shadow-sm ${message.userId === user?.userId
                            ? "bg-blue-600/90 text-white"
                            : isDarkTheme
                              ? "bg-zinc-800/90 text-white"
                              : "bg-zinc-200 text-black"
                            }`}
                        >
                          {message.userId !== user?.userId && (
                            <div className="flex items-center gap-1 mb-1">
                              <span className={`font-medium text-sm ${message.usernameEffect}`}>
                                {message.username}
                              </span>
                              {renderTextWithEmojis(message.statusEmoji, emojis)}
                            </div>
                          )}
                          <MarkdownWithEmojis
                            content={message.content}
                            style={{
                              backgroundColor: "transparent",
                              padding: 0,
                              color: message.userId === user?.userId ? "white" : isDarkTheme ? "white" : "black"
                            }}
                            users={userData}
                            emojisData={emojis}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-zinc-500 mt-1.5">
                        {formatTimestamp(message.createdAt)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className={`border-t ${isDarkTheme ? "border-white/10" : "border-black/10"} p-4 bg-black/20 backdrop-blur-sm`}>
          {isWebSocketConnected ? (
            user ? (
              user.isAuthorized ? (
                <div className="flex items-center space-x-2 min-h-[31px] max-h-[41px]">
                  <ImageUploader onImageUpload={handleImageUpload} isDarkTheme={isDarkTheme} />
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                    className={`flex-grow min-h-[31px] max-h-[41px] resize-none ${isDarkTheme
                      ? "bg-zinc-800/80 border-zinc-700/50 focus:border-yellow-500/50 placeholder:text-zinc-500"
                      : "bg-black/5 border-black/10 focus:border-yellow-600/50"
                      } rounded-md py-2 px-4`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <GifPicker onGifSelect={handleGifSelect} isDarkTheme={isDarkTheme} />
                  <EnhancedEmojiPicker onEmojiSelect={handleEmojiSelect} isDarkTheme={isDarkTheme} />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={`rounded-md px-4 ${newMessage.trim()
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : "bg-zinc-700/50 text-zinc-400"
                      } transition-colors`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-yellow-400 py-2">
                  <AlertTriangle className="w-4 h-4" />
                  <p>Shoutbox is for admins only until launch.</p>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center space-x-2 text-yellow-400 py-2">
                <AlertTriangle className="w-4 h-4" />
                <p>Please sign in to participate in the chat</p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center space-x-2 text-yellow-400 py-2">
              <AlertTriangle className="w-4 h-4" />
              <p>Connecting to chat... Please wait.</p>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">Shoutbox Settings</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Customize your shoutbox experience
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="msb" className="text-zinc-200">Mute Sound</Label>
              <Checkbox
                id="msb"
                checked={msb}
                onCheckedChange={(checked) => {
                  setMsb(checked)
                  localStorage.setItem("msb", checked.toString())
                }}
                className="border-yellow-500/50 data-[state=checked]:bg-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fva" className="text-zinc-200">Notification Sound</Label>
              <Input
                id="fva"
                value={fva}
                onChange={(e) => {
                  setFva(e.target.value)
                  localStorage.setItem("fva", e.target.value)
                }}
                className="bg-zinc-800 border-zinc-700 text-white focus:border-yellow-500/50"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">Delete Message</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShowDeleteModal(false)}
              className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-red-500/80 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">Edit Message</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Make changes to your message below.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[100px] bg-zinc-800 border-2 border-zinc-700 rounded-lg p-3 text-white
              focus:border-yellow-500/50 transition-colors duration-200"
          />
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShowEditModal(false)}
              className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmEdit}
              className="bg-yellow-500/80 hover:bg-yellow-600 text-black"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

