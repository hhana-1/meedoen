import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''

  const companies = await prisma.company.findMany({
    where: search ? {
      OR: [
        { companyName:  { contains: search, mode: 'insensitive' } },
        { emailAddress: { contains: search, mode: 'insensitive' } },
        { kvkNumber:    { contains: search, mode: 'insensitive' } },
      ],
    } : {},
    select: {
      id: true, companyName: true, kvkNumber: true, emailAddress: true,
      address: true, reviews: true, jobOfferings: true, createdAt: true, updatedAt: true,
      // password intentionally excluded
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(companies)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyName, kvkNumber, emailAddress, password, address, jobOfferings } = body

    if (!companyName || !kvkNumber || !emailAddress || !password) {
      return NextResponse.json({ error: 'companyName, kvkNumber, emailAddress and password are required' }, { status: 400 })
    }

    const hashed = await hashPassword(password)

    const company = await prisma.company.create({
      data: {
        companyName,
        kvkNumber,
        emailAddress,
        password:     hashed,
        address:      address      || undefined,
        jobOfferings: jobOfferings || [],
      },
    })

    const { password: _, ...safe } = company
    return NextResponse.json(safe, { status: 201 })
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'kvkNumber or emailAddress already exists' }, { status: 409 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
