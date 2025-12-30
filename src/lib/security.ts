import { headers } from 'next/headers'

type RateLimitStore = Map<string, { count: number; expiresAt: number }>

const rateLimitStore: RateLimitStore = new Map()

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
        if (value.expiresAt < now) {
            rateLimitStore.delete(key)
        }
    }
}, 5 * 60 * 1000)

export async function checkRateLimit(identifier: string, limit: number = 5, windowSeconds: number = 60): Promise<boolean> {
    const now = Date.now()
    const windowMs = windowSeconds * 1000

    // Attempt to get IP if check is ip-based (optional)
    // identifier usually is "action:email" or "action:ip"

    const record = rateLimitStore.get(identifier)

    if (!record) {
        rateLimitStore.set(identifier, { count: 1, expiresAt: now + windowMs })
        return true
    }

    if (now > record.expiresAt) {
        rateLimitStore.set(identifier, { count: 1, expiresAt: now + windowMs })
        return true
    }

    if (record.count >= limit) {
        return false
    }

    record.count += 1
    return true
}

export async function getClientIp() {
    const headersList = await headers()
    // X-Forwarded-For is usually the best bet in Vercel/Next.js
    const forwardedFor = headersList.get('x-forwarded-for')
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim()
    }
    // Fallback?
    return "unknown"
}
