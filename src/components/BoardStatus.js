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
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-80"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative z-10 w-full max-w-2xl mx-4 bg-black border-2 border-yellow-500 rounded-lg shadow-2xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                        <div className="absolute bottom-0 right-0 w-full h-1 bg-yellow-500"></div>
                        <div className="absolute bottom-0 right-0 w-1 h-full bg-yellow-500"></div>

                        <div className="p-8 text-center">
                            <motion.h1
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-5xl font-bold mb-6 text-yellow-500 font-orbitron"
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
                                    <p className="text-lg text-yellow-300 mb-2">Estimated Time Remaining:</p>
                                    <div className="text-3xl md:text-4xl font-bold text-yellow-500 font-mono bg-black/50 p-3 rounded-lg inline-block">
                                        {countdown}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <svg
                            className="absolute left-0 bottom-0 w-16 h-16 text-yellow-500/20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 6V12L16 14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <svg
                            className="absolute right-0 top-0 w-16 h-16 text-yellow-500/20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

