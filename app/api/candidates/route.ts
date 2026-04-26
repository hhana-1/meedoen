import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const skill  = searchParams.get('skill')  || ''

  const candidates = await prisma.candidate.findMany({
    where: {
      ...(search ? {
        OR: [
          { firstName:    { contains: search, mode: 'insensitive' } },
          { lastName:     { contains: search, mode: 'insensitive' } },
          { emailAddress: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
      ...(skill ? { skills: { has: skill } } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(candidates)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, vNumber, phoneNumber, emailAddress, address, skills } = body

    if (!firstName || !lastName || !vNumber || !emailAddress) {
      return NextResponse.json({ error: 'firstName, lastName, vNumber and emailAddress are required' }, { status: 400 })
    }

    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        vNumber,
        phoneNumber:  phoneNumber  || null,
        emailAddress,
        address:      address      || undefined,
        skills:       skills       || [],
      },
    })

    return NextResponse.json(candidate, { status: 201 })
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'vNumber or emailAddress already exists' }, { status: 409 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
