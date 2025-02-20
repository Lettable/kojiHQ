// 'use client';

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { jwtDecode } from 'jwt-decode';
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { AlertTriangle, Send } from 'lucide-react';
// import EnhancedEmojiPicker from '@/components/EmojiPicker';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import LoadingIndicator from '@/components/LoadingIndicator';
// import MarkdownWithEmojis from '@/partials/MarkdownWithEmojis';

// const MAX_MESSAGE_LENGTH = 500;

// const formatTimestamp = (date) => {
//   const now = new Date();
//   const messageDate = new Date(date);
//   const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

//   if (diffDays === 0) {
//     return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   } else if (diffDays < 7) {
//     return messageDate.toLocaleDateString([], { weekday: 'short' }) + ' ' +
//       messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   } else {
//     return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
//       messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   }
// };

// export default function Shoutbox() {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [user, setUser] = useState(null);
//   const [statusEmoji, setStatusEmoji] = useState(null);
//   const [emojis, setEmojis] = useState([]);
//   const [userData, setUserData] = useState()
//   const scrollAreaRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const wsRef = useRef(null);
//   const usernameRef = useRef('');
//   const audioRef = useRef(null);
//   const [isDarkTheme, setIsDarkTheme] = useState(true);
//   const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

//   const scrollToBottom = useCallback(() => {
//     setTimeout(() => {
//       if (scrollAreaRef.current) {
//         const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
//         if (scrollContainer) {
//           scrollContainer.scrollTop = scrollContainer.scrollHeight;
//         }
//       }
//     }, 0);
//   }, [scrollAreaRef]);

//   const connectWebSocket = useCallback(() => {
//     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

//     wsRef.current = new WebSocket('wss://kojihq-ws.onrender.com');

//     wsRef.current.onopen = () => {
//       console.log('WebSocket connected');
//       setIsWebSocketConnected(true);
//     };

//     wsRef.current.onmessage = (event) => {
//       try {
//         const parsedData = JSON.parse(event.data);
//         const newMessage = parsedData.message;

//         if (!newMessage || !newMessage.content) return;

//         const mentionRegex = /@(\w+)/g;
//         let match;

//         while ((match = mentionRegex.exec(newMessage.content)) !== null) {
//           if (match[1].toLowerCase() === usernameRef.current.toLowerCase()) {
//             console.log('Mention detected:', newMessage.content);

//             if (audioRef.current) {
//               audioRef.current.currentTime = 0;
//               audioRef.current.play().catch((error) => {
//                 console.warn('Audio playback error:', error);
//               });
//             }

//             break;
//           }
//         }

//         setMessages((prev) => [
//           ...prev,
//           { ...newMessage, _id: newMessage._id || `temp-${Date.now()}` },
//         ]);
//         scrollToBottom();
//       } catch (error) {
//         console.error('Error handling WebSocket message:', error);
//       }
//     };

//     wsRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     wsRef.current.onclose = (event) => {
//       console.log('WebSocket disconnected', event.reason);
//       setIsWebSocketConnected(false);
//       setTimeout(connectWebSocket, 5000);
//     };
//   }, [scrollToBottom]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const [emojisResponse, messagesResponse, userDataResponse] = await Promise.all([
//           fetch('/api/emojis'),
//           fetch('/api/messages'),
//           fetch('/api/mics/mention-regex')
//         ]);

//         if (!emojisResponse.ok || !messagesResponse.ok || !userDataResponse.ok) {
//           throw new Error('Failed to fetch emojis or messages or user Data');
//         }

//         const emojisData = await emojisResponse.json();
//         const messagesData = await messagesResponse.json();
//         const userfuckingData = await userDataResponse.json();

//         setUserData(userfuckingData.data)
//         setEmojis(emojisData);
//         setMessages(messagesData.messages);
//         scrollToBottom();

//         const token = localStorage.getItem('accessToken');
//         if (token) {
//           const decoded = jwtDecode(token);
//           usernameRef.current = decoded.username;
//           setUser(decoded);

//           const authResponse = await fetch(`/api/check-authorization?userId=${decoded.userId}`);
//           if (!authResponse.ok) {
//             throw new Error('Failed to check authorization');
//           }
//           const authData = await authResponse.json();
//           setUser(prev => ({ ...prev, isAuthorized: authData.isAuthorized }));

//           const statusResponse = await fetch(`/api/mics/status?userId=${decoded.userId}`);
//           if (!statusResponse.ok) {
//             throw new Error('Failed to fetch user status');
//           }
//           const data = await statusResponse.json();
//           setStatusEmoji(data.statusEmoji);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//     connectWebSocket();

//     const storedTheme = localStorage.getItem('theme');
//     setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true);

//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//     };
//   }, [connectWebSocket, scrollToBottom]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, scrollToBottom]);

//   useEffect(() => {
//     audioRef.current = new Audio('/emojis/notify.mp3');
//     audioRef.current.load();
//   }, []);

//   const renderTextWithEmojis = (text, emojis) => {
//     if (!text || typeof text !== 'string') return text || ''
//     if (!emojis || !Array.isArray(emojis)) return text

//     const emojiRegex = /:([\w-]+):/g
//     const parts = text.split(emojiRegex)

//     return parts.map((part, index) => {
//       if (index % 2 === 0) {
//         return part
//       } else {
//         const emoji = emojis.find(e => e.emojiTitle === `:${part}:`)
//         if (emoji) {
//           return (
//             <img
//               key={index}
//               src={emoji.emojiUrl}
//               alt={emoji.emojiTitle}
//               title={emoji.emojiTitle}
//               style={{ width: '18px', height: '18px' }}
//               className="inline-block"
//             />
//           )
//         } else {
//           return `:${part}:`
//         }
//       }
//     })
//   }

//   const handleEmojiSelect = (emojiTitle) => {
//     setNewMessage(prev => `${prev} ${emojiTitle}`.slice(0, MAX_MESSAGE_LENGTH));
//   };

//   const sendMessage = (e) => {
//     if (!user || !newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

//     const messageData = {
//       username: user.username,
//       usernameEffect: user.usernameEffect ? user.usernameEffect : "regular-effect",
//       content: newMessage.slice(0, MAX_MESSAGE_LENGTH),
//       userId: user.userId,
//       statusEmoji: statusEmoji,
//       profilePic: user.profilePic,
//       createdAt: new Date().toISOString(),
//     };

//     wsRef.current.send(JSON.stringify(messageData));
//     setNewMessage('');
//     scrollToBottom();
//   };

//   return (
//     <div className={`flex flex-col h-full w-full`}>
//       <main className="flex-grow flex flex-col overflow-hidden">
//         <ScrollArea className="flex-grow" ref={scrollAreaRef} style={{ height: '500px' }}>
//           <div className="p-4 space-y-4">
//             {isLoading ? (
//               <LoadingIndicator />
//             ) : (
//               <AnimatePresence>
//                 {messages.map((message) => (
//                   <motion.div
//                     key={message._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     className={`flex items-start space-x-3 ${message.userId === user?.userId ? 'justify-end' : 'justify-start'}`}
//                   >
//                     {message.userId !== user?.userId && (
//                       <Link href={`/user/${message.username}`}>
//                         <img
//                           src={message.profilePic || '/placeholder.svg?height=32&width=32'}
//                           alt={message.username}
//                           className="w-8 h-8 rounded-full cursor-pointer"
//                         />
//                       </Link>
//                     )}
//                     <div className={`flex flex-col ${message.userId === user?.userId ? 'items-end' : 'items-start'}`}>
//                       <div className={`px-4 py-2 rounded-lg max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg ${message.userId === user?.userId
//                         ? 'bg-blue-600 text-white'
//                         : isDarkTheme
//                           ? 'bg-zinc-800 text-white'
//                           : 'bg-zinc-200 text-black'
//                         }`}>
//                         {message.userId !== user?.userId && (
//                           <>
//                             <span className={`font-semibold text-sm ${message.usernameEffect} ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{message.username}</span> {renderTextWithEmojis(message.statusEmoji, emojis)}
//                           </>
//                         )}
//                         <MarkdownWithEmojis
//                           content={message.content}
//                           style={{ backgroundColor: 'transparent', padding: 0, color: 'white' }}
//                           users={userData}
//                           emojisData={emojis}
//                         />
//                       </div>
//                       <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
//                         {formatTimestamp(message.createdAt)}
//                       </span>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             )}
//           </div>
//         </ScrollArea>

//         <div className={`border-t ${isDarkTheme ? 'border-white/10' : 'border-black/10'} p-4`}>
//           {isWebSocketConnected ? (
//             user ? (
//               user.isAuthorized ? (
//                 <div className="flex items-center space-x-2 min-h-[31px] max-h-[41px] ">
//                   <Textarea
//                     placeholder="Type your message..."
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
//                     className={`flex-grow min-h-[31px] max-h-[41px] resize-none ${isDarkTheme
//                       ? 'bg-white/5 border-white/10 focus:border-yellow-400/50'
//                       : 'bg-black/5 border-black/10 focus:border-yellow-600/50'
//                       } rounded-full py-2 px-4`}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         sendMessage();
//                       }
//                     }}
//                   />
//                   <EnhancedEmojiPicker onEmojiSelect={handleEmojiSelect} isDarkTheme={isDarkTheme} />
//                   <Button
//                     onClick={sendMessage}
//                     disabled={!newMessage.trim()}
//                     className="bg-yellow-600 hover:bg-yellow-700 rounded-full p-auto"
//                   >
//                     <Send className="h-auto w-auto" />
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center space-x-2 text-yellow-400">
//                   <AlertTriangle className="w-4 h-4" />
//                   {/* <p>You may have done something unusual. It should be fixed soon, or contact support.</p> */}
//                   <p>Shoutbox is for admins only until launch.</p>
//                 </div>
//               )
//             ) : (
//               <div className="flex items-center justify-center space-x-2 text-yellow-400">
//                 <AlertTriangle className="w-4 h-4" />
//                 <p>Please sign in to participate in the chat</p>
//               </div>
//             )
//           ) : (
//             <div className="flex items-center justify-center space-x-2 text-yellow-400">
//               <AlertTriangle className="w-4 h-4" />
//               <p>Connecting to chat... Please wait.</p>
//             </div>
//           )}
//         </div>
//       </main>
//       <style jsx global>{`
//         .mention {
//           background-color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
//           padding: 2px 4px;
//           border-radius: 4px;
//           font-weight: bold;
//         }
//       `}</style>
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Send } from 'lucide-react';
import { FiSettings } from 'react-icons/fi';
import EnhancedEmojiPicker from '@/components/EmojiPicker';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';
import MarkdownWithEmojis from '@/partials/MarkdownWithEmojis';
import GifPicker from './gifPicker';
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
import { PencilIcon, Trash2Icon } from 'lucide-react';
const MAX_MESSAGE_LENGTH = 500;

const formatTimestamp = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 7) {
    return (
      messageDate.toLocaleDateString([], { weekday: 'short' }) +
      ' ' +
      messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  } else {
    return (
      messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ' ' +
      messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }
};

export default function Shoutbox({ isSettingsDialogOpen, setIsSettingsDialogOpen }) {
  // Main state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [statusEmoji, setStatusEmoji] = useState(null);
  const [emojis, setEmojis] = useState([]);
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  // Refs
  const scrollAreaRef = useRef(null);
  const wsRef = useRef(null);
  const usernameRef = useRef('');
  const audioRef = useRef(null);

  // Modal states for Delete & Edit dialogs
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Settings dialog state and settings values
  const [fva, setFva] = useState('/emojis/notify.mp3'); // favorite audio URL
  const [msb, setMsb] = useState(false); // mute shoutbox flag

  // Load settings from localStorage and initialize audio
  useEffect(() => {
    const storedFva = localStorage.getItem('fva') || '/emojis/notify.mp3';
    const storedMsb = localStorage.getItem('msb') === 'true';
    setFva(storedFva);
    setMsb(storedMsb);
    if (!storedMsb) {
      audioRef.current = new Audio(storedFva);
      audioRef.current.load();
    }
  }, []);

  const VB88_COMMAND_REGEX = /^\/vb88\s+(https?:\/\/.+\.mp3)$/i

  const handleVB88Command = (messageContent) => {
    const match = messageContent.match(VB88_COMMAND_REGEX)
    if (match) {
      const audioUrl = match[1]
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "vb88_command",
            audioUrl: audioUrl,
          }),
        )
      }
      const comSigma = new RegExp(`^User ${user.username} started a new brainrot :peepo-okq: :peeposad:$`);
      const messageData = {
        username: user.username,
        usernameEffect: user.usernameEffect ? user.usernameEffect : "regular-effect",
        content: comSigma,
        userId: user.userId,
        statusEmoji: statusEmoji,
        profilePic: user.profilePic,
        createdAt: new Date().toISOString(),
      };
      wsRef.current.send(JSON.stringify(messageData));
      setMessages((prev) => [
        ...prev,
        messageData,
      ])
      setNewMessage('');
      return true
    }
    return false
  }

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 0);
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket('wss://kojihq-ws.onrender.com');

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsWebSocketConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        console.log('Be ready for brainrot', parsedData.message.audioUrl)

        if (parsedData.message.type === "vb88_command") {
          console.log('Identified Rizz')
          if (audioRef.current) {
            console.log('Current Audio Ref Identified Sigma')
            audioRef.current = new Audio(parsedData.message.audioUrl)
            audioRef.current.load()
            console.log('Audio Loaded Zigma')
            audioRef.current.currentTime = 0
            audioRef.current.play().catch((error) => {
              console.error("Error playing audio:", error)
            })
          } else {
            console.error("Audio reference is not available")
          }
          return
        }

        const newMsg = parsedData.message;
        if (!newMsg || !newMsg.content) return;

        const mentionRegex = /@(\w+)/g;
        let match;
        while ((match = mentionRegex.exec(newMsg.content)) !== null) {
          if (match[1].toLowerCase() === usernameRef.current.toLowerCase()) {
            console.log('Mention detected:', newMsg.content);
            if (!msb && audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch((error) => {
                console.warn('Audio playback error:', error);
              });
            }
            break;
          }
        }

        setMessages((prev) => [
          ...prev,
          { ...newMsg, _id: newMsg._id || `temp-${Date.now()}` },
        ]);
        scrollToBottom();
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = (event) => {
      console.log('WebSocket disconnected', event.reason);
      setIsWebSocketConnected(false);
      setTimeout(connectWebSocket, 5000);
    };
  }, [msb, scrollToBottom]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [emojisResponse, messagesResponse, userDataResponse] = await Promise.all([
          fetch('/api/emojis'),
          fetch('/api/messages'),
          fetch('/api/mics/mention-regex')
        ]);

        if (!emojisResponse.ok || !messagesResponse.ok || !userDataResponse.ok) {
          throw new Error('Failed to fetch emojis, messages, or user data');
        }

        const emojisData = await emojisResponse.json();
        const messagesData = await messagesResponse.json();
        const userfuckingData = await userDataResponse.json();

        setUserData(userfuckingData.data);
        setEmojis(emojisData);
        setMessages(messagesData.messages);
        scrollToBottom();

        const token = localStorage.getItem('accessToken');
        if (token) {
          const decoded = jwtDecode(token);
          usernameRef.current = decoded.username;
          setUser(decoded);

          const authResponse = await fetch(`/api/check-authorization?userId=${decoded.userId}`);
          if (!authResponse.ok) {
            throw new Error('Failed to check authorization');
          }
          const authData = await authResponse.json();
          setUser(prev => ({ ...prev, isAuthorized: authData.isAuthorized }));

          const statusResponse = await fetch(`/api/mics/status?userId=${decoded.userId}`);
          if (!statusResponse.ok) {
            throw new Error('Failed to fetch user status');
          }
          const data = await statusResponse.json();
          setStatusEmoji(data.statusEmoji);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    connectWebSocket();

    const storedTheme = localStorage.getItem('theme');
    setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // Load notification audio when component mounts (handled above)
    // Audio initialization is now based on localStorage values.
  }, []);

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
              style={{ width: '18px', height: '18px' }}
              className="inline-block"
            />
          );
        } else {
          return `:${part}:`;
        }
      }
    });
  };

  const handleEmojiSelect = (emojiTitle) => {
    setNewMessage(prev => `${prev} ${emojiTitle}`.slice(0, MAX_MESSAGE_LENGTH));
  };

  const handleGifSelect = (gifMarkdown) => {
    setNewMessage((prev) => {
      const messageWithoutGif = prev.replace(/!\[.*?\]$$.*?$$/g, "").trim()
      return `${messageWithoutGif} ${gifMarkdown}`.trim().slice(0, MAX_MESSAGE_LENGTH)
    })
  }

  const sendMessage = () => {
    if (!user || !newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    if (handleVB88Command(newMessage.trim())) {
      setNewMessage("")
      scrollToBottom();
      return
    }

    const messageData = {
      username: user.username,
      usernameEffect: user.usernameEffect ? user.usernameEffect : "regular-effect",
      content: newMessage.slice(0, MAX_MESSAGE_LENGTH),
      userId: user.userId,
      statusEmoji: statusEmoji,
      profilePic: user.profilePic,
      createdAt: new Date().toISOString(),
    };

    wsRef.current.send(JSON.stringify(messageData));
    setNewMessage('');
    scrollToBottom();
  };

  const handleDeleteClick = (message) => {
    setSelectedMessage(message);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const body = JSON.stringify({
        u: user.userId,
        c: selectedMessage.content,
        t: token,
      });
      const res = await fetch('/api/mics/d-m', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(msg => msg._id !== selectedMessage._id));
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
    setShowDeleteModal(false);
    setSelectedMessage(null);
  };

  const handleEditClick = (message) => {
    setSelectedMessage(message);
    setEditContent(message.content);
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const body = JSON.stringify({
        u: user.userId,
        t: token,
        tz: selectedMessage.createdAt,
        c: editContent,
      });
      const res = await fetch('/api/mics/e-m', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev =>
          prev.map(msg => (msg._id === selectedMessage._id ? { ...msg, content: editContent } : msg))
        );
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
    setShowEditModal(false);
    setSelectedMessage(null);
    setEditContent('');
  };

  return (
    <div className={`flex flex-col h-full w-full`}>
      {/* Header with Shoutbox title and Settings Button */}

      <main className="flex-grow flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow" ref={scrollAreaRef} style={{ height: '500px' }}>
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
                    className={`flex items-start space-x-3 ${message.userId === user?.userId ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.userId !== user?.userId && (
                      <Link href={`/user/${message.username}`}>
                        <img
                          src={message.profilePic || '/placeholder.svg?height=32&width=32'}
                          alt={message.username}
                          className="w-8 h-8 rounded-full cursor-pointer"
                        />
                      </Link>
                    )}
                    <div className={`flex flex-col ${message.userId === user?.userId ? 'items-end' : 'items-start'}`}>
                      <div className="relative group">
                        <div
                          className={`px-4 py-2 rounded-lg max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg ${message.userId === user?.userId
                            ? "bg-blue-600 text-white"
                            : isDarkTheme
                              ? "bg-zinc-800 text-white"
                              : "bg-zinc-200 text-black"
                            }`}
                        >
                          {message.userId !== user?.userId && (
                            <>
                              <span
                                className={`font-semibold text-sm ${message.usernameEffect} ${isDarkTheme ? "text-gray-300" : "text-gray-600"
                                  }`}
                              >
                                {message.username}
                              </span>{" "}
                              {renderTextWithEmojis(message.statusEmoji, emojis)}
                            </>
                          )}
                          <MarkdownWithEmojis
                            content={message.content}
                            style={{ backgroundColor: "transparent", padding: 0, color: "white" }}
                            users={userData}
                            emojisData={emojis}
                          />
                        </div>
                        {message.userId === user?.userId && (
                          <div className="absolute -top-3 right-7 mr-10 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditClick(message)}
                              className="p-1 rounded-sm bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-colors"
                            >
                              <PencilIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(message)}
                              className="p-1 rounded-sm bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-colors"
                            >
                              <Trash2Icon className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {formatTimestamp(message.createdAt)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>

        <div className={`border-t ${isDarkTheme ? 'border-white/10' : 'border-black/10'} p-4`}>
          {isWebSocketConnected ? (
            user ? (
              user.isAuthorized ? (
                <div className="flex items-center space-x-2 min-h-[31px] max-h-[41px]">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                    className={`flex-grow min-h-[31px] max-h-[41px] resize-none ${isDarkTheme
                      ? 'bg-white/5 border-white/10 focus:border-yellow-400/50'
                      : 'bg-black/5 border-black/10 focus:border-yellow-600/50'
                      } rounded-full py-2 px-4`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <GifPicker onGifSelect={handleGifSelect} isDarkTheme={isDarkTheme}/>
                  <EnhancedEmojiPicker onEmojiSelect={handleEmojiSelect} isDarkTheme={isDarkTheme} />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-yellow-600 hover:bg-yellow-700 rounded-full p-auto"
                  >
                    <Send className="h-auto w-auto" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-yellow-400">
                  <AlertTriangle className="w-4 h-4" />
                  <p>Shoutbox is for admins only until launch.</p>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <p>Please sign in to participate in the chat</p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center space-x-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <p>Connecting to chat... Please wait.</p>
            </div>
          )}
        </div>
      </main>

      {showDeleteModal && (
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="bg-zinc-900 text-white">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Are you sure you want to delete this message?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="bg-zinc-800 text-whit hover:text-white border-0  hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showEditModal && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="bg-zinc-900 text-white">
            <DialogHeader>
              <DialogTitle>Edit Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="original-message" className="text-zinc-400">
                  Original Message
                </Label>
                <Input
                  id="original-message"
                  value={selectedMessage?.content}
                  disabled
                  className="bg-zinc-800 text-white border-zinc-700"
                />
              </div>
              <Label htmlFor="new-message" className="text-zinc-400 mt-2">
                New Message
              </Label>
              <div className='flex'>
                <Textarea
                  id="new-message"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bg-zinc-800 text-white border-zinc-700"
                  rows={3}
                />
                <EnhancedEmojiPicker
                  onEmojiSelect={(emojiTitle) =>
                    setEditContent((prev) => `${prev} ${emojiTitle}`.slice(0, MAX_MESSAGE_LENGTH))
                  }
                  isDarkTheme={isDarkTheme}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="bg-zinc-800 text-whit hover:text-white border-0  hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button onClick={confirmEdit} className="bg-yellow-500 text-black hover:bg-yellow-600">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isSettingsDialogOpen && (
        <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
          <DialogContent className="bg-zinc-900 text-white">
            <DialogHeader>
              <DialogTitle>Shoutbox Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notification-audio" className="text-zinc-400">
                  Notification Audio URL (must end with .mp3)
                </Label>
                <Input
                  id="notification-audio"
                  type="text"
                  value={fva}
                  onChange={(e) => setFva(e.target.value)}
                  className="bg-zinc-800 text-white border-zinc-700"
                  placeholder="/emojis/notify.mp3"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mute-sb" checked={msb} onCheckedChange={(checked) => setMsb(checked)} />
                <Label htmlFor="mute-sb" className="text-zinc-400">
                  Mute Shoutbox (no notifications)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsSettingsDialogOpen(false)}
                className="bg-zinc-800 text-whit hover:text-white border-0  hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!fva.trim().endsWith(".mp3")) {
                    alert("Audio URL must end with .mp3")
                    return
                  }
                  localStorage.setItem("fva", fva)
                  localStorage.setItem("msb", msb.toString())
                  if (!msb) {
                    audioRef.current = new Audio(fva)
                    audioRef.current.load()
                  }
                  setIsSettingsDialogOpen(false)
                }}
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <style jsx global>{`
        .mention {
          background-color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
