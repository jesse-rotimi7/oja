import { cookies } from 'next/headers'
import { auth } from '@/auth'

/**
 * Get session ID for guest users or user ID for authenticated users
 * This allows cart/orders to work with or without authentication
 */
export async function getSessionId(): Promise<string> {
  // Check if user is authenticated
  const session = await auth()
  
  if (session?.user?.id) {
    // Return user ID for authenticated users
    return session.user.id
  }

  // For guest users, use session ID from cookies
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('session-id')?.value

  if (!sessionId) {
    // Generate a simple session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    cookieStore.set('session-id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
  }

  return sessionId
}

/**
 * Get user ID if authenticated, null otherwise
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id || null
}

