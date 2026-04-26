import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  if (!process.env.MOLLIE_API_KEY) return NextResponse.json({ ok: true })

  try {
    const body = await req.formData()
    const paymentId = body.get('id') as string
    if (!paymentId) return NextResponse.json({ ok: true })

    const res = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MOLLIE_API_KEY}` },
    })
    const payment = await res.json()

    if (payment.status === 'paid' && payment.metadata?.jobId) {
      await prisma.jobListing.update({
        where: { id: payment.metadata.jobId },
        data: { active: true },
      })
    }
  } catch (e) {
    console.error('Mollie webhook error:', e)
  }

  return NextResponse.json({ ok: true })
}
