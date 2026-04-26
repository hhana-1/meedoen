import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await prisma.jobListing.findUnique({
    where: { id },
    include: {
      employer: {
        select: { id: true, companyName: true, verified: true, logo: true, description: true, userId: true, orgType: true },
      },
      _count: { select: { applications: true } },
    },
  })
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(job)
}
