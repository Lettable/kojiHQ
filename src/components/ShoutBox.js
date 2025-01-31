// // 'use client';

// // import { useEffect, useState, useRef, useCallback } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { jwtDecode } from 'jwt-decode';
// // import { Button } from "@/components/ui/button";
// // import { Textarea } from "@/components/ui/textarea";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import Header from '@/partials/Header';
// // import { AlertTriangle, Send } from 'lucide-react';
// // import EnhancedEmojiPicker from '@/components/EmojiPicker';
// // import Link from 'next/link';
// // import { useRouter } from 'next/navigation';
// // import LoadingIndicator from '@/components/LoadingIndicator';

// // const renderTextWithEmojis = (text, emojis) => {
// //   if (!text || typeof text !== 'string') return text || '';
// //   if (!emojis || !Array.isArray(emojis)) return text;

// //   const emojiRegex = /:([\w-]+):/g;
// //   const mentionRegex = /@(\w+)/g;
// //   const parts = text.split(emojiRegex);

// //   return parts.map((part, index) => {
// //     if (index % 2 === 0) {
// //       return part.split(mentionRegex).map((subPart, subIndex) => {
// //         if (subIndex % 2 === 0) {
// //           return subPart;
// //         } else {
// //           return (
// //             <span key={subIndex} className="mention">
// //               @{subPart}
// //             </span>
// //           );
// //         }
// //       });
// //     } else {
// //       const emoji = emojis.find(e => e.emojiTitle === `:${part}:`);
// //       if (emoji) {
// //         return (
// //           <img
// //             key={index}
// //             src={emoji.emojiUrl}
// //             alt={emoji.emojiTitle}
// //             title={emoji.emojiTitle}
// //             className="inline-block w-6 h-6"
// //           />
// //         );
// //       } else {
// //         return `:${part}:`;
// //       }
// //     }
// //   });
// // };

// // const formatTimestamp = (date) => {
// //   const now = new Date();
// //   const messageDate = new Date(date);
// //   const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

// //   if (diffDays === 0) {
// //     return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   } else if (diffDays < 7) {
// //     return messageDate.toLocaleDateString([], { weekday: 'short' }) + ' ' +
// //       messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   } else {
// //     return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
// //       messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   }
// // };

// // export default function Shoutbox() {
// //   const [messages, setMessages] = useState([]);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [user, setUser] = useState(null);
// //   const [emojis, setEmojis] = useState([]);
// //   const [posts, setPost] = useState()
// //   const scrollAreaRef = useRef(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [callpage, setCallPage] = useState(false)
// //   const wsRef = useRef(null);
// //   const usernameRef = useRef('');
// //   const audioRef = useRef(null);
// //   const router = useRouter();
// //   const [isDarkTheme, setIsDarkTheme] = useState(true);
// //   const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

// //   const scrollToBottom = useCallback(() => {
// //     if (scrollAreaRef.current) {
// //       const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
// //       if (scrollContainer) {
// //         scrollContainer.scrollTop = scrollContainer.scrollHeight;
// //       }
// //     }
// //   }, []);

// //   const connectWebSocket = useCallback(() => {
// //     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

// //     wsRef.current = new WebSocket('wss://kojihq-ws.onrender.com');

// //     wsRef.current.onopen = () => {
// //       console.log('WebSocket connected');
// //       setIsWebSocketConnected(true);
// //     };

// //     wsRef.current.onmessage = (event) => {
// //       try {
// //         const parsedData = JSON.parse(event.data);
// //         const newMessage = parsedData.message;

// //         if (!newMessage || !newMessage.content) return;

// //         const mentionRegex = /@(\w+)/g;
// //         let match;

// //         while ((match = mentionRegex.exec(newMessage.content)) !== null) {
// //           if (match[1].toLowerCase() === usernameRef.current.toLowerCase()) {
// //             console.log('Mention detected:', newMessage.content);

// //             if (audioRef.current) {
// //               audioRef.current.currentTime = 0;
// //               audioRef.current.play().catch((error) => {
// //                 console.warn('Audio playback error:', error);
// //               });
// //             }

// //             break;
// //           }
// //         }

// //         if (!newMessage.type) {
// //           setMessages((prev) => [
// //             ...prev,
// //             { ...newMessage, _id: newMessage._id || `temp-${Date.now()}` },
// //           ]);
// //         } else {
// //           setPost(() => [
// //             { ...newMessage, _id: newMessage._id },
// //           ])
// //         }
// //       } catch (error) {
// //         console.error('Error handling WebSocket message:', error);
// //       }
// //     };

// //     wsRef.current.onerror = (error) => {
// //       console.error('WebSocket error:', error);
// //     };

// //     wsRef.current.onclose = (event) => {
// //       console.log('WebSocket disconnected', event.reason);
// //       setIsWebSocketConnected(false);
// //       setTimeout(connectWebSocket, 5000);
// //     };
// //   }, []);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setIsLoading(true);
// //       try {
// //         const [emojisResponse, messagesResponse] = await Promise.all([
// //           fetch('/api/emojis'),
// //           fetch('/api/messages')
// //         ]);

// //         if (!emojisResponse.ok || !messagesResponse.ok) {
// //           throw new Error('Failed to fetch emojis or messages');
// //         }

// //         const emojisData = await emojisResponse.json();
// //         const messagesData = await messagesResponse.json();

// //         setEmojis(emojisData);
// //         setMessages(messagesData.messages);

// //         const token = localStorage.getItem('accessToken');
// //         if (token) {
// //           const decoded = jwtDecode(token);
// //           usernameRef.current = decoded.username;
// //           setUser(decoded);

// //           const authResponse = await fetch(`/api/check-authorization?userId=${decoded.userId}`);
// //           if (!authResponse.ok) {
// //             throw new Error('Failed to check authorization');
// //           }
// //           const authData = await authResponse.json();
// //           setUser(prev => ({ ...prev, isAuthorized: authData.isAuthorized }));
// //         }
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchData();
// //     connectWebSocket();

// //     const storedTheme = localStorage.getItem('theme');
// //     setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true);

// //     return () => {
// //       if (wsRef.current) {
// //         wsRef.current.close();
// //       }
// //     };
// //   }, [connectWebSocket]);

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages, scrollToBottom]);

// //   useEffect(() => {
// //     audioRef.current = new Audio('/emojis/notify.mp3');
// //     audioRef.current.load();
// //   }, []);

// //   const handleEmojiSelect = (emojiTitle) => {
// //     setNewMessage(prev => `${prev} ${emojiTitle}`);
// //   };

// //   const sendMessage = () => {
// //     if (!user || !newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

// //     const messageData = {
// //       username: user.username,
// //       content: newMessage,
// //       userId: user.userId,
// //       profilePic: user.profilePic,
// //       createdAt: new Date().toISOString(),
// //     };

// //     wsRef.current.send(JSON.stringify(messageData));
// //     setNewMessage('');
// //     scrollToBottom();
// //   };

// //   const toggleTheme = () => {
// //     const newTheme = !isDarkTheme;
// //     setIsDarkTheme(newTheme);
// //     localStorage.setItem('theme', newTheme ? 'dark' : 'light');
// //   };

// //   return (
// //     <div className={`flex flex-col h-full w-full`}>
// //       <main className="flex-grow flex flex-col overflow-hidden">
// //         <ScrollArea className="flex-grow" ref={scrollAreaRef} style={{ height: '500px' }}>
// //           <div className="p-4 space-y-4">
// //             {isLoading ? (
// //               <LoadingIndicator />
// //             ) : (
// //               <AnimatePresence>
// //                 {messages.map((message) => (
// //                   <motion.div
// //                     key={message._id}
// //                     initial={{ opacity: 0, y: 20 }}
// //                     animate={{ opacity: 1, y: 0 }}
// //                     exit={{ opacity: 0 }}
// //                     className={`flex items-start space-x-3 ${message.userId === user?.userId ? 'justify-end' : 'justify-start'}`}
// //                   >
// //                     {message.userId !== user?.userId && (
// //                       <Link href={`/user/${message.userId}`}>
// //                         <img
// //                           src={message.profilePic || '/placeholder.svg?height=32&width=32'}
// //                           alt={message.username}
// //                           className="w-8 h-8 rounded-full cursor-pointer"
// //                         />
// //                       </Link>
// //                     )}
// //                     <div className={`flex flex-col ${message.userId === user?.userId ? 'items-end' : 'items-start'}`}>
// //                       <div className={`px-4 py-2 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${message.userId === user?.userId
// //                         ? 'bg-blue-600 text-white'
// //                         : isDarkTheme
// //                           ? 'bg-zinc-800 text-white'
// //                           : 'bg-zinc-200 text-black'
// //                         }`}>
// //                         {message.userId !== user?.userId && (
// //                           <p className={`font-semibold text-xs ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{message.username}</p>
// //                         )}
// //                         <p className="text-sm break-words">{renderTextWithEmojis(message.content, emojis)}</p>
// //                       </div>
// //                       <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
// //                         {formatTimestamp(message.createdAt)}
// //                       </span>
// //                     </div>
// //                   </motion.div>
// //                 ))}
// //               </AnimatePresence>
// //             )}
// //             {posts && posts.map((post) => (
// //               <p className='bg-zinc-600/50 text-gray-200 rounded-lg items-center justify-center text-center text-sm' key={post._id}>New Post: {post.content}</p>
// //             ))}
// //           </div>
// //         </ScrollArea>


// //         {/* {user ? (
// //           user.isAuthorized ? (
// //             <div className={`border-t ${isDarkTheme ? 'border-white/10' : 'border-black/10'} p-4`}>
// //               <div className="flex items-center space-x-2 min-h-[31px] max-h-[41px] ">
// //                 <Textarea
// //                   placeholder="Type your message..."
// //                   value={newMessage}
// //                   onChange={(e) => setNewMessage(e.target.value)}
// //                   className={`flex-grow min-h-[31px] max-h-[41px] resize-none ${isDarkTheme
// //                     ? 'bg-white/5 border-white/10 focus:border-yellow-400/50'
// //                     : 'bg-black/5 border-black/10 focus:border-yellow-600/50'
// //                     } rounded-full py-2 px-4`}
// //                   onKeyDown={(e) => {
// //                     if (e.key === 'Enter' && !e.shiftKey) {
// //                       e.preventDefault();
// //                       sendMessage();
// //                     }
// //                   }}
// //                 />
// //                 <EnhancedEmojiPicker onEmojiSelect={handleEmojiSelect} isDarkTheme={isDarkTheme} />
// //                 <Button
// //                   onClick={sendMessage}
// //                   disabled={!newMessage.trim()}
// //                   className="bg-yellow-600 hover:bg-yellow-700 rounded-full p-auto"
// //                 >
// //                   <Send className="h-auto w-auto" />
// //                 </Button>
// //               </div>
// //             </div>
// //           ) : (
// //             <div className={`border-t ${isDarkTheme ? 'border-white/10' : 'border-black/10'} p-4`}>
// //               <div className="flex items-center justify-center space-x-2 text-yellow-400">
// //                 <AlertTriangle className="w-4 h-4" />
// //                 <p>Submit at least one project to participate in the chat</p>
// //               </div>
// //             </div>
// //           )
// //         ) : (
// //           <div className={`border-t ${isDarkTheme ? 'border-white/10' : 'border-black/10'} p-4`}>
// //             <div className="flex items-center justify-center space-x-2 text-yellow-400">
// //               <AlertTriangle className="w-4 h-4" />
// //               <p>Please sign in to participate in the chat</p>
// //             </div>
// //           </div>
// //         )} */}


// //         <div className={`border-t ${isDarkTheme ? 'border-white/10' : 'border-black/10'} p-4`}>
// //           {isWebSocketConnected ? (
// //             user ? (
// //               user.isAuthorized ? (
// //                 <div className="flex items-center space-x-2 min-h-[31px] max-h-[41px] ">
// //                   <Textarea
// //                     placeholder="Type your message..."
// //                     value={newMessage}
// //                     onChange={(e) => setNewMessage(e.target.value)}
// //                     className={`flex-grow min-h-[31px] max-h-[41px] resize-none ${isDarkTheme
// //                       ? 'bg-white/5 border-white/10 focus:border-yellow-400/50'
// //                       : 'bg-black/5 border-black/10 focus:border-yellow-600/50'
// //                       } rounded-full py-2 px-4`}
// //                     onKeyDown={(e) => {
// //                       if (e.key === 'Enter' && !e.shiftKey) {
// //                         e.preventDefault();
// //                         sendMessage();
// //                       }
// //                     }}
// //                   />
// //                   <EnhancedEmojiPicker onEmojiSelect={handleEmojiSelect} isDarkTheme={isDarkTheme} />
// //                   <Button
// //                     onClick={sendMessage}
// //                     disabled={!newMessage.trim()}
// //                     className="bg-yellow-600 hover:bg-yellow-700 rounded-full p-auto"
// //                   >
// //                     <Send className="h-auto w-auto" />
// //                   </Button>
// //                 </div>
// //               ) : (
// //                 <div className="flex items-center justify-center space-x-2 text-yellow-400">
// //                   <AlertTriangle className="w-4 h-4" />
// //                   <p>You may have done something unusual. It should be fixed soon, or contact support.</p>
// //                 </div>
// //               )
// //             ) : (
// //               <div className="flex items-center justify-center space-x-2 text-yellow-400">
// //                 <AlertTriangle className="w-4 h-4" />
// //                 <p>Please sign in to participate in the chat</p>
// //               </div>
// //             )
// //           ) : (
// //             <div className="flex items-center justify-center space-x-2 text-yellow-400">
// //               <AlertTriangle className="w-4 h-4" />
// //               <p>Connecting to chat... Please wait.</p>
// //             </div>
// //           )}
// //         </div>

// //       </main>
// //       <style jsx global>{`
// //         .mention {
// //           background-color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
// //           padding: 2px 4px;
// //           border-radius: 4px;
// //           font-weight: bold;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }

// 'use client';

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { jwtDecode } from 'jwt-decode';
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import Header from '@/partials/Header';
// import { AlertTriangle, Send } from 'lucide-react';
// import EnhancedEmojiPicker from '@/components/EmojiPicker';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import LoadingIndicator from '@/components/LoadingIndicator';

// const renderTextWithEmojis = (text, emojis) => {
//   if (!text || typeof text !== 'string') return text || '';
//   if (!emojis || !Array.isArray(emojis)) return text;

//   const emojiRegex = /:([\w-]+):/g;
//   const mentionRegex = /@(\w+)/g;
//   const parts = text.split(emojiRegex);

//   return parts.map((part, index) => {
//     if (index % 2 === 0) {
//       return part.split(mentionRegex).map((subPart, subIndex) => {
//         if (subIndex % 2 === 0) {
//           return subPart;
//         } else {
//           return (
//             <span key={subIndex} className="mention">
//               @{subPart}
//             </span>
//           );
//         }
//       });
//     } else {
//       const emoji = emojis.find(e => e.emojiTitle === `:${part}:`);
//       if (emoji) {
//         return (
//           <img
//             key={index}
//             src={emoji.emojiUrl || "/placeholder.svg"}
//             alt={emoji.emojiTitle}
//             title={emoji.emojiTitle}
//             className="inline-block w-6 h-6"
//           />
//         );
//       } else {
//         return `:${part}:`;
//       }
//     }
//   });
// };

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
//   const [emojis, setEmojis] = useState([]);
//   const [posts, setPost] = useState()
//   const scrollAreaRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [callpage, setCallPage] = useState(false)
//   const wsRef = useRef(null);
//   const usernameRef = useRef('');
//   const audioRef = useRef(null);
//   const router = useRouter();
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
//   }, []);

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

//         if (!newMessage.type) {
//           setMessages((prev) => [
//             ...prev,
//             { ...newMessage, _id: newMessage._id || `temp-${Date.now()}` },
//           ]);
//           scrollToBottom();
//         } else {
//           setPost(() => [
//             { ...newMessage, _id: newMessage._id },
//           ]);
//           scrollToBottom();
//         }
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
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const [emojisResponse, messagesResponse] = await Promise.all([
//           fetch('/api/emojis'),
//           fetch('/api/messages')
//         ]);

//         if (!emojisResponse.ok || !messagesResponse.ok) {
//           throw new Error('Failed to fetch emojis or messages');
//         }

//         const emojisData = await emojisResponse.json();
//         const messagesData = await messagesResponse.json();

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
//   }, [connectWebSocket]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, scrollToBottom]);

//   useEffect(() => {
//     audioRef.current = new Audio('/emojis/notify.mp3');
//     audioRef.current.load();
//   }, []);

//   const handleEmojiSelect = (emojiTitle) => {
//     setNewMessage(prev => `${prev} ${emojiTitle}`);
//   };

//   const sendMessage = () => {
//     if (!user || !newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

//     const messageData = {
//       username: user.username,
//       usernameEffect: user.usernameEffect ? user.usernameEffect : "regular-effect",
//       content: newMessage,
//       userId: user.userId,
//       profilePic: user.profilePic,
//       createdAt: new Date().toISOString(),
//     };

//     wsRef.current.send(JSON.stringify(messageData));
//     setNewMessage('');
//     scrollToBottom();
//   };

//   const toggleTheme = () => {
//     const newTheme = !isDarkTheme;
//     setIsDarkTheme(newTheme);
//     localStorage.setItem('theme', newTheme ? 'dark' : 'light');
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
//                       <Link href={`/user/${message.userId}`}>
//                         <img
//                           src={message.profilePic || '/placeholder.svg?height=32&width=32'}
//                           alt={message.username}
//                           className="w-8 h-8 rounded-full cursor-pointer"
//                         />
//                       </Link>
//                     )}
//                     <div className={`flex flex-col ${message.userId === user?.userId ? 'items-end' : 'items-start'}`}>
//                       <div className={`px-4 py-2 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${message.userId === user?.userId
//                         ? 'bg-blue-600 text-white'
//                         : isDarkTheme
//                           ? 'bg-zinc-800 text-white'
//                           : 'bg-zinc-200 text-black'
//                         }`}>
//                         {message.userId !== user?.userId && (
//                           <p className={`font-semibold text-xs ${message.usernameEffect} ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{message.username}</p>
//                         )}
//                         <p className="text-base break-words">{renderTextWithEmojis(message.content, emojis)}</p>
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
//                     onChange={(e) => setNewMessage(e.target.value)}
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
//                   <p>You may have done something unusual. It should be fixed soon, or contact support.</p>
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
import EnhancedEmojiPicker from '@/components/EmojiPicker';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';
import MarkdownWithEmojis from '@/partials/MarkdownWithEmojis';

const MAX_MESSAGE_LENGTH = 500; // Limit message length to 500 characters

const formatTimestamp = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 7) {
    return messageDate.toLocaleDateString([], { weekday: 'short' }) + ' ' +
      messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
      messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

export default function Shoutbox() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [emojis, setEmojis] = useState([]);
  const scrollAreaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const wsRef = useRef(null);
  const usernameRef = useRef('');
  const audioRef = useRef(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 0);
  }, [scrollAreaRef]); // Added scrollAreaRef as a dependency

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
        const newMessage = parsedData.message;

        if (!newMessage || !newMessage.content) return;

        const mentionRegex = /@(\w+)/g;
        let match;

        while ((match = mentionRegex.exec(newMessage.content)) !== null) {
          if (match[1].toLowerCase() === usernameRef.current.toLowerCase()) {
            console.log('Mention detected:', newMessage.content);

            if (audioRef.current) {
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
          { ...newMessage, _id: newMessage._id || `temp-${Date.now()}` },
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [emojisResponse, messagesResponse] = await Promise.all([
          fetch('/api/emojis'),
          fetch('/api/messages')
        ]);

        if (!emojisResponse.ok || !messagesResponse.ok) {
          throw new Error('Failed to fetch emojis or messages');
        }

        const emojisData = await emojisResponse.json();
        const messagesData = await messagesResponse.json();

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
  }, [connectWebSocket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    audioRef.current = new Audio('/emojis/notify.mp3');
    audioRef.current.load();
  }, []);

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
              className="inline-block w-4 h-4"
            />
          )
        } else {
          return `:${part}:`
        }
      }
    })
  }

  const handleEmojiSelect = (emojiTitle) => {
    setNewMessage(prev => `${prev} ${emojiTitle}`.slice(0, MAX_MESSAGE_LENGTH));
  };

  const sendMessage = () => {
    if (!user || !newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const messageData = {
      username: user.username,
      usernameEffect: user.usernameEffect ? user.usernameEffect : "regular-effect",
      content: newMessage.slice(0, MAX_MESSAGE_LENGTH),
      userId: user.userId,
      profilePic: user.profilePic,
      createdAt: new Date().toISOString(),
    };

    wsRef.current.send(JSON.stringify(messageData));
    setNewMessage('');
    scrollToBottom();
  };

  return (
    <div className={`flex flex-col h-full w-full`}>
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
                      <Link href={`/user/${message.userId}`}>
                        <img
                          src={message.profilePic || '/placeholder.svg?height=32&width=32'}
                          alt={message.username}
                          className="w-8 h-8 rounded-full cursor-pointer"
                        />
                      </Link>
                    )}
                    <div className={`flex flex-col ${message.userId === user?.userId ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2 rounded-lg max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg ${message.userId === user?.userId
                        ? 'bg-blue-600 text-white'
                        : isDarkTheme
                          ? 'bg-zinc-800 text-white'
                          : 'bg-zinc-200 text-black'
                        }`}>
                        {message.userId !== user?.userId && (
                          <>
                            <span className={`font-semibold text-sm ${message.usernameEffect} ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{message.username}</span> {renderTextWithEmojis(message.statusEmoji, emojis)}
                          </>
                        )}
                        <MarkdownWithEmojis
                          content={message.content}
                          style={{ backgroundColor: 'transparent', padding: 0, color: 'white' }}
                        />
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
                <div className="flex items-center space-x-2 min-h-[31px] max-h-[41px] ">
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
                  <p>You may have done something unusual. It should be fixed soon, or contact support.</p>
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