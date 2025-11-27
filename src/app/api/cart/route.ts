import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionId, getUserId } from '@/lib/session'

export const runtime = 'nodejs'

// GET /api/cart - Get user's cart
export async function GET() {
  try {
    const userId = await getUserId()
    const sessionId = await getSessionId()
    
    // For authenticated users, use userId; for guests, use sessionId
    const cartItems = await prisma.cartItem.findMany({
      where: userId 
        ? { userId }
        : { sessionId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ items: cartItems })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    const sessionId = await getSessionId()
    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if item already exists (for authenticated or guest)
    const existingItem = userId
      ? await prisma.cartItem.findUnique({
          where: {
            userId_productId: {
              userId,
              productId: Number(productId),
            },
          },
        })
      : await prisma.cartItem.findUnique({
          where: {
            sessionId_productId: {
              sessionId,
              productId: Number(productId),
            },
          },
        })

    if (existingItem) {
      // Update quantity
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
      return NextResponse.json(updated)
    } else {
      // Create new item
      const newItem = await prisma.cartItem.create({
        data: {
          sessionId: userId ? undefined : sessionId,
          userId: userId || undefined,
          productId: Number(productId),
          quantity,
        },
      })
      return NextResponse.json(newItem)
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remove item from cart
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

    await prisma.cartItem.deleteMany({
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
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}

// PATCH /api/cart - Update cart item quantity
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId()
    const sessionId = await getSessionId()
    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.deleteMany({
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
      return NextResponse.json({ success: true, removed: true })
    }

    const existingItem = userId
      ? await prisma.cartItem.findUnique({
          where: {
            userId_productId: {
              userId,
              productId: Number(productId),
            },
          },
        })
      : await prisma.cartItem.findUnique({
          where: {
            sessionId_productId: {
              sessionId,
              productId: Number(productId),
            },
          },
        })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

