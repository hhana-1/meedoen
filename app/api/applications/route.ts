import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.role === 'jobseeker') {
    const apps = await prisma.application.findMany({
      where: { userId: session.userId },
      include: {
        jobListing: {
          select: {
            id: true,
            title: true,
            location: true,
            category: true,
            employer: { select: { companyName: true, id: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(apps)
  }

  // Employer: applications to their jobs
  const employer = await prisma.employerProfile.findUnique({ where: { userId: session.userId } })
  if (!employer) return NextResponse.json([])

  const apps = await prisma.application.findMany({
    where: { jobListing: { employerId: employer.id } },
    include: {
      jobListing: { select: { id: true, title: true } },
      user: {
        select: {
          id: true,
          email: true,
          jobSeekerProfile: { select: { id: true, name: true, picture: true, bio: true, age: true, phone: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(apps)
}
