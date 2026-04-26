import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ user: null }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      employerProfile: { select: { id: true, companyName: true, verified: true } },
      jobSeekerProfile: { select: { id: true } },
    },
  })
  if (!user) return NextResponse.json({ user: null }, { status: 401 })

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      language: user.language,
      employerProfile: user.employerProfile,
      jobSeekerProfile: user.jobSeekerProfile,
    },
  })
}
