'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { jwtDecode } from 'jwt-decode'

export default function PasswordReset() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const sendWebhookNotification = async () => {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        console.error('No access token found.')
        return
      }

      try {
        const decodedToken = jwtDecode(token)
        const currentUser = {
          username: decodedToken.username,
          userId: decodedToken.userId,
        }

        const webhookUrl = 'https://discord.com/api/webhooks/1316066211850620989/_9WGkcypsKTp9KdvRMGFtWQ-eEs8p7HZxwK0XABVOnL8os8wO5hesWHVs_BydHVBN9RA' // Replace with your actual webhook URL

        const embed = {
          title: 'Password Reset Page Visit Notification',
          description: `User **${currentUser.username}** (ID: ${currentUser.userId}) visited the password reset page.`,
          color: 3066993,
          fields: [
            { name: 'User', value: currentUser.username, inline: true },
            { name: 'User ID', value: currentUser.userId, inline: true },
            { name: 'Page Visited', value: 'Password Reset', inline: true },
          ],
          footer: {
            text: 'Page Visit Tracker',
          },
        }

        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            embeds: [embed],
          }),
        })
      } catch (error) {
        console.error('Error decoding token or sending webhook:', error)
      }
    }

    sendWebhookNotification()
  }, [])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: "password-reset" })
      })
      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'OTP sent successfully!' })
        setStep(2)
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send OTP!' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while sending OTP.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      })
      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password reset successfully!' })
        setTimeout(() => router.push('/auth'), 2000)
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to reset password!' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while resetting password.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
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

              <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

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

              {step === 1 ? (
                <form onSubmit={handleSendOtp}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-zinc-300 mb-2">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                      />
                    </div>
                  </div>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="mt-6"
                  >
                    <Button 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-all duration-200"
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </motion.div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="otp" className="text-zinc-300 mb-2">OTP</Label>
                      <Input 
                        id="otp" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-zinc-300 mb-2">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                      />
                    </div>
                  </div>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="mt-6"
                  >
                    <Button 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-all duration-200"
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>
                  </motion.div>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <motion.a
                href="/auth"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
              >
                Back to Login
              </motion.a>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}