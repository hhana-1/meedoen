import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({
    where: { id },
    select: {
      id: true, companyName: true, kvkNumber: true, emailAddress: true,
      address: true, reviews: true, jobOfferings: true, createdAt: true, updatedAt: true,
    },
  })
  if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(company)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const { companyName, kvkNumber, emailAddress, password, address, reviews, jobOfferings } = body

    const company = await prisma.company.update({
      where: { id },
      data: {
        ...(companyName   !== undefined && { companyName }),
        ...(kvkNumber     !== undefined && { kvkNumber }),
        ...(emailAddress  !== undefined && { emailAddress }),
        ...(password      !== undefined && { password: await hashPassword(password) }),
        ...(address       !== undefined && { address }),
        ...(reviews       !== undefined && { reviews }),
        ...(jobOfferings  !== undefined && { jobOfferings }),
      },
    })

    const { password: _pw, ...safe } = company
    return NextResponse.json(safe)
  } catch (e: any) {
    if (e.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (e.code === 'P2002') return NextResponse.json({ error: 'kvkNumber or emailAddress already exists' }, { status: 409 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.company.delete({ where: { id } })
    return NextResponse.json({ deleted: true })
  } catch (e: any) {
    if (e.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
