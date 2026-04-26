import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.MOLLIE_API_KEY) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  const { jobId, jobTitle, amount } = await req.json()
  if (!jobId || !amount) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://meedoenbalie.com'

  const res = await fetch('https://api.mollie.com/v2/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: { currency: 'EUR', value: Number(amount).toFixed(2) },
      description: `Job posting: ${jobTitle}`,
      redirectUrl: `${baseUrl}/jobs/${jobId}?paid=1`,
      webhookUrl: `${baseUrl}/api/webhooks/mollie`,
      metadata: { jobId },
    }),
  })

  const payment = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: payment.detail || 'Payment creation failed' }, { status: 400 })
  }

  return NextResponse.json({
    paymentId: payment.id,
    checkoutUrl: payment._links.checkout.href,
  })
}
