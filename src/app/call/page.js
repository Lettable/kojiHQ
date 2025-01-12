'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, VolumeX, UserMinus, User, Settings, Shield, MonitorUp } from 'lucide-react'
import Shoutbox from '@/components/ShoutBox'
import { jwtDecode } from 'jwt-decode'

const EnhancedCallPage = () => {
    const [participants, setParticipants] = useState([])
    const [activeStreamerId, setActiveStreamerId] = useState(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(false)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [voicePitch, setVoicePitch] = useState(1)
    const [isJoined, setIsJoined] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const videoRef = useRef(null)
    const screenShareRef = useRef(null)
    const audioContext = useRef(null)
    const oscillator = useRef(null)
    const webSocketRef = useRef(null)
    const peerConnections = useRef({})
    const localStreamRef = useRef(null)

    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                const response = await fetch('/api/get-active-vc')
                const data = await response.json()
                if (data.success) {
                    setParticipants(data.activeUsers)
                }
            } catch (error) {
                console.error('Failed to fetch active users:', error)
            }
        }

        const getCurrentUser = () => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                const decodedToken = jwtDecode(token)
                setCurrentUser(decodedToken)
                return decodedToken
            }
            return null
        }

        const user = getCurrentUser()
        if (user) {
            fetchActiveUsers()
            initializeWebSocket(user.userId)
        }

        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close()
            }
            Object.values(peerConnections.current).forEach(pc => pc.close())
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    const initializeWebSocket = (userId) => {
        webSocketRef.current = new WebSocket(`ws://localhost:5000/voice?userId=${userId}`)

        webSocketRef.current.onopen = () => {
            console.log('WebSocket connection established')
        }

        webSocketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            handleWebSocketMessage(message)
        }

        webSocketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        webSocketRef.current.onclose = () => {
            console.log('WebSocket connection closed')
        }
    }

    const handleWebSocketMessage = (message) => {
        switch (message.type) {
            case 'offer':
                handleOffer(message)
                break
            case 'answer':
                handleAnswer(message)
                break
            case 'candidate':
                handleCandidate(message)
                break
            case 'userJoined':
                handleUserJoined(message.user)
                break
            case 'userLeft':
                handleUserLeft(message.userId)
                break
            default:
                console.log('Unknown message type:', message.type)
        }
    }

    const handleOffer = async (message) => {
        const pc = createPeerConnection(message.sender)
        await pc.setRemoteDescription(new RTCSessionDescription(message.offer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        sendWebSocketMessage({
            type: 'answer',
            answer: pc.localDescription,
            recipient: message.sender
        })
    }

    const handleAnswer = (message) => {
        const pc = peerConnections.current[message.sender]
        if (pc) {
            pc.setRemoteDescription(new RTCSessionDescription(message.answer))
        }
    }

    const handleCandidate = (message) => {
        const pc = peerConnections.current[message.sender]
        if (pc) {
            pc.addIceCandidate(new RTCIceCandidate(message.candidate))
        }
    }

    const handleUserJoined = (user) => {
        setParticipants(prev => [...prev, user])
    }

    const handleUserLeft = (userId) => {
        setParticipants(prev => prev.filter(p => p.userId !== userId))
        if (peerConnections.current[userId]) {
            peerConnections.current[userId].close()
            delete peerConnections.current[userId]
        }
    }

    const createPeerConnection = (userId) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        })

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendWebSocketMessage({
                    type: 'candidate',
                    candidate: event.candidate,
                    recipient: userId
                })
            }
        }

        pc.ontrack = (event) => {
            const participant = participants.find(p => p.userId === userId)
            if (participant) {
                setParticipants(prev => prev.map(p => 
                    p.userId === userId ? { ...p, stream: event.streams[0] } : p
                ))
            }
        }

        peerConnections.current[userId] = pc
        return pc
    }

    const sendWebSocketMessage = (message) => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            webSocketRef.current.send(JSON.stringify(message))
        }
    }

    const handleJoinLeave = async () => {
        if (!isJoined) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                localStreamRef.current = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
                setIsJoined(true)
                setIsVideoOn(true)
                participants.forEach(participant => {
                    if (participant.userId !== currentUser.userId) {
                        const pc = createPeerConnection(participant.userId)
                        stream.getTracks().forEach(track => pc.addTrack(track, stream))
                        pc.createOffer().then(offer => {
                            pc.setLocalDescription(offer)
                            sendWebSocketMessage({
                                type: 'offer',
                                offer: offer,
                                recipient: participant.userId
                            })
                        })
                    }
                })
            } catch (error) {
                console.error('Error accessing media devices:', error)
            }
        } else {
            setIsJoined(false)
            setIsVideoOn(false)
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop())
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
            Object.values(peerConnections.current).forEach(pc => pc.close())
            peerConnections.current = {}
            sendWebSocketMessage({ type: 'leave' })
        }
    }

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsMuted(!audioTrack.enabled)
            }
        }
    }

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled
                setIsVideoOn(videoTrack.enabled)
            }
        }
    }

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
                if (screenShareRef.current) {
                    screenShareRef.current.srcObject = stream
                }
                setIsScreenSharing(true)
                Object.values(peerConnections.current).forEach(pc => {
                    stream.getTracks().forEach(track => pc.addTrack(track, stream))
                })
            } catch (error) {
                console.error('Error starting screen share:', error)
            }
        } else {
            if (screenShareRef.current && screenShareRef.current.srcObject) {
                screenShareRef.current.srcObject.getTracks().forEach(track => track.stop())
                screenShareRef.current.srcObject = null
            }
            setIsScreenSharing(false)
            Object.values(peerConnections.current).forEach(pc => {
                const senders = pc.getSenders()
                senders.forEach(sender => {
                    if (sender.track && sender.track.kind === 'video') {
                        pc.removeTrack(sender)
                    }
                })
            })
        }
    }

    const handleVoicePitchChange = (value) => {
        setVoicePitch(value[0])
        // Voice pitch modulation would require additional audio processing
        // This is a placeholder for future implementation
    }

    const handleVolumeChange = (userId, value) => {
        const participant = participants.find(p => p.userId === userId)
        if (participant && participant.stream) {
            const audioTrack = participant.stream.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = value[0] > 0
                // Note: Adjusting volume programmatically is not straightforward
                // and may require a custom audio processing solution
            }
        }
    }

    const kickUser = (userId) => {
        // This would typically be handled server-side
        sendWebSocketMessage({ type: 'kickUser', userId })
    }

    const muteUser = (userId) => {
        // This would typically be handled server-side
        sendWebSocketMessage({ type: 'muteUser', userId })
    }

    const handleStreamClick = (userId) => {
        setActiveStreamerId(userId)
    }

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-4 flex w-10 flex-col">
                    <div className="flex-1 relative bg-white/10 rounded-lg overflow-hidden mb-4">
                        <AnimatePresence>
                            {participants.map((user) => (
                                user.userId === activeStreamerId && (
                                    <motion.div
                                        key={user.userId}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        {user.stream ? (
                                            <video
                                                ref={user.userId === currentUser?.userId ? videoRef : null}
                                                autoPlay
                                                playsInline
                                                muted={user.userId === currentUser?.userId}
                                                className="w-full h-full object-cover"
                                                srcObject={user.stream}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center">
                                                <Avatar className="w-32 h-32 mb-4">
                                                    <AvatarImage src={user.profilePic} />
                                                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                                                </Avatar>
                                                <p className="text-2xl font-bold">{user.username}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="relative w-full max-h-64 overflow-hidden">
                        <ScrollArea className="w-full h-full">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 p-2">
                                {participants.map((user) => (
                                    <motion.div
                                        key={user.userId}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleStreamClick(user.userId)}
                                        className={`relative flex flex-col items-center justify-center bg-white/10 p-3 rounded-lg cursor-pointer ${user.userId === activeStreamerId ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        <div className="relative h-14 w-14 rounded-full overflow-hidden">
                                            <Avatar className="h-full w-full">
                                                <AvatarImage src={user.profilePic} />
                                                <AvatarFallback className='text-black bg-gray-700'>
                                                    {user.username[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            {user.isSpeaking && !user.isMuted && (
                                                <motion.div
                                                    animate={{
                                                        boxShadow: `0 0 8px hsl(${voicePitch * 60}, 100%, 50%)`,
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute inset-0 rounded-full border-2 border-transparent"
                                />
                            )}
                        </div>

                        <div className="mt-0 text-sm text-gray-300 text-center truncate w-16">
                            {user.username}
                        </div>

                        <div className="absolute bottom-1 right-1 flex gap-1">
                            {user.isStreaming && (
                                <div className="bg-red-500 rounded-full p-1">
                                    <Video size={12} />
                                </div>
                            )}
                            {user.isMuted && (
                                <div className="bg-gray-800 rounded-full p-1">
                                    <MicOff size={12} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </ScrollArea>
    </div>
    <div className="flex justify-center mt-4 space-x-4">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={toggleMute} variant={isMuted ? "destructive" : "secondary"} className="rounded-full">
                        {isMuted ? <MicOff /> : <Mic />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isMuted ? 'Unmute' : 'Mute'} Microphone</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={toggleVideo} variant={isVideoOn ? "secondary" : "destructive"} className="rounded-full">
                        {isVideoOn ? <Video /> : <VideoOff />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isVideoOn ? 'Turn Off' : 'Turn On'} Video</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={toggleScreenShare} variant={isScreenSharing ? "destructive" : "secondary"} className="rounded-full">
                        <MonitorUp />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isScreenSharing ? 'Stop' : 'Start'} Screen Sharing</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleJoinLeave} variant={isJoined ? "destructive" : "default"} className="rounded-full">
                        {isJoined ? <PhoneOff /> : 'Join Call'}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isJoined ? 'Leave' : 'Join'} Call</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
</div>
<div className="w-[400px] bg-zinc-800/50 p-4 overflow-hidden flex flex-col">
    <h2 className="text-xl font-bold mb-4">Chat</h2>
    <Shoutbox callpageProp={true} />
</div>
</div>
{isScreenSharing && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-zinc-800 p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Screen Share</h3>
        <video ref={screenShareRef} autoPlay playsInline className="w-full max-h-[80vh] object-contain" />
        <Button onClick={toggleScreenShare} variant="destructive" className="mt-4">
            Stop Sharing
        </Button>
    </div>
</div>
)}
</div>
)
}

export default EnhancedCallPage