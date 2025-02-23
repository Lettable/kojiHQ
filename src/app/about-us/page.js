'use client'

import { useState, useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Github, 
  Linkedin, 
  ChevronDown, 
  Crown, 
  ShoppingBag, 
  Users, 
  Zap, 
  MessageSquare, 
  Rocket,
  Shield,
  Sparkles 
} from 'lucide-react'
import { FaDiscord, FaTelegram } from "react-icons/fa"
import Link from 'next/link'
import Header from '@/partials/Header'

export default function AboutUs() {
  const [openStep, setOpenStep] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [isDiscordWidgetOpen, setIsDiscordWidgetOpen] = useState(false)
  const popoverTriggerRef = useRef(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)



  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        const userId = decodedToken.userId

        if (!userId) throw new Error('User ID not found in token.')

        setCurrentUser(decodedToken)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Error decoding token:', error.message)
        setCurrentUser(null)
        setIsLoggedIn(false)
      }
    }
  }, [])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverTriggerRef.current && !popoverTriggerRef.current.contains(event.target)) {
        setIsDiscordWidgetOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleStep = (index) => {
    setOpenStep(openStep === index ? null : index)
  }

  // Features data
  const features = [
    {
      title: "Digital Marketplace",
      description: "Buy, sell, and trade digital products securely. Our platform supports everything from software to digital art.",
      icon: ShoppingBag,
    },
    {
      title: "Community Hub",
      description: "Connect with like-minded individuals, share knowledge, and build lasting relationships.",
      icon: Users,
    },
    {
      title: "Real-Time Platform",
      description: "Experience lightning-fast updates and seamless interactions across all platform features.",
      icon: Zap,
    },
    {
      title: "Premium Benefits",
      description: "Unlock exclusive features and enhance your experience with our premium membership options.",
      icon: Crown,
    },
    {
      title: "Enhanced Security",
      description: "Advanced account protection and monitoring for all users.",
      icon: Shield,
    },
    {
      title: "Innovation Focus",
      description: "Experience cutting-edge features and continuous platform improvements.",
      icon: Rocket,
    }
  ]

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Mirza (Mirzya)",
      role: "Owner & Developer",
      image: "https://i.ibb.co/442QP0w/d66220ef0f9b.png",
      description: "Responsible for overseeing the platform's development and ensuring its success.",
      links: {
        telegram: "https://t.me/mirzyave",
        github: "https://github.com/lettable",
        discord: "https://discordapp.com/users/1135747839545323582"
      }
    },
    {
      id: 2,
      name: "Mr Shadow",
      role: "Founder & Co-Owner",
      image: "https://i.postimg.cc/sxNXBXQt/photo-2025-02-16-23-24-29.jpg",
      description: "Leads the business operations and defines the vision of Suized.",
      links: {
        telegram: "https://t.me/mrSh4dow"
      }
    },
    {
      id: 3,
      name: "Fiery",
      role: "Developer",
      image: "https://cdn.discordapp.com/avatars/1141422910821646337/da0ab741e70232a8db7a3558b44fa57d.png?size=1024",
      description: "Contributed to the development of the platform and is responsible for the overall design and functionality.",
      links: {
        telegram: "https://t.me/fieryssh",
        discord: "https://discordapp.com/users/1135747839545323582",
        github: "https://github.com/flickydev"
      }
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header
        setIsOpen={() => {}}
        avatar={currentUser?.profilePic}
        userId={currentUser?.userId}
        currentPage='/about-us'
        isDarkTheme={true}
        toggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        isLoggedIn={isLoggedIn}
        isPremium={currentUser?.isPremium}
      />

      {/* Hero Section with enhanced styling */}
      <section className="py-16 text-center relative">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-yellow-500/20 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 container mx-auto px-4"
        >
          <Crown className="w-24 h-24 text-yellow-400 mx-auto mb-8" />
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            About Suized
          </h1>
          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">
            Your gateway to digital innovation and community-driven marketplace
          </p>
        </motion.div>
      </section>

      <main className="container mx-auto px-4 py-16 space-y-24">
        {/* Overview Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-zinc-900/30 backdrop-blur-sm border-zinc-800 hover:border-yellow-400/50 transition-all duration-300">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Platform Overview
              </h2>
              <div className="space-y-4 text-zinc-400">
                <p>
                  Suized is an innovative platform designed for buying, selling, and exploring digital products while fostering a vibrant community. Our platform enables real-time interactions and seamless transactions in a secure environment.
                </p>
                <p>
                  With a focus on user experience and security, Suized provides a comprehensive suite of features for both buyers and sellers. Our modular design ensures continuous evolution to meet the community&apos;s needs.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="group relative h-full overflow-hidden border-zinc-800/50 bg-zinc-900/30 backdrop-blur-lg hover:bg-yellow-700/10 transition-all duration-500">
                  <CardContent className="relative p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="rounded-xl bg-yellow-500/10 p-3 ring-1 ring-yellow-500/20 transition-all duration-300 group-hover:bg-yellow-500/20 group-hover:ring-yellow-500/40">
                        <feature.icon className="h-6 w-6 text-yellow-500" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="mb-4 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="bg-zinc-900/30 backdrop-blur-sm border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                <CardContent className="p-6">
                  <Avatar className="w-32 h-32 mx-auto mb-4 ring-2 ring-white/80">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-semibold mb-2 text-center text-white">{member.name}</h3>
                  <div className="text-yellow-400 mb-2 text-center">
                    <Badge variant="default" className="bg-zinc-800">{member.role}</Badge>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4 text-center">{member.description}</p>
                  <div className="flex justify-center space-x-3">
                    {member.links.github && (
                      <Button variant="ghost" size="icon" className="bg-zinc-800 hover:bg-zinc-700 text-white" onClick={() => window.open(member.links.github, "_blank")}>
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                      </Button>
                    )}
                    {member.links.telegram && (
                      <Button variant="ghost" size="icon" className="bg-zinc-800 hover:bg-zinc-700 text-white" onClick={() => window.open(member.links.telegram, "_blank")}>
                        <FaTelegram className="h-5 w-5" />
                        <span className="sr-only">Telegram</span>
                      </Button>
                    )}
                    {member.links.discord && (
                      <Button variant="ghost" size="icon" className="bg-zinc-800 hover:bg-zinc-700 text-white" onClick={() => window.open(member.links.discord, "_blank")}>
                        <FaDiscord className="h-5 w-5" />
                        <span className="sr-only">Discord</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900/50 border-t border-zinc-800/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-6">
              <a
                href="https://telegram.dog/suizedto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-yellow-500 transition-colors"
              >
                <FaTelegram className="w-6 h-6" />
              </a>
            </div>
            <div className="text-zinc-500 text-sm text-center">
              © Suized - {new Date().getFullYear()} | All Rights Reserved.
              <br />
              <span className="text-zinc-600">Made with ❤️ for the community.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
