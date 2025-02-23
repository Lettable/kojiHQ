'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import Header from '@/partials/Header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Eye, DollarSign, Clock, Search, X } from 'lucide-react'
import Link from 'next/link'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'

const renderTextWithEmojis = (text, emojis) => {
    if (!text || typeof text !== 'string') return text || '';
    if (!emojis || !Array.isArray(emojis)) return text;

    const emojiRegex = /:([\w-]+):/g;
    const mentionRegex = /@(\w+)/g;
    const parts = text.split(emojiRegex);

    return parts.map((part, index) => {
        if (index % 2 === 0) {
            return part.split(mentionRegex).map((subPart, subIndex) => {
                if (subIndex % 2 === 0) {
                    return subPart;
                } else {
                    return (
                        <span key={subIndex} className="mention">
                            @{subPart}
                        </span>
                    );
                }
            });
        } else {
            const emoji = emojis.find(e => e.emojiTitle === `:${part}:`);
            if (emoji) {
                return (
                    <img
                        key={index}
                        src={emoji.emojiUrl}
                        alt={emoji.emojiTitle}
                        title={emoji.emojiTitle}
                        className="inline-block w-6 h-6"
                    />
                );
            } else {
                return `:${part}:`;
            }
        }
    });
};

const projectTypes = [
    'Accounts',
    'Groups & Channels',
    'Domains',
    'Software',
    'Databases',
    'Other Digital Assets'
];

export default function Marketplace() {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedAuctionStatus, setSelectedAuctionStatus] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [topProjectors, setTopProjectors] = useState([]);
    const [liveAuctions, setLiveAuctions] = useState([]);
    const [emojis, setEmojis] = useState()
    const [currentUser, setCurrentUser] = useState()
    const [currentUserId, setCurrentUserId] = useState()
    const [currentUserPfp, setCurrentUserPfp] = useState()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        setIsDarkTheme(storedTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const sendDiscordNotification = async () => {
        if (!currentUserId) return;
    
        // const webhookUrl = 'https://discord.com/api/webhooks/1316066211850620989/_9WGkcypsKTp9KdvRMGFtWQ-eEs8p7HZxwK0XABVOnL8os8wO5hesWHVs_BydHVBN9RA'; // Replace with your Discord webhook URL
    
        // const payload = {
        //     content: '**Marketplace Page Visited**',
        //     embeds: [
        //         {
        //             title: 'User Visited Marketplace',
        //             description: 'A user has visited the marketplace page.',
        //             fields: [
        //                 {
        //                     name: 'User Details',
        //                     value: `**User ID**: ${currentUserId}\n**Username**: ${currentUser.username}\n**Profile Picture**: [Click to View](${currentUserPfp || 'No Profile Pic'})`,
        //                 },
        //             ],
        //             color: 7506394,
        //         },
        //     ],
        // };
    
        // try {
        //     const response = await fetch(webhookUrl, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(payload),
        //     });
    
        //     if (!response.ok) {
        //         console.error('Failed to send webhook notification to Discord');
        //     }
        // } catch (error) {
        //     console.error('Error sending webhook notification:', error);
        // }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            router.push('/auth')
            return
        }
        try {
            const decoded = jwtDecode(token)
            setCurrentUser(decoded)
            setCurrentUserId(decoded.userId)
            setCurrentUserPfp(decoded.profilePic)
            if (decoded.userId) {
                setIsLoggedIn(true)
            }
            if (decoded.isPremium) {
                setIsPremium(true)
            }
        } catch (error) {
            console.error(error)
            router.push('/auth')
        }
    }, [router])

    const fetchEmojis = async () => {
        try {
            const response = await fetch('/api/emojis')
            const data = await response.json()
            setEmojis(data)
        } catch (error) {
            console.error('Error fetching emojis:', error)
        }
    }

    const fetchProjects = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/market-place?page=${page}`);
            const data = await response.json();
            if (page === 1) {
                setProjects(data.projects);
            } else {
                setProjects(prevProjects => [...prevProjects, ...data.projects]);
            }
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.currentPage);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
        setIsLoading(false);
    }, []);

    const fetchTopProjectors = useCallback(async () => {
        try {
            const response = await fetch('/api/top-projectors');
            const data = await response.json();
            if (data.success) {
                setTopProjectors(data.topProjectors.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching top projectors:', error);
        }
    }, []);

    const fetchLiveAuctions = useCallback(async () => {
        try {
            const response = await fetch('/api/get-live-auctions');
            const data = await response.json();
            if (data.success) {
                setLiveAuctions(data.auctions);
            }
        } catch (error) {
            console.error('Error fetching live auctions:', error);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
        fetchTopProjectors();
        fetchLiveAuctions();
        fetchEmojis();
        sendDiscordNotification();
    }, [fetchProjects, fetchTopProjectors, fetchLiveAuctions, currentUser]);

    const filterProjects = useCallback(() => {
        let filtered = projects.filter(project =>
            // Search term condition
            (searchTerm === '' ||
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            ) &&
            // Category filter
            (selectedCategory === 'All' || project.category === selectedCategory) &&
            // Price range filter
            (project.price >= priceRange[0] && project.price <= priceRange[1]) &&
            // Status filter (including Showcase logic)
            (selectedStatus === 'All' ||
                (selectedStatus.toLowerCase() === 'showcasing' && project.showcase) || // Handle "Showcasing" status
                project.status.toLowerCase() === selectedStatus.toLowerCase() // Regular status check (Active, Sold, etc.)
            ) &&
            // Auction status filter
            (selectedAuctionStatus === 'All' ||
                (selectedAuctionStatus === 'Live Auctions' && project.status === 'active') ||
                (selectedAuctionStatus === 'Fixed Price' && project.price !== null))
        );

        setFilteredProjects(filtered);
    }, [projects, searchTerm, selectedCategory, priceRange, selectedStatus, selectedAuctionStatus]);



    useEffect(() => {
        filterProjects();
    }, [filterProjects, projects, searchTerm, selectedCategory, priceRange, selectedStatus, selectedAuctionStatus]);

    const handleLoadMore = () => {
        if (currentPage < totalPages) {
            fetchProjects(currentPage + 1);
        }
    };

    const findRelatedProjects = (project) => {
        return projects.filter(p =>
            p.id !== project.id &&
            p.tags.some(tag => project.tags.includes(tag))
        ).slice(0, 5);
    };

    return (
        <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header 
            avatar={currentUserPfp}
            userId={currentUserId} 
            isDarkTheme={isDarkTheme} 
            toggleTheme={toggleTheme}
            isLoggedIn={isLoggedIn}
            isPremium={isPremium}
            />

            {/* Updated Hero Section */}
            <section className={`relative py-16 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}>
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-purple-500/5 to-blue-500/5" />
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full filter blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full filter blur-[120px]" />
                </div>
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                                Digital Marketplace
                            </span>
                        </h1>
                        <p className={`text-lg mb-8 ${isDarkTheme ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            Explore, bid and purchase digital products from our community
                        </p>
                        <div className="max-w-2xl mx-auto relative">
                            <input
                                type="text"
                                placeholder="Search projects by tags, title, or owner..."
                                className={`w-full py-3 pl-12 pr-4 rounded-xl ${
                                    isDarkTheme 
                                        ? 'bg-white/5 text-white placeholder-white/50 border-white/10' 
                                        : 'bg-black/5 text-black placeholder-black/50 border-black/10'
                                } focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkTheme ? 'text-white/50' : 'text-black/50'}`} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Updated Main Content Section */}
            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8">
                    {/* Left Sidebar */}
                    <aside className="space-y-6">
                        <Card className={`${isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h3 className={`text-lg font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-zinc-800'}`}>Category</h3>
                                    <select
                                        className={`w-full p-2 rounded-xl ${
                                            isDarkTheme 
                                                ? 'bg-white/10 text-white hover:bg-white/20' 
                                                : 'bg-black/10 text-black hover:bg-black/20'
                                        } transition-colors`}
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="All">All Categories</option>
                                        {projectTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-zinc-800'}`}>Price Range</h3>
                                    <Slider
                                        min={0}
                                        max={10000}
                                        step={100}
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        className={isDarkTheme ? 'text-white' : 'text-black'}
                                    />
                                    <div className={`flex justify-between mt-2 text-sm ${isDarkTheme ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map(project => (
                                <motion.div
                                    key={project.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card
                                        className={`${isDarkTheme ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-zinc-200 hover:bg-gray-50'} transition-all duration-200 rounded-xl overflow-hidden`}
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <div className="relative aspect-w-16 aspect-h-9">
                                            <img
                                                src={project.images[0]}
                                                alt={project.title}
                                                className="w-full h-full object-cover rounded-t-xl"
                                            />
                                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent rounded-t-xl">
                                                <h3 className="text-xl font-semibold text-white truncate">{project.title}</h3>
                                                <p className={`text-sm ${isDarkTheme ? 'text-white/80' : 'text-gray-300'} truncate`}>
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <Avatar className="h-6 w-6 mr-2">
                                                        <AvatarImage src={project.author.avatar} alt={project.author.username} />
                                                        <AvatarFallback>{project.author.username.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className={`text-sm ${isDarkTheme ? 'text-white/90' : 'text-zinc-700'}`}>{project.author.username}</span>
                                                </div>
                                                <Badge className={`${isDarkTheme ? 'bg-white/20 text-white' : 'bg-zinc-200 text-black'}`}>
                                                    {project.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                {project.price !== null ? (
                                                    <span className={`text-lg font-bold ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                                        ${project.price}
                                                    </span>
                                                ) : (
                                                    <span className={`text-lg font-bold ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}>
                                                        Showcase
                                                    </span>
                                                )}
                                                <div className="flex items-center space-x-2">
                                                    <span className={`text-sm flex items-center ${isDarkTheme ? 'text-white/70' : 'text-zinc-600'}`}>
                                                        <Eye className="w-4 h-4 mr-1" /> {project.views}
                                                    </span>
                                                    <span className={`text-sm flex items-center ${isDarkTheme ? 'text-white/70' : 'text-zinc-600'}`}>
                                                        <MessageCircle className="w-4 h-4 mr-1" /> {project.comments.length}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {currentPage < totalPages && (
                            <div className="mt-8 text-center">
                                <Button
                                    variant="outline"
                                    className={`${isDarkTheme ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-black hover:bg-gray-100'} transition-all`}
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Loading...
                                        </div>
                                    ) : 'Load More Projects'}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <aside className="space-y-6">
                        <Card className={`${isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200'}`}>
                            <CardContent className="p-6">
                                <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-zinc-800'}`}>Top Projectors</h3>
                                <ul className="space-y-4">
                                    {topProjectors.map((projector, index) => (
                                        <motion.li
                                            key={projector.userId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center"
                                        >
                                            <Avatar className="h-8 w-8 mr-2">
                                                <AvatarImage src={projector.avatar} alt={projector.username} />
                                                <AvatarFallback>{projector.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <Link href={`/user/${projector.userId}`} className={`text-sm ${isDarkTheme ? 'text-white hover:text-white/80' : 'text-zinc-800 hover:text-zinc-600'} transition-colors`}>
                                                {projector.username}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className={`${isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200'}`}>
                            <CardContent className="p-6">
                                <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-zinc-800'}`}>Live Auctions</h3>
                                <ul className="space-y-4">
                                    {liveAuctions.map((auction, index) => (
                                        <motion.li
                                            key={auction.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between"
                                        >
                                            <Link 
                                                href={`/product/${auction.id}`}
                                                className={`text-sm ${isDarkTheme ? 'text-white hover:text-white/80' : 'text-zinc-800 hover:text-zinc-600'} transition-colors`}
                                            >
                                                {auction.title.length > 9 ? `${auction.title.substring(0, 20)}...` : auction.title}
                                            </Link>
                                            <span className={`text-sm font-semibold ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                                ${auction.highestBid}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </main>

            {/* Project Detail Modal (Redesigned) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className={`max-w-4xl ${isDarkTheme ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200'}`}>
                    {selectedProject && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Side: Image and Details */}
                            <div>
                                <img src={selectedProject.images[0]} alt={selectedProject.title} className="w-full h-auto rounded-lg mb-4" />
                                <div className="space-y-4">
                                    <h1 className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-zinc-800'}`}>{selectedProject.title}</h1>
                                    <p className={`text-sm ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>{selectedProject.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.tags.map(tag => (
                                            <Badge key={tag} className={`${isDarkTheme ? 'bg-white/10 text-white' : 'bg-zinc-200 text-black'}`}>
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center">
                                        <Avatar className="h-10 w-10 mr-3">
                                            <AvatarImage src={selectedProject.author.avatar} alt={selectedProject.author.username} />
                                            <AvatarFallback>{selectedProject.author.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-zinc-700'}`}>{selectedProject.author.username}</p>
                                            <p className={`text-sm ${isDarkTheme ? 'text-zinc-400' : 'text-zinc-500'}`}>Project Owner</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Tabs and Actions */}
                            <div className="space-y-4">
                                <Tabs defaultValue="comments" className="w-full">
                                    <TabsList className="w-full grid grid-cols-2">
                                        <TabsTrigger value="comments" className={`w-full ${isDarkTheme ? 'text-white/80 hover:bg-white/10' : 'text-zinc-700 hover:bg-zinc-100'}`}>
                                            Comments
                                        </TabsTrigger>
                                        <TabsTrigger value="related" className={`w-full ${isDarkTheme ? 'text-white/80 hover:bg-white/10' : 'text-zinc-700 hover:bg-zinc-100'}`}>
                                            Related
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="comments">
                                        <ScrollArea className="h-64 pr-4">
                                            {selectedProject.comments.length > 0 ? (
                                                selectedProject.comments.map((comment) => (
                                                    <div key={comment.id} className="mb-4">
                                                        <div className="flex items-center mb-1">
                                                            <Avatar className="h-6 w-6 mr-2">
                                                                <AvatarImage src={comment.avatar} />
                                                                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <span className={`font-semibold ${isDarkTheme ? 'text-white/90' : 'text-zinc-700'}`}>{comment.author}</span>
                                                        </div>
                                                        <p className={`text-sm ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                                            {renderTextWithEmojis(comment.content, emojis)}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className={`text-center mt-4 ${isDarkTheme ? 'text-zinc-400' : 'text-zinc-500'}`}>No comments yet.</p>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>
                                    <TabsContent value="related">
                                        <ScrollArea className="h-64 pr-4">
                                            {findRelatedProjects(selectedProject).length > 0 ? (
                                                findRelatedProjects(selectedProject).map(project => (
                                                    <div key={project.id} className="mb-4">
                                                        <h4 className={`font-semibold ${isDarkTheme ? 'text-white/90' : 'text-zinc-700'}`}>{project.title}</h4>
                                                        <p className={`text-sm ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'} line-clamp-2`}>
                                                            {project.description}
                                                        </p>
                                                        <Button variant="link" className="p-0 mt-1" onClick={() => window.location.href = `/product/${project.id}`}>
                                                            View Project
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className={`text-center mt-4 ${isDarkTheme ? 'text-zinc-400' : 'text-zinc-500'}`}>No related projects.</p>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>
                                </Tabs>

                                {/* Actions */}
                                <div className="flex items-center justify-between">
                                    {selectedProject.price !== null ? (
                                        <div className="text-center">
                                            <p className={`text-sm ${isDarkTheme ? 'text-zinc-400' : 'text-zinc-600'}`}>Price</p>
                                            <p className={`text-2xl font-bold ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                                ${selectedProject.price}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className={`text-sm ${isDarkTheme ? 'text-zinc-400' : 'text-zinc-600'}`}>Status</p>
                                            <p className={`text-2xl font-bold ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}>
                                                Showcase
                                            </p>
                                        </div>
                                    )}
                                    <Button
                                        className={`${isDarkTheme ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black text-white hover:bg-gray-800'} transition-colors`}
                                        onClick={() => window.location.href = `/product/${selectedProject.id}`}
                                    >
                                        View Product
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}