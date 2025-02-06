// 'use client'

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Sparkles, Zap, Square, Star, Sun, Moon, Heart, FlameIcon as Fire, Droplet, Cloud, Snowflake } from 'lucide-react'
// import { jwtDecode } from 'jwt-decode'
// import Header from '@/partials/Header'

// const usernameEffects = [
//     { name: 'Sparkle', icon: Sparkles, class: 'sparkle-effect', price: 4.99 },
//     { name: 'Neon', icon: Zap, class: 'neon-effect', price: 5.99 },
//     { name: 'Rainbow', icon: Sun, class: 'rainbow-effect', price: 6.99 },
//     { name: 'Fire', icon: Fire, class: 'fire-effect', price: 4.99 },
//     { name: 'Snow', icon: Snowflake, class: 'snow-effect', price: 4.99 },
//     { name: 'Shadow', icon: Moon, class: 'shadow-effect', price: 3.99 },
//     { name: 'Retro', icon: Star, class: 'retro-effect', price: 4.99 },
//     { name: 'Cosmic', icon: Star, class: 'cosmic-effect', price: 8.99 },
//     { name: 'Pixel', icon: Square, class: 'pixel-effect', price: 5.99 },
//     { name: 'Glowing', icon: Sun, class: 'glowing-effect', price: 6.99 }
// ];

// const UsernameEffectsMarketplace = () => {
//     const [username, setUsername] = useState('')
//     const [currentUser, SetCurrentUser] = useState({})

//     useEffect(() => {
//         const token = localStorage.getItem('accessToken');
//         const decodedToken = token ? jwtDecode(token) : null;
//         SetCurrentUser(decodedToken)
//         const storedUsername = decodedToken ? decodedToken.username : null;
//         if (storedUsername) {
//             setUsername(storedUsername);
//         }
//     }, []);

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
//             <Header
//                 avatar={currentUser ? currentUser.profilePic : null}
//                 userId={currentUser ? currentUser.userId : null}
//                 currentPage="/mics/username-effect"
//                 setIsOpen={() => { }}
//                 isOpen={false}
//                 isDarkTheme={true}
//                 isPremium={currentUser ? currentUser.isPremium : false}
//                 isLoggedIn={currentUser ? true : false}
//             /> 
//             <header className="py-16 px-4 text-center">
//                 <motion.h1
//                     className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     Transform Your Username
//                 </motion.h1>
//                 <motion.p
//                     className="text-xl text-gray-300 max-w-2xl mx-auto"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                 >
//                     Stand out in the crowd with our stunning username effects. Make your mark in the forum with these eye-catching styles!
//                 </motion.p>
//             </header>

//             <main className="container mx-auto px-4 py-8">
//                 <div className="mb-8">
//                     <Label htmlFor="username" className="text-lg mb-2 block">Enter your username to preview effects:</Label>
//                     <Input
//                         id="username"
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         className="bg-zinc-800 border-zinc-700 text-white"
//                         placeholder="Enter your username"
//                     />
//                 </div>

//                 <ScrollArea className="h-[calc(100vh-300px)]">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {usernameEffects.map((effect, index) => (
//                             <motion.div
//                                 key={effect.name}
//                                 initial={{ opacity: 0, scale: 0.9 }}
//                                 animate={{ opacity: 1, scale: 1 }}
//                                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                             >
//                                 <Card className="bg-zinc-800 text-white border-zinc-700 overflow-hidden">
//                                     <CardContent className="p-6">
//                                         <div className="flex justify-between mb-4">
//                                             <h3 className="text-xl font-semibold">{effect.name}</h3>
//                                             <effect.icon className="w-6 h-6 text-yellow-400" />
//                                         </div>
//                                         <div className={`text-2xl font-bold mb-4 ${effect.class}`}>
//                                             {username}
//                                         </div>
//                                     </CardContent>
//                                     <CardFooter className="bg-zinc-900 border-t border-zinc-700 p-4 flex justify-between items-center">
//                                         <code className="text-sm text-gray-400">{effect.class}</code>
//                                         <Button
//                                             variant="default"
//                                             className="bg-yellow-500 hover:bg-yellow-600 text-black"
//                                         >
//                                             Buy for ${effect.price}
//                                         </Button>
//                                     </CardFooter>
//                                 </Card>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </ScrollArea>
//             </main>
//         </div>
//     )
// }

// export default UsernameEffectsMarketplace

// 'use client'

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Sparkles, Zap, Square, Star, Sun, Moon, Heart, FlameIcon as Fire, Droplet, Cloud, Snowflake } from 'lucide-react'
// import { jwtDecode } from 'jwt-decode'
// import Header from '@/partials/Header'

// const usernameEffects = [
//     { name: 'Sparkle', icon: Sparkles, class: 'sparkle-effect', price: 4.99 },
//     { name: 'Neon', icon: Zap, class: 'neon-effect', price: 5.99 },
//     { name: 'Olympus', icon: Zap, class: 'olympus-effect', price: 9.99 },
//     { name: 'Rainbow', icon: Sun, class: 'rainbow-effect', price: 6.99 },
//     { name: 'Fire', icon: Fire, class: 'fire-effect', price: 4.99 },
//     { name: 'Snow', icon: Snowflake, class: 'snow-effect', price: 4.99 },
//     { name: 'Shadow', icon: Moon, class: 'shadow-effect', price: 3.99 },
//     { name: 'Retro', icon: Star, class: 'retro-effect', price: 4.99 },
//     { name: 'Cosmic', icon: Star, class: 'cosmic-effect', price: 8.99 },
//     { name: 'Pixel', icon: Square, class: 'pixel-effect', price: 5.99 },
//     { name: 'Glowing', icon: Sun, class: 'glowing-effect', price: 6.99 }
// ];

// const UsernameEffectsMarketplace = () => {
//     const [username, setUsername] = useState('')
//     const [currentUser, setCurrentUser] = useState({})

//     useEffect(() => {
//         const token = localStorage.getItem('accessToken');
//         const decodedToken = token ? jwtDecode(token) : null;
//         setCurrentUser(decodedToken)
//         const storedUsername = decodedToken ? decodedToken.username : null;
//         if (storedUsername) {
//             setUsername(storedUsername);
//         }
//     }, []);

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
//             <Header
//                 avatar={currentUser ? currentUser.profilePic : null}
//                 userId={currentUser ? currentUser.userId : null}
//                 currentPage="/mics/username-effect"
//                 setIsOpen={() => { }}
//                 isOpen={false}
//                 isDarkTheme={true}
//                 isPremium={currentUser ? currentUser.isPremium : false}
//                 isLoggedIn={currentUser ? true : false}
//             />
//             <div className="container mx-auto px-4 py-8 max-w-4xl">
//                 <motion.div
//                     className="bg-zinc-800 rounded-lg p-6 mb-8"
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
//                         Transform Your Username
//                     </h1>
//                     <p className="text-gray-300 mb-6">
//                         Stand out in the crowd with our stunning username effects. Make your mark in the forum with these eye-catching styles!
//                     </p>
//                     <div className="mb-4">
//                         <Label htmlFor="username" className="text-sm font-medium mb-2 block">Preview your username with effects:</Label>
//                         <Input
//                             id="username"
//                             type="text"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             className="bg-zinc-700 border-zinc-600 text-white"
//                             placeholder="Enter your username"
//                         />
//                     </div>
//                 </motion.div>

//                 <ScrollArea className="h-[calc(100vh-300px)]">
//                     <div className="space-y-4">
//                         {usernameEffects.map((effect, index) => (
//                             <motion.div
//                                 key={effect.name}
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ duration: 0.3, delay: index * 0.05 }}
//                             >
//                                 <Card className="bg-zinc-800 text-white border-zinc-700 overflow-hidden">
//                                     <CardContent className="p-4 flex items-center justify-between">
//                                         <div className="flex items-center space-x-4">
//                                             <div>
//                                                 <h3 className="text-lg font-semibold">{effect.name}</h3>
//                                                 <div className={`text-xl font-bold ${effect.class}`}>
//                                                     {username}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center space-x-4">
//                                             <code className="text-sm text-gray-400">{effect.class}</code>
//                                             <Button
//                                                 variant="default"
//                                                 className="bg-yellow-500 hover:bg-yellow-600 text-black"
//                                             >
//                                                 Buy for ${effect.price}
//                                             </Button>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </ScrollArea>
//             </div>
//         </div>
//     )
// }

// export default UsernameEffectsMarketplace

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Zap, Square, Star, Sun, Moon, Heart, FlameIcon as Fire, Droplet, Cloud, Snowflake } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import Header from '@/partials/Header'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from '@/hooks/use-toast'

const usernameEffects = [
    { name: 'Sparkle', icon: Sparkles, class: 'sparkle-effect', price: 4.99 },
    { name: 'Neon', icon: Zap, class: 'neon-effect', price: 5.99 },
    { name: 'Olympus', icon: Zap, class: 'olympus-effect', price: 9.99 },
    { name: 'Rainbow', icon: Sun, class: 'rainbow-effect', price: 6.99 },
    { name: 'Fire', icon: Fire, class: 'fire-effect', price: 4.99 },
    { name: 'Snow', icon: Snowflake, class: 'snow-effect', price: 4.99 },
    { name: 'Shadow', icon: Moon, class: 'shadow-effect', price: 3.99 },
    { name: 'Retro', icon: Star, class: 'retro-effect', price: 4.99 },
    { name: 'Cosmic', icon: Star, class: 'cosmic-effect', price: 8.99 },
    { name: 'Pixel', icon: Square, class: 'pixel-effect', price: 5.99 },
    { name: 'Glowing', icon: Sun, class: 'glowing-effect', price: 6.99 }
];

const UsernameEffectsMarketplace = () => {
    const [username, setUsername] = useState('')
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogContent, setDialogContent] = useState({ title: '', message: '' })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setCurrentUser(decodedToken)
            setUsername(decodedToken.username || '');
        }
    }, [setCurrentUser]);

    const handleBuyEffect = async (effectToBuy) => {
        setIsLoading(true)
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({
                title: "Error",
                description: "You must be logged in to purchase effects.",
                variant: "destructive",
            })
            setIsLoading(false)
            return;
        }

        try {
            const response = await fetch('/api/mics/buy-effect', {
                method: 'POST',
                body: JSON.stringify({ token, effectToBuy })
            });

            const data = await response.json();

            if (response.ok) {
                setDialogContent({
                    title: 'Purchase Successful',
                    message: `${data.message} You have ${data.remainingCredits} credits left.`
                });
                setIsDialogOpen(true);
            } else {
                toast({
                    title: "Purchase Failed",
                    description: data.message,
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
            <Header
                avatar={currentUser?.profilePic}
                userId={currentUser?.userId}
                currentPage="/mics/username-effect"
                setIsOpen={() => {}}
                isOpen={false}
                isDarkTheme={true}
                isPremium={currentUser?.isPremium}
                isLoggedIn={!!currentUser}
            />
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-6 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Transform Your Username
                    </h1>
                    <p className="text-gray-300 mb-6">
                        Stand out in the crowd with our stunning username effects. Make your mark in the forum with these eye-catching styles!
                    </p>
                    <div className="mb-4">
                        <Label htmlFor="username" className="text-sm font-medium mb-2 block">Preview your username with effects:</Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-zinc-700/50 border-zinc-600 text-white"
                            placeholder="Enter your username"
                        />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {usernameEffects.map((effect, index) => (
                        <motion.div
                            key={effect.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card className="bg-zinc-800/50 backdrop-blur-sm text-white border-zinc-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold flex items-center">
                                            <effect.icon className="w-5 h-5 mr-2" />
                                            {effect.name}
                                        </h3>
                                        <code className="text-sm text-gray-400">{effect.class}</code>
                                    </div>
                                    <div className={`text-2xl font-bold ${effect.class} mb-4`}>
                                        {username || 'Your Username'}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-yellow-400">${effect.price}</span>
                                        <Button
                                            variant="default"
                                            className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                            onClick={() => handleBuyEffect(effect.class)}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Processing...' : 'Buy Now'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogContent.title}</DialogTitle>
                        <DialogDescription>{dialogContent.message}</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UsernameEffectsMarketplace