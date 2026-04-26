import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.MOLLIE_API_KEY) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  const { id } = await params
  const res = await fetch(`https://api.mollie.com/v2/payments/${id}`, {
    headers: { Authorization: `Bearer ${process.env.MOLLIE_API_KEY}` },
  })

  const payment = await res.json()
  if (!res.ok) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

  return NextResponse.json({ status: payment.status, jobId: payment.metadata?.jobId })
}
