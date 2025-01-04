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

            {/* Hero Section */}
            <section className={`py-16 ${isDarkTheme ? 'bg-zinc-900/10 text-white border-zinc-300' : 'bg-gray-100'}`}>
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">Explore, Bid, and Buy Products in Real-Time</h1>
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search projects by tags, title, or owner..."
                            className={`w-full py-3 pl-12 pr-4 rounded-full ${isDarkTheme ? 'bg-white/10 text-white' : 'bg-white text-gray-900'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className={`${isDarkTheme ? 'absolute left-4 top-1/2 transform -translate-y-1/2 text-white' : 'absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'}`} />
                    </div>
                </div>
            </section>
            <Separator className={`${isDarkTheme ? 'bg-white/10' : 'bg-zinc-300'}`} />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-64 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Category</h3>
                            <select
                                className={`w-full p-2 rounded ${isDarkTheme ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option className={`${isDarkTheme ? 'bg-black text-white' : 'bg-gray-100'}`} value="All">All Categories</option>
                                {projectTypes.map(type => (
                                    <option key={type} className={`${isDarkTheme ? 'bg-black text-white' : 'bg-gray-100'}`} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Price Range</h3>
                            <Slider
                                min={0}
                                max={10000}
                                step={100}
                                value={priceRange}
                                onValueChange={setPriceRange}
                            />
                            <div className="flex justify-between mt-2">
                                <span>${priceRange[0]}</span>
                                <span>${priceRange[1]}</span>
                            </div>
                        </div>
                        <div>
                            {/* <h3 className="text-lg font-semibold mb-2">Project Status</h3>
                            <select
                                className={`w-full p-2 rounded ${isDarkTheme ? 'bg-white/10' : 'bg-gray-100'}`}
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option className={`${isDarkTheme ? 'bg-black text-white' : 'bg-gray-100'}`} value="All">All Statuses</option>
                                <option className={`${isDarkTheme ? 'bg-black text-white' : 'bg-gray-100'}`} value="Active">Active</option>
                                <option className={`${isDarkTheme ? 'bg-black text-white' : 'bg-gray-100'}`} value="Sold">Sold</option>
                                <option className={`${isDarkTheme ? 'bg-black text-white' : 'bg-gray-100'}`} value="Showcasing">Showcasing</option>

                            </select> */}
                        </div>
                        <div>
                            {/* <h3 className="text-lg font-semibold mb-2">Auction Status</h3>
                            <select
                                className={`w-full p-2 rounded ${isDarkTheme ? 'bg-white/10' : 'bg-gray-100'}`}
                                value={selectedAuctionStatus}
                                onChange={(e) => setSelectedAuctionStatus(e.target.value)}
                            >
                                <option className={`${isDarkTheme ? 'bg-black text-white' : 'bg-gray-100'}`} value="All">All</option>
                                <option className={`${isDarkTheme ? 'bg-black text-white' : 'bg-gray-100'}`} value="Live Auctions">Live Auctions</option>
                                <option className={`${isDarkTheme ? 'bg-black text-white' : 'bg-gray-100'}`} value="Fixed Price">Fixed Price</option>
                                
                            </select> */}
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Project Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map(project => (
                                    <Card key={project.id} className={`${isDarkTheme ? 'bg-white/10 border-black text-white' : 'bg-white text-gray-900'} overflow-hidden`}>
                                        <CardContent className="p-6">
                                            <img src={project.images[0]} alt={project.title} className="w-full h-48 object-cover rounded-md mb-4" />
                                            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                                            {/* <div className="flex flex-wrap gap-2 mb-4">
                                                {project.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                                ))}
                                            </div> */}
                                            <div className="flex items-center justify-between mb-4">
                                                {project.price !== null ? (
                                                    <div>
                                                        <p className="text-sm">Fixed Price</p>
                                                        <p className="font-bold text-lg">${project.price}</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-sm">Bid</p>
                                                        <p className="font-bold text-lg">null</p>
                                                    </div>
                                                )}
                                                <Badge className={`${isDarkTheme ? 'bg-white/20 hover:bg-white/20 text-white' : 'hover:bg-zinc-200 text-black bg-zinc-200'}`}>{project.status}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Avatar className="h-8 w-8 mr-2">
                                                        <AvatarImage src={project.author.avatar} alt={project.author.username} />
                                                        <AvatarFallback>{project.author.username.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{project.author.username}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm flex items-center"><Eye className="w-4 h-4 mr-1" /> {project.views}</span>
                                                    <span className="text-sm flex items-center"><MessageCircle className="w-4 h-4 mr-1" /> {project.comments.length}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-6 pt-0">
                                            <Button className={`w-full ${isDarkTheme ? 'bg-black hover:bg-black text-zinc-300' : 'bg-black text-white'}`} onClick={() => {
                                                setSelectedProject(project)
                                                setIsModalOpen(true)
                                            }}>View Details</Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-10">
                                    <p className="text-xl font-semibold">No projects found.</p>
                                    <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                                </div>
                            )}
                        </div>

                        {/* Load More Button */}
                        <div className="mt-8 text-center">
                            {currentPage < totalPages && (
                                <Button
                                    variant="outline"
                                    className={isDarkTheme ? 'bg-white/10 text-white border-0  hover:bg-white/20 hover:text-white' : ''}
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Loading...' : 'Load More Projects'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Sidebar */}
                    <aside className="w-full lg:w-64 space-y-6">
                        <Card className={`${isDarkTheme ? 'bg-white/10 text-white border-0' : 'bg-white text-gray-900'}`}>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Top Projectors</h3>
                                <ul className="space-y-4">
                                    {topProjectors.map(projector => (
                                        <li key={projector.userId} className="flex items-center">
                                            <Avatar className="h-8 w-8 mr-2">
                                                <AvatarImage src={projector.avatar} alt={projector.username} />
                                                <AvatarFallback>{projector.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <Link href={`/user/${projector.userId}`}>
                                                <span className="text-sm">{projector.username}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className={`${isDarkTheme ? 'bg-white/10 text-white border-0' : 'bg-white text-gray-900'}`}>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Live Auctions</h3>
                                <ul className="space-y-4">
                                    {liveAuctions.map(auction => (
                                        <li key={auction.id} className="flex items-center justify-between">
                                            <Link href={`/product/${auction.id}`}>
                                                <span className="text-sm">{auction.title.length > 9 ? `${auction.title.substring(0, 20)}...` : auction.title}</span>
                                            </Link>
                                            <span className="text-sm font-semibold">${auction.highestBid}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </aside>
                </div>

                {/* Marketplace Analytics Section */}
                <section className={`mt-12 p-6 rounded-lg ${isDarkTheme ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <h2 className="text-2xl font-bold mb-4">Marketplace Analytics</h2>
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
                        <Card className={`${isDarkTheme ? 'bg-white/10 border-0 text-white' : ''}`}>
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
                                <p className="text-3xl font-bold">{projects.length}</p>
                            </CardContent>
                        </Card>
                        <Card className={`${isDarkTheme ? 'bg-white/10 border-0 text-white' : ''}`}>
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                                <p className="text-3xl font-bold">${projects.reduce((sum, project) => sum + (project.price || 0), 0).toLocaleString()}</p>
                            </CardContent>
                        </Card>
                        <Card className={`${isDarkTheme ? 'bg-white/10 border-0 text-white' : ''}`}>
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold mb-2">Active Buyers</h3>
                                <p className="text-3xl font-bold">{Math.floor(projects.length * 0.7)}</p>
                            </CardContent>
                        </Card>
                        <Card className={`${isDarkTheme ? 'bg-white/10 border-0 text-white' : ''}`}>
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold mb-2">Active Sellers</h3>
                                <p className="text-3xl font-bold">{new Set(projects.map(p => p.author.userId)).size}</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            {/* Project Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className={`max-w-4xl ${isDarkTheme ? 'bg-black/70 border-zinc-700 text-white' : ''}`}>
                    {selectedProject && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedProject.title}</DialogTitle>
                                <DialogDescription>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Badge className={`${isDarkTheme ? 'bg-white/20 hover:bg-white/20 border-white/20 text-white' : 'bg-black hover:bg-black'}`}>{selectedProject.category}</Badge>
                                        <Badge className={`${isDarkTheme ? 'bg-white text-black' : ''}`} variant="outline">{selectedProject.status}</Badge>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <img src={selectedProject.images[0]} alt={selectedProject.title} className="w-full h-64 object-cover rounded-md mb-4" />
                                    <p className={`text-sm mb-4 ${isDarkTheme ? 'text-zinc-200' : 'text-gray-600'}`}>{selectedProject.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedProject.tags.map(tag => (
                                            <Badge className={`${isDarkTheme ? 'bg-white hover:bg-white' : 'bg-zinc-300 hover:bg-zinc-300'}`} key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <Avatar className="h-10 w-10 mr-2">
                                                <AvatarImage src={selectedProject.author.avatar} alt={selectedProject.author.username} />
                                                <AvatarFallback>{selectedProject.author.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{selectedProject.author.username}</p>
                                                <p className={`${isDarkTheme ? 'text-sm text-zinc-200' : 'text-sm text-gray-500'}`}>Project Owner</p>
                                            </div>
                                        </div>
                                        <Button onClick={() => window.location.href = `/user/${selectedProject.author.userId}`} className={`${isDarkTheme ? 'bg-white text-black hover:bg-zinc-200 ' : ''}`} variant="outline">
                                            Message Owner
                                        </Button>
                                    </div>
                                    {selectedProject.price !== null ? (
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold mb-2">Price</h3>
                                            <p className="text-3xl font-bold">${selectedProject.price}</p>
                                            <Button onClick={() => window.location.href = `/product/${selectedProject.id}`} className="w-full mt-2">
                                                Go To Product
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold mb-2">Showcase</h3>
                                            <p className="text-3xl font-bold">--</p>
                                            <Button className="w-full mt-2">
                                                <Link href={`/product/${selectedProject.id}`}>
                                                    View Product
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                    <Tabs defaultValue="comments">
                                        <TabsList className="w-full">
                                            <TabsTrigger value="comments" className="w-full">Comments</TabsTrigger>
                                            <TabsTrigger value="related" className="w-full">Related Projects</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="comments">
                                            <ScrollArea className="h-[200px] pt-2">
                                                {selectedProject.comments.length > 0 ? (
                                                    selectedProject.comments.map((comment) => (
                                                        <div key={comment.id} className="mb-4 pt-2">
                                                            <div className="flex items-center mb-2">
                                                                <Avatar className="h-6 w-6 mr-2">
                                                                    <AvatarImage src={comment.avatar} />
                                                                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <span className="font-semibold">{comment.author}</span>
                                                            </div>
                                                            <p className="text-sm">{renderTextWithEmojis(comment.content, emojis)}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center mt-4">No comments yet.</p>
                                                )}
                                            </ScrollArea>
                                        </TabsContent>
                                        <TabsContent value="related">
                                            <ScrollArea className="h-[200px] pt-2">
                                                {findRelatedProjects(selectedProject).length > 0 ? (
                                                    findRelatedProjects(selectedProject).map(project => (
                                                        <div key={project.id} className="mb-4 pt-2">
                                                            <h4 className="font-semibold">{project.title}</h4>
                                                            <p className="text-sm">{project.description.slice(0, 100)}...</p>
                                                            <Button>
                                                                <Link href={`/product/${project.id}`}>
                                                                    View Project
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center mt-4">No related projects found.</p>
                                                )}
                                            </ScrollArea>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}