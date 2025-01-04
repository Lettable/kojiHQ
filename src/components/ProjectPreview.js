'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Maximize, Minimize, Smartphone, Tablet, Monitor, Activity, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const ProjectPreview = ({ link, open, onOpenChange }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [viewportWidth, setViewportWidth] = useState(100)
    const [performanceScore, setPerformanceScore] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const iframeRef = useRef(null)

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme')
        setIsDarkTheme(storedTheme === 'dark')
    }, [])

    useEffect(() => {
        if (open) {
            const startTime = performance.now()

            const handleLoad = () => {
                const endTime = performance.now()
                const loadTime = endTime - startTime
                const score = Math.max(0, Math.min(100, 100 - (loadTime / 100)))
                console.log(Math.round(score) || 'okay')
                setPerformanceScore(Math.round(score))
                setIsLoading(false)
            }

            handleLoad()
        }
    }, [open, link])

    const handleViewportChange = (device) => {
        switch (device) {
            case 'mobile':
                setViewportWidth(30)
                break
            case 'tablet':
                setViewportWidth(50)
                break
            case 'desktop':
                setViewportWidth(100)
                break
        }
    }

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen)
    }

    const reloadIframe = () => {
        if (iframeRef.current) {
            setPerformanceScore(null)
            iframeRef.current.src = iframeRef.current.src
        }
    }

    const handleClose = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`p-0 ${isFullScreen ? 'w-screen h-screen max-w-none' : 'w-11/12 h-5/6 max-w-6xl'} ${isDarkTheme ? 'bg-black/90 text-white border-zinc-700' : 'bg-white text-black'}`}>
                <div className="flex flex-col h-full rounded-lg overflow-hidden shadow-lg">
                    {/* Browser-like top bar */}
                    <div className={`flex items-center justify-between p-2 ${isDarkTheme ? 'bg-black/90' : 'bg-gray-100'} border-b ${isDarkTheme ? 'border-zinc-700' : 'border-gray-200'}`}>
                        <div className="flex items-center space-x-2">
                            {/* <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => iframeRef.current?.contentWindow?.history.back()}
                                            className={isDarkTheme ? 'text-white hover:text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'}
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Back</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => iframeRef.current?.contentWindow?.history.forward()}
                                            className={isDarkTheme ? 'text-white hover:text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'}
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Forward</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider> */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={reloadIframe}
                                            className={isDarkTheme ? 'text-white hover:text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'}
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Reload</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className={`flex-1 px-4 py-1 mx-2 text-sm truncate rounded ${isDarkTheme ? 'bg-white/10' : 'bg-white border border-gray-300'}`}>
                            {link}
                        </div>
                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={toggleFullScreen}
                                            className={isDarkTheme ? 'text-white hover:text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'}
                                        >
                                            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            onClick={onOpenChange}
                                            className={isDarkTheme ? 'text-white hover:text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'}
                                        >
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Close</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className={`flex items-center justify-between p-2 ${isDarkTheme ? 'bg-black/90' : 'bg-gray-100'} border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewportChange('mobile')}
                                            className={isDarkTheme ? 'text-white hover:text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'}
                                        >
                                            <Smartphone className="h-4 w-4 mr-1" />
                                            Mobile
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Switch to Mobile View</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewportChange('tablet')}
                                            className={isDarkTheme ? 'text-white hover:text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'}
                                        >
                                            <Tablet className="h-4 w-4 mr-1" />
                                            Tablet
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Switch to Tablet View</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewportChange('desktop')}
                                            className={isDarkTheme ? 'text-white hover:text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'}
                                        >
                                            <Monitor className="h-4 w-4 mr-1" />
                                            Desktop
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Switch to Desktop View</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Activity className={`h-4 w-4 ${performanceScore === null ? 'text-gray-400' :
                                    performanceScore >= 90 ? 'text-green-500' :
                                        performanceScore >= 70 ? 'text-yellow-500' :
                                            'text-red-500'
                                }`} />
                            <span className="text-sm">
                                Performance: {isLoading ? 'Calculating...' : performanceScore === null ? 'N/A' : `${performanceScore}`}
                            </span>
                        </div>
                    </div>

                    {/* Viewport Slider */}
                    <div className={`px-4 py-2 ${isDarkTheme ? 'bg-black/90' : 'bg-gray-100'} border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                        <Slider
                        className={`${isDarkTheme ? 'text-white fill-white' : 'text-black'}`}
                            value={[viewportWidth]}
                            onValueChange={(value) => setViewportWidth(value[0])}
                            max={100}
                            step={1}
                        />
                    </div>

                    {/* Preview Window */}
                    <div className="flex-1 overflow-hidden bg-white">
                        <div style={{ width: `${viewportWidth}%`, height: '100%', margin: '0 auto' }}>
                            <iframe
                                ref={iframeRef}
                                src={link}
                                className="w-full h-full border-0"
                                title="Project Preview"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProjectPreview

