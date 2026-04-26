import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isValidImageType, isValidImageSize } from '@/lib/moderation'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  if (!isValidImageType(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, or WebP.' }, { status: 400 })
  }
  if (!isValidImageSize(file.size)) {
    return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const filename = `${session.userId}-${Date.now()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buffer)

  const url = `/uploads/${filename}`

  if (session.role === 'jobseeker') {
    await prisma.jobSeekerProfile.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, picture: url },
      update: { picture: url },
    })
  } else {
    await prisma.employerProfile.update({
      where: { userId: session.userId },
      data: { logo: url },
    })
  }

  return NextResponse.json({ url })
}
