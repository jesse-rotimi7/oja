import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionId, getUserId } from '@/lib/session'

export const runtime = 'nodejs'

// GET /api/favorites - Get user's favorites
export async function GET() {
  try {
    const userId = await getUserId()
    const sessionId = await getSessionId()
    
    const favorites = await prisma.favorite.findMany({
      where: userId ? { userId } : { sessionId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    const sessionId = await getSessionId()
    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if already favorited
    const existing = userId
      ? await prisma.favorite.findUnique({
          where: {
            userId_productId: {
              userId,
              productId: Number(productId),
            },
          },
        })
      : await prisma.favorite.findUnique({
          where: {
            sessionId_productId: {
              sessionId,
              productId: Number(productId),
            },
          },
        })

    if (existing) {
      return NextResponse.json(existing)
    }

    const favorite = await prisma.favorite.create({
      data: {
        sessionId: userId ? undefined : sessionId,
        userId: userId || undefined,
        productId: Number(productId),
      },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId()
    const sessionId = await getSessionId()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    await prisma.favorite.deleteMany({
      where: userId
        ? {
            userId,
            productId: Number(productId),
          }
        : {
            sessionId,
            productId: Number(productId),
          },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}

