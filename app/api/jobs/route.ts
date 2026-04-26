import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { moderateContent } from '@/lib/moderation'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const jobType = searchParams.get('jobType') || ''

  const jobs = await prisma.jobListing.findMany({
    where: {
      active: true,
      ...(search ? { OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ]} : {}),
      ...(category ? { category } : {}),
      ...(jobType ? { jobType } : {}),
    },
    include: {
      employer: {
        select: { companyName: true, verified: true, logo: true, userId: true },
      },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const employerUserIds = [...new Set(jobs.map(j => j.employer.userId))]
  const ratingAggs = employerUserIds.length > 0
    ? await prisma.review.groupBy({
        by: ['toUserId'],
        _avg: { rating: true },
        _count: { rating: true },
        where: { toUserId: { in: employerUserIds }, flagged: false },
      })
    : []
  const ratingMap = Object.fromEntries(
    ratingAggs.map(r => [r.toUserId, { avg: r._avg.rating, count: r._count.rating }])
  )
  const jobsWithRatings = jobs.map(j => ({
    ...j,
    employer: {
      ...j.employer,
      avgRating: ratingMap[j.employer.userId]?.avg ?? null,
      reviewCount: ratingMap[j.employer.userId]?.count ?? 0,
    },
  }))
  return NextResponse.json(jobsWithRatings)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, requirements, location, hoursPerWeek, shifts, salaryMin, salaryMax, category, jobType } = body

  if (!title || !description) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const mod = moderateContent(title + ' ' + description)
  if (mod.flagged) return NextResponse.json({ error: 'Content flagged: ' + mod.reason }, { status: 422 })

  const employer = await prisma.employerProfile.findUnique({ where: { userId: session.userId } })
  if (!employer) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const job = await prisma.jobListing.create({
    data: {
      employerId: employer.id,
      title,
      description,
      requirements: requirements ? JSON.stringify(requirements) : null,
      location: location || null,
      hoursPerWeek: hoursPerWeek || null,
      shifts: shifts ? JSON.stringify(shifts) : null,
      salaryMin: salaryMin || null,
      salaryMax: salaryMax || null,
      category: category || null,
      jobType: jobType || 'regular',
    },
  })
  return NextResponse.json(job, { status: 201 })
}
