import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionId, getUserId } from '@/lib/session'
import { Prisma } from '@prisma/client'

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
    // Get session info first
    let userId: string | null = null
    let sessionId: string = ''
    
    try {
      userId = await getUserId()
      sessionId = await getSessionId()
      
      if (!sessionId || sessionId.trim() === '') {
        console.error('Invalid sessionId:', sessionId)
        return NextResponse.json(
          { error: 'Failed to get valid session' },
          { status: 401 }
        )
      }
    } catch (sessionError) {
      console.error('Error getting session:', sessionError)
      return NextResponse.json(
        { error: 'Failed to authenticate session' },
        { status: 401 }
      )
    }

    // Parse request body
    let body: {
      items?: Array<{
        productId: number
        title: string
        price: number
        quantity: number
        image?: string
      }>
      email?: string
      name?: string
      address?: string
    }
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request body. Expected JSON.' },
        { status: 400 }
      )
    }

    const { items, email, name, address } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      )
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'number') {
        return NextResponse.json(
          { error: 'Each item must have a valid productId' },
          { status: 400 }
        )
      }
      if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
        return NextResponse.json(
          { error: 'Each item must have a valid title' },
          { status: 400 }
        )
      }
      if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
        return NextResponse.json(
          { error: 'Each item must have a valid price greater than 0' },
          { status: 400 }
        )
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Each item must have a valid quantity greater than 0' },
          { status: 400 }
        )
      }
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )

    if (total <= 0 || !isFinite(total)) {
      return NextResponse.json(
        { error: 'Invalid order total. Please check item prices and quantities.' },
        { status: 400 }
      )
    }

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
          create: items.map((item: { productId: number; title: string; price: number; quantity: number; image?: string }) => ({
            productId: item.productId,
            title: item.title.trim(),
            price: item.price,
            quantity: item.quantity,
            image: item.image || undefined,
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
    // Log full error details for debugging
    console.error('Error creating order:', {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return NextResponse.json(
            { error: 'A record with this information already exists' },
            { status: 409 }
          )
        case 'P2003':
          return NextResponse.json(
            { error: 'Invalid reference in order data' },
            { status: 400 }
          )
        case 'P2011':
          return NextResponse.json(
            { error: 'Missing required field in order data' },
            { status: 400 }
          )
        case 'P2012':
          return NextResponse.json(
            { error: 'Missing required value in order data' },
            { status: 400 }
          )
        default:
          console.error('Prisma error code:', error.code, error.message)
          return NextResponse.json(
            { 
              error: process.env.NODE_ENV === 'development' 
                ? `Database error: ${error.message}` 
                : 'Failed to create order due to database error'
            },
            { status: 500 }
          )
      }
    }
    
    // Handle Prisma validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Prisma validation error:', error.message)
      return NextResponse.json(
        { 
          error: process.env.NODE_ENV === 'development' 
            ? `Validation error: ${error.message}` 
            : 'Invalid order data provided'
        },
        { status: 400 }
      )
    }
    
    // Handle generic errors
    if (error instanceof Error) {
      // Check for common error patterns
      if (error.message.includes('Unique constraint') || error.message.includes('duplicate')) {
        return NextResponse.json(
          { error: 'An order with this information already exists' },
          { status: 409 }
        )
      }
      if (error.message.includes('Foreign key') || error.message.includes('constraint')) {
        return NextResponse.json(
          { error: 'Invalid reference in order data' },
          { status: 400 }
        )
      }
      if (error.message.includes('Required') || error.message.includes('missing')) {
        return NextResponse.json(
          { error: 'Missing required fields in order data' },
          { status: 400 }
        )
      }
      
      // Return detailed error in development
      return NextResponse.json(
        { 
          error: process.env.NODE_ENV === 'development' 
            ? `Failed to create order: ${error.message}` 
            : 'Failed to create order. Please check your order data and try again.'
        },
        { status: 500 }
      )
    }
    
    // Unknown error
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    )
  }
}

