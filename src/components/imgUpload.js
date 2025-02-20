"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ImageIcon, Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ImageUploader({ onImageUpload, isDarkTheme }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  async function uploadImage(base64Image) {
    const API_KEY = "dcf61c7abd01f1d764140f9cdb3d36cc"
    const IMG_API_URL = `https://api.imgbb.com/1/upload?key=${API_KEY}`

    try {
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "")
      const formData = new FormData()
      formData.append("image", base64Data)

      const response = await fetch(IMG_API_URL, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (result.success) {
        return result.data.url
      } else {
        throw new Error(result.status || "Image upload failed")
      }
    } catch (error) {
      throw new Error("Error uploading image")
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      await handleUpload(file)
    }
  }

  const handleDrop = async (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      await handleUpload(file)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
    }
  }

  const handleUpload = async (file) => {
    setIsUploading(true)
    setUploadProgress(0)
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const base64Image = e.target?.result
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval)
              return prev
            }
            return prev + 10
          })
        }, 100)

        const imageUrl = await uploadImage(base64Image)
        clearInterval(interval)
        setUploadProgress(100)
        const markdown = `![uploaded-image](${imageUrl})`
        onImageUpload(markdown)
        setIsOpen(false)
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "There was an error uploading your image. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="icon"
        className={`text-white hover:text-white hover:bg-white/10 ${
          isDarkTheme ? "bg-white/0" : "bg-white text-black border-zinc-500 hover:text-black hover:bg-zinc-200"
        }`}
      >
        <ImageIcon className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`sm:max-w-md ${isDarkTheme ? "bg-zinc-900 text-white" : "bg-white text-black"}`}>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div
            className={`mt-4 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragging
                ? "border-yellow-500 bg-yellow-500/10"
                : isDarkTheme
                  ? "border-zinc-700 hover:border-yellow-500/50"
                  : "border-zinc-300 hover:border-yellow-500/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            {isUploading ? (
              <div className="w-full space-y-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-center text-sm">Uploading... {uploadProgress}%</p>
              </div>
            ) : (
              <>
                <Upload className={`h-10 w-10 ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`} />
                <p className={`mt-2 text-sm ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`}>
                  Drag and drop an image, or click to select
                </p>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mt-4">
                  Select Image
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

