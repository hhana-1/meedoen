import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'jobseeker') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { coverLetter } = await req.json().catch(() => ({}))

  const existing = await prisma.application.findFirst({
    where: { jobListingId: id, userId: session.userId },
  })
  if (existing) return NextResponse.json({ error: 'Already applied' }, { status: 409 })

  const application = await prisma.application.create({
    data: {
      jobListingId: id,
      userId: session.userId,
      coverLetter: coverLetter || null,
      status: 'applied',
      stage: 'applied',
    },
  })
  return NextResponse.json(application, { status: 201 })
}
