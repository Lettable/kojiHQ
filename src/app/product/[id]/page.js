// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import Header from '@/partials/Header'
// import { jwtDecode } from 'jwt-decode'
// import { ScrollArea } from "@/components/ui/scroll-area"
// import {
//     ArrowLeft,
//     AlertTriangle,
//     ArrowRight,
//     ChevronDown,
//     ChevronUp,
//     Clock,
//     ExternalLink,
//     Heart,
//     MessageCircle,
//     Share2,
//     ThumbsDown,
//     ThumbsUp,
//     Zap,
//     Menu,
//     Bell,
//     Search
// } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useRouter, useParams } from 'next/navigation'

// // Comment component
// const Comment = ({ comment, onReply }) => {
//     const [isReplying, setIsReplying] = useState(false)
//     const [replyContent, setReplyContent] = useState('')

//     const handleReply = () => {
//         if (replyContent.trim()) {
//             onReply(comment.id, replyContent)
//             setReplyContent('')
//             setIsReplying(false)
//         }
//     }

//     return (
//         <Card className="bg-white/5 text-white border-white/10 mb-4">
//             <CardContent className="p-4">
//                 <div className="flex space-x-4">
//                     <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative">
//                         <img src={comment.avatar} alt={comment.author} className="object-cover w-full h-full" />
//                     </div>

//                     <div className="text-white flex-1">
//                         <div className="flex items-center text-white space-x-2">
//                             <span className="font-semibold">{comment.author}</span>
//                             <span className="text-sm text-white/50">{comment.timestamp}</span>
//                         </div>
//                         <p className="mt-2 text-white/70">{comment.content}</p>
//                         <div className="mt-2 flex items-center space-x-4">
//                             <button
//                                 className="flex items-center space-x-1 text-white/50 hover:text-white"
//                                 onClick={() => setIsReplying(!isReplying)}
//                             >
//                                 <MessageCircle className="h-4 w-4" />
//                                 <span>Reply</span>
//                             </button>
//                         </div>

//                         {isReplying && (
//                             <div className="mt-4">
//                                 <Textarea
//                                     placeholder="Write a reply..."
//                                     value={replyContent}
//                                     onChange={(e) => setReplyContent(e.target.value)}
//                                     className="w-full bg-white/5 border-white/10 focus:border-yellow-400/50"
//                                 />
//                                 <div className="mt-2 flex justify-end space-x-2">
//                                     <Button variant="ghost" className='rounded border-2 bg-white text-black hover:bg-black hover:text-white' onClick={() => setIsReplying(false)}>Cancel</Button>
//                                     <Button variant="outline" className='text-black bg-white rounded border-2 hover:bg-black hover:text-white' onClick={handleReply}>Post Reply</Button>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Nested Replies */}
//                         {comment.replies && comment.replies.map(reply => (
//                             <Card key={reply.id} className="mt-4 ml-8 text-white bg-white/5 border-white/10">
//                                 <CardContent className="p-4">
//                                     <div className="flex space-x-4">
//                                         <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative">
//                                             <img src={reply.avatar} alt={reply.author} className="object-cover w-full h-full" />
//                                         </div>
//                                         <div className="flex-1">
//                                             <div className="flex items-center space-x-2">
//                                                 <span className="font-semibold">{reply.author}</span>
//                                                 <span className="text-sm text-white/50">{reply.timestamp}</span>
//                                             </div>
//                                             <p className="mt-2 text-white/70">{reply.content}</p>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// export default function ProjectDetails() {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0)
//     const [sortBy, setSortBy] = useState('top')
//     const [newComment, setNewComment] = useState('')
//     const [bids, setBids] = useState([])
//     const [newBidAmount, setNewBidAmount] = useState('')
//     const [userBid, setUserBid] = useState(null)
//     const [comments, setComments] = useState([])
//     const [currentUser, setCurrentUser] = useState({})
//     const [projectData, setProjectData] = useState(null)
//     const [highestBid, setHighestBid] = useState(null)
//     const [userId, setUserId] = useState()
//     const router = useRouter()
//     const params = useParams()

//     useEffect(() => {
//         const token = localStorage.getItem('accessToken')
//         if (!token) {
//             router.push('/auth')
//             return
//         }
//         try {
//             const decoded = jwtDecode(token)
//             setUserId(decoded.userId)
//             setCurrentUser(decoded)
//             fetchProjectData()
//             fetchComments()
//             fetchBids(decoded.userId)
//         } catch (error) {
//             console.error(error)
//             router.push('/auth')
//         }
//     }, [router, params])

//     const fetchProjectData = async () => {
//         try {
//             const response = await fetch(`/api/project?id=${params.id}`)
//             const data = await response.json()
//             if (data.projectData) {
//                 setProjectData(data.projectData)
//             }
//         } catch (error) {
//             console.error("Error fetching project data:", error)
//         }
//     }

//     const fetchComments = async () => {
//         try {
//             const response = await fetch(`/api/project-action/comment?id=${params.id}`)
//             const data = await response.json()
//             if (data.success) {
//                 setComments(data.data)
//             }
//         } catch (error) {
//             console.error("Error fetching comments:", error)
//         }
//     }

//     const fetchBids = async (currentfuckinguserid) => {
//         try {
//             const response = await fetch(`/api/project-action/bid-action?id=${params.id}`)
//             const data = await response.json()
//             if (data.success) {
//                 setBids(data.data)
//                 const userBid = data.data.find(bid => bid.authorId === currentfuckinguserid)
//                 if (userBid) {
//                     setUserBid(userBid)
//                 }
//                 const highestBid = data.data.reduce((max, bid) => max.amount > bid.amount ? max : bid, { amount: 0 })
//                 setHighestBid(highestBid)
//             }
//         } catch (error) {
//             console.error("Error fetching bids:", error)
//         }
//     }

//     const nextImage = () => {
//         setCurrentImageIndex((prev) =>
//             prev === projectData.images.length - 1 ? 0 : prev + 1
//         )
//     }

//     const prevImage = () => {
//         setCurrentImageIndex((prev) =>
//             prev === 0 ? projectData.images.length - 1 : prev - 1
//         )
//     }

//     const placeBid = useCallback(async () => {
//         const bidAmount = parseInt(newBidAmount)
//         if (isNaN(bidAmount) || bidAmount <= 0) {
//             alert("Please enter a valid bid amount.")
//             return
//         }

//         try {
//             const response = await fetch(`/api/project-action/bid-action?id=${params.id}`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     bidderId: currentUser.userId,
//                     bidAmount: bidAmount
//                 })
//             })
//             const data = await response.json()
//             if (data.success) {
//                 fetchBids()
//                 setNewBidAmount('')
//             } else {
//                 alert("Failed to place bid. Please try again.")
//             }
//         } catch (error) {
//             console.error("Error placing bid:", error)
//             alert("An error occurred while placing your bid. Please try again.")
//         }
//     }, [newBidAmount, currentUser.userId, params.id])

//     const addComment = useCallback(async () => {
//         if (newComment.trim()) {
//             try {
//                 const response = await fetch(`/api/project-action/comment?id=${params.id}`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         userId: currentUser.userId,
//                         author: currentUser.username,
//                         avatar: currentUser.profilePic,
//                         content: newComment
//                     })
//                 })
//                 const data = await response.json()
//                 if (data.success) {
//                     fetchComments()
//                     setNewComment('')
//                 } else {
//                     alert("Failed to post comment. Please try again.")
//                 }
//             } catch (error) {
//                 console.error("Error posting comment:", error)
//                 alert("An error occurred while posting your comment. Please try again.")
//             }
//         }
//     }, [newComment, currentUser, params.id])

//     const addReply = useCallback(async (commentId, content) => {
//         try {
//             const response = await fetch(`/api/project-action/comment?id=${params.id}`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     userId: currentUser.userId,
//                     author: currentUser.username,
//                     avatar: currentUser.profilePic,
//                     content: content,
//                     parentCommentId: commentId
//                 })
//             })
//             const data = await response.json()
//             if (data.success) {
//                 fetchComments()
//             } else {
//                 alert("Failed to post reply. Please try again.")
//             }
//         } catch (error) {
//             console.error("Error posting reply:", error)
//             alert("An error occurred while posting your reply. Please try again.")
//         }
//     }, [currentUser, params.id])

//     const sortComments = useCallback((comments) => {
//         if (sortBy === 'top') {
//             return [...comments].sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0))
//         } else {
//             return [...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//         }
//     }, [sortBy])

//     if (!projectData) {
//         return <div>Loading...</div>
//     }

//     return (
//         <div className="min-h-screen bg-black text-white">
//             <Header avatar={currentUser.profilePic} userId={currentUser.userId}/>
//             <main className="container mx-auto px-4 py-8">
//                 <div className="grid gap-8">
//                     {/* Project Header */}
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                             <div className="flex items-center space-x-2">
//                                 <Badge variant="outline" className="text-yellow-400 border-yellow-400">
//                                     {projectData.views} VIEWS
//                                 </Badge>
//                                 <Badge variant="outline" className="text-yellow-400 border-yellow-400">
//                                     {projectData.status}
//                                 </Badge>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Project Title */}
//                     <div>
//                         <h1 className="text-3xl font-bold">{projectData.title}</h1>
//                         <p className="text-white/70 mt-2">{projectData.description}</p>
//                     </div>

//                     {/* Image Slider */}
//                     <div className="relative aspect-video bg-white/5 rounded-xl overflow-hidden">
//                         <Image
//                             src={projectData.images[currentImageIndex]}
//                             alt={`Project screenshot ${currentImageIndex + 1}`}
//                             fill
//                             className="object-cover"
//                         />
//                         <div className="absolute inset-0 flex items-center justify-between p-4">
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={prevImage}
//                                 className="bg-black/50 hover:bg-black/70"
//                             >
//                                 <ArrowLeft className="h-6 w-6" />
//                             </Button>
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={nextImage}
//                                 className="bg-black/50 hover:bg-black/70"
//                             >
//                                 <ArrowRight className="h-6 w-6" />
//                             </Button>
//                         </div>
//                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//                             {projectData.images.map((_, index) => (
//                                 <button
//                                     key={index}
//                                     className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
//                                         }`}
//                                     onClick={() => setCurrentImageIndex(index)}
//                                 />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Project Details */}
//                     <div className="grid md:grid-cols-3 gap-8">
//                         <div className="md:col-span-2 space-y-8">
//                             <Card className="bg-white/5 border-white/10">
//                                 <CardContent className="p-6 space-y-4">
//                                     <div>
//                                         <h2 className="text-xl text-white font-semibold mb-2">Project Build Details</h2>
//                                         <p className="text-white/70">{projectData.buildDetails}</p>
//                                     </div>
//                                     <Separator className="bg-white/10" />
//                                     <div>
//                                         <h2 className="text-xl font-semibold mb-2 text-white">Reason for Selling</h2>
//                                         <p className="text-white/70">{projectData.sellingReason}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Metrics */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <Card className="bg-white/5 border-white/10">
//                                     <CardContent className="p-6 text-center">
//                                         <div className="text-2xl text-white font-bold">${projectData.metrics.avgRevenue}</div>
//                                         <div className="text-sm text-white/70">Avg. Revenue / Month</div>
//                                     </CardContent>
//                                 </Card>
//                                 <Card className="bg-white/5 border-white/10">
//                                     <CardContent className="p-6 text-center">
//                                         <div className="text-2xl font-bold text-white">{projectData.metrics.avgDownloads}</div>
//                                         <div className="text-sm text-white/70">Avg. Downloads / Month</div>
//                                     </CardContent>
//                                 </Card>
//                             </div>

//                             {/* Comments Section */}
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <h2 className="text-xl font-semibold">Comments</h2>
//                                     <select
//                                         value={sortBy}
//                                         onChange={(e) => setSortBy(e.target.value)}
//                                         className="bg-white/5 border-white/50 rounded-md px-3 py-1"
//                                     >
//                                         <option value="top" className='bg-black text-white'>Top Comments</option>
//                                         <option value="recent" className='bg-black text-white'>Recent</option>
//                                     </select>
//                                 </div>

//                                 <div className="space-y-4">
//                                     <div className="flex space-x-4">
//                                         <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative">
//                                             <img src={currentUser.profilePic} alt="User Avatar" className="object-cover w-full h-full" />
//                                         </div>

//                                         <div className="flex-1">
//                                             <Textarea
//                                                 placeholder="Add a comment..."
//                                                 value={newComment}
//                                                 onChange={(e) => setNewComment(e.target.value)}
//                                                 className="w-full bg-white/5 border-white/10 focus:border-yellow-400/50"
//                                             />
//                                             <div className="mt-2 flex justify-end text-white">
//                                                 <Button
//                                                     variant="outline"
//                                                     className='text-black bg-white rounded border-2 hover:bg-black hover:text-white'
//                                                     onClick={addComment}
//                                                     disabled={!newComment.trim()}
//                                                 >
//                                                     Post Comment
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {sortComments(comments).map(comment => (
//                                         <Comment
//                                             key={comment.id}
//                                             comment={comment}
//                                             onReply={addReply}
//                                         />
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Sidebar */}
//                         <div className="space-y-4">
//                             <div className="sticky top-4">
//                                 <Card className="bg-white/5 text-white mb-[30px] border-white/10 ">
//                                     <CardContent className="p-6 space-y-6">
//                                         <div className="text-center">
//                                             <div className="text-2xl font-bold">
//                                                 ${projectData.priceType === 'bid' ? (highestBid ? highestBid.amount : projectData.price) : projectData.price} USD
//                                             </div>
//                                             {projectData.priceType === 'bid' ? (
//                                                 <p className="text-sm text-white/70 mt-1">
//                                                     This is the highest bid ever placed for this project
//                                                 </p>
//                                             ) : projectData.isNegotiable && (
//                                                 <p className="text-sm text-white/70 mt-1">
//                                                     This price is negotiable and transferable
//                                                 </p>
//                                             )}
//                                         </div>

//                                         <div className="space-y-4">
//                                             <Link href={`/user/${projectData.author.id}`} target="_blank" rel="noopener noreferrer">
//                                                 <Button className="w-full bg-blue-600 mb-4 hover:bg-blue-700">
//                                                     Buy Project / Contact Owner
//                                                 </Button>
//                                             </Link>
//                                             <Link href={projectData.projectUrl} target="_blank" rel="noopener noreferrer">
//                                                 <Button variant="outline" className="text-black w-full">
//                                                     <ExternalLink className="mr-2 h-4 w-4" />
//                                                     Visit Project Website
//                                                 </Button>
//                                             </Link>
//                                         </div>

//                                         <Separator className="bg-white/10" />

//                                         <div className="flex items-center space-x-4">
//                                             <Image
//                                                 src={projectData.author.avatar}
//                                                 alt={projectData.author.name}
//                                                 width={40}
//                                                 height={40}
//                                                 className="rounded-full"
//                                             />
//                                             <div>
//                                                 <div className="flex items-center text-white space-x-2">
//                                                     <span className="font-semibold">{projectData.author.name}</span>
//                                                     {projectData.author.verified && (
//                                                         <Badge className="bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/20">✓</Badge>
//                                                     )}
//                                                 </div>
//                                                 <div className="text-sm text-white/50">
//                                                     Joined {projectData.author.joinDate}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                                 {projectData.priceType === 'bid' && (
//                                     <Card className="bg-white/5 text-white border-white/10 mb-4">
//                                         <CardContent className="p-6 space-y-6">
//                                             <div className="text-center">
//                                                 <div className="text-2xl font-bold">${highestBid ? highestBid.amount : projectData.price} USD</div>
//                                                 <p className="text-sm text-white/70 mt-1">
//                                                     Current highest bid
//                                                 </p>
//                                             </div>

//                                             <div className="space-y-4">
//                                                 {userBid ? (
//                                                     <div className="text-center">
//                                                         <p className="text-lg font-semibold">Your current bid: ${userBid.amount}</p>
//                                                         <p className="text-sm text-white/70">Placed on {new Date(userBid.timestamp).toLocaleString()}</p>
//                                                     </div>
//                                                 ) : (
//                                                     <p className="text-center text-white/70">You haven't placed a bid yet</p>
//                                                 )}
//                                                 <Input
//                                                     type="number"
//                                                     placeholder="Enter bid amount"
//                                                     value={newBidAmount}
//                                                     onChange={(e) => setNewBidAmount(e.target.value)}
//                                                     className="bg-white/10 border-white/20"
//                                                 />
//                                                 <Button 
//                                                     className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
//                                                     onClick={placeBid}
//                                                 >
//                                                     {userBid ? "Update Your Bid" : "Place Bid"}
//                                                 </Button>
//                                             </div>

//                                             <Separator className="bg-white/10" />

//                                             <div className="space-y-2">
//                                                 <h3 className="font-semibold">Current Bids</h3>
//                                                 <ScrollArea className="h-40">
//                                                     {bids.map((bid) => (
//                                                         <div key={bid.id} className="flex justify-between items-center py-2">
//                                                             <span>{bid.author}</span>
//                                                             <span>${bid.amount}</span>
//                                                         </div>
//                                                     ))}
//                                                 </ScrollArea>
//                                             </div>

//                                             {userBid && (
//                                                 <div className="flex items-center space-x-2 text-yellow-400">
//                                                     <AlertTriangle className="h-4 w-4" />
//                                                     <span className="text-sm">You can only place one bid</span>
//                                                 </div>
//                                             )}
//                                         </CardContent>
//                                     </Card>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     )
// }


// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import Header from '@/partials/Header'
// import { jwtDecode } from 'jwt-decode'
// import { ScrollArea } from "@/components/ui/scroll-area"
// import EmojiPicker from '@/components/EmojiPicker'
// import {
//     ArrowLeft,
//     AlertTriangle,
//     ArrowRight,
//     ChevronDown,
//     ChevronUp,
//     Clock,
//     ExternalLink,
//     Heart,
//     MessageCircle,
//     Share2,
//     ThumbsDown,
//     Check,
//     ThumbsUp,
//     Zap,
//     Menu,
//     Bell,
//     Search
// } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useRouter, useParams } from 'next/navigation'
// import { usePathname } from 'next/navigation'

// const renderTextWithEmojis = (text, emojis) => {
//     if (!emojis || !Array.isArray(emojis)) {
//         return text; // Return the original text if emojis is not an array
//     }

//     const emojiRegex = /:([\w-]+):/g;
//     const parts = text.split(emojiRegex);

//     return parts.map((part, index) => {
//         if (index % 2 === 0) {
//             return part;
//         } else {
//             const emoji = emojis.find(e => e.emojiTitle === `:${part}:`);
//             if (emoji) {
//                 return (
//                     <img
//                         key={index}
//                         src={emoji.emojiUrl}
//                         alt={emoji.emojiTitle}
//                         title={emoji.emojiTitle}
//                         className={`inline-block w-6 h-6 ${emoji.isAnimated ? 'animate-pulse' : ''}`}
//                     />
//                 );
//             } else {
//                 return `:${part}:`;
//             }
//         }
//     });
// };

// // Comment component
// const Comment = ({ comment, onReply, projectCreatorId, emojis }) => {
//     const [isReplying, setIsReplying] = useState(false)
//     const [replyContent, setReplyContent] = useState('')

//     const handleReply = () => {
//         if (comment.userId === '67321c26210e3f7cf0b4a124') {
//             alert("You can't submit projects as a guest user, please sign in from your real account.");
//             return;
//         }
//         if (replyContent.trim()) {
//             onReply(comment.id, replyContent)
//             setReplyContent('')
//             setIsReplying(false)
//         }
//     }

//     const handleEmojiSelect = (emojiTitle) => {
//         setReplyContent((prevContent) => `${prevContent} ${emojiTitle}`);
//     };

//     const isCreator = comment.userId === projectCreatorId

//     return (
//         <Card className="bg-white/5 text-white border-white/10 mb-4">
//             <CardContent className="p-4">
//                 <div className="flex space-x-4">
//                     <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative">
//                         <img src={comment.avatar} alt={comment.author} className="object-cover w-full h-full" />
//                     </div>

//                     <div className="text-white flex-1">
//                         <div className="flex items-center text-white space-x-2">
//                             <Link href={`/user/${comment.userId}`}>
//                                 <span className="font-semibold cursor-pointer hover:underline">{comment.author}</span>
//                             </Link>
//                             {isCreator && <Badge className="bg-blue-500 hover:bg-blue-500">Creator</Badge>}
//                             <span className="text-sm text-white/50">{comment.timestamp}</span>
//                         </div>
//                         <p className="mt-2 text-white/70">{renderTextWithEmojis(comment.content, emojis)}</p>
//                         <div className="mt-2 flex items-center space-x-4">
//                             <button
//                                 className="flex items-center space-x-1 text-white/50 hover:text-white"
//                                 onClick={() => setIsReplying(!isReplying)}
//                             >
//                                 <MessageCircle className="h-4 w-4" />
//                                 <span>Reply</span>
//                             </button>
//                         </div>

//                         {isReplying && (
//                             <div className="mt-4">
//                                 <div className="flex">
//                                     <Textarea
//                                         placeholder="Write a reply..."
//                                         value={replyContent}
//                                         onChange={(e) => setReplyContent(e.target.value)}
//                                         className="w-full bg-white/5 border-white/10 focus:border-yellow-400/50"
//                                     />
//                                     <EmojiPicker onEmojiSelect={handleEmojiSelect} />
//                                 </div>
//                                 <div className="mt-2 flex justify-end space-x-2">
//                                     <Button variant="ghost" className='rounded border-2 bg-white text-black hover:bg-black hover:text-white' onClick={() => setIsReplying(false)}>Cancel</Button>
//                                     <Button variant="outline" className='text-black bg-white rounded border-2 hover:bg-black hover:text-white' onClick={handleReply}>Post Reply</Button>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Nested Replies */}
//                         {comment.replies && comment.replies.map(reply => (
//                             <Card key={reply.id} className="mt-4 ml-8 text-white bg-white/5 border-white/10">
//                                 <CardContent className="p-4">
//                                     <div className="flex space-x-4">
//                                         <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative">
//                                             <img src={reply.avatar} alt={reply.author} className="object-cover w-full h-full" />
//                                         </div>
//                                         <div className="flex-1">
//                                             <div className="flex items-center space-x-2">
//                                                 <Link href={`/user/${reply.userId}`}>
//                                                     <span className="font-semibold cursor-pointer hover:underline">{reply.author}</span>
//                                                 </Link>
//                                                 {reply.userId === projectCreatorId && <Badge className="bg-blue-500 hover:bg-blue-500">Creator</Badge>}
//                                                 <span className="text-sm text-white/50">{reply.timestamp}</span>
//                                             </div>
//                                             <p className="mt-2 text-white/70">{renderTextWithEmojis(reply.content, emojis)}</p>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// export default function ProjectDetails() {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0)
//     const [sortBy, setSortBy] = useState('top')
//     const [newComment, setNewComment] = useState('')
//     const [bids, setBids] = useState([])
//     const [newBidAmount, setNewBidAmount] = useState('')
//     const [userBid, setUserBid] = useState(null)
//     const [comments, setComments] = useState([])
//     const [currentUser, setCurrentUser] = useState({})
//     const [projectData, setProjectData] = useState(null)
//     const [highestBid, setHighestBid] = useState(null)
//     const [userId, setUserId] = useState()
//     const [emojis, setEmojis] = useState([]);
//     const pathname = usePathname()
//     const router = useRouter()
//     const params = useParams()

//     useEffect(() => {
//         const token = localStorage.getItem('accessToken')
//         if (!token) {
//             router.push('/auth')
//             return
//         }
//         try {
//             const decoded = jwtDecode(token)
//             setUserId(decoded.userId)
//             setCurrentUser(decoded)
//             fetchProjectData()
//             fetchComments()
//             fetchBids(decoded.userId)
//         } catch (error) {
//             console.error(error)
//             router.push('/auth')
//         }
//         fetch('/api/emojis')
//             .then(response => response.json())
//             .then(data => setEmojis(data))
//             .catch(error => console.error('Error fetching emojis:', error));
//     }, [router, params])

//     const fetchProjectData = async () => {
//         try {
//             const response = await fetch(`/api/project?id=${params.id}`)
//             const data = await response.json()
//             if (data.projectData) {
//                 setProjectData(data.projectData)
//             }
//         } catch (error) {
//             console.error("Error fetching project data:", error)
//         }
//     }

//     const fetchComments = async () => {
//         try {
//             const response = await fetch(`/api/project-action/comment?id=${params.id}`)
//             const data = await response.json()
//             if (data.success) {
//                 setComments(data.data)
//             }
//         } catch (error) {
//             console.error("Error fetching comments:", error)
//         }
//     }

//     const fetchBids = async (currentUserId) => {
//         try {
//             const response = await fetch(`/api/project-action/bid-action?id=${params.id}`)
//             const data = await response.json()
//             if (data.success) {
//                 setBids(data.data)
//                 const userBid = data.data.find(bid => bid.authorId === currentUserId)
//                 if (userBid) {
//                     setUserBid(userBid)
//                 }
//                 const highestBid = data.data.reduce((max, bid) => max.amount > bid.amount ? max : bid, { amount: 0 })
//                 setHighestBid(highestBid)
//             }
//         } catch (error) {
//             console.error("Error fetching bids:", error)
//         }
//     }


//     const handleEmojiSelect = (emojiTitle) => {
//         setNewComment((prevComment) => `${prevComment} ${emojiTitle}`);
//     };


//     const nextImage = () => {
//         setCurrentImageIndex((prev) =>
//             prev === projectData.images.length - 1 ? 0 : prev + 1
//         )
//     }

//     const prevImage = () => {
//         setCurrentImageIndex((prev) =>
//             prev === 0 ? projectData.images.length - 1 : prev - 1
//         )
//     }

//     const placeBid = useCallback(async () => {
//         if (currentUser.userId === '67321c26210e3f7cf0b4a124') {
//             alert("You can't add comments as Guest. Sign in from your real account.");
//             return;
//         }
//         const bidAmount = parseInt(newBidAmount);
//         if (isNaN(bidAmount) || bidAmount <= 0) {
//             alert("Please enter a valid bid amount.");
//             return;
//         }

//         if (bidAmount < projectData.minBidIncrement) {
//             alert(`Minimum bid increment is $${projectData.minBidIncrement}.`);
//             return;
//         }

//         if (new Date() > new Date(projectData.bidEndDate)) {
//             alert("Bidding for this project has ended.");
//             return;
//         }

//         try {
//             const response = await fetch(`/api/project-action/bid-action?id=${params.id}`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     bidderId: currentUser.userId,
//                     bidAmount: bidAmount,
//                 }),
//             });

//             const data = await response.json();

//             if (data.success) {
//                 fetchBids(currentUser.userId);
//                 setNewBidAmount('');

//                 const notificationResponse = await fetch(`/api/notification`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         senderId: currentUser.userId,
//                         receiverId: projectData.author.id,
//                         type: 'bid',
//                         projectId: params.id,
//                     }),
//                 });

//                 const notificationData = await notificationResponse.json();

//                 if (!notificationData.success) {
//                     console.warn("Failed to send notification:", notificationData.message);
//                 }
//             } else {
//                 alert("Failed to place bid. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error placing bid:", error);
//             alert("An error occurred while placing your bid. Please try again.");
//         }
//     }, [newBidAmount, currentUser.userId, params.id, projectData, fetchBids]);


//     const addComment = useCallback(async () => {
//         if (currentUser.userId === '67321c26210e3f7cf0b4a124') {
//             alert("You can't add comments as Guest. Sign in from your real account.");
//             return;
//         }
//         if (newComment.trim()) {
//             try {
//                 const response = await fetch(`/api/project-action/comment?id=${params.id}`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         userId: currentUser.userId,
//                         author: currentUser.username,
//                         avatar: currentUser.profilePic,
//                         content: newComment,
//                     }),
//                 });

//                 const data = await response.json();

//                 if (data.success) {
//                     fetchComments();
//                     setNewComment('');

//                     const notificationResponse = await fetch(`/api/notification`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({
//                             senderId: currentUser.userId,
//                             receiverId: projectData.author.id,
//                             type: 'comment',
//                             projectId: params.id,
//                         }),
//                     });

//                     const notificationData = await notificationResponse.json();

//                     if (!notificationData.success) {
//                         console.warn("Failed to send notification:", notificationData.message);
//                     }
//                 } else {
//                     alert("Failed to post comment. Please try again.");
//                 }
//             } catch (error) {
//                 console.error("Error posting comment:", error);
//                 alert("An error occurred while posting your comment. Please try again.");
//             }
//         }
//     }, [newComment, currentUser, params.id, fetchComments]);

//     const addReply = useCallback(async (commentId, content) => {
//         if (currentUser.userId === '67321c26210e3f7cf0b4a124') {
//             alert("You can't add comments as Guest. Sign in from your real account.");
//             return;
//         }

//         try {
//             const response = await fetch(`/api/project-action/comment?id=${params.id}`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     userId: currentUser.userId,
//                     author: currentUser.username,
//                     avatar: currentUser.profilePic,
//                     content: content,
//                     parentCommentId: commentId,
//                 }),
//             });

//             const data = await response.json();

//             if (data.success) {
//                 fetchComments();

//                 const notificationResponse = await fetch(`/api/notification`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         senderId: currentUser.userId,
//                         receiverId: projectData.author.id,
//                         type: 'reply',
//                         projectId: params.id,
//                     }),
//                 });

//                 const notificationData = await notificationResponse.json();

//                 if (!notificationData.success) {
//                     console.warn("Failed to send notification:", notificationData.message);
//                 }
//             } else {
//                 alert("Failed to post reply. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error posting reply:", error);
//             alert("An error occurred while posting your reply. Please try again.");
//         }
//     }, [currentUser, params.id, fetchComments]);


//     const sortComments = useCallback((comments) => {
//         if (sortBy === 'top') {
//             return [...comments].sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0))
//         } else {
//             return [...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//         }
//     }, [sortBy])

//     if (!projectData) {
//         return null
//     }

//     const isBiddingEnded = new Date() > new Date(projectData.bidEndDate)

//     return (
//         <div className="min-h-screen bg-black text-white">
//             <Header avatar={currentUser.profilePic} userId={currentUser.userId} currentPage={pathname}/>
//             <main className="container mx-auto px-4 py-8">
//                 <div className="grid gap-8">
//                     {/* Project Header */}
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                             <div className="flex items-center space-x-2">
//                                 <Badge variant="outline" className="text-yellow-400 border-yellow-400">
//                                     {projectData.views} VIEWS
//                                 </Badge>
//                                 <Badge variant="outline" className="text-yellow-400 border-yellow-400">
//                                     {projectData.projectStatus.toUpperCase()}
//                                 </Badge>
//                                 {projectData.tags.map((tag, index) => (
//                                     <Badge
//                                         key={index}
//                                         variant="outline"
//                                         className="text-yellow-400 border-yellow-400"
//                                     >
//                                         {tag}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Project Title */}
//                     <div>
//                         <h1 className="text-3xl font-bold">{projectData.title}</h1>
//                         <p className="text-white/70 mt-2">{projectData.description}</p>
//                     </div>

//                     {/* Image Slider */}
//                     <div className="relative aspect-video bg-white/5 rounded-xl overflow-hidden">
//                         <Image
//                             src={projectData.images[currentImageIndex]}
//                             alt={`Project screenshot ${currentImageIndex + 1}`}
//                             fill
//                             className="object-cover"
//                         />
//                         <div className="absolute inset-0 flex items-center justify-between p-4">
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={prevImage}
//                                 className="bg-black/50 hover:bg-black/70"
//                             >
//                                 <ArrowLeft className="h-6 w-6" />
//                             </Button>
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={nextImage}
//                                 className="bg-black/50 hover:bg-black/70"
//                             >
//                                 <ArrowRight className="h-6 w-6" />
//                             </Button>
//                         </div>
//                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//                             {projectData.images.map((_, index) => (
//                                 <button
//                                     key={index}
//                                     className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
//                                         }`}
//                                     onClick={() => setCurrentImageIndex(index)}
//                                 />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Project Details */}
//                     <div className="grid md:grid-cols-3 gap-8">
//                         <div className="md:col-span-2 space-y-8">
//                             <Card className="bg-white/5 border-white/10">
//                                 <CardContent className="p-6 space-y-4">
//                                     <div>
//                                         <h2 className="text-xl text-white font-semibold mb-2">Project Build Details</h2>
//                                         <p className="text-white/70">{projectData.buildDetails}</p>
//                                     </div>
//                                     <Separator className="bg-white/10" />
//                                     <div>
//                                         <h2 className="text-xl font-semibold mb-2 text-white">Reason for Selling</h2>
//                                         <p className="text-white/70">{projectData.sellingReason}</p>
//                                     </div>
//                                     <Separator className="bg-white/10" />
//                                     <div>
//                                         <h2 className="text-xl font-semibold mb-2 text-white">Future Potential</h2>
//                                         <p className="text-white/70">{projectData.futurePotential}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Metrics */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <Card className="bg-white/5 border-white/10">
//                                     <CardContent className="p-6 text-center">
//                                         <div className="text-2xl text-white font-bold">${projectData.metrics.avgRevenue}</div>
//                                         <div className="text-sm text-white/70">Avg. Revenue / Month</div>
//                                     </CardContent>
//                                 </Card>
//                                 <Card className="bg-white/5 border-white/10">
//                                     <CardContent className="p-6 text-center">
//                                         <div className="text-2xl font-bold text-white">{projectData.metrics.avgDownloads}</div>
//                                         <div className="text-sm text-white/70">Avg. Downloads / Month</div>
//                                     </CardContent>
//                                 </Card>
//                             </div>

//                             {/* Included Items */}
//                             <Card className="bg-white/5 border-white/10">
//                                 <CardContent className="p-6 space-y-4">
//                                     <h2 className="text-xl font-semibold text-white">Included Items</h2>
//                                     <div className="flex flex-wrap gap-2">
//                                         {projectData.includedItems.map((item, index) => (
//                                             <Badge key={index} variant="secondary" className="bg-green-500/20 hover:bg-green-500/20 text-green-400">
//                                                 <Check className="mr-1 h-3 w-3" /> {item}
//                                             </Badge>
//                                         ))}
//                                     </div>
//                                     {projectData.additionalItems && (
//                                         <div>
//                                             <h3 className="text-lg font-semibold text-white mt-4">Additional Items</h3>
//                                             <p className="text-white/70">{projectData.additionalItems}</p>
//                                         </div>
//                                     )}
//                                 </CardContent>
//                             </Card>

//                             {/* Comments Section */}
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <h2 className="text-xl font-semibold">Comments</h2>
//                                     <select
//                                         value={sortBy}
//                                         onChange={(e) => setSortBy(e.target.value)}
//                                         className="bg-white/5 border-white/50 rounded-md px-3 py-1"
//                                     >
//                                         <option value="top" className='bg-black text-white'>Top Comments</option>
//                                         <option value="recent" className='bg-black text-white'>Recent</option>
//                                     </select>
//                                 </div>

//                                 <div className="space-y-4">
//                                     <div className="flex space-x-4">
//                                         <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative">
//                                             <img src={currentUser.profilePic} alt="User Avatar" className="object-cover w-full h-full" />
//                                         </div>

//                                         <div className="flex">
//                                             <Textarea
//                                                 placeholder="Add a comment..."
//                                                 value={newComment}
//                                                 onChange={(e) => setNewComment(e.target.value)}
//                                                 className="w-[750px] bg-white/5 border-white/10 focus:border-yellow-400/50"
//                                             />
//                                             <EmojiPicker onEmojiSelect={handleEmojiSelect} />
//                                             <div className="mt-2 flex justify-end text-white">
//                                                 <Button
//                                                     variant="outline"
//                                                     className='text-black bg-white rounded border-2 hover:bg-black hover:text-white'
//                                                     onClick={() => {
//                                                         addComment(newComment);
//                                                         setNewComment('');
//                                                     }}
//                                                     disabled={!newComment.trim()}
//                                                 >
//                                                     Post Comment
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {sortComments(comments).map(comment => (
//                                         <Comment
//                                             key={comment.id}
//                                             comment={comment}
//                                             onReply={addReply}
//                                             projectCreatorId={projectData.author.id}
//                                             emojis={emojis}
//                                         />
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Sidebar */}
//                         <div className="space-y-4">
//                             <div className="sticky top-4">
//                                 <Card className="bg-white/5 text-white mb-[30px] border-white/10 ">
//                                     <CardContent className="p-6 space-y-6">
//                                         <div className="text-center">
//                                             <div className="text-2xl font-bold">
//                                                 ${projectData.priceType === 'bid' ? (highestBid ? highestBid.amount : projectData.price) : projectData.price} USD
//                                             </div>
//                                             {projectData.priceType === 'bid' ? (
//                                                 <p className="text-sm text-white/70 mt-1">
//                                                     This is the highest bid ever placed for this project
//                                                 </p>
//                                             ) : projectData.isNegotiable && (
//                                                 <p className="text-sm text-white/70 mt-1">
//                                                     This price is negotiable and transferable
//                                                 </p>
//                                             )}
//                                         </div>

//                                         <div className="space-y-4">
//                                             <Link href={`/user/${projectData.author.id}`} target="_blank" rel="noopener noreferrer">
//                                                 <Button className="w-full bg-blue-600 mb-4 hover:bg-blue-700">
//                                                     Buy Project / Contact Owner
//                                                 </Button>
//                                             </Link>
//                                             <Link href={projectData.projectUrl} target="_blank" rel="noopener noreferrer">
//                                                 <Button variant="outline" className="text-black w-full">
//                                                     <ExternalLink className="mr-2 h-4 w-4" />
//                                                     Visit Project Website
//                                                 </Button>
//                                             </Link>
//                                         </div>

//                                         <Separator className="bg-white/10" />

//                                         <div className="flex items-center space-x-4">
//                                             <img src={projectData.author.avatar} alt={projectData.author.name} className='rounded-full w-[40px] h-[40px]' />
//                                             {/* <Image
//                                                 src={projectData.author.avatar}
//                                                 alt={projectData.author.name}
//                                                 width={40}
//                                                 height={40}
//                                                 className="rounded-full"
//                                             /> */}
//                                             <div>
//                                                 <div className="flex items-center text-white space-x-2">
//                                                     <Link href={`/user/${projectData.author.id}`}>
//                                                         <span className="font-semibold">{projectData.author.name}</span>
//                                                     </Link>
//                                                     {projectData.author.verified && (
//                                                         <Badge className="bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/20">✓</Badge>
//                                                     )}
//                                                 </div>
//                                                 <div className="text-sm text-white/50">
//                                                     Joined {projectData.author.joinDate}
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <Separator className="bg-white/10" />

//                                         <div className="space-y-2">
//                                             <h3 className="font-semibold">Project Status</h3>
//                                             <div className="flex items-center space-x-2">
//                                                 <Badge variant={projectData.interestedInSelling ? "success" : "secondary"}>
//                                                     {projectData.interestedInSelling ? "Interested In Selling" : "Not Interested In Selling"}
//                                                 </Badge>
//                                                 {projectData.lookingForCoFounder && (
//                                                     <Badge variant="secondary">Looking for Co-Founder</Badge>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                                 {projectData.priceType === 'bid' && (
//                                     <Card className="bg-white/5 text-white border-white/10 mb-4">
//                                         <CardContent className="p-6 space-y-6">
//                                             <div className="text-center">
//                                                 <div className="text-2xl font-bold">${highestBid ? highestBid.amount : projectData.price} USD</div>
//                                                 <p className="text-sm text-white/70 mt-1">
//                                                     Current highest bid
//                                                 </p>
//                                             </div>

//                                             <div className="space-y-4">
//                                                 {userBid ? (
//                                                     <div className="text-center">
//                                                         <p className="text-lg font-semibold">Your current bid: ${userBid.amount}</p>
//                                                         <p className="text-sm text-white/70">Placed on {new Date(userBid.timestamp).toLocaleString()}</p>
//                                                     </div>
//                                                 ) : (
//                                                     <p className="text-center text-white/70">You haven&apost placed a bid yet</p>
//                                                 )}
//                                                 {!isBiddingEnded && (
//                                                     <>
//                                                         <Input
//                                                             type="number"
//                                                             placeholder="Enter bid amount"
//                                                             value={newBidAmount}
//                                                             onChange={(e) => setNewBidAmount(e.target.value)}
//                                                             className="bg-white/10 border-white/20"
//                                                         />
//                                                         <Button
//                                                             className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
//                                                             onClick={placeBid}
//                                                         >
//                                                             {userBid ? "Update Your Bid" : "Place Bid"}
//                                                         </Button>
//                                                     </>
//                                                 )}
//                                             </div>

//                                             <Separator className="bg-white/10" />

//                                             <div className="space-y-2">
//                                                 <h3 className="font-semibold">Current Bids</h3>
//                                                 <ScrollArea className="h-40">
//                                                     {bids.map((bid) => (
//                                                         <div key={bid.id} className="flex justify-between items-center py-2">
//                                                             <Link href={`/user/${bid.authorId}`}>
//                                                                 <span className="cursor-pointer hover:underline">{bid.author}</span>
//                                                             </Link>
//                                                             <span>${bid.amount}</span>
//                                                         </div>
//                                                     ))}
//                                                 </ScrollArea>
//                                             </div>

//                                             {isBiddingEnded && highestBid && (
//                                                 <div className="flex items-center space-x-2 text-yellow-400">
//                                                     <AlertTriangle className="h-4 w-4" />
//                                                     <span className="text-sm">Bidding has ended. {highestBid.author} won with a bid of ${highestBid.amount}</span>
//                                                 </div>
//                                             )}

//                                             {!isBiddingEnded && (
//                                                 <div className="flex items-center space-x-2 text-yellow-400">
//                                                     <AlertTriangle className="h-4 w-4" />
//                                                     <span className="text-sm">Minimum bid increment: ${projectData.minBidIncrement}</span>
//                                                 </div>
//                                             )}
//                                         </CardContent>
//                                     </Card>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     )
// }


'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Header from '@/partials/Header'
import { jwtDecode } from 'jwt-decode'
import ProjectPreview from '@/components/ProjectPreview'
import { ScrollArea } from "@/components/ui/scroll-area"
import EmojiPicker from '@/components/EmojiPicker'
import { ArrowLeft, AlertTriangle, AlertCircle, ArrowRight, ChevronDown, ChevronUp, Clock, ExternalLink, Heart, MessageCircle, Share2, ThumbsDown, Check, ThumbsUp, Zap, Menu, Bell, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";


const renderTextWithEmojis = (text, emojis) => {
    if (!emojis || !Array.isArray(emojis)) {
        return text;
    }

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
                        className={`inline-block w-6 h-6 ${emoji.isAnimated ? 'animate-pulse' : ''}`}
                    />
                );
            } else {
                return `:${part}:`;
            }
        }
    });
};

const Comment = ({ comment, onReply, projectCreatorId, emojis, isDarkTheme }) => {
    const [isReplying, setIsReplying] = useState(false)
    const [replyContent, setReplyContent] = useState('')

    const handleReply = () => {
        if (comment.userId === null ) {
            toast({
                title: "Error",
                description: "You can't submit projects as a guest user, please sign in from your real account.",
                variant: "destructive",
            })
            return;
        }
        if (replyContent.trim()) {
            onReply(comment.id, replyContent)
            setReplyContent('')
            setIsReplying(false)
        }
    }

    const handleEmojiSelect = (emojiTitle) => {
        setReplyContent((prevContent) => `${prevContent} ${emojiTitle}`);
    };

    const isCreator = comment.userId === projectCreatorId

    return (
        <Card className={`${isDarkTheme ? 'bg-white/5 text-white border-white/10 mb-4' : 'bg-white text-black border-zinc-200 mb-4'}`}>
            <CardContent className="p-4">
                <div className="flex space-x-4">
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative">
                        <img src={comment.avatar} alt={comment.author} className="object-cover w-full h-full" />
                    </div>

                    <div className={`${isDarkTheme ? 'text-white flex-1' : 'text-black flex-1'}`}>
                        <div className={`${isDarkTheme ? 'flex items-center text-white space-x-2' : 'flex items-center text-black space-x-2'}`}>
                            <Link href={`/user/${comment.userId}`}>
                                <span className={`font-semibold cursor-pointer hover:underline ${comment.usernameEffect}`}>{comment.author}</span>
                            </Link>
                            {isCreator && <Badge className="bg-blue-500 hover:bg-blue-500">Creator</Badge>}
                            <span className={`text-xs ${isDarkTheme ? 'text-white/50' : 'text-zinc-700'}`}>{new Date(comment.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className={`${isDarkTheme ? 'mt-2 text-white/70' : 'mt-2 text-zinc-700'}`}>{renderTextWithEmojis(comment.content, emojis)}</p>
                        <div className="mt-2 flex items-center space-x-4">
                            <button
                                className={`flex items-center space-x-1 ${isDarkTheme ? 'text-white/50 hover:text-white' : 'text-zinc-700 hover:text-zinc-700'}`}
                                onClick={() => setIsReplying(!isReplying)}
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span>Reply</span>
                            </button>
                        </div>

                        {isReplying && (
                            <div className="mt-4">
                                <div className="flex flex-col sm:flex-row">
                                    <Textarea
                                        placeholder="Write a reply..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className={`${isDarkTheme ? 'w-full bg-white/5 border-white/10 focus:border-yellow-400/50 mb-2 sm:mb-0 sm:mr-2' : 'w-full bg-white/5 border-zinc-300  mb-2 sm:mb-0 sm:mr-2'}`}
                                    />
                                    <EmojiPicker onEmojiSelect={handleEmojiSelect} isDarkTheme={isDarkTheme} />
                                </div>
                                <div className="mt-2 flex justify-end space-x-2">
                                    <Button variant="ghost" className='rounded border-2 bg-white text-black hover:bg-black hover:text-white' onClick={() => setIsReplying(false)}>Cancel</Button>
                                    <Button variant="outline" className='text-black bg-white rounded border-2 hover:bg-black hover:text-white' onClick={handleReply}>Post Reply</Button>
                                </div>
                            </div>
                        )}

                        {comment.replies && comment.replies.map(reply => (
                            <Card key={reply.id} className={`${isDarkTheme ? 'mt-4 ml-4 sm:ml-8 text-white bg-white/5 border-white/10' : 'mt-4 ml-4 sm:ml-8 text-black bg-white border-zinc-200'}`}>
                                <CardContent className="p-4">
                                    <div className="flex space-x-4">
                                        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative">
                                            <img src={reply.avatar} alt={reply.author} className="object-cover w-full h-full" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <Link href={`/user/${reply.userId}`}>
                                                    <span className={`font-semibold cursor-pointer hover:underline ${reply.usernameEffect} `}>{reply.author}</span>
                                                </Link>
                                                {reply.userId === projectCreatorId && <Badge className="bg-blue-500 hover:bg-blue-500">Creator</Badge>}
                                                <span className={`${isDarkTheme ? 'text-sm text-white/50' : 'text-sm text-zinc-700'}`}>{new Date(reply.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className={`${isDarkTheme ? 'mt-2 text-white/70' : 'mt-2 text-zinc-700'}`}>{renderTextWithEmojis(reply.content, emojis)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function ProjectDetails() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sortBy, setSortBy] = useState('top');
    const [newComment, setNewComment] = useState('');
    const [bids, setBids] = useState([]);
    const [newBidAmount, setNewBidAmount] = useState('');
    const [userBid, setUserBid] = useState(null);
    const [comments, setComments] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [highestBid, setHighestBid] = useState(null);
    const [userId, setUserId] = useState();
    const [emojis, setEmojis] = useState([]);
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState('');
    const [isSold, setIsSold] = useState(false);
    const [projectData, setProjectData] = useState(null);
    const [isChatStarted, setIsChatStarted] = useState(false);
    const [isMessageSent, setIsMessageSent] = useState(false);
    const [IsCurrentUserPremium, SetCurrentUserAsPremium] = useState()
    const [statusEmoji, setStatusEmoji] = useState('')
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const wsRef = useRef(null)
    const { toast } = useToast();

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const openPreview = (link) => {
        setCurrentProject(link)
        setIsPreviewOpen(true)
    }

    const startChat = async () => {
        if (currentUser.userId === projectData.author.id) {
            toast({
                title: "Error",
                description: "You cannot message yourself.",
                variant: "destructive",
            })
            return
        }

        try {
            const startChatResponse = await fetch('/api/start-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    starterId: currentUser.userId,
                    recipientId: projectData.author.id,
                }),
            })
            const startChatData = await startChatResponse.json()

            if (startChatData.success) {
                setIsChatStarted(true)

                wsRef.current = new WebSocket(`wss://sideprojector-ws.onrender.com/p2p?userId=${currentUser.userId}`)

                wsRef.current.onopen = () => {
                    const messageData = {
                        recipientId: projectData.author.id,
                        content: `Hey, I'm interested in ${projectData.title}`,
                    }

                    wsRef.current.send(JSON.stringify(messageData))
                    setIsMessageSent(true)

                    toast({
                        title: "Message Sent",
                        description: "Your message has been sent to the project owner.",
                        variant: "success",
                    })

                    router.push('/chat')
                }

                wsRef.current.onerror = (error) => {
                    console.error('WebSocket error:', error)
                    toast({
                        title: "Error",
                        description: "Failed to establish WebSocket connection. Please try again.",
                        variant: "destructive",
                    })
                }
            } else {
                toast({
                    title: "Error",
                    description: "Failed to start chat. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error starting chat:', error)
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        }
    }

    const markAsSold = async () => {
        try {
            const response = await fetch('/api/mark-as-sold', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: params.id,
                    ownerId: currentUser.userId,
                }),
            });
            const data = await response.json();
            if (data.message === "Project marked as sold successfully") {
                setIsSold(true);
            }
        } catch (error) {
            console.error("Error marking project as sold:", error);
        }
    }


    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            router.push('/auth')
            return
        }
        try {
            const decoded = jwtDecode(token);
            setUserId(decoded.userId);
            setCurrentUser(decoded);
            SetCurrentUserAsPremium(decoded.isPremium)
            fetchProjectData(decoded);
            fetchComments();
            fetchBids(decoded.userId);
        } catch (error) {
            console.error(error);
            router.push('/auth');
        }
        fetch('/api/emojis')
            .then(response => response.json())
            .then(data => setEmojis(data))
            .catch(error => console.error('Error fetching emojis:', error));
    }, [router, params])

    const fetchProjectData = async (user) => {
        try {
            const response = await fetch(`/api/project?id=${params.id}`)
            const data = await response.json()
            if (data.projectData) {
                setProjectData(data.projectData)
                setStatusEmoji(data.projectData.author.statusEmoji)

                const webhookUrl = 'https://discord.com/api/webhooks/1316066211850620989/_9WGkcypsKTp9KdvRMGFtWQ-eEs8p7HZxwK0XABVOnL8os8wO5hesWHVs_BydHVBN9RA';
                const message = {
                    content: `**New Project Visit Notification**`,
                    embeds: [
                        {
                            title: `Project: ${data.projectData.title}`,
                            description: `A user has visited the project page.`,
                            fields: [
                                {
                                    name: 'User Details',
                                    value: `**User ID**: ${user.userId}\n**Username**: ${user.username}`,
                                },
                                {
                                    name: 'Project Details',
                                    value: `**Project Title**: ${data.projectData.title}\n**Description**: ${data.projectData.description}\n**Project Owner**: ${data.projectData.author.name}`,
                                },
                            ],
                            color: 3447003,
                        },
                    ],
                };

                // const sendWebhook = async () => {
                //     try {
                //         const response = await fetch(webhookUrl, {
                //             method: 'POST',
                //             headers: {
                //                 'Content-Type': 'application/json',
                //             },
                //             body: JSON.stringify(message),
                //         });

                //         if (!response.ok) {
                //             console.error('Failed to send webhook to Discord');
                //         }
                //     } catch (error) {
                //         console.error('Error sending webhook:', error);
                //     }
                // };
                if (data.projectData.status === 'sold') {
                    setIsSold(true)
                }
                sendWebhook();
            }
        } catch (error) {
            console.error("Error fetching project data:", error)
        }

    }

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/project-action/comment?id=${params.id}`)
            const data = await response.json()
            if (data.success) {
                setComments(data.data)
            }
        } catch (error) {
            console.error("Error fetching comments:", error)
        }
    }

    const fetchBids = async (currentUserId) => {
        try {
            const response = await fetch(`/api/project-action/bid-action?id=${params.id}`)
            const data = await response.json()
            if (data.success) {
                setBids(data.data)
                const userBid = data.data.find(bid => bid.authorId === currentUserId)
                if (userBid) {
                    setUserBid(userBid)
                }
                const highestBid = data.data.reduce((max, bid) => max.amount > bid.amount ? max : bid, { amount: 0 })
                setHighestBid(highestBid)
            }
        } catch (error) {
            console.error("Error fetching bids:", error)
        }
    }

    const handleEmojiSelect = (emojiTitle) => {
        setNewComment((prevComment) => `${prevComment} ${emojiTitle}`);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === projectData.images.length - 1 ? 0 : prev + 1
        )
    }



    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? projectData.images.length - 1 : prev - 1
        )
    }

    const placeBid = useCallback(async () => {
        if (currentUser.userId === null) {
            toast({
                title: "Error",
                description: "You can't add comments as Guest. Sign in from your real account.",
                variant: "destructive",
            })
            return;
        }
        const bidAmount = parseInt(newBidAmount);
        if (isNaN(bidAmount) || bidAmount <= 0) {
            toast({
                title: "Error",
                description: "Please enter a valid bid amount.",
                variant: "destructive",
            })
            return;
        }

        if (bidAmount < projectData.minBidIncrement) {
            toast({
                title: "Error",
                description: `Minimum bid increment is $${projectData.minBidIncrement}.`,
                variant: "destructive",
            })
            return;
        }

        if (new Date() > new Date(projectData.bidEndDate)) {
            toast({
                title: "Error",
                description: "Bidding for this project has ended.",
                variant: "destructive",
            })
            return;
        }

        try {
            const response = await fetch(`/api/project-action/bid-action?id=${params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bidderId: currentUser.userId,
                    bidAmount: bidAmount,
                }),
            });

            const data = await response.json();

            if (data.success) {
                fetchBids(currentUser.userId);
                setNewBidAmount('');

                const notificationResponse = await fetch(`/api/notification`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        senderId: currentUser.userId,
                        receiverId: projectData.author.id,
                        type: 'bid',
                        projectId: params.id,
                    }),
                });

                const notificationData = await notificationResponse.json();

                if (!notificationData.success) {
                    console.warn("Failed to send notification:", notificationData.message);
                }
            } else {
                toast({
                    title: "Error",
                    description: "Failed to place bid. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error placing bid:", error);
            toast({
                title: "Error",
                description: "An error occurred while placing your bid. Please try again.",
                variant: "destructive",
            })
        }
    }, [newBidAmount, currentUser.userId, params.id, projectData, fetchBids]);

    const addComment = useCallback(async () => {
        if (currentUser.userId === null) {
            toast({
                title: "Error",
                description: "You can't add comments as Guest. Sign in from your real account.",
                variant: "destructive",
            })
            return;
        }

        const emojiRegex = /:([\w-]+):/g;
        const foundEmojis = newComment.match(emojiRegex) || [];
    
        for (const emojiTitle of foundEmojis) {
            const emojiData = emojis.find(e => e.emojiTitle === emojiTitle);
            if (emojiData && emojiData.isPremium && !IsCurrentUserPremium) {
                alert(`Subscribe to Premium to use premium emojis like ${emojiTitle}`);
                return;
            }
        }

        if (newComment.trim()) {
            try {
                const response = await fetch(`/api/project-action/comment?id=${params.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: currentUser.userId,
                        author: currentUser.username,
                        avatar: currentUser.profilePic,
                        content: newComment,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    fetchComments();
                    setNewComment('');

                    const notificationResponse = await fetch(`/api/notification`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            senderId: currentUser.userId,
                            receiverId: projectData.author.id,
                            type: 'comment',
                            projectId: params.id,
                        }),
                    });

                    const notificationData = await notificationResponse.json();

                    if (!notificationData.success) {
                        console.warn("Failed to send notification:", notificationData.message);
                    }
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to post comment. Please try again.",
                        variant: "destructive",
                    })
                }
            } catch (error) {
                console.error("Error posting comment:", error);
                toast({
                    title: "Error",
                    description: "An error occurred while posting your comment. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }, [newComment, currentUser, params.id, fetchComments]);

    const addReply = useCallback(async (commentId, content) => {
        if (currentUser.userId === null) {
            toast({
                title: "Error",
                description: "You can't add comments as Guest. Sign in from your real account.",
                variant: "destructive",
            })
            return;
        }

        const emojiRegex = /:([\w-]+):/g;
        const foundEmojis = content.match(emojiRegex) || [];
    
        for (const emojiTitle of foundEmojis) {
            const emojiData = emojis.find(e => e.emojiTitle === emojiTitle);
            if (emojiData && emojiData.isPremium && !IsCurrentUserPremium) {
                alert(`Subscribe to Premium to use premium emojis like ${emojiTitle}`);
                return;
            }
        }

        try {
            const response = await fetch(`/api/project-action/comment?id=${params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.userId,
                    author: currentUser.username,
                    avatar: currentUser.profilePic,
                    content: content,
                    parentCommentId: commentId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                fetchComments();

                const notificationResponse = await fetch(`/api/notification`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        senderId: currentUser.userId,
                        receiverId: projectData.author.id,
                        type: 'reply',
                        projectId: params.id,
                    }),
                });

                const notificationData = await notificationResponse.json();

                if (!notificationData.success) {
                    console.warn("Failed to send notification:", notificationData.message);
                }
            } else {
                toast({
                    title: "Error",
                    description: "Failed to post reply. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error posting reply:", error);
            toast({
                title: "Error",
                description: "An error occurred while posting your reply. Please try again.",
                variant: "destructive",
            })
        }
    }, [currentUser, params.id, fetchComments]);

    const sortComments = useCallback((comments) => {
        if (sortBy === 'top') {
            return [...comments].sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0))
        } else {
            return [...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        }
    }, [sortBy])

    if (!projectData) {
        return null
    }

    const isBiddingEnded = new Date() > new Date(projectData.bidEndDate)

    if (!projectData) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header
                avatar={currentUser.profilePic}
                userId={currentUser.userId}
                currentPage={pathname}
                isDarkTheme={isDarkTheme}
                toggleTheme={toggleTheme}
            />
            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-8">
                    {/* Project Header */}
                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex flex-wrap items-center space-x-2 space-y-2">
                            <Badge variant="outline" className="text-yellow-400 mt-2 border-yellow-400">
                                {projectData.views} VIEWS
                            </Badge>
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                {projectData.status}
                            </Badge>
                            {projectData.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-yellow-400 border-yellow-400"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {currentUser.userId === projectData.author.id && (
                                <Button
                                    onClick={markAsSold}
                                    className="bg-red-500 hover:bg-red-600 text-white right-8 absolute"
                                    disabled={isSold}
                                >
                                    {isSold ? 'Marked as Sold' : 'Mark as Sold'}
                                </Button>
                            )}
                        </div>
                    </div>


                    {/* Project Title */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">{projectData.title}</h1>
                        <p className={`${isDarkTheme ? 'text-white/70 mt-2' : 'text-zinc-500 mt-2'}`}>{projectData.description}</p>
                    </div>

                    {/* Image Slider */}
                    <div className="relative aspect-video bg-white/5 rounded-xl overflow-hidden">
                        {/* "SOLD OUT" Text on the top-right corner */}
                        {isSold && (
                            <div
                                className="absolute top-200 left-3 z-30 bg-transparent text-white text-4xl font-extrabold uppercase tracking-wide py-2 px-4"
                                style={{
                                    background: "rgba(0, 0, 0, 0.5)",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                                    transform: "rotate(-40deg)",
                                    transformOrigin: "top left",
                                    fontFamily: "'Roboto', sans-serif",
                                    letterSpacing: "0.2em",
                                }}
                            >
                                SOLD OUT
                            </div>
                        )}

                        {/* Main Image */}
                        <Image
                            src={projectData.images[currentImageIndex]}
                            alt={`Project screenshot ${currentImageIndex + 1}`}
                            fill
                            className="object-cover"
                        />

                        {/* Navigation Buttons */}
                        <div className="absolute inset-0 flex items-center justify-between p-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={prevImage}
                                className={`${isDarkTheme
                                    ? 'bg-black/50 hover:bg-black/70'
                                    : 'bg-zinc-200 hover:bg-zinc-400'
                                    }`}
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={nextImage}
                                className={`${isDarkTheme
                                    ? 'bg-black/50 hover:bg-black/70'
                                    : 'bg-zinc-200 hover:bg-zinc-400'
                                    }`}
                            >
                                <ArrowRight className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Pagination Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {projectData.images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>


                    {/* Project Details */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <Card className={`${isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-white/10 border-zinc-200'}`}>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <h2 className={`${isDarkTheme ? 'text-xl text-white font-semibold mb-2' : 'text-xl text-black font-semibold mb-2'}`}>Technical Details</h2>
                                        <p className={`${isDarkTheme ? 'text-white/70' : 'text-zinc-700'}`}>{projectData.buildDetails}</p>
                                    </div>
                                    <Separator className={`${isDarkTheme ? 'bg-white/10' : 'bg-zinc-300'}`} />
                                    <div>
                                        <h2 className={`${isDarkTheme ? 'text-xl text-white font-semibold mb-2' : 'text-xl text-black font-semibold mb-2'}`}>Reason for Selling</h2>
                                        <p className={`${isDarkTheme ? 'text-white/70' : 'text-zinc-700'}`}>{projectData.sellingReason}</p>
                                    </div>
                                    
                                </CardContent>
                            </Card>

                            {/* Comments Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Comments</h2>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className={`${isDarkTheme ? 'bg-white/5 border-white/50 rounded-md px-3 py-1' : 'bg-zinc-200 border-zinc-700 rounded-md px-3 py-1'}`}
                                    >
                                        <option value="top" className={`${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>Top Comments</option>
                                        <option value="recent" className={`${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>Recent</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative">
                                            <img src={currentUser.profilePic} alt="User Avatar" className="object-cover w-full h-full" />
                                        </div>

                                        <div className="flex-grow flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                            <Textarea
                                                placeholder="Add a comment..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                className={`${isDarkTheme ? 'flex-grow bg-white/5 border-white/10 focus:border-yellow-400/50' : 'flex-grow bg-white border-zinc-300 focus:border-zinc-300'}`}
                                            />
                                            <div className="flex items-center space-x-2">
                                                <EmojiPicker onEmojiSelect={handleEmojiSelect} isDarkTheme={isDarkTheme} />
                                                <Button
                                                    variant="outline"
                                                    className={`${isDarkTheme ? 'text-black bg-white rounded border-2 hover:bg-black hover:text-white' : 'text-white bg-black rounded border-2 hover:bg-white hover:text-black'}`}
                                                    onClick={() => {
                                                        addComment(newComment);
                                                        setNewComment('');
                                                    }}
                                                    disabled={!newComment.trim()}
                                                >
                                                    Post Comment
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {comments && comments.length > 0 ? (
                                        sortComments(comments).map(comment => (
                                            <Comment
                                                key={comment.id}
                                                comment={comment}
                                                onReply={addReply}
                                                projectCreatorId={projectData.author.id}
                                                emojis={emojis}
                                                isDarkTheme={isDarkTheme}
                                            />
                                        ))
                                    ) : (
                                        <p className={`text-center mt-4 py-4 ${isDarkTheme ? 'text-white/50' : 'text-zinc-500'}`}>
                                            No comments yet. Be the first to comment!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            <div className="sticky top-4">
                                <Card className={`${isDarkTheme ? 'bg-white/5 text-white mb-[30px] border-white/10' : 'bg-white text-zinc-700 mb-[30px] border-zinc-200'}`}>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="text-center">
                                            <div className={`${isDarkTheme ? 'text-2xl font-bold' : 'text-2xl font-bold text-black'}`}>
                                                ${projectData.priceType === 'bid' ? (highestBid ? highestBid.amount : projectData.price) : projectData.price} USD
                                            </div>
                                            {projectData.priceType === 'bid' ? (
                                                <p className={`${isDarkTheme ? 'text-sm text-white/70 mt-1' : 'text-sm text-zinc-700 mt-1'}`}>
                                                    This is the highest bid ever placed for this project
                                                </p>
                                            ) : projectData.isNegotiable && (
                                                <p className={`${isDarkTheme ? 'text-sm text-white/70 mt-1' : 'text-sm text-zinc-700 mt-1'}`}>
                                                    This price is negotiable and transferable
                                                </p>
                                            )}
                                        </div>

                                        <div className="">
                                            <Button
                                                className="w-full bg-blue-600 mb-4 hover:bg-blue-700"
                                                onClick={startChat}
                                                disabled={isChatStarted || isMessageSent}
                                            >
                                                {isChatStarted || isMessageSent ? 'Message Sent' : 'Message Owner About This Product'}
                                            </Button>
                                            {/* <Button className="mt-1 w-full" onClick={() => openPreview(projectData.projectUrl)}>
                                                Preview Project
                                            </Button> */}
                                            {/* <ProjectPreview
                                                link={currentProject}
                                                open={isPreviewOpen}
                                                onOpenChange={() => setIsPreviewOpen(false)}
                                            /> */}
                                        </div>

                                        <Separator className={`${isDarkTheme ? 'bg-white/10' : 'bg-zinc-300'}`} />

                                        <div className="flex items-center space-x-4">
                                            {/* <Image
                                                src={projectData.author.avatar}
                                                alt={projectData.author.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            /> */}
                                            <img className="rounded-full h-10 w-10" src={projectData.author.avatar} alt={projectData.author.name} />
                                            <div>
                                                <div className={`${isDarkTheme ? 'flex items-center text-white space-x-2' : 'flex items-center text-black space-x-2'}`}>
                                                    <Link href={`/user/${projectData.author.id}`}>
                                                        <span className={`font-semibold ${projectData.author.nameEffect}`}>{projectData.author.name}</span>
                                                    </Link>
                                                    {renderTextWithEmojis(statusEmoji, emojis)}
                                                </div>
                                                <div className={`${isDarkTheme ? 'text-sm text-white/50' : 'text-sm text-zinc-700'}`}>
                                                    Joined {projectData.author.joinDate}
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className={`${isDarkTheme ? 'bg-white/10' : 'bg-zinc-300'}`} />

                                        <div className="space-y-2">
                                            <h3 className={`${isDarkTheme ? 'font-semibold text-white' : 'font-semibold text-black'}`}>Project Status</h3>
                                            <div className="flex items-center space-x-2">
                                                {projectData.status === 'active' && (
                                                    <Badge className={`${isDarkTheme ? 'text-black hover:bg-white' : 'text-black bg-zinc-200 hover:bg-zinc-200'}`} variant="secondary">Still in stock</Badge>
                                                )}
                                                {projectData.status === 'sold' && (
                                                    <Badge className={`${isDarkTheme ? 'text-black hover:bg-white' : 'text-black bg-zinc-200 hover:bg-zinc-200'}`} variant="secondary">Sold out</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                {projectData.priceType === 'bid' && (
                                    <Card className={`${isDarkTheme ? 'bg-white/5 text-white border-white/10 mb-4' : 'bg-white text-black border-zinc-200 mb-4'}`}>
                                        <CardContent className="p-6 space-y-6">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">${highestBid ? highestBid.amount : projectData.price} USD</div>
                                                <p className={`${isDarkTheme ? 'text-sm text-white/70 mt-1' : 'text-sm text-zinc-700 mt-1'}`}>
                                                    Current highest bid
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                {userBid ? (
                                                    <div className="text-center">
                                                        <p className="text-lg font-semibold">Your current bid: ${userBid.amount}</p>
                                                        <p className={`${isDarkTheme ? 'text-sm text-white/70 mt-1' : 'text-sm text-zinc-700 mt-1'}`}>Placed on {new Date(userBid.timestamp).toLocaleString()}</p>
                                                    </div>
                                                ) : (
                                                    <p className={`${isDarkTheme ? 'text-center text-white/70 mt-1' : 'text-center text-zinc-700 mt-1'}`}>You haven&apos;t placed a bid yet</p>
                                                )}
                                                {!isBiddingEnded && (
                                                    <>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter bid amount"
                                                            value={newBidAmount}
                                                            onChange={(e) => setNewBidAmount(e.target.value)}
                                                            className={`${isDarkTheme ? 'bg-white/10 border-white/20' : 'bg-white border-zinc-300'}`}
                                                        />
                                                        <Button
                                                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
                                                            onClick={placeBid}
                                                        >
                                                            {userBid ? "Update Your Bid" : "Place Bid"}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>

                                            <Separator className={`${isDarkTheme ? 'bg-white/10' : 'bg-zinc-300'}`} />

                                            <div className="space-y-2">
                                                <h3 className="font-semibold">Current Bids</h3>
                                                <ScrollArea className="h-40">
                                                    {bids.map((bid) => (
                                                        <div key={bid.id} className="flex justify-between items-center py-2">
                                                            <Link href={`/user/${bid.authorId}`}>
                                                                <span className="cursor-pointer hover:underline">{bid.author}</span>
                                                            </Link>
                                                            <span>${bid.amount}</span>
                                                        </div>
                                                    ))}
                                                </ScrollArea>
                                            </div>

                                            {isBiddingEnded && highestBid && (
                                                <div className="flex items-center space-x-2 text-yellow-400">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span className="text-sm">Bidding has ended. {highestBid.author} won with a bid of ${highestBid.amount}</span>
                                                </div>
                                            )}

                                            {!isBiddingEnded && (
                                                <div className="flex items-center space-x-2 text-yellow-400">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span className="text-sm">Minimum bid increment: ${projectData.minBidIncrement}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Toaster />
        </div>
    )
}