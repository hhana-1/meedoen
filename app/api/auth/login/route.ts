import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const identifier = email.trim()

    // Try email first, then V-NR (10-digit number)
    let user = await prisma.user.findUnique({
      where: { email: identifier.toLowerCase() },
      include: {
        employerProfile: { select: { id: true, companyName: true, verified: true } },
        jobSeekerProfile: { select: { id: true, name: true } },
      },
    })

    if (!user && /^\d{10}$/.test(identifier)) {
      const profile = await prisma.jobSeekerProfile.findUnique({
        where: { vnr: identifier },
        include: {
          user: {
            include: {
              employerProfile: { select: { id: true, companyName: true, verified: true } },
              jobSeekerProfile: { select: { id: true, name: true } },
            },
          },
        },
      })
      if (profile) user = profile.user
    }

    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = await verifyPassword(password, user.password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

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
    })
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
