// 'use client'

// import { useState, useCallback, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { jwtDecode } from 'jwt-decode'
// import { Switch } from "@/components/ui/switch"
// import { usePathname, useRouter } from 'next/navigation'
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { X, Upload, DollarSign, Clock, Tag, Eye, ArrowRight, Globe, BarChart, Download } from 'lucide-react'
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import Image from 'next/image'
// import Header from '@/partials/Header'
// import { useMediaQuery } from 'react-responsive'
// import fetchAndAnalyze from '@/lib/utils/scrapper'
// import { Toaster } from "@/components/ui/toaster";
// import { useToast } from "@/hooks/use-toast";

// const projectCategories = [
//     'SaaS Business',
//     'E-commerce',
//     'Blog',
//     'Mobile App',
//     'Desktop App',
//     'Browser Extention',
//     'AI/ML',
//     'IoT',
//     'Blockchain',
//     'Education',
//     'health & Fitness',
//     'Social Network',
//     'Web Development',
//     'UI/UX Design',
//     'Game Development',
//     'Data Science',
//     'Other'
// ]

// const saleItems = [
//     { id: 'domain', label: 'Domain name' },
//     { id: 'source', label: 'Source code' },
//     { id: 'data', label: 'All related data' },
//     { id: 'design', label: 'Design, images, logo' },
//     { id: 'twitter', label: 'Twitter account' },
//     { id: 'email', label: 'Email account' },
// ]

// export default function EnhancedProjectSubmission() {
//     const [images, setImages] = useState([])
//     const [title, setTitle] = useState('')
//     const [description, setDescription] = useState('')
//     const [projectStatus, setProjectStatus] = useState('selling')
//     const [priceType, setPriceType] = useState('fixed')
//     const [fixedPrice, setFixedPrice] = useState('')
//     const [isNegotiable, setIsNegotiable] = useState(false)
//     const [startingBid, setStartingBid] = useState('')
//     const [minBidIncrement, setMinBidIncrement] = useState('')
//     const [bidEndTime, setBidEndTime] = useState('')
//     const [category, setCategory] = useState('')
//     const [tags, setTags] = useState([])
//     const [newTag, setNewTag] = useState('')
//     const [isPreviewMode, setIsPreviewMode] = useState(false)
//     const [projectLink, setProjectLink] = useState('')
//     const [avgRevenue, setAvgRevenue] = useState('')
//     const [avgDownloads, setAvgDownloads] = useState('')
//     const [projectBuildDetails, setProjectBuildDetails] = useState('')
//     const [reasonForSelling, setReasonForSelling] = useState('')
//     const [token, setToken] = useState(null)
//     const [currentUser, setCurrentUser] = useState({})
//     const [interestedInSelling, setInterestedInSelling] = useState(false)
//     const [lookingForCoFounder, setLookingForCoFounder] = useState(false)
//     const [includedItems, setIncludedItems] = useState([])
//     const [additionalItems, setAdditionalItems] = useState('')
//     const [futurePotential, setFuturePotential] = useState('')
//     const [isMetaFetcherOpen, setIsMetaFetcherOpen] = useState(false)
//     const [isDarkTheme, setIsDarkTheme] = useState(true);
//     const [metaFetchUrl, setMetaFetchUrl] = useState('')
//     const pathname = usePathname()
//     const router = useRouter()
//     const { toast } = useToast();

//     const isMobile = useMediaQuery({ query: '(max-width: 640px)' })


//     useEffect(() => {
//         const storedTheme = localStorage.getItem('theme');
//         setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true);
//     }, []);

//     const toggleTheme = () => {
//         const newTheme = !isDarkTheme;
//         setIsDarkTheme(newTheme);
//         localStorage.setItem('theme', newTheme ? 'dark' : 'light');
//     };


//     useEffect(() => {
//         const token = localStorage.getItem('accessToken')
//         if (!token) {
//             router.push('/auth')
//         } else {
//             setToken(token)
//         }
//         try {
//             const decoded = jwtDecode(token);
//             setCurrentUser(decoded)

//         } catch (error) {
//             console.log(error)
//         }
//     }, [router])

//     const handleImageUpload = useCallback((e) => {
//         const files = Array.from(e.target.files || [])
//         if (files.length + images.length > 5) {
//             toast({
//                 title: "Error",
//                 description: "You can only upload up to 5 images",
//                 variant: "destructive",
//             })
//             return
//         }
//         files.forEach(file => {
//             const reader = new FileReader()
//             reader.onloadend = () => {
//                 setImages(prev => [...prev, reader.result])
//             }
//             reader.readAsDataURL(file)
//         })
//     }, [images])

//     const removeImage = useCallback((index) => {
//         setImages(prev => prev.filter((_, i) => i !== index))
//     }, [])

//     const reorderImages = useCallback((fromIndex, toIndex) => {
//         setImages(prev => {
//             const newImages = [...prev]
//             const [removed] = newImages.splice(fromIndex, 1)
//             newImages.splice(toIndex, 0, removed)
//             return newImages
//         })
//     }, [])

//     const addTag = useCallback(() => {
//         if (newTag && !tags.includes(newTag) && tags.length < 5) {
//             setTags(prev => [...prev, newTag])
//             setNewTag('')
//         }
//     }, [newTag, tags])

//     const removeTag = useCallback((tag) => {
//         setTags(prev => prev.filter(t => t !== tag))
//     }, [])

//     const togglePreviewMode = () => {
//         setIsPreviewMode(prev => !prev)
//     }

//     const validateBidEndTime = (time) => {
//         const selectedDate = new Date(time);
//         const currentDate = new Date();

//         if (selectedDate <= currentDate) {
//             toast({
//                 title: "Error",
//                 description: "You can't select a date in the past or today. Please choose a future date.",
//                 variant: "destructive",
//             })
//             return false;
//         }
//         return true;
//     }

//     const validateProjectLink = (link) => {
//         const urlPattern = /^https:\/\/.+/
//         if (link && !urlPattern.test(link)) {
//             toast({
//                 title: "Error",
//                 description: "Project link must start with https://",
//                 variant: "destructive",
//             })
//             return false
//         }
//         return true
//     }

//     const handleMetaFetch = async () => {
//         if (!validateProjectLink(metaFetchUrl)) return
//         console.log(metaFetchUrl)

//         try {
//             const data = await fetchAndAnalyze(metaFetchUrl)
//             console.log(data)
//             setTitle(data.metadata.title || '')
//             setDescription(data.metadata.description || '')
//             setProjectLink(data.metadata.website || '')
//             setIsMetaFetcherOpen(false)
//         } catch (error) {
//             console.error('Error fetching metadata:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to fetch project details. Please try again or enter manually.",
//                 variant: "destructive",
//             })
//         }
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (currentUser.username === "Guest") {
//             toast({
//                 title: "Error",
//                 description: "You can't submit projects as a guest user, please sign in from your real account.",
//                 variant: "destructive",
//             })
//             return;
//         }

//         if (!validateProjectLink(projectLink)) return;
//         if (tags.length < 5) {
//             toast({
//                 title: "Error",
//                 description: "Please add at least 5 tags",
//                 variant: "destructive",
//             })
//             return
//         }

//         const projectData = {
//             token,
//             images,
//             title,
//             description,
//             projectStatus,
//             priceType,
//             fixedPrice,
//             isNegotiable,
//             startingBid,
//             minBidIncrement,
//             bidEndTime,
//             category,
//             tags,
//             projectLink,
//             avgRevenue,
//             avgDownloads,
//             projectBuildDetails,
//             reasonForSelling,
//             interestedInSelling,
//             lookingForCoFounder,
//             includedItems,
//             additionalItems,
//             futurePotential
//         };

//         try {
//             const response = await fetch('/api/submit-project', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(projectData),
//             });

//             if (response.ok) {
//                 const result = await response.json();

//                 if (result.success) {
//                     toast({
//                         title: "Success",
//                         description: "Your project has been submitted successfully",
//                         variant: "success",
//                     })
//                     router.push('/');
//                 } else if (result.status === 401) {
//                     toast({
//                         title: "Error",
//                         description: "Please re-login, your token has expired. We could not identify you, it’s our bad.",
//                         variant: "destructive",
//                     })
//                 }
//                 else {
//                     toast({
//                         title: "Error",
//                         description: "Failed to submit project. Please try again.",
//                         variant: "destructive",
//                     })
//                 }
//             } else {
//                 const errorResponse = await response.json();
//                 if (errorResponse.status === 401) {
//                     toast({
//                         title: "Error",
//                         description: "Please re-login, your token has expired. We could not identify you, it’s our bad.",
//                         variant: "destructive",
//                     })
//                 } else {
//                     const errorMessage = errorResponse.message || 'An unexpected error occurred. Please try again later.';
//                     toast({
//                         title: "Error",
//                         description: errorMessage,
//                         variant: "destructive",
//                     })
//                 }
//             }

//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: `Error submitting project:', ${error}`,
//                 variant: "destructive",
//             })
//         }
//     };

//     if (isMobile) {
//         return (
//             <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">

//                 <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ duration: 0.5 }}
//                     className="text-center"
//                 >
//                     <span className="text-6xl mb-4">🛑</span>
//                     <h1 className="text-2xl font-bold mb-4 text-yellow-400">Hold up, adventurer!</h1>
//                     <p className="mb-4">For the best experience in posting your awesome project, we recommend using a laptop or desktop computer.</p>
//                     <p className="text-sm text-gray-400 italic">Your poor laptop is probably feeling neglected. Why not dust it off and give it some love?</p>
//                     <p className='text-md text-gray-400 italic mt-5'><a href="/">Go to home!</a></p>
//                 </motion.div>
//             </div>
//         )
//     }

//     return (
//         <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
//             <Header
//                 avatar={currentUser.profilePic}
//                 userId={currentUser.userId}
//                 currentPage={pathname}
//                 isDarkTheme={isDarkTheme}
//                 toggleTheme={toggleTheme}
//             />
//             <main className={`container mx-auto px-4 py-8 ${isDarkTheme ? 'text-white' : 'text-black'}`}>
//                 <Dialog open={isMetaFetcherOpen} onOpenChange={setIsMetaFetcherOpen}>
//                     <DialogTrigger asChild>
//                         <Button className={`mb-8 ${isDarkTheme ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}>
//                             Use Fetcher
//                         </Button>
//                     </DialogTrigger>
//                     <DialogContent className={`sm:max-w-[425px] ${isDarkTheme ? 'bg-zinc-900 text-white' : 'bg-white text-black border border-zinc-200'}`}>
//                         <DialogHeader>
//                             <DialogTitle>Choose Submission Method</DialogTitle>
//                             <DialogDescription>
//                                 Fetch project details automatically or enter manually.
//                             </DialogDescription>
//                         </DialogHeader>
//                         <div className="grid gap-4 py-4">
//                             <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="metaFetchUrl" className={`text-right ${isDarkTheme ? 'text-white' : 'text-black'}`}>
//                                     Project URL
//                                 </Label>
//                                 <Input
//                                     id="metaFetchUrl"
//                                     value={metaFetchUrl}
//                                     onChange={(e) => setMetaFetchUrl(e.target.value)}
//                                     className={`col-span-3 ${isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-white border border-zinc-300'} focus:border-yellow-400/50`}
//                                     placeholder="https://your-project-url.com"
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex justify-end space-x-4">
//                             <Button className={`text-black hover:bg-white/80 ${isDarkTheme ? 'border border-white' : 'border border-zinc-300'}`} variant="outline" onClick={() => setIsMetaFetcherOpen(false)}>
//                                 Enter Manually
//                             </Button>
//                             <Button onClick={handleMetaFetch} className={`bg-yellow-400 hover:bg-yellow-500 text-black`}>
//                                 Fetch Details
//                             </Button>
//                         </div>
//                     </DialogContent>
//                 </Dialog>
//                 <h1 className="text-3xl font-bold mb-8">Submit Your Project</h1>
//                 <form onSubmit={handleSubmit} className="space-y-8">
//                     {/* Image Upload Section */}
//                     <Card className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
//                         <CardContent className="p-6 flex flex-col items-center">
//                             <h2 className={`text-xl font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-black'}`}>Project Images</h2>
//                             <div className="flex flex-wrap justify-center gap-4 mb-4">
//                                 {images.map((image, index) => (
//                                     <motion.div
//                                         key={index}
//                                         className="relative w-32 h-32"
//                                         drag
//                                         dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//                                         onDragEnd={(_, info) => {
//                                             const closestIndex = Math.round(info.point.x / 140)
//                                             if (closestIndex !== index) {
//                                                 reorderImages(index, closestIndex)
//                                             }
//                                         }}
//                                     >
//                                         <Image src={image} alt={`Project image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
//                                         <button
//                                             type="button"
//                                             onClick={() => removeImage(index)}
//                                             className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
//                                         >
//                                             <X className="w-4 h-4" />
//                                         </button>
//                                     </motion.div>
//                                 ))}
//                             </div>
//                             {images.length < 5 && (
//                                 <label className={`w-32 h-32 border-2 border-dashed ${isDarkTheme ? 'border-white/30' : 'border-zinc-300'} rounded-md flex flex-col items-center justify-center cursor-pointer hover border-yellow-400/50 transition-colors`}>
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleImageUpload}
//                                         className="hidden"
//                                         multiple
//                                         required={images.length === 0}
//                                     />
//                                     <Upload className={`${isDarkTheme ? 'w-8 h-8 text-white/50 mb-2' : 'w-8 h-8 text-zinc-700 mb-2'}`} />
//                                     <span className={`text-sm ${isDarkTheme ? 'text-white/50' : 'text-black/50'}`}>Upload Image</span>
//                                 </label>
//                             )}
//                         </CardContent>
//                     </Card>

//                     {/* Project Details */}
//                     <Card className={`bg-white/5 ${isDarkTheme ? 'text-white' : 'text-black'} border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
//                         <CardContent className="p-6 space-y-4">
//                             <div>
//                                 <Label htmlFor="title" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Project Title</Label>
//                                 <Input
//                                     id="title"
//                                     value={title}
//                                     onChange={(e) => setTitle(e.target.value)}
//                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                     required
//                                     maxLength={100}
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="description" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Project Description</Label>
//                                 <Textarea
//                                     id="description"
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                     rows={5}
//                                     required
//                                     maxLength={500}
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="projectBuildDetails" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Project Build Details</Label>
//                                 <Textarea
//                                     id="projectBuildDetails"
//                                     value={projectBuildDetails}
//                                     onChange={(e) => setProjectBuildDetails(e.target.value)}
//                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                     rows={5}
//                                     required
//                                     maxLength={1000}
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="reasonForSelling" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Reason for Selling</Label>
//                                 <Textarea
//                                     id="reasonForSelling"
//                                     value={reasonForSelling}
//                                     onChange={(e) => setReasonForSelling(e.target.value)}
//                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                     rows={3}
//                                     required
//                                     maxLength={500}
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="projectLink" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Project Link</Label>
//                                 <Input
//                                     id="projectLink"
//                                     value={projectLink}
//                                     onChange={(e) => setProjectLink(e.target.value)}
//                                     placeholder="https://your-project-url.com"
//                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                     required
//                                     maxLength={200}
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Project Status and Pricing Options */}
//                     <Card className={`bg-white/5 ${isDarkTheme ? 'text-white' : 'text-black'} border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
//                         <CardContent className="p-6 space-y-4">
//                             <h2 className={`text-xl font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-black'}`}>Project Status</h2>
//                             <RadioGroup value={projectStatus} onValueChange={(value) => setProjectStatus(value)}>
//                                 <div className="flex items-center space-x-2">
//                                     <RadioGroupItem className='text-yellow-400' value="selling" id="selling" />
//                                     <Label htmlFor="selling" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Selling</Label>
//                                     <div className="flex items-center space-x-2">
//                                         <RadioGroupItem className='text-yellow-400' value="showcasing" id="showcasing" />
//                                         <Label htmlFor="showcasing" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Showcasing</Label>
//                                     </div>
//                                 </div>
//                             </RadioGroup>

//                             {projectStatus === 'showcasing' && (
//                                 <div className="flex items-center space-x-2">
//                                     <Switch
//                                         id="interestedInSelling"
//                                         checked={interestedInSelling}
//                                         onCheckedChange={setInterestedInSelling}
//                                     />
//                                     <Label htmlFor="interestedInSelling" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Interested in selling</Label>
//                                 </div>
//                             )}

//                             <div className="flex items-center space-x-2">
//                                 <Switch
//                                     id="lookingForCoFounder"
//                                     checked={lookingForCoFounder}
//                                     onCheckedChange={setLookingForCoFounder}
//                                 />
//                                 <Label htmlFor="lookingForCoFounder" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Looking for co-founder/collaborator</Label>
//                             </div>

//                             {(projectStatus === 'selling' || interestedInSelling) && (
//                                 <>
//                                     <h2 className={`text-xl font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-black'}`}>Pricing</h2>
//                                     <RadioGroup value={priceType} onValueChange={(value) => setPriceType(value)}>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem className='text-yellow-400' value="fixed" id="fixed" />
//                                             <Label htmlFor="fixed" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Fixed Price</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem className='text-yellow-400' value="bid" id="bid" />
//                                             <Label htmlFor="bid" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Bid-Based</Label>
//                                         </div>
//                                     </RadioGroup>
//                                     {priceType === 'fixed' ? (
//                                         <div className="space-y-4">
//                                             <div>
//                                                 <Label htmlFor="fixedPrice" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Fixed Price (USD)</Label>
//                                                 <Input
//                                                     id="fixedPrice"
//                                                     type="number"
//                                                     value={fixedPrice}
//                                                     onChange={(e) => setFixedPrice(e.target.value)}
//                                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                                     required
//                                                     min={0}
//                                                     max={1000000000}
//                                                 />
//                                             </div>
//                                             <div className="flex items-center space-x-2">
//                                                 <Switch
//                                                     id="isNegotiable"
//                                                     checked={isNegotiable}
//                                                     onCheckedChange={setIsNegotiable}
//                                                 />
//                                                 <Label htmlFor="isNegotiable" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Is price negotiable?</Label>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <div>
//                                                 <Label htmlFor="startingBid" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Starting Bid (USD)</Label>
//                                                 <Input
//                                                     id="startingBid"
//                                                     type="number"
//                                                     value={startingBid}
//                                                     onChange={(e) => setStartingBid(e.target.value)}
//                                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                                     required
//                                                     min={0}
//                                                     max={1000000000}
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <Label htmlFor="minBidIncrement" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Minimum Bid Increment (USD)</Label>
//                                                 <Input
//                                                     id="minBidIncrement"
//                                                     type="number"
//                                                     value={minBidIncrement}
//                                                     onChange={(e) => setMinBidIncrement(e.target.value)}
//                                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                                     required
//                                                     min={1}
//                                                     max={100000}
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <Label htmlFor="bidEndTime" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Bid End Time</Label>
//                                                 <Input
//                                                     id="bidEndTime"
//                                                     type="datetime-local"
//                                                     value={bidEndTime}
//                                                     onChange={(e) => {
//                                                         if (validateBidEndTime(e.target.value)) {
//                                                             setBidEndTime(e.target.value)
//                                                         }
//                                                     }}
//                                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </CardContent>
//                     </Card>

//                     {/* Project Metrics */}
//                     <Card className={`bg-white/5 ${isDarkTheme ? 'text-white' : 'text-black'} border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
//                         <CardContent className="p-6 space-y-4">
//                             <h2 className={`text-xl font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-black'}`}>Project Metrics</h2>
//                             <div>
//                                 <Label htmlFor="avgRevenue" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Avg. Revenue / Month (USD)</Label>
//                                 <Input
//                                     id="avgRevenue"
//                                     type="number"
//                                     value={avgRevenue}
//                                     onChange={(e) => setAvgRevenue(e.target.value)}
//                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                     placeholder="e.g., 1000"
//                                     min={0}
//                                     max={1000000000}
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="avgDownloads" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Avg. Downloads / Month</Label>
//                                 <Input
//                                     id="avgDownloads"
//                                     type="number"
//                                     value={avgDownloads}
//                                     onChange={(e) => setAvgDownloads(e.target.value)}
//                                     className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                     placeholder="e.g., 5000"
//                                     min={0}
//                                     max={1000000000}
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Categories and Tags */}
//                     <Card className={`bg-white/5 ${isDarkTheme ? 'text-white' : 'text-black'} border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
//                         <CardContent className="p-6 space-y-4">
//                             <div>
//                                 <Label htmlFor="category" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Project Category</Label>
//                                 <Select value={category} onValueChange={setCategory} required>
//                                     <SelectTrigger className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}>
//                                         <SelectValue placeholder="Select a category" />
//                                     </SelectTrigger>
//                                     <SelectContent className='text-white bg-zinc-900'>
//                                         {projectCategories.map((cat) => (
//                                             <SelectItem key={cat} value={cat}>{cat}</SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div>
//                                 <Label htmlFor="tags" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Tags (minimum 5 required)</Label>
//                                 <div className="flex flex-wrap gap-2 mb-2">
//                                     {tags.map((tag) => (
//                                         <Badge key={tag} variant="secondary" className="px-2 py-1">
//                                             {tag}
//                                             <button onClick={() => removeTag(tag)} className="ml-2 text-xs">
//                                                 <X className="w-3 h-3" />
//                                             </button>
//                                         </Badge>
//                                     ))}
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <Input
//                                         value={newTag}
//                                         onChange={(e) => setNewTag(e.target.value)}
//                                         placeholder="Add a tag"
//                                         className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border -yellow-400/50`}
//                                         maxLength={20}
//                                     />
//                                     <Button type="button" onClick={addTag} className='text-black hover:text-white hover:bg-black hover:border-white' variant="outline">
//                                         Add
//                                     </Button>
//                                 </div>
//                                 {tags.length < 5 && (
//                                     <p className="text-yellow-400 text-sm mt-2">Please add at least {5 - tags.length} more tag(s)</p>
//                                 )}
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Sale Information */}
//                     {(projectStatus === 'selling' || interestedInSelling) && (
//                         <Card className={`bg-white/5 ${isDarkTheme ? 'text-white' : 'text-black'} border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
//                             <CardContent className="p-6 space-y-4">
//                                 <h2 className={`text-xl font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-black'}`}>Sale Information</h2>
//                                 <div>
//                                     <Label className={`${isDarkTheme ? 'text-white' : 'text-black'} mb-2`}>What items are included in the sale?</Label>
//                                     {saleItems.map((item) => (
//                                         <div key={item.id} className="flex items-center space-x-2 mt-2">
//                                             <Checkbox
//                                                 id={item.id}
//                                                 checked={includedItems.includes(item.id)}
//                                                 onCheckedChange={(checked) => {
//                                                     setIncludedItems(prev =>
//                                                         checked
//                                                             ? [...prev, item.id]
//                                                             : prev.filter((id) => id !== item.id)
//                                                     )
//                                                 }}
//                                             />
//                                             <Label htmlFor={item.id} className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>{item.label}</Label>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="additionalItems" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Are there anything else that you want to include as part of this sale?</Label>
//                                     <Textarea
//                                         id="additionalItems"
//                                         value={additionalItems}
//                                         onChange={(e) => setAdditionalItems(e.target.value)}
//                                         className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                         rows={3}
//                                         maxLength={500}
//                                     />
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="futurePotential" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>How can the buyer take this project further?</Label>
//                                     <Textarea
//                                         id="futurePotential"
//                                         value={futurePotential}
//                                         onChange={(e) => setFuturePotential(e.target.value)}
//                                         className={`bg-white/5 border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'} focus:border-yellow-400/50`}
//                                         rows={3}
//                                         maxLength={1000}
//                                     />
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     )}

//                     {/* Preview Toggle */}
//                     <div className="flex items-center justify-end space-x-2">
//                         <Label htmlFor="preview-mode" className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Preview Mode</Label>
//                         <Switch
//                             id="preview-mode"
//                             checked={isPreviewMode}
//                             onCheckedChange={togglePreviewMode}
//                         />
//                     </div>

//                     {/* Preview or Submit Button */}
//                     {isPreviewMode ? (
//                         <ProjectPreview
//                             images={images}
//                             title={title}
//                             description={description}
//                             projectStatus={projectStatus}
//                             priceType={priceType}
//                             fixedPrice={fixedPrice}
//                             isNegotiable={isNegotiable}
//                             startingBid={startingBid}
//                             category={category}
//                             tags={tags}
//                             projectLink={projectLink}
//                             avgRevenue={avgRevenue}
//                             avgDownloads={avgDownloads}
//                             projectBuildDetails={projectBuildDetails}
//                             reasonForSelling={reasonForSelling}
//                             interestedInSelling={interestedInSelling}
//                             lookingForCoFounder={lookingForCoFounder}
//                             includedItems={includedItems}
//                             additionalItems={additionalItems}
//                             futurePotential={futurePotential}
//                             isDarkTheme={isDarkTheme}
//                         />
//                     ) : (
//                         <Button type="submit" className={`w-full ${isDarkTheme ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}>
//                             Submit Your Project
//                         </Button>
//                     )}
//                 </form>
//             </main>
//             <Toaster />
//         </div>
//     );
// }

// function ProjectPreview({
//     images,
//     title,
//     description,
//     projectStatus,
//     priceType,
//     fixedPrice,
//     isNegotiable,
//     startingBid,
//     category,
//     tags,
//     projectLink,
//     avgRevenue,
//     avgDownloads,
//     projectBuildDetails,
//     reasonForSelling,
//     interestedInSelling,
//     lookingForCoFounder,
//     includedItems,
//     additionalItems,
//     futurePotential,
//     isDarkTheme // Add this prop to determine the theme
// }) {
//     return (
//         <Card className={`bg-white/5 ${isDarkTheme ? 'text-white border-white/10' : 'bg-white text-black border-zinc-200'}`}>
//             <CardContent className={`p-6 ${isDarkTheme ? 'text-white' : 'text-black'} space-y-4`}>
//                 <h2 className="text-2xl font-bold">Project Preview</h2>
//                 <div className="flex gap-4 overflow-x-auto pb-4">
//                     {images.map((image, index) => (
//                         <Image key={index} src={image} alt={`Project image ${index + 1}`} width={200} height={150} objectFit="cover" className="rounded-md" />
//                     ))}
//                 </div>
//                 <h3 className="text-xl font-semibold">{title}</h3>
//                 <p className={`${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>{description}</p>
//                 <div>
//                     <h4 className="font-semibold">Project Build Details</h4>
//                     <p className={`${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>{projectBuildDetails}</p>
//                 </div>
//                 <div>
//                     <h4 className="font-semibold">Reason for Selling</h4>
//                     <p className={`${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>{reasonForSelling}</p>
//                 </div>
//                 {projectLink && (
//                     <div className="flex items-center space-x-2">
//                         <Globe className={`w-5 h-5 ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`} />
//                         <a href={projectLink} target="_blank" rel="noopener noreferrer" className={`hover:underline ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`}>
//                             Project Website
//                         </a>
//                     </div>
//                 )}
//                 <div className="flex items-center space-x-2">
//                     <DollarSign className={`w-5 h-5 ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`} />
//                     <span className="font-semibold">
//                         {projectStatus === 'selling' ? (
//                             priceType === 'fixed' ? (
//                                 <>
//                                     ${fixedPrice} USD
//                                     {isNegotiable && <span className="ml-2 text-sm">(Negotiable)</span>}
//                                 </>
//                             ) : (
//                                 `Starting bid: $${startingBid} USD`
//                             )
//                         ) : (
//                             interestedInSelling ? 'Interested in selling' : 'Not for sale'
//                         )}
//                     </span>
//                 </div>
//                 {avgRevenue && (
//                     <div className="flex items-center space-x-2">
//                         <BarChart className={`w-5 h-5 ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`} />
//                         <span>Avg. Revenue / Month: ${avgRevenue} USD</span>
//                     </div>
//                 )}
//                 {avgDownloads && (
//                     <div className="flex items-center space-x-2">
//                         <Download className={`w-5 h-5 ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`} />
//                         <span>Avg. Downloads / Month: {avgDownloads}</span>
//                     </div>
//                 )}
//                 <div className="flex items-center space-x-2">
//                     <Tag className={`w-5 h-5 ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`} />
//                     <span>{category}</span>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                     {tags.map((tag) => (
//                         <Badge key={tag} variant="secondary">{tag}</Badge>
//                     ))}
//                 </div>
//                 {lookingForCoFounder && (
//                     <div className="flex items-center space-x-2">
//                         <span className={`${isDarkTheme ? 'text-yellow -400' : 'text-yellow-600'}`}>Looking for co-founder/collaborator</span>
//                     </div>
//                 )}
//                 {(projectStatus === 'selling' || interestedInSelling) && (
//                     <>
//                         <div>
//                             <h4 className="font-semibold">Included in Sale</h4>
//                             <ul className="list-disc list-inside">
//                                 {includedItems.map((item) => (
//                                     <li key={item}>{saleItems.find(i => i.id === item).label}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                         {additionalItems && (
//                             <div>
//                                 <h4 className="font-semibold">Additional Items</h4>
//                                 <p className={`${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>{additionalItems}</p>
//                             </div>
//                         )}
//                         {futurePotential && (
//                             <div>
//                                 <h4 className="font-semibold">Future Potential</h4>
//                                 <p className={`${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>{futurePotential}</p>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }


'use client'

import { useState, useCallback, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { usePathname, useRouter } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { X, Upload, DollarSign, Clock, Tag } from 'lucide-react'
import Image from 'next/image'
import Header from '@/partials/Header'
import { useToast } from "@/hooks/use-toast"

const productCategories = [
    'Accounts',
    'Groups & Channels',
    'Domains',
    'Software',
    'Databases',
    'Other Digital Assets'
]

export default function DigitalProductSubmission() {
    const [images, setImages] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [technicalDetails, setTechnicalDetails] = useState('')
    const [reasonForSelling, setReasonForSelling] = useState('')
    const [isNegotiable, setIsNegotiable] = useState(false)
    const [category, setCategory] = useState('')
    const [tags, setTags] = useState([])
    const [newTag, setNewTag] = useState('')
    const [priceType, setPriceType] = useState('fixed')
    const [price, setPrice] = useState('')
    const [startingBid, setStartingBid] = useState('')
    const [incrementBid, setIncrementBid] = useState('')
    const [bidEndDate, setBidEndDate] = useState('')
    const [productStatus, setProductStatus] = useState('active')
    const [productPurpose, setProductPurpose] = useState('selling')
    const [token, setToken] = useState(null)
    const [currentUser, setCurrentUser] = useState({})
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const pathname = usePathname()
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme')
        setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true)

        const token = localStorage.getItem('accessToken')
        if (!token) {
            router.push('/auth')
        } else {
            setToken(token)
            try {
                const decoded = jwtDecode(token)
                setCurrentUser(decoded)
            } catch (error) {
                console.error('Error decoding token:', error)
            }
        }
    }, [router])

    const handleImageUpload = useCallback((e) => {
        const files = Array.from(e.target.files || [])
        if (files.length + images.length > 5) {
            toast({
                title: "Error",
                description: "You can only upload up to 5 images",
                variant: "destructive",
            })
            return
        }
        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result])
            }
            reader.readAsDataURL(file)
        })
    }, [images, toast])

    const removeImage = useCallback((index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }, [])

    const addTag = useCallback(() => {
        if (newTag && !tags.includes(newTag) && tags.length < 5) {
            setTags(prev => [...prev, newTag])
            setNewTag('')
        }
    }, [newTag, tags])

    const removeTag = useCallback((tag) => {
        setTags(prev => prev.filter(t => t !== tag))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (tags.length < 5) {
            toast({
                title: "Error",
                description: "Please add at least 5 tags",
                variant: "destructive",
            })
            return
        }

        const productData = {
            title,
            description,
            technicalDetails,
            reasonForSelling,
            isNegotiable,
            category,
            tags,
            priceType,
            price: priceType === 'fixed' ? price : undefined,
            startingBid: priceType === 'bid' ? startingBid : undefined,
            incrementBid: priceType === 'bid' ? incrementBid : undefined,
            bidEndDate: priceType === 'bid' ? bidEndDate : undefined,
            images,
            productStatus,
            productPurpose,
            token: token
        }

        try {
            const response = await fetch('/api/submit-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData),
            })

            const result = await response.json()

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Your digital product has been submitted successfully",
                    variant: "success",
                })
                router.push(`/product/${response.product._id}`)
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to submit digital product",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error submitting digital product:', error)
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header
                avatar={currentUser.profilePic}
                userId={currentUser.userId}
                currentPage={pathname}
                isDarkTheme={isDarkTheme}
                toggleTheme={() => setIsDarkTheme(!isDarkTheme)}
            />
            <main className="container text-white mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Submit Your Digital Product</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold">Images</h2>
                            <div className="flex items-center justify-center text-center flex-wrap gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <Image src={image} alt={`Product image ${index + 1}`} width={100} height={100} className="rounded-md" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {images.length < 5 && (
                                    <label className={`w-24 h-24 items-center justify-center text-center text-white border-2 border-dashed ${isDarkTheme ? 'border-white/30' : 'border-zinc-300'} rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400/50 transition-colors`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            multiple
                                        />
                                        <Upload className={`w-8 items-center justify-center text-center h-8 ${isDarkTheme ? 'text-white/50' : 'text-zinc-500'} mb-2`} />
                                        <span className={`text-sm items-center justify-center text-center ${isDarkTheme ? 'text-white/50' : 'text-zinc-500'}`}>Upload</span>
                                    </label>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <Label htmlFor="title">Product Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}
                                    required
                                    maxLength={100}
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Product Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}
                                    rows={5}
                                    required
                                    maxLength={500}
                                />
                            </div>
                            <div>
                                <Label htmlFor="technicalDetails">Technical Details</Label>
                                <Textarea
                                    id="technicalDetails"
                                    value={technicalDetails}
                                    onChange={(e) => setTechnicalDetails(e.target.value)}
                                    className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}
                                    rows={5}
                                    required
                                    maxLength={1000}
                                />
                            </div>
                            <div>
                                <Label htmlFor="reasonForSelling">Reason for Selling</Label>
                                <Textarea
                                    id="reasonForSelling"
                                    value={reasonForSelling}
                                    onChange={(e) => setReasonForSelling(e.target.value)}
                                    className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}
                                    rows={3}
                                    required
                                    maxLength={500}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold">Pricing</h2>
                            <RadioGroup value={priceType} onValueChange={setPriceType}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="fixed" id="fixed" />
                                    <Label htmlFor="fixed">Fixed Price</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bid" id="bid" />
                                    <Label htmlFor="bid">Bid-Based</Label>
                                </div>
                            </RadioGroup>
                            {priceType === 'fixed' ? (
                                <div>
                                    <Label htmlFor="price">Fixed Price (USD)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}
                                        required
                                        min={0}
                                    />
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Switch
                                            id="isNegotiable"
                                            checked={isNegotiable}
                                            onCheckedChange={setIsNegotiable}
                                        />
                                        <Label htmlFor="isNegotiable">Is price negotiable?</Label>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="startingBid">Starting Bid (USD)</Label>
                                        <Input
                                            id="startingBid"
                                            type="number"
                                            value={startingBid}
                                            onChange={(e) => setStartingBid(e.target.value)}
                                            className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}
                                            required
                                            min={0}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="incrementBid">Minimum Bid Increment (USD)</Label>
                                        <Input
                                            id="incrementBid"
                                            type="number"
                                            value={incrementBid}
                                            onChange={(e) => setIncrementBid(e.target.value)}
                                            className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}
                                            required
                                            min={1}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="bidEndDate">Bid End Date</Label>
                                        <Input
                                            id="bidEndDate"
                                            type="datetime-local"
                                            value={bidEndDate}
                                            onChange={(e) => setBidEndDate(e.target.value)}
                                            className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <Label htmlFor="category">Product Category</Label>
                                <Select value={category} onValueChange={setCategory} required>
                                    <SelectTrigger className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productCategories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="tags">Tags (minimum 5 required)</Label>
                                <div className="flex text-white  flex-wrap gap-2 mb-2">
                                    {tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="px-2 py-1">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="ml-2 text-xs">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add a tag"
                                        className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-300'}`}
                                        maxLength={20}
                                    />
                                    <Button type="button" onClick={addTag} variant="outline">
                                        Add
                                    </Button>
                                </div>
                                {tags.length < 5 && (
                                    <p className="text-yellow-400 text-sm mt-2">Please add at least {5 - tags.length} more tag(s)</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold">Product Status</h2>
                            <RadioGroup value={productStatus} onValueChange={setProductStatus}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="active" id="active" />
                                    <Label htmlFor="active">Active</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sold" id="sold" />
                                    <Label htmlFor="sold">Sold</Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    <Card className={`bg-white/5 text-white border ${isDarkTheme ? 'border-white/10' : 'border-zinc-200'}`}>
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold">Product Purpose</h2>
                            <RadioGroup value={productPurpose} onValueChange={setProductPurpose}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="selling" id="selling" />
                                    <Label htmlFor="selling">Selling</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="buying" id="buying" />
                                    <Label htmlFor="buying">Buying</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="showcasing" id="showcasing" />
                                    <Label htmlFor="showcasing">Showcasing</Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    <Button type="submit" className={`w-full ${isDarkTheme ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}>
                        Submit Your Digital Product
                    </Button>
                </form>
            </main>
        </div>
    )
}