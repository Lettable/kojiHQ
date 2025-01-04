'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, X, Users } from 'lucide-react'

const dummyUsers = [
  { id: 1, name: 'Alice Cooper', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Hey, I saw your project...', online: true },
  { id: 2, name: 'Bob Dylan', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'What do you think about...', online: false },
  { id: 3, name: 'Charlie Puth', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'I can offer you a deal...', online: true },
  { id: 4, name: 'David Bowie', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Let\'s discuss the terms...', online: false },
  { id: 5, name: 'Eva Green', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'I have a question about...', online: true },
  { id: 6, name: 'Frank Sinatra', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Can we schedule a call?', online: false },
]

const dummyConversations = {
  1: [
    { id: 1, sender: 'Alice Cooper', message: 'Hey, I saw your project and I\'m interested in buying it.', timestamp: '4:00:00 PM' },
    { id: 2, sender: 'You', message: 'That\'s great! What aspects of the project interest you the most?', timestamp: '4:05:00 PM' },
    { id: 3, sender: 'Alice Cooper', message: 'I love the AI integration and the user interface. How much are you asking for it?', timestamp: '4:10:00 PM' },
  ],
  // ... other conversations
}

const ChatApp = ({ isOpen, setIsOpen }) => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [conversations, setConversations] = useState(dummyConversations)
  const [newMessage, setNewMessage] = useState('')
  const chatContainerRef = useRef(null)

  const handleUserSelect = (user) => {
    setSelectedUser(user)
  }
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return

    const updatedConversations = { ...conversations }
    const newMessageObj = {
      id: Date.now(),
      sender: 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    updatedConversations[selectedUser.id] = [
      ...(updatedConversations[selectedUser.id] || []),
      newMessageObj
    ]

    setConversations(updatedConversations)
    setNewMessage('')
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [conversations, selectedUser])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 w-[650px] h-[500px] bg-[#1e1e1e] border border-white/10 rounded-lg shadow-lg flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#2d2d2d]">
              <h2 className="text-xl font-bold text-white">Chat</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* User List */}
              <div className="w-[280px] border-r border-white/10 bg-[#2d2d2d] overflow-hidden">
                <ScrollArea className="h-full">
                  {dummyUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      className={`flex items-center p-4 cursor-pointer ${
                        selectedUser?.id === user.id ? 'bg-white/10' : ''
                      }`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {user.online && (
                          <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2d2d2d]" />
                        )}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h3 className="font-semibold text-sm text-white truncate">{user.name}</h3>
                        <p className="text-xs text-white/70 truncate">{user.lastMessage}</p>
                      </div>
                    </motion.div>
                  ))}
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-[#1e1e1e] relative overflow-hidden">
                {selectedUser ? (
                  <>
                    {/* Chat Header */}
                    <div className="absolute top-0 left-0 right-0 p-3 border-b border-white/10 bg-[#2d2d2d] z-10">
                      <h2 className="text-lg font-bold text-white">{selectedUser.name}</h2>
                    </div>

                    {/* Messages */}
                    <div 
                      className="flex-1 overflow-y-auto overflow-hidden pt-16 pb-16 px-4"
                      ref={chatContainerRef}
                    >
                      {conversations[selectedUser.id]?.map((message) => (
                        <div
                          key={message.id}
                          className={`max-w-[80%] mb-4 ${message.sender === 'You' ? 'ml-auto' : ''}`}
                        >
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender === 'You'
                                ? 'bg-[#0D47A1] text-white'
                                : 'bg-[#2d2d2d] text-white'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-50 mt-1">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Fixed Input Field */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 bg-[#2d2d2d]">
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage()
                            }
                          }}
                          className="flex-1 bg-[#1e1e1e] border-white/10 text-white"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          size="icon"
                          className="bg-[#0D47A1] hover:bg-[#1565C0]"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-white/50">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-white/20" />
                      <p className="text-sm">Select a user to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatApp