import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await prisma.serviceListing.findUnique({
    where: { id },
    include: {
      profile: {
        select: {
          id: true,
          picture: true,
          bio: true,
          age: true,
          hoursPerWeek: true,
          shifts: true,
          languages: true,
          user: { select: { id: true } },
        },
      },
    },
  })
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(service)
}
