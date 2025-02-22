"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { jwtDecode } from "jwt-decode"

export default function SiteStatusOverlay() {
  const [config, setConfig] = useState(null)
  const [visible, setVisible] = useState(true)
  const [countdown, setCountdown] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        let uid = null
        const token = localStorage.getItem("accessToken")
        if (token) {
          const decoded = jwtDecode(token)
          uid = decoded.userId
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
            setVisible(false)
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

  if (!visible || loading) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-70"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 max-w-2xl w-full mx-4 p-8 bg-zinc-900 rounded-lg shadow-2xl text-center"
          >
            <motion.h1
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl p-3 font-bold mb-6 text-yellow-500 font-orbitron"
            >
              {config?.status === "maintenance" ? "System Maintenance" : config?.message || "Site Unavailable"}
            </motion.h1>
            {config?.countdownTimestamp && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                <p className="text-lg text-gray-400 mb-2">Estimated Time Remaining:</p>
                <div className="text-3xl md:text-4xl font-bold text-yellow-500 font-mono">{countdown}</div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

