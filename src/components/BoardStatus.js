"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { jwtDecode } from "jwt-decode"

export default function SiteStatusOverlay() {
    const [config, setConfig] = useState(null)
    const [visible, setVisible] = useState(true)
    const [countdown, setCountdown] = useState("")

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
                    setConfig({ status: "closed", message: data.message || "Site is closed." })
                }
            } catch (error) {
                console.error("Error fetching site config:", error)
                setConfig({ status: "closed", message: "Error loading site configuration." })
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

    if (!visible) return null

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-90"
                >
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black opacity-50"></div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10"></div>
                        <motion.div
                            className="absolute inset-0"
                            initial={{ backgroundPosition: "0% 50%" }}
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "linear" }}
                            style={{
                                backgroundImage: 'url("/cyberpunk-grid.png")',
                                backgroundSize: "100px 100px",
                                opacity: 0.1,
                            }}
                        ></motion.div>
                    </div>

                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 max-w-2xl w-full mx-4 p-8 bg-zinc-900 bg-opacity-80 rounded-lg shadow-2xl border border-yellow-500/20 text-center"
                    >
                        <motion.h1
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl md:text-5xl font-bold mb-6 text-yellow-500 font-orbitron"
                        >
                            {config?.status === "maintenance" ? "System Maintenance" : config?.message || "Access Denied"}
                        </motion.h1>
                        <motion.p
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-xl md:text-2xl text-gray-300 mb-8"
                        >
                            {config?.status === "maintenance"
                                ? "Our systems are currently undergoing critical updates."
                                : "The network is currently inaccessible."}
                        </motion.p>
                        {config?.countdownTimestamp && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="mb-8"
                            >
                                <p className="text-lg text-gray-400 mb-2">Estimated Time to Restoration:</p>
                                <div className="text-3xl md:text-4xl font-bold text-yellow-500 font-mono">{countdown}</div>
                            </motion.div>
                        )}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-sm text-gray-500"
                        >
                            Please stand by for further instructions.
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

