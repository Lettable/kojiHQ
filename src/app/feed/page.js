'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { jwtDecode } from 'jwt-decode'
import { Bell, ChevronDown, Filter, Loader2, Menu, MessageCircle, Moon, Search, Share2, Sun, ThumbsUp, X, Zap, Heart, DollarSign, Eye, Check } from 'lucide-react'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import Header from '@/partials/Header'
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from 'next/navigation'
import ChatMenuButton from '@/partials/ChatMenuButton'

const renderTextWithEmojis = (text, emojis) => {
  if (!text || typeof text !== 'string') return text || '';
  if (!emojis || !Array.isArray(emojis)) return text;

  const emojiRegex = /:([\w-]+):/g;
  const parts = text.split(emojiRegex);

  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return part;
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

export default function EnhancedDynamicSideProjector() {
  const [currentUser, setCurrentUser] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [projectStatus, setProjectStatus] = useState('all')
  const [priceType, setPriceType] = useState('all')
  const [searchType, setSearchType] = useState('projects')
  const [allProjects, setAllProjects] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [statusEmoji, setStatusEmoji] = useState('')
  const [emojis, setEmojis] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [renderedIds, setRenderedIds] = useState(new Set())
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: false,
  })

  const handleThemeToggle = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    console.log(newTheme ? 'Dark mode enabled' : 'Light mode enabled');
  };

  const fetchEmojis = async () => {
    try {
      const response = await fetch('/api/emojis')
      const data = await response.json()
      setEmojis(data)
    } catch (error) {
      console.error('Error fetching emojis:', error)
    }
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true);

    const token = localStorage.getItem('accessToken');
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      if (!userId) throw new Error('User ID not found in token.');

      fetchNewToken(userId, token)
        .then((newToken) => {
          const newDecoded = jwtDecode(newToken);

          setCurrentUser(newDecoded);
          localStorage.setItem('accessToken', newToken);

          fetchEmojis();
        })
        .catch((error) => {
          console.error('Error fetching new token:', error.message);
          setCurrentUser(null);
          setIsLoggedIn(false);
        });
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/auth');
    }
  }, [router]);

  // async function fetchNewToken(userId, token) {
  //   try {
  //     const response = await fetch('/api/generate-token', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ userId, token }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Failed to fetch new token.');
  //     }

  //     const { token: newToken } = await response.json();
  //     return newToken;
  //   } catch (error) {
  //     console.error('Error updating token:', error.message);
  //     throw error;
  //   }
  // }
  async function fetchNewToken(userId, token) {
    try {
      const response = await fetch('/api/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, token }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 403) {
          if (data.message?.includes('banned') || data.message?.includes('suspended')) {
            localStorage.removeItem('accessToken');
            router.push('/auth');
          }
        }
        throw new Error(data.error || 'Failed to fetch new token.');
      }
  
      const { token: newToken } = data;
      return newToken;
    } catch (error) {
      console.error('Error updating token:', error.message);
      throw error;
    }
  }
  

  const fetchProjects = useCallback(async () => {
    if (!hasMore || isLoading) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/home-action?page=${page}`)
      const data = await response.json()
      if (data.success) {
        const newProjects = data.data.filter(project => !renderedIds.has(project.id))
        setAllProjects(prev => [...prev, ...newProjects])
        setRenderedIds(prev => new Set([...prev, ...newProjects.map(p => p.id)]))
        setPage(prev => prev + 1)
        setHasMore(data.data.length > 0)
      } else {
        console.error("Failed to fetch projects")
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, hasMore, isLoading, renderedIds])

  const fetchUsers = useCallback(async () => {
    if (searchQuery.length < 2) return

    try {
      const response = await fetch('/api/user-action/search-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: searchQuery }),
      })
      const data = await response.json()
      if (data.success) {
        const newUsers = data.data.filter(user => !renderedIds.has(user.id))
        setUsers(prev => [...prev, ...newUsers])
        setRenderedIds(prev => new Set([...prev, ...newUsers.map(u => u.id)]))
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, renderedIds])

  useEffect(() => {
    if (searchType === 'projects' && allProjects.length === 0) {
      fetchProjects()
    }
  }, [searchType, allProjects.length, fetchProjects])

  useEffect(() => {
    if (inView && hasMore && searchType === 'projects') {
      fetchProjects()
    }
  }, [inView, hasMore, fetchProjects, searchType])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchType === 'users' && searchQuery.length >= 2) {
        fetchUsers()
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, searchType, fetchUsers])

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(project.type)

      const matchesPrice =
        project.price >= priceRange[0] && project.price <= priceRange[1]

      const matchesStatus =
        projectStatus === 'all' || project.projectStatus === projectStatus

      const matchesPriceType =
        priceType === 'all' ||
        (priceType === 'fixed' && project.priceType === 'fixed') ||
        (priceType === 'bid' && project.priceType === 'bid')

      return matchesSearch && matchesType && matchesPrice && matchesStatus && matchesPriceType
    })
  }, [allProjects, searchQuery, selectedTypes, priceRange, projectStatus, priceType])

  const handleSubmit = () => {
    router.push('/submit-project')
  }

  const toggleProjectType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    if (searchType === 'users') {
      setRenderedIds(new Set())
    }
  }

  const handleShare = (id) => {
    const url = `${window.location.origin}/${searchType === 'projects' ? 'project' : 'user'}/${id}`
    navigator.clipboard.writeText(url)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err))
  }

  const truncateDescription = (description, limit = 60) => {
    const words = description.split(' ')
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...'
    }
    return description
  }

  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const renderSidebar = () => (
    <div className={`space-y-6 ${isDarkTheme ? 'text-white' : 'text-black'}`}>
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Search</h3>
        <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
          <Input
            placeholder={`Search for ${searchType}`}
            className={`flex-grow ${isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} focus:border-yellow-400/50 transition-colors`}
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button type="submit" variant="ghost" size="icon" className={`${isDarkTheme ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/10 text-black hover:bg-black/20'} ml-2`}>
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Search Type</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="search-type"
            checked={searchType === 'users'}
            onCheckedChange={(checked) => {
              setSearchType(checked ? 'users' : 'projects');
              setRenderedIds(new Set());
            }}
          />
          <Label htmlFor="search-type">
            {searchType === 'projects' ? 'Products' : 'Users'}
          </Label>
        </div>
      </div>


      {searchType === 'projects' && (
        <>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Price Type</h3>
            <RadioGroup value={priceType} onValueChange={setPriceType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-price" />
                <Label htmlFor="all-price">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Fixed Price</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bid" id="bid" />
                <Label htmlFor="bid">Bid-based</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Price Range</h3>
            <Slider
              min={0}
              max={10000}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div className="space-y-4 pb-4">
            <h3 className="font-semibold text-lg">Product Types</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {projectTypes.map(type => (
                <div key={type} className="flex items-center">
                  <Checkbox
                    id={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={(checked) => toggleProjectType(type)}
                  />
                  <label htmlFor={type} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Header
        setIsOpen={() => { }}
        avatar={currentUser.profilePic}
        userId={currentUser.userId}
        onFilterClick={() => setIsMobileFilterOpen(true)}
        onMenuClick={() => setIsMobileSidebarOpen(true)}
        currentPage={pathname}
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        isLoggedIn={currentUser.userId != null}
        isPremium={currentUser.isPremium}
      />

      {/* <ChatMenuButton isDarkTheme={isDarkTheme} /> */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar for desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <Card className={`${isDarkTheme ? 'bg-white/5 text-white border-white/10' : 'bg-black/5 text-black border-black/10'}`}>
              <CardContent className="p-6">
                {renderSidebar()}
              </CardContent>
            </Card>
          </div>

          {/* Mobile Filter Sheet */}
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetContent side="left" className={`w-[300px] sm:w-[400px] ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
              <Button
                onClick={() => setIsMobileFilterOpen(false)}
                className="absolute right-2 top-2"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="mt-6">
                {renderSidebar()}
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile Sidebar Sheet */}
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetContent side="right" className={`w-[300px] sm:w-[400px] ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
              <Button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute right-2 top-2"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-lg">Menu</h3>
                <nav className="space-y-2">
                  <Link href="/ranking" className={`block ${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>Ranking</Link>
                  <Link href="/submit-project" className={`block ${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>Submit Project</Link>
                  <Link href="https://discord.com/events/1311022452801011802/1311064914139545691" className={`block ${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>Events</Link>
                  <Link href="https://discord.gg/JHkhrCjD" className={`block ${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>Discord</Link>
                  <Link href={`/user/${currentUser.userId}`} className={`block ${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>Profile</Link>
                  <Link href="/about-us" className={`block ${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'} transition-colors`}>About Us</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Search Results */}
          <div className="lg:w-3/4 space-y-6">
            <h2 className="text-xl font-bold">Products <Badge variant="outline" className="text-yellow-400 border-yellow-400">Trending 🔥</Badge></h2>
            <div className="grid gap-6">
              <AnimatePresence>
                {searchType === 'projects' ? (
                  filteredProjects.length > 0 ? filteredProjects.map(project => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className={`${isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} hover:border-yellow-400/50 transition-colors`}>
                        <Link href={`/product/${project.id}`}>
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div className="space-y-2 flex-1">
                                <Badge className={`${isDarkTheme ? 'bg-yellow-400/30 text-yellow-400 hover:bg-yellow-400/30' : 'bg-yellow-400/30 text-black hover:bg-yellow-400/30'}`}>
                                  {project.type}
                                </Badge>
                                <h3 className={`text-xl ${isDarkTheme ? 'text-white/70' : 'text-black/70'} font-semibold`}>{project.title}</h3>
                                <p className={isDarkTheme ? 'text-white/70' : 'text-black/70'}>{truncateDescription(project.description)}</p>
                              </div>
                              {project.projectStatus === 'selling' ? (
                                <Badge variant="outline" className={project.priceType === 'fixed' ? "text-green-400 border-green-400" : "text-yellow-400 border-yellow-400"}>
                                  {project.priceType === 'fixed' ? `$${project.price}` : 'Bid'}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-blue-400 border-blue-400">
                                  Showcase
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Link>

                        <CardFooter className={`p-6 ${isDarkTheme ? 'bg-white/5' : 'bg-black/5'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer relative">
                                <img src={project.profilePic || '/placeholder-user.jpg'} alt={project.author} className="object-cover w-full h-full" />
                              </div>
                              <Link href={`/user/${project.authorId}`}>
                                <span className={`text-sm ${project.authorUsernameEffect} ${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>{project.author}</span>
                              </Link>
                              {project.authorStatusEmoji && (
                                <span className="ml-2">{renderTextWithEmojis(project.authorStatusEmoji, emojis)}</span>
                              )}
                            </div>
                            <div className={`text-sm ${isDarkTheme ? 'text-white/50' : 'text-black/50'}`}>
                              {project.views} views • Uploaded at {new Date(project.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className={isDarkTheme ? 'text-white' : 'text-black'}>
                            <Link href={`/product/${project.id}`}>
                              <Button variant="ghost" size="icon" className={`hover:bg-${isDarkTheme ? 'white' : 'black'}/10 hover:text-${isDarkTheme ? 'white' : 'black'}`}>
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`hover:bg-${isDarkTheme ? 'white' : 'black'}/10 hover:text-${isDarkTheme ? 'white' : 'black'}`}
                              onClick={() => handleShare(project.id)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                    : (
                      <div className={`text-center ${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>No projects found</div>
                    )
                ) : users.length > 0 ? (
                  users.map(user => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={`/user/${user.id}`}>
                        <Card className={`${isDarkTheme ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'} hover:border-yellow-400/50 transition-colors`}>
                          <CardContent className="p-6 flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden">
                              <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className={`${user.usernameEffect} text-xl font-semibold`}>{user.username}</span>
                              {user.statusEmoji && (
                                <span className='ml-2'>{renderTextWithEmojis(user.statusEmoji, emojis)}</span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className={`text-center ${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>No users found</div>
                )}
              </AnimatePresence>
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
              </div>
            )}

            {/* Intersection observer target */}
            {searchType === 'projects' && hasMore && (
              <div className='justify-center items-center text-center'>
                <Button
                  onClick={fetchProjects}
                  className={`w-full mt-4 ${isDarkTheme ? 'bg-yellow-400 hover:bg-yellow-500 w-30 justify-center items-center text-center text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}