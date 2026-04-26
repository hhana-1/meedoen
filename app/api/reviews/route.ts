import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { moderateContent } from '@/lib/moderation'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const toUserId = searchParams.get('toUserId')
  if (!toUserId) return NextResponse.json({ error: 'Missing toUserId' }, { status: 400 })

  const reviews = await prisma.review.findMany({
    where: { toUserId, flagged: false },
    include: {
      from: { select: { id: true, role: true, employerProfile: { select: { companyName: true } }, jobSeekerProfile: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(reviews)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { toUserId, rating, comment } = await req.json()
  if (!toUserId || rating === undefined || !comment) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (rating < 0 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be 0–5' }, { status: 400 })
  }
  if (toUserId === session.userId) {
    return NextResponse.json({ error: 'Cannot review yourself' }, { status: 400 })
  }

  const mod = moderateContent(comment)
  const flagged = mod.flagged

  const review = await prisma.review.create({
    data: {
      fromUserId: session.userId,
      toUserId,
      rating: Math.round(rating),
      comment,
      flagged,
    },
  })
  return NextResponse.json(review, { status: 201 })
}
