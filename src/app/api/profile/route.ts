import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const profileSelect = {
  id: true,
  email: true,
  name: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: profileSelect,
  })

  return NextResponse.json({ profile: user })
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    name,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
  } = body

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    },
    select: profileSelect,
  })

  return NextResponse.json({ profile: updated })
}





