"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, MessageCircle, User, Image, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { jwtDecode } from 'jwt-decode'

const PremiumSubscription = () => {
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                router.push("/auth");
                return;
            }
            const decoded = jwtDecode(token);
            setCurrentUser(decoded);
        } catch (error) {
            console.error("Error decoding token or fetching data:", error);
            router.push("/auth");
        }
    }, [])

    const handleSubscription = async (plan) => {
        const response = await fetch('/api/premium-callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: plan.name,
                description: `Premium ${plan.name} subscription on SideProjector`,
                amount: plan.price,
                currency: 'USD',
                userId: currentUser.userId,
                email: currentUser.email,
                redirectUrl: window.location.href,
            }),
        });
    
        if (response.ok) {
            const data = await response.json();
            window.open(data.charge.payment_url, '_blank');
        } else {
            console.error('Error creating charge:', await response.json());
        }
    };
    

    const plans = [
        {
            name: 'Weekly',
            price: '4.99',
            period: 'week',
            features: [
                'Custom Status',
                'Access to Premium Emojis',
                'Premium API access (fast and reliable)',
                'Longer Bio',
                'Priority Support',
                'Increased Visibility'
            ]
        },
        {
            name: 'Monthly',
            price: '16.99',
            period: 'month',
            features: [
                'All Weekly features',
                'Access to Premium Emojis',
                'Premium API access (fast and reliable)',
                'Longer Bio and Username',
                'Priority Support',
                'Maximum Visibility Boost'
            ]
        },
        {
            name: 'Yearly',
            price: '299.99',
            period: 'year',
            features: [
                'All Monthly Features',
                'Custom Badge with Tagline',
                'Early Access to New Features',
                'Personal Account Manager',
                'Unlimited Project Showcases',
                'VIP Community Access'
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                        Elevate Your Experience
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        Unlock premium features and take your products to new heights with our exclusive subscription plans
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className={`bg-gradient-to-br from-gray-800 to-gray-900 border-2 rounded-3xl overflow-hidden ${selectedPlan === plan.name.toLowerCase() ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'} hover:border-purple-500 transition-all duration-300`}>
                                <CardHeader className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6">
                                    <CardTitle className="text-3xl font-bold text-center text-white">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="text-center mt-2">
                                        <span className="text-4xl font-bold text-white">${plan.price}</span>
                                        <span className="text-gray-300">/{plan.period}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center">
                                                <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                                                <span className="text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                                        onClick={() => handleSubscription(plan)}
                                    >
                                        Choose {plan.name}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center"
                >
                    <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Premium Perks</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <PerkCard icon={<Star className="w-12 h-12 text-yellow-400" />} title="Custom Badges">
                            Stand out with unique profile badges that showcase your premium status
                        </PerkCard>
                        <PerkCard icon={<Zap className="w-12 h-12 text-blue-400" />} title="Boosted Visibility">
                            Get your products in front of more eyes with increased visibility in feeds and search results
                        </PerkCard>
                        <PerkCard icon={<MessageCircle className="w-12 h-12 text-green-400" />} title="Priority Support">
                            Skip the queue and get help faster with our dedicated premium support team
                        </PerkCard>
                        <PerkCard icon={<User className="w-12 h-12 text-purple-400" />} title="Flexible Identity">
                            Change your username anytime and express yourself with longer bios and custom taglines
                        </PerkCard>
                        <PerkCard icon={<Image className="w-12 h-12 text-pink-400" />} title="Unlimited Changes">
                            Keep your profile fresh by updating your picture as often as you like
                        </PerkCard>
                        <PerkCard icon={<Sparkles className="w-12 h-12 text-indigo-400" />} title="Premium Emojis">
                            Express yourself with our exclusive set of premium emojis across the entire platform
                        </PerkCard>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

const PerkCard = ({ icon, title, children }) => (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 hover:border-purple-500 rounded-3xl overflow-hidden transition-all duration-300 group">
        <CardContent className="p-6 text-center">
            <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">{icon}</div>
            <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-300">{children}</p>
        </CardContent>
    </Card>
)

export default PremiumSubscription