import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { moderateContent } from '@/lib/moderation'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.jobSeekerProfile.findUnique({
    where: { userId: session.userId },
    include: { services: true },
  })
  return NextResponse.json(profile)
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'jobseeker') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, phone, vnr, dateOfBirth, nationality, docNumber, docValidUntil,
    bio, age, experience, education, languages, hoursPerWeek, shifts,
    linkedin, instagram, twitter, facebook } = body

  if (bio) {
    const mod = moderateContent(bio)
    if (mod.flagged) return NextResponse.json({ error: 'Bio contains inappropriate content' }, { status: 422 })
  }

  const profile = await prisma.jobSeekerProfile.upsert({
    where: { userId: session.userId },
    create: {
      userId: session.userId,
      name: name || null,
      phone: phone || null,
      vnr: vnr || null,
      dateOfBirth: dateOfBirth || null,
      nationality: nationality || null,
      docNumber: docNumber || null,
      docValidUntil: docValidUntil || null,
      bio: bio || null,
      age: age ? parseInt(age) : null,
      experience: experience ? JSON.stringify(experience) : null,
      education: education ? JSON.stringify(education) : null,
      languages: languages ? JSON.stringify(languages) : null,
      hoursPerWeek: hoursPerWeek ? parseInt(hoursPerWeek) : null,
      shifts: shifts ? JSON.stringify(shifts) : null,
      linkedin: linkedin || null,
      instagram: instagram || null,
      twitter: twitter || null,
      facebook: facebook || null,
    },
    update: {
      ...(name !== undefined ? { name: name || null } : {}),
      ...(phone !== undefined ? { phone: phone || null } : {}),
      ...(vnr !== undefined ? { vnr: vnr || null } : {}),
      ...(dateOfBirth !== undefined ? { dateOfBirth: dateOfBirth || null } : {}),
      ...(nationality !== undefined ? { nationality: nationality || null } : {}),
      ...(docNumber !== undefined ? { docNumber: docNumber || null } : {}),
      ...(docValidUntil !== undefined ? { docValidUntil: docValidUntil || null } : {}),
      ...(bio !== undefined ? { bio: bio ?? null } : {}),
      ...(age !== undefined ? { age: age ? parseInt(age) : null } : {}),
      ...(experience !== undefined ? { experience: experience ? JSON.stringify(experience) : null } : {}),
      ...(education !== undefined ? { education: education ? JSON.stringify(education) : null } : {}),
      ...(languages !== undefined ? { languages: languages ? JSON.stringify(languages) : null } : {}),
      ...(hoursPerWeek !== undefined ? { hoursPerWeek: hoursPerWeek ? parseInt(hoursPerWeek) : null } : {}),
      ...(shifts !== undefined ? { shifts: shifts ? JSON.stringify(shifts) : null } : {}),
      ...(linkedin !== undefined ? { linkedin: linkedin ?? null } : {}),
      ...(instagram !== undefined ? { instagram: instagram ?? null } : {}),
      ...(twitter !== undefined ? { twitter: twitter ?? null } : {}),
      ...(facebook !== undefined ? { facebook: facebook ?? null } : {}),
    },
  })
  return NextResponse.json(profile)
}
