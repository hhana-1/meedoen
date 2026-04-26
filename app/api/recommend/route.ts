import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'jobseeker') {
    return NextResponse.json([])
  }

  // Get categories the user has applied to
  const appliedJobs = await prisma.application.findMany({
    where: { userId: session.userId },
    include: { jobListing: { select: { category: true } } },
    take: 20,
  })

  const categories = [...new Set(appliedJobs.map(a => a.jobListing.category).filter(Boolean))]

  let recommended = await prisma.jobListing.findMany({
    where: {
      active: true,
      ...(categories.length > 0 ? { category: { in: categories as string[] } } : {}),
      applications: { none: { userId: session.userId } },
    },
    include: {
      employer: { select: { companyName: true, verified: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  // Fall back to recent jobs if no matches
  if (recommended.length === 0) {
    recommended = await prisma.jobListing.findMany({
      where: { active: true, applications: { none: { userId: session.userId } } },
      include: { employer: { select: { companyName: true, verified: true } } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
  }

  return NextResponse.json(recommended)
}
