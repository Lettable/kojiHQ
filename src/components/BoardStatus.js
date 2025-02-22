"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { jwtDecode } from "jwt-decode"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

export default function SiteStatusOverlay() {
  const [config, setConfig] = useState(null)
  const [open, setOpen] = useState(true)
  const [countdown, setCountdown] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        let uid = null
        const token = localStorage.getItem("accessToken")
        if (token) {
          const decoded = jwtDecode(token)
          uid = decoded.userId.trim() !== "" ? decoded.userId : "6795858d6c2080f02fc02fa2"
        }
        const res = await fetch("/api/mics/b-s", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid }),
        })
        const data = await res.json()
        if (data.success) {
          setConfig(data.config)
          if (data.config.status === "open") {
            setOpen(false)
          }
        } else {
          setConfig({ status: "closed", message: data.message || "Site is currently unavailable." })
        }
      } catch (error) {
        console.error("Error fetching site config:", error)
        setConfig({ status: "closed", message: "Unable to load site configuration." })
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  useEffect(() => {
    if (!config || !config.countdownTimestamp) return
    const target = new Date(config.countdownTimestamp).getTime()
    const interval = setInterval(() => {
      const now = Date.now()
      const distance = target - now
      if (distance <= 0) {
        clearInterval(interval)
        setCountdown("0d 0h 0m 0s")
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [config])

  if (loading) return null

  return (
    <Dialog open={open} onOpenChange={() => {}} className="border-2 border-zinc-400 shadow-md bg-opacity-70">
      <DialogContent className="sm:max-w-md bg-black border-2 border-zinc-400 text-white bg-opacity-70" onPointerDownOutside={(e) => e.preventDefault()} >
        <DialogHeader>
          <DialogTitle className="text-center text-white">
            {config?.status === "maintenance" ? "System Maintenance" : config?.message || "Site Unavailable"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Loader2 className="h-12 w-12 text-white" />
          </motion.div>
          {config?.countdownTimestamp && (
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Estimated Time Remaining:</p>
              <p className="text-2xl font-bold text-white">{countdown}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

