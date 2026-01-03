import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEmbedUrl(url: string | null | undefined): string {
  if (!url) return ""

  // Vimeo
  if (url.includes("vimeo.com")) {
    const vimeoId = url.split("vimeo.com/")[1]?.split("/")[0]?.split("?")[0]
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`
    }
  }

  // YouTube
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v")
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }

  return url
}
