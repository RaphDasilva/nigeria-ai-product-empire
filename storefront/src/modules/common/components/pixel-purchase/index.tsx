"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
  }
}

type PixelPurchaseProps = {
  value: number
  currency: string
  contentName: string
}

export default function PixelPurchase({
  value,
  currency,
  contentName,
}: PixelPurchaseProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Purchase", {
        value,
        currency,
        content_name: contentName,
      })
    }
  }, [value, currency, contentName])

  return null
}
