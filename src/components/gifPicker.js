"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileImage, Search } from "lucide-react"
import { FaImage } from "react-icons/fa"
import { debounce } from "lodash"

const TENOR_KEY = "LIVDSRZULELA"
const CATEGORIES_URL = `https://g.tenor.com/v1/categories?&key=${TENOR_KEY}`
const SEARCH_URL = `https://g.tenor.com/v1/search?key=${TENOR_KEY}&contentfilter=off&media_filter=minimal&ar_range=wide&limit=50`


export default function GifPicker({ onGifSelect, isDarkTheme}) {
    const [isOpen, setIsOpen] = useState(false)
    const [categories, setCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [position, setPosition] = useState("bottom")
    const [isLoading, setIsLoading] = useState(false)
    const pickerRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(CATEGORIES_URL)
                const data = await response.json()
                setCategories(data.tags || [])
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        const handleResize = () => {
            if (buttonRef.current && isOpen) {
                const buttonRect = buttonRef.current.getBoundingClientRect()
                const windowHeight = window.innerHeight
                const spaceBelow = windowHeight - buttonRect.bottom
                const spaceAbove = buttonRect.top
                const pickerHeight = 450

                setPosition(spaceBelow < pickerHeight && spaceAbove > spaceBelow ? "top" : "bottom")
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("resize", handleResize)
        }
    }, [isOpen])

    const searchGifs = async (query) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${SEARCH_URL}&q=${encodeURIComponent(query)}`)
            const data = await response.json()
            setSearchResults(data.results || [])
        } catch (error) {
            console.error("Error searching gifs:", error)
            setSearchResults([])
        }
        setIsLoading(false)
    }

    const debouncedSearch = useRef(debounce(searchGifs, 500)).current

    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm)
        }
        
        return () => {
            debouncedSearch.cancel()
        }
    }, [searchTerm])

    const handleCategoryClick = (category) => {
        setSearchTerm(category.searchterm)
    }

    const handleGifSelect = (gif) => {
        const markdownUrl = `![${gif.id}](${gif.media[0].tinygif.url})`
        onGifSelect(markdownUrl)
        setIsOpen(false)
    }

    return (
        <div className="relative inline-block">
            <Button
                ref={buttonRef}
                onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                variant="ghost"
                size="icon"
                className={`text-white hover:text-white hover:bg-white/10 ${isDarkTheme
                        ? "bg-white/0 text-white"
                        : "bg-white text-black border-zinc-500 hover:text-black hover:bg-zinc-200"
                    }`}
            >
                <FaImage className="h-5 w-5" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={pickerRef}
                        initial={{ opacity: 0, scale: 0.95, y: position === "top" ? 20 : -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: position === "top" ? 20 : -20 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute ${position === "top" ? "bottom-full mb-2" : "h-[300px] mt-2"} right-0 w-96 ${isDarkTheme ? "bg-black/90 text-white" : "bg-white text-black"
                            } backdrop-blur-xl border border-white/10 rounded-lg shadow-lg overflow-hidden z-50`}
                    >
                        <div className="p-4">
                            <div className="relative mb-4">
                                <Input
                                    type="text"
                                    placeholder="Search GIFs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full bg-white/5 border-white/20 ${isDarkTheme ? "text-white" : "text-black border-zinc-500"
                                        } placeholder-white/50 p-2 rounded-md`}
                                />
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                            </div>
                            <hr className={`border-t ${isDarkTheme ? "border-white/20" : "border-black/10"}`} />
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                </div>
                            ) : searchTerm ? (
                                <div className="grid grid-cols-2 gap-2 p-4">
                                    {searchResults.map((gif) => (
                                        <motion.div
                                            key={gif.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => handleGifSelect(gif)}
                                            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-yellow-500/50 transition-all"
                                        >
                                            <img
                                                src={gif.media[0].tinygif.url || "/placeholder.svg"}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 p-4">
                                    {categories.map((category) => (
                                        <motion.div
                                            key={category.searchterm}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => handleCategoryClick(category)}
                                            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group hover:ring-2 hover:ring-yellow-500/50 transition-all"
                                        >
                                            <img
                                                src={category.image || "/placeholder.svg"}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white font-medium">{category.name}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

