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
        return alert('MetaMask not detected');
      };

      const username = `${Math.random().toString(36).substring(2, 8)}${Math.floor(Math.random() * 100)}`

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      const nonce = Math.floor(Math.random() * 1000000).toString();
      const message = `Sign this message to log in: ${nonce}`;

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, userAddress],
      });

      console.log(username, userAddress, nonce, signature)
      const response = await fetch('/api/auth/metamask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          walletAddress: userAddress,
          nonce,
          signature,
        })
      });

      
      if (response.data) {
        console.log('Authentication success:', response.data);
        router.push(`/welcome?token=${response.data.token}`);
        return response.data;
      } else {
        throw new Error('Token not found in response');
      }

    } catch (error) {
      console.error('Error during MetaMask authentication:', error);
      throw error;
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault()
    setIsLoginLoading(true)
    setMessage(null)

    const deviceDetails = getDeviceDetails();
    const userIP = await getUserIP();

    const email = event.target.loginEmail.value
    const password = event.target.loginPassword.value

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, deviceDetails, userIP })
      })
      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('theme', 'dark')
        setMessage({ type: 'success', text: 'Logged in successfully!' })
        router.push('/')
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed!' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred during login.' })
    } finally {
      setIsLoginLoading(false)
    }
  }

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

  // const continueAsGuest = () => {
  //   localStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzMyMWMyNjIxMGUzZjdjZjBiNGExMjQiLCJ1c2VybmFtZSI6Ikd1ZXN0IiwiZW1haWwiOiJndWVzdEBzaWRlcHJvamVjdG9yLnZlcmNlbC5hcHAiLCJwcm9maWxlUGljIjoiaHR0cHM6Ly9lbmNyeXB0ZWQtdGJuMC5nc3RhdGljLmNvbS9pbWFnZXM_cT10Ym46QU5kOUdjUzItZmxLUU9JRThyaWJJbnVkSldwSXN5OTR2MUI3TE1DZW11QmY4UmNqcElZMVB0M2hMSFpSNXI3OHJYQkZXMGNJaFZnJnVzcXA9Q0FVIiwiaWF0Ijo5OTMxMzM3MjU4LCJleHAiOjk5MzE5NDIwNTh9.HlX4eyQhdaP_HwKEEf-aZOxyJ57jncvMxHfsBqm8s7o')
  //   router.push('/')
  // }

  const continueAsGuest = async (event) => {
    event.preventDefault()
    setMessage(null)

    const deviceDetails = getDeviceDetails();
    const userIP = await getUserIP();

    const email = 'guest@sideprojector.vercel.app'
    const password = '12345678'

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, deviceDetails, userIP })
      })
      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken)
        setMessage({ type: 'success', text: 'Logged in successfully!' })
        router.push('/')
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed!' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred during login.' })
    } finally {
      setIsLoginLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-none bg-black/30 backdrop-blur-xl border-white shadow-2xl text-white">
          <CardContent className="p-6">
            <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Sign Up</TabsTrigger>
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
                      className="mb-4 bg-white/10 border-white/20"
                    >
                      <AlertTitle className="text-white">{message.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                      <AlertDescription className="text-white/80">{message.text}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="loginEmail" className="text-white">Email</Label>
                      <Input id="loginEmail" name="loginEmail" type="email" required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                    </div>
                    <div>
                      <Label htmlFor="loginPassword" className="text-white">Password</Label>
                      <Input id="loginPassword" name="loginPassword" type="password" required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6"
                  >
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white" type="submit" disabled={isLoginLoading}>
                      {isLoginLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </motion.div>
                  {/* <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-3"
                  >
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white" onClick={continueAsGuest}>
                      Continue as Guest / Try
                    </Button>
                  </motion.div> */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-3"
                  >
                    <Button
                      className="bg-[#5865F2] hover:bg-[#4752C4] w-full text-white flex items-center justify-center"
                      asChild
                    >
                      <a href="https://discord.com/oauth2/authorize?client_id=1325208183215620226&response_type=code&redirect_uri=https%3A%2F%2Fkojimarketplace.vercel.app%2Fapi%2Fdiscord&scope=identify+email">
                        <FaDiscord className="h-5 w-5" />
                        Go with Discord
                      </a>
                    </Button>
                  </motion.div>
                </form>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3"
                >
                  <Button
                    className="bg-[#F6851B] hover:bg-[#D76D1A] w-full text-white flex items-center justify-center"
                    onClick={handleMetaMaskAuth} // Use onClick instead of asChild
                  >
                    <FaEthereum className="h-5 w-5" /> {/* Add margin to the right for spacing */}
                    Go with MetaMask
                  </Button>
                </motion.div>
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
                      whileHover={{ scale: 1.02 }}
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
                      whileHover={{ scale: 1.02 }}
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
          <CardFooter className="flex flex-col items-center pb-6 space-y-4">
            <motion.a
              href="#"
              onClick={() => {
                setTabValue(tabValue === "login" ? "signup" : "login")
                setSignupStep(1)
                setMessage(null)
              }}
              className="text-sm text-white/60 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tabValue === "login" ? "Create new account" : "Already have an account?"}
            </motion.a>
            <Link href="/reset-password" className="text-sm text-white/60 hover:text-white">
              Forgot password?
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}