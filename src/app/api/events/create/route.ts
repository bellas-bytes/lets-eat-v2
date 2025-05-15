import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isApproved) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const { title, imageUrl, description, location, date } = data

  const event = await prisma.event.create({
    data: {
      title,
      imageUrl,
      description,
      location,
      date: new Date(date),
      createdBy: { connect: { id: session.user.id } },
    },
  })

  return NextResponse.json(event)
}
