// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { usePathname } from 'next/navigation'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { AlertCircle, Copy, Eye, EyeOff, ExternalLink, Play, CircleStopIcon as Stop } from 'lucide-react'
// import { FaQuestionCircle, FaRegQuestionCircle } from 'react-icons/fa'
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import Header from '@/partials/Header'
// import { jwtDecode } from 'jwt-decode'
// import { Toaster } from '@/components/ui/toaster'
// import { useToast } from '@/hooks/use-toast'

// const adCategories = [
//     'Telegram Markets',
//     'Instagram Markets',
//     'Crypto',
//     'Exchange',
//     'Other'
// ]

// export default function AdManagementPage() {
//     const [currentUser, setCurrentUser] = useState(null)
//     const [isDarkTheme, setIsDarkTheme] = useState(true)
//     const [isAdRunning, setIsAdRunning] = useState(false)
//     const [showFullToken, setShowFullToken] = useState(false)
//     const [newAdContent, setNewAdContent] = useState('')
//     const [selectedCategory, setSelectedCategory] = useState('')
//     const [adHistory, setAdHistory] = useState([])
//     const [isLoggedIn, setIsLoggedIn] = useState(false)
//     const [authToken, setAuthToken] = useState('')
//     const router = useRouter()
//     const pathname = usePathname()
//     const { toast } = useToast()

//     useEffect(() => {
//         const getCurrentUser = () => {
//             const token = localStorage.getItem('accessToken')
//             setAuthToken(token)
//             if (token) {
//                 const decodedToken = jwtDecode(token)
//                 setCurrentUser(decodedToken)
//                 setIsLoggedIn(true)
//             } else {
//                 toast({
//                     title: "Warning",
//                     description: "You are not logged in.",
//                     variant: "destructive",
//                 })
//                 setCurrentUser(null)
//                 setIsLoggedIn(false)
//             }
//         }

//         const fetchAdHistory = async () => {
//             // Implement API call to fetch ad history
//             // For now, using dummy data
//             setAdHistory([
//                 { id: 1, groupName: 'Crypto Enthusiasts', content: 'Check out our new crypto exchange!', link: 'https://t.me/cryptogroup/1234' },
//                 { id: 2, groupName: 'Instagram Marketers', content: 'Boost your Instagram followers!', link: 'https://t.me/instamarket/5678' },
//                 { id: 1, groupName: 'Crypto Enthusiasts', content: 'Check out our new crypto exchange!', link: 'https://t.me/cryptogroup/1234' },
//             ])
//         }

//         getCurrentUser()
//         fetchAdHistory()

//         const storedTheme = localStorage.getItem('theme')
//         setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true)
//     }, [])

//     const toggleAdStatus = async () => {
//         try {
//             // Implement API call to start/stop ad
//             setIsAdRunning(!isAdRunning)
//             toast({
//                 title: isAdRunning ? "Ad Stopped" : "Ad Started",
//                 description: isAdRunning ? "Your ad campaign has been stopped." : "Your ad campaign has started.",
//                 variant: "destructive",
//             })
//         } catch (error) {
//             console.error('Error toggling ad status:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to toggle ad status. Please try again.",
//                 variant: "destructive",
//             })
//         }
//     }

//     const copyToClipboard = (text) => {
//         navigator.clipboard.writeText(text)
//         toast({
//             title: "Copied",
//             description: "Text copied to clipboard.",
//             variant: "destructive",
//         })
//     }

//     const startNewAd = async () => {
//         try {
//             // Implement API call to start new ad
//             console.log('Starting new ad:', { content: newAdContent, category: selectedCategory })
//             setNewAdContent('')
//             setSelectedCategory('')
//             setIsAdRunning(true)
//             toast({
//                 title: "Ad Created",
//                 description: "Your new ad campaign has been created and started.",
//                 variant: "destructive",
//             })
//         } catch (error) {
//             console.error('Error starting new ad:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to start new ad. Please try again.",
//                 variant: "destructive",
//             })
//         }
//     }

//     const toggleTheme = () => {
//         const newTheme = !isDarkTheme
//         setIsDarkTheme(newTheme)
//         localStorage.setItem('theme', newTheme ? 'dark' : 'light')
//     }

//     return (
//         <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
//             <Header
//                 avatar={currentUser && currentUser.profilePic}
//                 userId={currentUser && currentUser.userId}
//                 currentPage='/ad-management'
//                 isDarkTheme={isDarkTheme}
//                 toggleTheme={toggleTheme}
//                 isLoggedIn={isLoggedIn}
//                 isPremium={currentUser && currentUser.isPremium}
//             />

//             <main className="container mx-auto px-4 py-8">
//                 <div className="flex flex-col lg:flex-row gap-8">
//                     {/* Left side - Main content */}
//                     <div className="lg:w-3/4">
//                         <h1 className="text-3xl font-bold mb-6">Ad Management</h1>

//                         {/* User Statistics */}
//                         <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg mb-6`}>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     User Statistics
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <FaRegQuestionCircle />
//                                             </TooltipTrigger>
//                                             <TooltipContent className="text-xs">
//                                                 {"Your stats: remaining credits and total ads broadcasted"}
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 <div>
//                                     <p className="text-sm text-gray-400">Credits Remaining</p>
//                                     <p className="text-2xl font-bold">{currentUser?.credits || 0}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-400">Total Ads Broadcasted</p>
//                                     <p className="text-2xl font-bold">{currentUser?.totalAdsSent || 0}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-400">Ad Status</p>
//                                     <Badge variant={isAdRunning ? "success" : "destructive"} className="mt-1">
//                                         {isAdRunning ? "Active" : "Stopped"}
//                                     </Badge>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         {/* Ad History */}
//                         <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     Your Ad History
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <FaRegQuestionCircle />
//                                             </TooltipTrigger>
//                                             <TooltipContent className="text-xs">
//                                                 {"Ad History: See your past broadcasts."}
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <ScrollArea className="h-[300px]">
//                                     <Table>
//                                         <TableHeader className="border-0 bg-transparent">
//                                             <TableRow className="hover:bg-transparent">
//                                                 <TableHead>Group Name</TableHead>
//                                                 <TableHead>Ad Content</TableHead>
//                                                 <TableHead>Action</TableHead>
//                                             </TableRow>
//                                         </TableHeader>
//                                         <TableBody className='hover:rounded-lg'>
//                                             {adHistory.map((ad) => (
//                                                 <TableRow key={ad.id} className="hover:rounded-xl hover:bg-zinc-600/10 transition">
//                                                     <TableCell>{ad.groupName}</TableCell>
//                                                     <TableCell>{ad.content.slice(0, 50)}...</TableCell>
//                                                     <TableCell>
//                                                         <Button variant="link" className='text-white hover:text-zinc-200' asChild>
//                                                             <a href={ad.link} target="_blank" rel="noopener noreferrer">
//                                                                 View Ad <ExternalLink className="text-white hover:text-zinc-200 ml-2 h-4 w-4" />
//                                                             </a>
//                                                         </Button>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 </ScrollArea>
//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* Right side - User Information */}
//                     <div className="lg:w-1/4 space-y-6">
//                         <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
//                             <CardHeader>
//                                 <CardTitle>User Information</CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 <div>
//                                     <p className="text-sm text-gray-400">Username</p>
//                                     <p className="font-medium">{currentUser?.username}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-400">Telegram ID</p>
//                                     <p className="font-medium">{currentUser?.telegramId}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-400">Forum User ID</p>
//                                     <p className="font-medium">{currentUser?.userId}</p>
//                                 </div>
//                                 <div>
//                                     <CardTitle className="flex items-center gap-1">
//                                         <p className="text-sm text-gray-400">Referral Link</p>
//                                         <TooltipProvider>
//                                             <Tooltip>
//                                                 <TooltipTrigger asChild>
//                                                     <FaRegQuestionCircle className='h-3 w-3' />
//                                                 </TooltipTrigger>
//                                                 <TooltipContent className="text-xs">
//                                                     {"Get more referrals and discounts via this Telegram link"}
//                                                 </TooltipContent>
//                                             </Tooltip>
//                                         </TooltipProvider>
//                                     </CardTitle>
//                                     <div className="flex items-center gap-2">
//                                         <Input value={`https://kojiforum.com/ref/${currentUser?.username}`} readOnly className={isDarkTheme ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-300'} />
//                                         <Button size="icon" onClick={() => copyToClipboard(`https://kojiforum.com/ref/${currentUser?.username}`)}>
//                                             <Copy className="h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <CardTitle className="flex items-center gap-1">
//                                         <p className="text-sm text-gray-400">Token</p>
//                                         <TooltipProvider>
//                                             <Tooltip>
//                                                 <TooltipTrigger asChild>
//                                                     <FaRegQuestionCircle className='h-3 w-3' />
//                                                 </TooltipTrigger>
//                                                 <TooltipContent className="text-xs">
//                                                     {`Don't share your secret token; both parties will lose access. Keep it secure. It's valid until ${new Date(Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`}
//                                                 </TooltipContent>
//                                             </Tooltip>
//                                         </TooltipProvider>
//                                     </CardTitle>
//                                     <div className="flex items-center gap-2">
//                                         <Input
//                                             value={showFullToken ? currentUser?.token : `${currentUser?.token?.slice(0, 5)}****`}
//                                             readOnly
//                                             className={isDarkTheme ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-300'}
//                                         />
//                                         <Button size="icon" onClick={() => setShowFullToken(!showFullToken)}>
//                                             {showFullToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                                         </Button>
//                                         <Button size="icon" onClick={() => copyToClipboard(currentUser?.token)}>
//                                             <Copy className="h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center">
//                                     <AlertCircle className="w-5 h-5 mr-2" />
//                                     Ad Guidelines
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <ul className="list-disc list-inside space-y-2 text-sm">
//                                     <li>Keep content relevant and respectful</li>
//                                     <li>Avoid spamming or excessive posting</li>
//                                     <li>Ensure your ad complies with community rules</li>
//                                     <li>Target your ads to appropriate categories</li>
//                                     <li>Monitor your ad performance regularly</li>
//                                 </ul>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </main>
//             <Toaster />
//         </div>
//     )
// }

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, Copy, Eye, EyeOff, ExternalLink, Play, CircleStopIcon as Stop, Lock } from 'lucide-react'
import { FaRegQuestionCircle } from 'react-icons/fa'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Header from '@/partials/Header'
import { jwtDecode } from 'jwt-decode'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'

const adCategories = [
  'Telegram Markets',
  'Instagram Markets',
  'Crypto',
  'Exchange',
  'Other'
]

export default function AdManagementPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [isAdRunning, setIsAdRunning] = useState(false)
  const [showFullToken, setShowFullToken] = useState(false)
  const [newAdContent, setNewAdContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [tgUid, setTgUid] = useState('')
  const [username, setUsername] = useState('')
  const [adHistory, setAdHistory] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const getCurrentUser = async () => {
      const token = localStorage.getItem('accessToken')
      setAuthToken(token)
      if (token) {
        try {
          const decodedToken = jwtDecode(token)
          const telegramUID = decodedToken.telegramUID
          setTgUid(telegramUID)
          setUsername(decodedToken.username)
          const response = await fetch(`/api/tg-user?id=${telegramUID}`)
          if (!response.ok) throw new Error('Failed to fetch user data')
          const userData = await response.json()
          setCurrentUser({ ...userData, isPremium: decodedToken.isPremium })
          setIsLoggedIn(true)
          setIsAdRunning(userData.is_running)
        } catch (error) {
          console.error('Error fetching user data:', error)
          toast({
            title: "Error",
            description: "Failed to fetch user data. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Warning",
          description: "You are not logged in.",
          variant: "destructive",
        })
        setCurrentUser(null)
        setIsLoggedIn(false)
      }
    }

    const fetchAdHistory = async () => {
      try {
        const telegramUID = jwtDecode(localStorage.getItem('accessToken')).telegramUID
        const response = await fetch(`/api/tg-ad-history?id=${telegramUID}`)
        if (!response.ok) throw new Error('Failed to fetch ad history')
        const history = await response.json()
        setAdHistory(history)
      } catch (error) {
        console.error('Error fetching ad history:', error)
        toast({
          title: "Error",
          description: "Failed to fetch ad history. Please try again.",
          variant: "destructive",
        })
      }
    }

    getCurrentUser()
    fetchAdHistory()

    const storedTheme = localStorage.getItem('theme')
    setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true)
  }, [])

  const toggleAdStatus = async () => {
    try {
      // Implement API call to start/stop ad
      setIsAdRunning(!isAdRunning)
      toast({
        title: isAdRunning ? "Ad Stopped" : "Ad Started",
        description: isAdRunning ? "Your ad campaign has been stopped." : "Your ad campaign has started.",
        variant: "destructive",
      })
    } catch (error) {
      console.error('Error toggling ad status:', error)
      toast({
        title: "Error",
        description: "Failed to toggle ad status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Text copied to clipboard.",
      variant: "destructive",
    })
  }

  const startNewAd = async () => {
    try {
      // Implement API call to start new ad
      console.log('Starting new ad:', { content: newAdContent, category: selectedCategory })
      setNewAdContent('')
      setSelectedCategory('')
      setIsAdRunning(true)
      toast({
        title: "Ad Created",
        description: "Your new ad campaign has been created and started.",
        variant: "destructive",
      })
    } catch (error) {
      console.error('Error starting new ad:', error)
      toast({
        title: "Error",
        description: "Failed to start new ad. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const isPremium = currentUser?.isPremium

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Header
        avatar={currentUser && currentUser.profilePic}
        userId={currentUser && currentUser.userId}
        currentPage='/ad-management'
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        isPremium={isPremium}
      />

      <main className={`container mx-auto px-4 py-8 relative ${!isPremium ? 'pointer-events-none' : ''}`}>
        {!isPremium && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90 flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Premium Access Required</h2>
              <p>Upgrade your account to access ad management features.</p>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Main content */}
          <div className="lg:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Ad Management</h1>

            {/* User Statistics */}
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg mb-6`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  User Statistics
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FaRegQuestionCircle />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">
                        {"Your stats: remaining credits and total ads broadcasted"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Credits Remaining</p>
                  <p className="text-2xl font-bold">{currentUser?.credits || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Ads Broadcasted</p>
                  <p className="text-2xl font-bold">{currentUser?.totalAdsSent || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Ad Status</p>
                  <Badge variant={isAdRunning ? "success" : "destructive"} className="mt-1">
                    {isAdRunning ? "Active" : "Stopped"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Ad History */}
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Your Ad History
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FaRegQuestionCircle />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">
                        {"Ad History: See your past broadcasts."}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {adHistory.length > 0 ? (
                    <Table>
                      <TableHeader className="border-0 bg-transparent">
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Group Name</TableHead>
                          <TableHead>Ad Content</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className='hover:rounded-lg'>
                        {adHistory.map((ad) => (
                          <TableRow key={ad.id} className="hover:rounded-xl hover:bg-zinc-600/10 transition">
                            <TableCell>{ad.groupName}</TableCell>
                            <TableCell>{ad.content.slice(0, 50)}...</TableCell>
                            <TableCell>
                              <Button variant="link" className='text-white hover:text-zinc-200' asChild>
                                <a href={ad.link} target="_blank" rel="noopener noreferrer">
                                  View Ad <ExternalLink className="text-white hover:text-zinc-200 ml-2 h-4 w-4" />
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center mt-32 text-zinc-300/80 py-4">No history found.</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right side - User Information */}
          <div className="lg:w-1/4 space-y-6">
            <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Username</p>
                  <p className="font-medium">{username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Telegram ID</p>
                  <p className="font-medium">{tgUid}</p>
                </div>
                <div>
                  <CardTitle className="flex items-center gap-1">
                    <p className="text-sm text-gray-400">Referral Link</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FaRegQuestionCircle className='h-3 w-3' />
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">
                          {"Get more referrals and discounts via this Telegram link"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Input value={`https://t.me/LettableBot?start=${tgUid}`} readOnly className={isDarkTheme ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-300'} />
                    <Button size="icon" onClick={() => copyToClipboard(`https://t.me/LettableBot?start=${tgUid}`)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <CardTitle className="flex items-center gap-1">
                    <p className="text-sm text-gray-400">Token</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FaRegQuestionCircle className='h-3 w-3' />
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">
                          {"Don't share your secret token; both parties will lose access. Keep it secure."}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Input
                      value={showFullToken ? currentUser?.token : `${currentUser?.token?.slice(0, 7)}*************`}
                      readOnly
                      className={isDarkTheme ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-300'}
                    />
                    <Button size="icon" onClick={() => setShowFullToken(!showFullToken)}>
                      {showFullToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" onClick={() => copyToClipboard(currentUser?.token)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Ad Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Keep content relevant and respectful</li>
                  <li>Avoid spamming or excessive posting</li>
                  <li>Ensure your ad complies with community rules</li>
                  <li>Target your ads to appropriate categories</li>
                  <li>Monitor your ad performance regularly</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}