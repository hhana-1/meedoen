import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || ''

  const services = await prisma.serviceListing.findMany({
    where: {
      active: true,
      approved: true,
      ...(type ? { serviceType: type } : {}),
    },
    include: {
      profile: {
        select: {
          id: true,
          picture: true,
          bio: true,
          user: { select: { id: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'jobseeker') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { serviceType, description } = await req.json()
  if (!serviceType) return NextResponse.json({ error: 'Missing service type' }, { status: 400 })

  const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId: session.userId } })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const existing = await prisma.serviceListing.findFirst({
    where: { profileId: profile.id, serviceType },
  })
  if (existing) return NextResponse.json({ error: 'Service already listed' }, { status: 409 })

  const service = await prisma.serviceListing.create({
    data: { profileId: profile.id, serviceType, description: description || null },
  })
  return NextResponse.json(service, { status: 201 })
}
