'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Zap, Square, Star, Sun, Moon, Heart, FlameIcon as Fire, Droplet, Cloud, Snowflake } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import Header from '@/partials/Header'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
    const [currentUser, setCurrentUser] = useState(null)
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
                    message: `${data.message} You have ${data.remainingCredits.toFixed(2)} credits left.`
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
        <div className="min-h-screen bg-black text-white">
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
            
            <div className="relative overflow-hidden py-24 border-b border-white/20">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-purple-500/5 to-blue-500/5" />
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full filter blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full filter blur-[120px]" />
                </div>
                <div className="relative container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            Username Effects Marketplace
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                            Enhance your presence with unique visual effects for your username. 
                            Choose from our collection of premium effects to stand out in the community.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-8xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-8 sticky top-8 self-start">
                        <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 overflow-hidden">
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-yellow-500">Live Preview</h2>
                                    <div className="space-y-3">
                                        <Label htmlFor="username" className="text-zinc-300">Your Username</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 h-12"
                                            placeholder="Enter your username"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-yellow-500">Information</h2>
                                    <div className="rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-6 border border-zinc-700/50">
                                        <p className="text-zinc-300 leading-relaxed">
                                            Transform your presence with our unique username effects. 
                                            Each effect can be purchased with credits and applied to your profile.
                                        </p>
                                        <p className="text-yellow-500/80 mt-4 font-medium">
                                            Effects are permanent once purchased.
                                        </p>
                                    </div>
                                </div>

                                {currentUser?.credits !== undefined && (
                                    <div className="rounded-xl bg-gradient-to-br from-yellow-500/10 to-purple-500/10 p-8 backdrop-blur-xl border border-yellow-500/20">
                                        <p className="text-sm text-zinc-300 mb-2">Available Credits</p>
                                        <p className="text-4xl font-bold text-yellow-500">
                                            {currentUser.credits.toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enhanced Effects Grid */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {usernameEffects.map((effect, index) => (
                                <motion.div
                                    key={effect.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 hover:bg-zinc-800/50 transition-all duration-300 group overflow-hidden">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                                                        <effect.icon className="w-6 h-6 text-yellow-500" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-zinc-100">{effect.name}</h3>
                                                </div>
                                                <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500/20 transition-colors">
                                                    {effect.price} Credits
                                                </span>
                                            </div>
                                            
                                            <div className="h-16 flex items-center justify-center mb-6 rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 group-hover:border-yellow-500/20 transition-all">
                                                <span className={`text-2xl ${effect.class}`}>
                                                    {username || 'Preview Text'}
                                                </span>
                                            </div>

                                            <Button
                                                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium transition-all duration-300 shadow-lg shadow-yellow-500/20 h-12 text-lg"
                                                onClick={() => handleBuyEffect(effect.class)}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-5 h-5 border-2 border-black/20 border-t-black animate-spin rounded-full" />
                                                        Processing...
                                                    </span>
                                                ) : (
                                                    'Purchase Effect'
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-yellow-500">{dialogContent.title}</DialogTitle>
                        <DialogDescription className="text-zinc-300">{dialogContent.message}</DialogDescription>
                    </DialogHeader>
                    <Button 
                        onClick={() => setIsDialogOpen(false)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UsernameEffectsMarketplace