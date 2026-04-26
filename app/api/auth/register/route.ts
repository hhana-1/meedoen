import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, role, language, companyName, kvkNumber, orgType, address, phone, website,
      name, jobseekerPhone, vnr, dateOfBirth, nationality, docNumber, docValidUntil } = body

    if (!email || !password || !role) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (!['employer', 'jobseeker'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    if (role === 'employer' && !companyName) return NextResponse.json({ error: 'Company name required' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const hashed = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        role,
        language: language || 'en',
        ...(role === 'employer' ? {
          employerProfile: {
            create: {
              companyName,
              kvkNumber: kvkNumber || null,
              orgType: orgType || 'enterprise',
              address: address || null,
              phone: phone || null,
              website: website || null,
              verified: false,
            },
          },
        } : {
          jobSeekerProfile: {
            create: {
              name: name || null,
              phone: jobseekerPhone || null,
              vnr: vnr || null,
              dateOfBirth: dateOfBirth || null,
              nationality: nationality || null,
              docNumber: docNumber || null,
              docValidUntil: docValidUntil || null,
            },
          },
        }),
      },
      include: {
        employerProfile: { select: { id: true, companyName: true, verified: true } },
        jobSeekerProfile: { select: { id: true } },
      },
    })

    const token = await createToken({ userId: user.id, email: user.email, role: user.role })

    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        language: user.language,
        employerProfile: user.employerProfile,
        jobSeekerProfile: user.jobSeekerProfile,
      },
    }, { status: 201 })

    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  } catch (e: any) {
    console.error('Register error:', e)
    if (e.code === 'P2002') return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    const msg = e?.message ?? String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
