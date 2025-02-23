'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, FileText, ImageIcon, Paperclip, Video, X } from 'lucide-react'
import Header from '@/partials/Header'
import ReactMarkdown from 'react-markdown'
import { jwtDecode } from 'jwt-decode'
import uploadFile from '@/lib/utils/UploadFile'
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import MarkdownWithEmojis from '@/partials/MarkdownWithEmojis'
import EnhancedEmojiPicker from '@/components/EmojiPicker'
import Link from 'next/link'
import { ChevronLeft, Send, Code2, Smile } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'

export default function CreateThread() {
    const [currentUser, setCurrentUser] = useState(null)
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [forums, setForums] = useState([])
    const [selectedForum, setSelectedForum] = useState('')
    const [selectedSubcategory, setSelectedSubcategory] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [attachments, setAttachments] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authToken, setAuthToken] = useState('');
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const getCurrentUser = () => {
            const token = localStorage.getItem('accessToken');
            setAuthToken(token)
            if (token) {
                const decodedToken = jwtDecode(token);
                setCurrentUser(decodedToken);
                setIsLoggedIn(true);
            } else {
                toast({
                    title: "Warning",
                    description: "You are not logged In.",
                    variant: "destructive",
                })
                setCurrentUser(null);
                setIsLoggedIn(false);
            }
        }
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/home-forum', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": `Bearer ${authToken}`,
                    },
                })
                if (!response.ok) {
                    throw new Error('Failed to fetch categories')
                }
                const data = await response.json()
                setCategories(data)
                
                const forumId = pathname.split('/').pop()
                if (forumId) {
                    for (const category of data) {
                        for (const subcategory of category.subcategories) {
                            const forum = subcategory.forums.find(f => f._id === forumId)
                            if (forum) {
                                setSelectedCategory(category._id)
                                setSubcategories(category.subcategories)
                                setSelectedSubcategory(subcategory._id)
                                setForums(subcategory.forums)
                                setSelectedForum(forum._id)
                                return
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }

        getCurrentUser()
        fetchCategories()

        const storedTheme = localStorage.getItem('theme')
        setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true)
    }, [authToken, pathname, toast])

    const handleCategoryChange = (value) => {
        setSelectedCategory(value)
        setSelectedSubcategory('')
        setSelectedForum('')
        const selectedCat = categories.find(cat => cat._id === value)
        if (selectedCat) {
            setSubcategories(selectedCat.subcategories)
        }
    }

    const handleSubcategoryChange = (value) => {
        setSelectedSubcategory(value)
        setSelectedForum('')
        const selectedSub = subcategories.find(sub => sub._id === value)
        if (selectedSub) {
            setForums(selectedSub.forums)
        }
    }

    const handleForumChange = (value) => {
        setSelectedForum(value)
    }

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files)
        setAttachments(files)
    }

    const handleEmojiSelect = (emojiTitle) => {
        const editor = document.querySelector('.markdown-editor-container textarea');
        if (editor) {
            const cursorPosition = editor.selectionStart;
            const textBeforeCursor = content.slice(0, cursorPosition);
            const textAfterCursor = content.slice(cursorPosition);
    
            setContent(`${textBeforeCursor} ${emojiTitle} ${textAfterCursor}`);
        }
    };

    const handleEditorChange = ({ html, text }) => {
        setContent(text);
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        event.stopPropagation();
        setIsSubmitting(true)

        try {
            if (!currentUser) {
                toast({
                    title: "Warning",
                    description: "You are not logged In.",
                    variant: "destructive",
                })
                return
            }
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
            router.push(`/thread/${newThread._id}`)
        } catch (error) {
            console.error('Error creating thread:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        setAttachments(prev => [...prev, ...files]);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header
                avatar={currentUser && currentUser.profilePic}
                userId={currentUser && currentUser.userId}
                currentPage='/create-thread'
                isDarkTheme={isDarkTheme}
                isLoggedIn={isLoggedIn}
                isPremium={currentUser && currentUser.isPremium}
            />

            <main className="container mx-auto px-4 py-12 max-w-[65%]">
                {/* Hero Section */}
                <div className="mb-12 relative">
                    <div className="absolute -top-10 left-4 w-12 h-12 bg-yellow-500 rounded-full opacity-20 blur-lg"></div>
                    <div className="absolute -top-12 right-10 w-8 h-8 bg-pink-500 rounded-full opacity-20 blur-md"></div>
                    
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-yellow-500 transition-colors hover:text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-lg mb-6"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to Forums
                    </Link>

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mb-3">
                        Create New Thread
                    </h1>
                    <p className="text-zinc-400 text-lg">Share your thoughts and start a discussion</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Form Section */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit}>
                            <Card className="bg-zinc-900/50 backdrop-blur-lg border-white/10 mb-6">
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {/* Category Selection */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="category" className="text-sm font-medium text-zinc-400 mb-1.5">
                                                    Category*
                                                </Label>
                                                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                                    <SelectTrigger id="category" className="w-full bg-zinc-800/50 border-zinc-700/50 text-white">
                                                        <SelectValue placeholder="Choose category" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                                        {categories.map((category) => (
                                                            <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="subcategory" className="text-sm font-medium text-zinc-400 mb-1.5">
                                                    Subcategory*
                                                </Label>
                                                <Select value={selectedSubcategory} onValueChange={handleSubcategoryChange} disabled={!selectedCategory}>
                                                    <SelectTrigger id="subcategory" className="w-full bg-zinc-800/50 border-zinc-700/50 text-white">
                                                        <SelectValue placeholder="Choose subcategory" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                                        {subcategories.map((subcategory) => (
                                                            <SelectItem key={subcategory._id} value={subcategory._id}>{subcategory.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="forum" className="text-sm font-medium text-zinc-400 mb-1.5">
                                                    Forum*
                                                </Label>
                                                <Select value={selectedForum} onValueChange={handleForumChange} disabled={!selectedSubcategory}>
                                                    <SelectTrigger id="forum" className="w-full bg-zinc-800/50 border-zinc-700/50 text-white">
                                                        <SelectValue placeholder="Choose forum" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                                        {forums.map((forum) => (
                                                            <SelectItem key={forum._id} value={forum._id}>{forum.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Title Input */}
                                        <div>
                                            <Label htmlFor="title" className="text-sm font-medium text-zinc-400 mb-1.5">
                                                Title*
                                            </Label>
                                            <Input
                                                id="title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="bg-zinc-800/50 border-zinc-700/50 text-white"
                                                placeholder="Enter a descriptive title"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Content Editor */}
                            <Card className="bg-zinc-900/50 backdrop-blur-lg border-white/10 mb-6">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-sm font-medium text-zinc-400">
                                            Content*
                                        </Label>
                                        <EnhancedEmojiPicker
                                            onEmojiSelect={handleEmojiSelect}
                                            isDarkTheme={isDarkTheme}
                                        />
                                    </div>
                                    <Tabs defaultValue="write" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50 rounded-lg p-1 mb-3">
                                            <TabsTrigger 
                                                value="write"
                                                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                                            >
                                                Write
                                            </TabsTrigger>
                                            <TabsTrigger 
                                                value="preview"
                                                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                                            >
                                                Preview
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="write">
                                            <div className="markdown-editor-container">
                                                <ReactMarkdownEditorLite
                                                    value={content}
                                                    onChange={handleEditorChange}
                                                    renderHTML={text => <ReactMarkdown>{text}</ReactMarkdown>}
                                                    className="w-full min-h-[400px] bg-zinc-800/50 rounded-lg overflow-hidden border border-zinc-700/50"
                                                    config={{
                                                        view: {
                                                            menu: true,
                                                            md: true,
                                                            html: false,
                                                        },
                                                        canView: {
                                                            menu: true,
                                                            md: true,
                                                            html: false,
                                                            fullScreen: false,
                                                            hideMenu: false,
                                                        },
                                                        htmlClass: 'bg-zinc-800/50 text-white',
                                                        markdownClass: 'bg-zinc-800/50 text-white font-mono',
                                                    }}
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="preview">
                                            <ScrollArea className="h-[400px] bg-zinc-800/50 rounded-lg p-4">
                                                <MarkdownWithEmojis content={content} />
                                            </ScrollArea>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900/50 backdrop-blur-lg border-white/10 mb-6">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-sm font-medium text-zinc-400">
                                            Attachments
                                        </Label>
                                        <p className="text-xs text-zinc-500">
                                            Max size: 10MB per file
                                        </p>
                                    </div>
                                    
                                    <div
                                        onDragEnter={handleDragEnter}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`
                                            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                                            ${isDragging 
                                                ? 'border-yellow-500 bg-yellow-500/10' 
                                                : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/30'}
                                        `}
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <Paperclip className={`w-8 h-8 ${isDragging ? 'text-yellow-500' : 'text-zinc-400'}`} />
                                            <div>
                                                <p className="text-sm text-zinc-400 mb-1">
                                                    Drag & drop files here, or
                                                </p>
                                                <Button 
                                                    type="button"
                                                    onClick={() => document.getElementById('attachments').click()}
                                                    variant="outline"
                                                    className="bg-zinc-800 hover:bg-zinc-700 text-white hover:text-white/80 border-zinc-700"
                                                >
                                                    Browse Files
                                                </Button>
                                                <Input
                                                    id="attachments"
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    multiple
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attachments Preview */}
                                    {attachments.length > 0 && (
                                        <div className="mt-6 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-zinc-300">
                                                    Attached Files ({attachments.length})
                                                </h4>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setAttachments([])}
                                                    className="text-zinc-400 hover:text-white"
                                                >
                                                    Clear All
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {attachments.map((file, index) => (
                                                    <div 
                                                        key={index} 
                                                        className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {file.type.startsWith('image/') ? (
                                                                <ImageIcon className="w-4 h-4 text-blue-400" />
                                                            ) : file.type.startsWith('video/') ? (
                                                                <Video className="w-4 h-4 text-red-400" />
                                                            ) : (
                                                                <FileText className="w-4 h-4 text-yellow-400" />
                                                            )}
                                                            <div>
                                                                <p className="text-sm text-zinc-300 truncate max-w-[200px]">
                                                                    {file.name}
                                                                </p>
                                                                <p className="text-xs text-zinc-500">
                                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeAttachment(index)}
                                                            className="text-zinc-400 hover:text-white"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium h-12 rounded-xl"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating Thread...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Create Thread
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-zinc-900/50 backdrop-blur-lg border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg text-white flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                    Posting Guidelines
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {[
                                        "Be respectful and constructive",
                                        "Stay on topic and avoid spam",
                                        "Use clear and concise titles",
                                        "Format your content for readability",
                                        "Check for existing threads"
                                    ].map((guideline, index) => (
                                        <li key={index} className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                            {guideline}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 backdrop-blur-lg border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg text-white flex items-center gap-2">
                                    <Code2 className="w-5 h-5 text-yellow-500" />
                                    Markdown Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {[
                                        ["**Bold**", "Bold text"],
                                        ["*Italic*", "Italic text"],
                                        ["`Code`", "Inline code"],
                                        ["- Item", "List items"],
                                        ["[Link](URL)", "Hyperlinks"],
                                        ["![Alt](URL)", "Images"]
                                    ].map(([syntax, desc], index) => (
                                        <li key={index} className="text-sm">
                                            <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-yellow-500">{syntax}</code>
                                            <span className="text-zinc-400 ml-2">{desc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Toaster />
        </div>
    )
}