'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link'
import { FaQuestionCircle, FaRegQuestionCircle } from 'react-icons/fa'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaDiscord } from "react-icons/fa"
import { FaEthereum } from 'react-icons/fa'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

export default function AuthPage() {
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isSignupLoading, setIsSignupLoading] = useState(false)
  const [tabValue, setTabValue] = useState("login")
  const [message, setMessage] = useState(null)
  const [signupStep, setSignupStep] = useState(1)
  const [signupEmail, setSignupEmail] = useState('')
  const [signupOtp, setSignupOtp] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupTelegramUID, setSignupTelegramUID] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      router.push('/')
    }
  }, [router])

  function getDeviceDetails() {
    return {
      browser: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };
  }

  async function getUserIP() {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  }

  const handleMetaMaskAuth = async () => {
    try {
      if (!window.ethereum) {
        return toast({
          title: 'MetaMask not detected',
          description: "Install MetaMask extension on your browser and create a wallet first.",
          variant: 'destructive'
        })
      }
  
      const username = `${Math.random().toString(36).substring(2, 8)}${Math.floor(Math.random() * 100)}`;
  
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
  
      const nonce = Math.floor(Math.random() * 1000000).toString();
      const message = `Sign this message to log in: ${nonce}`;
  
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, userAddress],
      });
  
      const response = await fetch('/api/auth/metamask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          walletAddress: userAddress,
          nonce,
          signature,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }
  
      const data = await response.json();
  
      console.log('Authentication success:', data);
  
      if (data.token) {
        router.push(`/welcome?token=${data.token}`);
        return data;
      } else {
        throw new Error('Token not found in response');
      }
  
    } catch (error) {
      console.error('Error during MetaMask authentication:', error);
      throw error;
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoginLoading(true);
    setMessage(null);
  
    const deviceDetails = getDeviceDetails();
    const userIP = await getUserIP();
  
    const email = event.target.loginEmail.value;
    const password = event.target.loginPassword.value;
  
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, deviceDetails, userIP }),
      });
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('theme', 'dark');
        setMessage({ type: 'success', text: 'Logged in successfully!' });
        router.push('/');
      } else {
        if (response.status === 403) {
          if (data.message.includes('banned')) {
            setMessage({ type: 'error', text: 'Your account has been banned. Contact support for assistance.' });
          } else if (data.message.includes('suspended')) {
            setMessage({
              type: 'error',
              text: data.suspendedUntil
                ? `Your account is suspended until ${new Date(data.suspendedUntil).toLocaleString()}`
                : 'Your account is temporarily suspended.',
            });
          }
        } else {
          setMessage({ type: 'error', text: data.message || 'Login failed!' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred during login. Please try again.' });
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSendOtp = async (event) => {
    event.preventDefault()
    setIsSignupLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, purpose: "sign-up" })
      })
      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'OTP sent successfully!' })
        setSignupStep(2)
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send OTP!' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while sending OTP.' })
    } finally {
      setIsSignupLoading(false)
    }
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    setIsSignupLoading(true)
    setMessage(null)

    if (!/^[a-zA-Z0-9_]{1,12}$/.test(signupUsername)) {
      setMessage({ type: 'error', text: "Username can only contain up to 12 letters, numbers, and underscores." })
      setIsSignupLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          telegramUID: signupTelegramUID,
          password: signupPassword,
          otp: signupOtp
        })
      })
      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('theme', 'dark')
        setMessage({ type: 'success', text: 'Account created successfully!' })
        router.push('/')
      } else {
        setMessage({ type: 'error', text: data.message || 'Signup failed!' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred during signup.' })
    } finally {
      setIsSignupLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-yellow-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-none bg-zinc-900/40 backdrop-blur-xl shadow-2xl text-white">
            <CardContent className="p-8">
              <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex justify-center mb-8"
              >
                <img
                  src="https://i.postimg.cc/85s7TkJz/suize-364-424-og-white-logo.png"
                  alt="Logo"
                  className="w-20 h-20 object-cover filter drop-shadow-glow"
                />
              </motion.div>

              <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-800/30 p-1 rounded-lg">
                  <TabsTrigger 
                    value="login" 
                    className="text-white data-[state=active]:bg-gradient-to-r from-yellow-500 to-yellow-600 data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="text-white data-[state=active]:bg-gradient-to-r from-yellow-500 to-yellow-600 data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Alert
                        variant={message.type === 'error' ? 'destructive' : 'default'}
                        className="mb-6 bg-zinc-800/50 border-zinc-700"
                      >
                        <AlertTitle className="text-white">
                          {message.type === 'error' ? 'Error' : 'Success'}
                        </AlertTitle>
                        <AlertDescription className="text-zinc-300">
                          {message.text}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <Label htmlFor="loginEmail" className="text-zinc-300 mb-2">
                        Email
                      </Label>
                      <Input
                        id="loginEmail"
                        name="loginEmail"
                        type="email"
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="loginPassword" className="text-zinc-300">
                          Password
                        </Label>
                        <Link 
                          href="/reset-password" 
                          className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="loginPassword"
                        name="loginPassword"
                        type="password"
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                      />
                    </div>

                    <motion.div
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-all duration-200" 
                        type="submit" 
                        disabled={isLoginLoading}
                      >
                        {isLoginLoading ? 'Logging in...' : 'Login'}
                      </Button>
                    </motion.div>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 text-zinc-500 bg-zinc-900 rounded-sm">Or continue with</span>
                      </div>
                    </div>

                    <motion.div
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center gap-2"
                        asChild
                      >
                        <a href="https://discord.com/oauth2/authorize?client_id=1325208183215620226&response_type=code&redirect_uri=https%3A%2F%2Fkoji.cbu.net%2Fapi%2Fdiscord&scope=identify+email">
                          <FaDiscord className="h-5 w-5" />
                          Discord
                        </a>
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  {signupStep === 1 ? (
                    <form onSubmit={handleSendOtp}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="signupEmail" className="text-white">Email</Label>
                          <Input
                            id="signupEmail"
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="signupUsername" className="text-white">Username</Label>
                          <Input
                            id="signupUsername"
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="signupTelegramUID" className="text-white mb-1 flex items-center gap-1">
                            Telegram UID
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FaRegQuestionCircle className='mb-[1px]' />
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">
                                  {"We need your Telegram User Id to link your Telegram ID with our forum, Don't worry it's safe. get it by using rose bot."}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Input
                            id="signupTelegramUID"
                            value={signupTelegramUID}
                            onChange={(e) => setSignupTelegramUID(e.target.value)}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="signupPassword" className="text-white">Password</Label>
                          <Input
                            id="signupPassword"
                            type="password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                      </div>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="mt-6"
                      >
                        <Button
                          className="w-full bg-white/10 hover:bg-white/20 text-white"
                          type="submit"
                          disabled={isSignupLoading}
                        >
                          {isSignupLoading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>
                      </motion.div>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="signupOtp" className="text-white">OTP</Label>
                          <Input
                            id="signupOtp"
                            value={signupOtp}
                            onChange={(e) => setSignupOtp(e.target.value)}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                      </div>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="mt-6"
                      >
                        <Button
                          className="w-full bg-white/10 hover:bg-white/20 text-white"
                          type="submit"
                          disabled={isSignupLoading}
                        >
                          {isSignupLoading ? 'Signing up...' : 'Sign Up'}
                        </Button>
                      </motion.div>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-center pb-6">
              <motion.a
                href="#"
                onClick={() => {
                  setTabValue(tabValue === "login" ? "signup" : "login")
                  setSignupStep(1)
                  setMessage(null)
                }}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
              >
                {tabValue === "login" ? "Dont have an account?" : "Already have an account?"}
              </motion.a>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      <Toaster />
    </div>
  )
}