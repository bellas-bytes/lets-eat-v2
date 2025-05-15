import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await prisma.teamMember.findMany()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isApproved) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const newMember = await prisma.teamMember.create({
    data: {
      ...body,
      addedBy: { connect: { id: session.user.id } },
    },
  })
  return NextResponse.json(newMember)
}
