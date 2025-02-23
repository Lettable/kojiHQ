"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.memo(React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full select-none",
      "transition-none",
      "bg-transparent",
      className
    )}
    {...props} />
)));
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.memo(React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full select-none",
      "transition-none",
      "bg-transparent",
      className
    )}
    loading="eager"
    decoding="async"
    {...props} />
)));
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.memo(React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full select-none",
      "transition-none",
      "bg-transparent",
      className
    )}
    delayMs={0}
    {...props} />
)));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
