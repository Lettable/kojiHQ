'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, FileText, ImageIcon, Paperclip, Video } from 'lucide-react'
import Header from '@/partials/Header'
import ReactMarkdown from 'react-markdown'
import { jwtDecode } from 'jwt-decode'
import uploadFile from '@/lib/utils/UploadFile'
import { Suspense } from 'react'

export default function CreateThread() {
    const searchParams = useSearchParams()
    const [currentUser, setCurrentUser] = useState(null)
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const [forums, setForums] = useState([])
    const [selectedForum, setSelectedForum] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [attachments, setAttachments] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authToken, setAuthToken] = useState('');
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const getCurrentUser = () => {
            const token = localStorage.getItem('accessToken');
            setAuthToken(token)
            if (token) {
                const decodedToken = jwtDecode(token);
                setCurrentUser(decodedToken);
                setIsLoggedIn(true);
            } else {
                setCurrentUser(null);
                setIsLoggedIn(false);
            }
        }
        const fetchForums = async () => {
            try {
                const response = await fetch('/api/forum', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": `Bearer ${authToken}`,
                    },
                })
                if (!response.ok) {
                    throw new Error('Failed to fetch forums')
                }
                const data = await response.json()
                setForums(data)
            } catch (error) {
                console.error('Error fetching forums:', error)
            }
        }

        getCurrentUser()
        fetchForums()


        const forumId = searchParams.get('forumId')
        if (forumId) {
            fetchForumById(forumId)
        }

        const storedTheme = localStorage.getItem('theme')
        setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true)
    }, [searchParams, authToken])

    const fetchForumById = async (id) => {
        try {
            const response = await fetch(`/api/forum?forumId=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `Bearer ${authToken}`,
                },
            })
            if (!response.ok) {
                throw new Error('Failed to fetch forum')
            }
            const forum = await response.json()
            setSelectedForum(forum._id)
            setSelectedCategory(forum.category)
        } catch (error) {
            console.error('Error fetching forum by ID:', error)
        }
    }

    const handleForumChange = (value) => {
        setSelectedForum(value)
        const forum = forums.find(f => f._id === value)
        if (forum) {
            setSelectedCategory(forum.category)
        }
    }
    
    function forumFallBack() {
        return <div className="flex items-center justify-center h-screen bg-black text-white text-2xl font-bold">Loading...</div>;
    }

    const handleCategoryChange = (value) => {
        setSelectedCategory(value)
        setSelectedForum('')
    }

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files)
        setAttachments(files)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            const uploadPromises = attachments.map(async (file) => {
                try {
                    const fileDetails = await uploadFile(file)
                    return { fileName: fileDetails.fileName, fileUrl: fileDetails.fileUrl, fileType: fileDetails.fileType }
                } catch (error) {
                    console.error('Error uploading file:', error)
                    return null
                }
            })

            const uploadedFiles = await Promise.all(uploadPromises)

            const threadData = {
                userId: currentUser ? currentUser.userId : null,
                forumId: selectedForum,
                title: title.trim(),
                content: content.trim(),
                attachments: uploadedFiles.filter(Boolean).map(file => ({
                    fileName: file.fileName,
                    fileUrl: file.fileUrl,
                    fileType: file.fileType,
                })),
            }

            const response = await fetch('/api/thread', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(threadData)
            })

            if (!response.ok) {
                throw new Error('Failed to create thread')
            }

            const newThread = await response.json()
            router.push(`/thread?id=${newThread._id}`)
        } catch (error) {
            console.error('Error creating thread:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleTheme = () => {
        const newTheme = !isDarkTheme
        setIsDarkTheme(newTheme)
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    }

    const categories = [...new Set(forums.map(forum => forum.category))]

    return (
        <Suspense fallback={<forumFallBack />}>
        <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header
                avatar={currentUser && currentUser.profilePic}
                userId={currentUser && currentUser.userId}
                currentPage='/create-thread'
                isDarkTheme={isDarkTheme}
                toggleTheme={toggleTheme}
                isLoggedIn={isLoggedIn}
            />

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-3/4">
                        <h1 className="text-3xl font-bold mb-6">Create New Thread</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="category" className="block text-sm font-medium mb-1">Select Category*</label>
                                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                    <SelectTrigger id="category" className={`w-full ${isDarkTheme ? 'bg-zinc-800 border-0 text-white' : 'border-0 border-black text-black'}`}>
                                        <SelectValue placeholder="Choose a category" />
                                    </SelectTrigger>
                                    <SelectContent className={isDarkTheme ? 'bg-zinc-800 border-0 text-white' : ' border-black border-0 text-black'}>
                                        {categories.map((category) => (
                                            <SelectItem className='border-0' key={category} value={category}>{category}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="forum" className="block text-sm font-medium mb-1">Select Forum*</label>
                                <Select value={selectedForum} onValueChange={handleForumChange}>
                                    <SelectTrigger id="forum" className={`w-full ${isDarkTheme ? 'bg-zinc-800 border-0 text-white' : 'bg-white text-black'}`}>
                                        <SelectValue placeholder="Choose a forum" />
                                    </SelectTrigger>
                                    <SelectContent className={isDarkTheme ? 'bg-zinc-800 border-0 text-white' : 'bg-white text-black'}>
                                        {forums
                                            .filter(forum => forum.category === selectedCategory)
                                            .map((forum) => (
                                                <SelectItem className='border-0' key={forum._id} value={forum._id}>{forum.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium mb-1">Title*</label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`w-full ${isDarkTheme ? 'bg-zinc-800 border-0 text-white' : 'border border-black text-black'}`}
                                    placeholder="Enter thread title"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="content" className="block text-sm font-medium mb-1">Content*</label>
                                <Tabs defaultValue="write" className="w-full">
                                    <TabsList className={`grid w-full grid-cols-2 ${isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                        <TabsTrigger value="write">Write</TabsTrigger>
                                        <TabsTrigger value="preview">Preview</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="write">
                                        <Textarea
                                            id="content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className={`w-full h-64 ${isDarkTheme ? 'bg-zinc-800 border-0 text-white' : 'bg-white border-0 text-black'}`}
                                            placeholder="Write your thread content here (Markdown supported)"
                                        />
                                    </TabsContent>
                                    <TabsContent value="preview">
                                        <ScrollArea className={`w-full h-64 p-4 rounded-md ${isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                            <ReactMarkdown>{content}</ReactMarkdown>
                                        </ScrollArea>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="attachments" className="block text-sm font-medium mb-1">Attachments</label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="attachments"
                                        type="file"
                                        onChange={handleFileChange}
                                        className={`w-full file:text-white file:mt-1 text-white fill-white ${isDarkTheme ? 'bg-zinc-800 border-0 text-white' : 'bg-white border-0 text-black'}`}
                                        multiple
                                    />
                                    <Button type="button" onClick={() => document.getElementById('attachments').click()}>
                                        <Paperclip className="text-white w-4 h-4 mr-2" />
                                        Attach Files
                                    </Button>
                                </div>
                                {attachments.length > 0 && (
                                    <div className="mt-2 text-white border-0 space-y-2">
                                        {attachments.map((file, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                {file.type.startsWith('image/') ? (
                                                    <ImageIcon className="w-4 h-4" />
                                                ) : file.type.startsWith('video/') ? (
                                                    <Video className="w-4 h-4" />
                                                ) : (
                                                    <FileText className="w-4 h-4" />
                                                )}
                                                <span>{file.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className={`w-full ${isDarkTheme ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Thread...' : 'Create Thread'}
                            </Button>
                        </form>
                    </div>

                    {/* Right side - Sidebar */}
                    <div className="lg:w-1/4 space-y-6">
                        <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
                            <CardHeader>
                                <CardTitle className="text-lg">Posting Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>Be respectful and constructive</li>
                                    <li>Stay on topic and avoid spam</li>
                                    <li>Use clear and concise titles</li>
                                    <li>Format your content for readability</li>
                                    <li>Check for existing threads before posting</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
                            <CardHeader>
                                <CardTitle className="text-lg">Markdown Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>**Bold** for bold text</li>
                                    <li>*Italic* for italic text</li>
                                    <li>`Code` for inline code</li>
                                    <li>- Item for unordered lists</li>
                                    <li>[Link](URL) for hyperlinks</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className={`${isDarkTheme ? 'bg-zinc-900/50 text-white' : 'bg-white text-black'} border-0 shadow-lg`}>
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    Need Help?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    If you need assistance or have questions about creating a thread, please visit our Help Center or contact a moderator.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
        </Suspense>
    )
}