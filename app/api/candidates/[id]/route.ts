import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const candidate = await prisma.candidate.findUnique({ where: { id } })
  if (!candidate) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(candidate)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const { firstName, lastName, vNumber, phoneNumber, emailAddress, address, skills, reviews } = body

    const candidate = await prisma.candidate.update({
      where: { id },
      data: {
        ...(firstName    !== undefined && { firstName }),
        ...(lastName     !== undefined && { lastName }),
        ...(vNumber      !== undefined && { vNumber }),
        ...(phoneNumber  !== undefined && { phoneNumber }),
        ...(emailAddress !== undefined && { emailAddress }),
        ...(address      !== undefined && { address }),
        ...(skills       !== undefined && { skills }),
        ...(reviews      !== undefined && { reviews }),
      },
    })

    return NextResponse.json(candidate)
  } catch (e: any) {
    if (e.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (e.code === 'P2002') return NextResponse.json({ error: 'vNumber or emailAddress already exists' }, { status: 409 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.candidate.delete({ where: { id } })
    return NextResponse.json({ deleted: true })
  } catch (e: any) {
    if (e.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
