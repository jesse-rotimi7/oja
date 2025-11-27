import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionId, getUserId } from '@/lib/session'

export const runtime = 'nodejs'

// GET /api/orders - Get user's orders
export async function GET() {
  try {
    const userId = await getUserId()
    const sessionId = await getSessionId()
    
    const orders = await prisma.order.findMany({
      where: userId ? { userId } : { sessionId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    const sessionId = await getSessionId()
    const body = await request.json()
    const { items, email, name, address } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )

    // Create order with items
    const order = await prisma.order.create({
      data: {
        sessionId,
        userId: userId || undefined,
        total,
        email,
        name,
        address,
        status: 'pending',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Clear cart after order is created
    await prisma.cartItem.deleteMany({
      where: userId
        ? {
            userId,
          }
        : { sessionId },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

