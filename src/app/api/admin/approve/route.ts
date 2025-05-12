import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email } = await req.json()

  await prisma.user.update({
    where: { email },
    data: { isApproved: true },
  })

  return NextResponse.json({ success: true })
}
