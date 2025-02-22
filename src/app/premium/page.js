"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, MessageCircle, User, Sparkles, Crown, Lock, Shield, Rocket } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import Header from '@/partials/Header'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

const PremiumSubscription = () => {
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [dialogContent, setDialogContent] = useState({ title: '', message: '' })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [token, setToken] = useState()
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                router.push("/auth");
                return;
            }
            setToken(token)
            const decoded = jwtDecode(token);
            setCurrentUser(decoded);
        } catch (error) {
            console.error("Error decoding token or fetching data:", error);
            router.push("/auth");
        }
    }, [router])

    const handleSubscription = async (plan) => {
        setIsLoading(true)
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast({
                title: "Error",
                description: "You must be logged in to purchase a premium plan.",
                variant: "destructive",
            })
            setIsLoading(false)
            return;
        }

        try {
            const response = await fetch('/api/mics/premium', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    planName: plan.name,
                    token: token
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setDialogContent({
                    title: 'Premium Plan Purchased',
                    message: `Congratulations! You've successfully purchased the ${data.planName} plan. Your premium status will end on ${new Date(data.premiumEndDate).toLocaleDateString()}. You have ${data.daysRemaining} days remaining. Your new group is: ${data.assignedGroups}. Remaining credits: ${data.remainingCredits}`
                });
                setIsDialogOpen(true);
            } else if (response.status === 403) {
                toast({
                    title: "Purchase Failed",
                    description: data.message,
                    variant: "destructive",
                })
            } else {
                throw new Error(data.message || 'An unexpected error occurred');
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
    };

    const plans = [
        {
            name: 'Heaven',
            price: '$4.99',
            period: 'week',
            image: '/groupimgs/heaven.png',
            features: [
                'Custom Status',
                'Access to Premium Emojis',
                'Premium API access (fast and reliable)',
                'Longer Bio',
                'Priority Support',
                'Increased Visibility'
            ],
            highlight: false
        },
        {
            name: 'Godlike',
            price: '$16.99',
            period: 'month',
            image: '/groupimgs/godlike.png',
            features: [
                'All Heaven features',
                'Access to Premium Emojis',
                'Premium API access (fast and reliable)',
                'Longer Bio and Username',
                'Priority Support',
                'Maximum Visibility Boost'
            ],
            highlight: true
        },
        {
            name: 'Supreme',
            price: '$299.99',
            period: 'year',
            image: '/groupimgs/supreme.png',
            features: [
                'All Godlike Features',
                'Custom Badge with Tagline',
                'Early Access to New Features',
                'Personal Account Manager',
                'Unlimited Project Showcases',
                'VIP Community Access'
            ],
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <Header
                avatar={currentUser?.profilePic}
                userId={currentUser?.userId}
                currentPage="/premium"
                isDarkTheme={true}
                isLoggedIn={!!currentUser}
                isPremium={currentUser?.isPremium}
            />

            <div className="container mx-auto px-4 py-2">
                <section className="py-16 text-center relative">
                    <div className="absolute inset-0" />
                    <div className="absolute inset-0">
                        <div className="absolute top-10 left-1/4 w-72 h-72 bg-yellow-500/20 rounded-full filter blur-3xl" />
                        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl" />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                    >
                        <Crown className="w-24 h-24 text-yellow-400 mx-auto mb-8" />
                        <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            Elevate Your Experience
                        </h1>
                        <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">
                            Join our elite community and unlock premium features that will transform your journey
                        </p>
                    </motion.div>
                </section>

                <Separator className="my-12 bg-zinc-800" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative group`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-0 right-0 text-center z-20 transition-transform duration-300 group-hover:translate-y-[-5px]">
                                    <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <Card className={`relative overflow-hidden backdrop-blur-sm bg-zinc-900/30 border-2 ${plan.highlight ? 'border-yellow-400' : 'border-zinc-800'} hover:translate-y-[-10px] hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300`}>
                                <div className="absolute inset-0 transition-opacity duration-300" />
                                <div className={`absolute inset-x-0 h-1 top-0`} />
                                <CardHeader className="space-y-4 text-center relative z-10">
                                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="text-5xl font-bold text-white">
                                        {plan.price}
                                        <span className="text-lg text-zinc-400 ml-2">/ {plan.period}</span>
                                    </div>
                                    <div className="w-32 h-20 mx-auto mb-4 relative group">
                                        <Image
                                            src={plan.image}
                                            alt={`${plan.name} rank`}
                                            width={512}
                                            height={512}
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6 relative z-10">
                                <div className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors duration-200">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-yellow-400" />
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                    <Button
                                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold transition-all duration-300"
                                        onClick={() => handleSubscription(plan)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Processing...' : `Upgrade to ${plan.name}`}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <section className="py-16">
                    <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        Premium Benefits
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <BenefitCard
                            icon={<Shield className="w-8 h-8 text-yellow-400" />}
                            title="Enhanced Security"
                            description="Advanced account protection and monitoring"
                        />
                        <BenefitCard
                            icon={<Rocket className="w-8 h-8 text-yellow-400" />}
                            title="Faster Performance"
                            description="Priority access to all platform features"
                        />
                        <BenefitCard
                            icon={<Sparkles className="w-8 h-8 text-yellow-400" />}
                            title="Exclusive Content"
                            description="Early access to new features and updates"
                        />
                        <BenefitCard
                            icon={<Crown className="w-8 h-8 text-yellow-400" />}
                            title="VIP Support"
                            description="24/7 priority customer support"
                        />
                    </div>
                </section>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-zinc-900 text-white border-zinc-800">
                    <DialogHeader>
                        <DialogTitle>{dialogContent.title}</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            {dialogContent.message}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

const BenefitCard = ({ icon, title, description }) => (
  <Card className="bg-zinc-900/30 backdrop-blur-sm border-zinc-800 hover:border-yellow-400/50 transition-all duration-300 group">
    <CardContent className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">{title}</h3>
      <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">{description}</p>
    </CardContent>
  </Card>
)

export default PremiumSubscription