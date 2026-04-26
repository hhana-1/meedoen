import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

const VALID_STAGES = ['applied', 'intake', 'trialDay', 'trialPeriod', 'contract', 'hired', 'rejected']

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const app = await prisma.application.findUnique({
    where: { id },
    include: {
      jobListing: {
        include: { employer: { select: { id: true, companyName: true, logo: true } } },
      },
      user: {
        select: {
          id: true, email: true,
          jobSeekerProfile: { select: { id: true, name: true, picture: true, bio: true, phone: true } },
        },
      },
    },
  })
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (session.role === 'jobseeker' && app.userId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (session.role === 'employer') {
    const emp = await prisma.employerProfile.findUnique({ where: { userId: session.userId } })
    if (!emp || app.jobListing.employer.id !== emp.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  return NextResponse.json(app)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { stage, notes } = await req.json()

  if (stage && !VALID_STAGES.includes(stage)) {
    return NextResponse.json({ error: 'Invalid stage' }, { status: 400 })
  }

  const app = await prisma.application.findUnique({
    where: { id },
    include: { jobListing: { select: { employer: { select: { userId: true } } } } },
  })
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (app.jobListing.employer.userId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.application.update({
    where: { id },
    data: {
      ...(stage ? { stage, status: stage } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  })
  return NextResponse.json(updated)
}
