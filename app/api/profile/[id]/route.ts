import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const profile = await prisma.jobSeekerProfile.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      picture: true,
      bio: true,
      age: true,
      experience: true,
      education: true,
      languages: true,
      hoursPerWeek: true,
      shifts: true,
      linkedin: true,
      instagram: true,
      twitter: true,
      facebook: true,
      nationality: true,
      // phone, vnr, docNumber, docValidUntil intentionally excluded from public view
      services: true,
      user: { select: { id: true, email: true } },
    },
  })
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(profile)
}
