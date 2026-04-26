import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const employer = await prisma.employerProfile.findUnique({
    where: { id },
    include: {
      jobListings: {
        where: { active: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      user: { select: { id: true } },
    },
  })
  if (!employer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(employer)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const employer = await prisma.employerProfile.findUnique({ where: { id } })
  if (!employer || employer.userId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { description, website, phone, address } = body

  const updated = await prisma.employerProfile.update({
    where: { id },
    data: {
      description: description ?? undefined,
      website: website ?? undefined,
      phone: phone ?? undefined,
      address: address ?? undefined,
    },
  })
  return NextResponse.json(updated)
}
