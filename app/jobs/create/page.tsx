'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const CATEGORIES = ['Cleaning', 'Cooking', 'Construction', 'Retail', 'Logistics', 'Healthcare', 'IT', 'Administration', 'Hospitality', 'Agriculture', 'Other']
const SHIFT_OPTIONS = ['Morning (6:00–14:00)', 'Afternoon (14:00–22:00)', 'Night (22:00–06:00)', 'Flexible']

export default function CreateJobPage() {
  const { user, loading } = useAuth()
  const { t, dir } = useLanguage()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [hours, setHours] = useState('')
  const [durationWeeks, setDurationWeeks] = useState('')
  const [salary, setSalary] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [jobType, setJobType] = useState('regular')
  const [selectedShifts, setSelectedShifts] = useState<string[]>([])
  const [requirements, setRequirements] = useState<string[]>([''])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Payment step
  const [paymentStep, setPaymentStep] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [jobId, setJobId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'employer')) router.push('/login')
  }, [user, loading, router])

  const totalCost = hours && durationWeeks && salary
    ? parseFloat(hours) * parseFloat(durationWeeks) * parseFloat(salary)
    : null

  function toggleShift(s: string) {
    setSelectedShifts(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, description, location: location || null,
        hoursPerWeek: hours ? parseInt(hours) : null,
        salaryMin: salary ? parseFloat(salary) : null,
        salaryMax: salary ? parseFloat(salary) : null,
        category, jobType,
        shifts: selectedShifts.length > 0 ? selectedShifts : null,
        requirements: requirements.filter(Boolean),
      }),
    })

    const jobData = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      setError(jobData.error || t('error'))
      return
    }

    if (jobData.requirePayment && totalCost) {
      const payRes = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: jobData.id, jobTitle: title, amount: totalCost }),
      })
      const payData = await payRes.json()
      if (payRes.ok) {
        setJobId(jobData.id)
        setCheckoutUrl(payData.checkoutUrl)
        setPaymentId(payData.paymentId)
        setPaymentStep(true)
      } else {
        setError(payData.error || 'Payment creation failed')
      }
    } else {
      router.push(`/jobs/${jobData.id}`)
    }
  }

  async function checkPaymentStatus() {
    if (!paymentId) return
    setChecking(true)
    const res = await fetch(`/api/payments/${paymentId}`)
    const data = await res.json()
    setChecking(false)
    setPaymentStatus(data.status)
    if (data.status === 'paid') {
      setTimeout(() => router.push(`/jobs/${jobId}`), 1500)
    }
  }

  const qrUrl = checkoutUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(checkoutUrl)}`
    : ''

  if (paymentStep) {
    return (
      <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-10 w-full">
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-4xl mb-3">💳</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Complete payment</h1>
            <p className="text-gray-500 mb-2 text-sm">Your job listing will go live after payment is confirmed.</p>

            <div className="bg-orange-50 border border-orange-200 rounded-xl px-6 py-4 mb-6 inline-block">
              <p className="text-sm text-gray-500">Total amount</p>
              <p className="text-3xl font-bold text-orange-600">€{totalCost?.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">
                {hours} hrs × {durationWeeks} weeks × €{parseFloat(salary || '0').toFixed(2)}/hr
              </p>
            </div>

            {qrUrl && (
              <div className="flex justify-center mb-6">
                <div className="border-2 border-gray-200 rounded-2xl p-3 inline-block">
                  <img src={qrUrl} alt="Payment QR code" className="w-56 h-56" />
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-4">Scan the QR code or tap the button below to pay</p>

            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors mb-3"
            >
              Open payment page →
            </a>

            {paymentStatus === 'paid' ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold">
                ✅ Payment confirmed! Redirecting to your job listing...
              </div>
            ) : paymentStatus && paymentStatus !== 'open' && paymentStatus !== 'pending' ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                Payment status: {paymentStatus}. Please try again.
              </div>
            ) : (
              <button
                onClick={checkPaymentStatus}
                disabled={checking}
                className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 text-sm"
              >
                {checking ? 'Checking...' : 'I have paid — check status'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 w-full">
        <Link href="/dashboard" className="text-orange-500 hover:underline text-sm mb-6 inline-block">← {t('back')}</Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('postJob')}</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
            <h2 className="font-bold text-gray-700">{t('basicInfo')}</h2>
            <Field label={t('jobTitleLabel') + ' *'} value={title} onChange={setTitle} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobDescription')} *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                required rows={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                placeholder="Describe the role, responsibilities, and what you are looking for..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('jobTypeLabel')}</label>
              <div className="flex gap-2 flex-wrap">
                <button type="button" onClick={() => setJobType('regular')}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm border transition-colors ${jobType === 'regular' ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-600 hover:border-orange-300'}`}>
                  💼 {t('jobTypeRegular')}
                </button>
                <button type="button" onClick={() => setJobType('volunteer')}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm border transition-colors ${jobType === 'volunteer' ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:border-green-300'}`}>
                  🤝 {t('jobTypeVolunteer')}
                </button>
                <button type="button" onClick={() => setJobType('ervaringswerkplek')}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm border transition-colors ${jobType === 'ervaringswerkplek' ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 text-gray-600 hover:border-purple-300'}`}>
                  🌱 {t('jobTypeErvaringswerkplek')}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
            <h2 className="font-bold text-gray-700">{t('detailsSection')}</h2>
            <Field label={t('location')} value={location} onChange={setLocation} placeholder="e.g. Amsterdam" />
            <div className="grid grid-cols-2 gap-4">
              <Field label={`${t('hrsWeekLabel')} *`} value={hours} onChange={setHours} type="number" placeholder="e.g. 24" required />
              <Field label="Duration (weeks) *" value={durationWeeks} onChange={setDurationWeeks} type="number" placeholder="e.g. 4" required />
              <Field label={`${t('salary')} (€/hr) *`} value={salary} onChange={setSalary} type="number" placeholder="e.g. 13.50" required />
              <div className="flex flex-col justify-end">
                {totalCost !== null && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Total wages</p>
                    <p className="text-xl font-bold text-orange-600">€{totalCost.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{hours}h × {durationWeeks}w × €{parseFloat(salary).toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('preferredShifts')}</label>
              <div className="flex flex-wrap gap-2">
                {SHIFT_OPTIONS.map(s => (
                  <button type="button" key={s} onClick={() => toggleShift(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${selectedShifts.includes(s) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300 hover:border-orange-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-gray-700 mb-4">{t('requirements')}</h2>
            <div className="flex flex-col gap-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={req}
                    onChange={e => { const r = [...requirements]; r[i] = e.target.value; setRequirements(r) }}
                    placeholder={`Requirement ${i + 1}`}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  {requirements.length > 1 && (
                    <button type="button" onClick={() => setRequirements(requirements.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 px-2">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setRequirements([...requirements, ''])}
                className="text-orange-500 text-sm hover:underline text-left mt-1">{t('addRequirement')}</button>
            </div>
          </div>

          {totalCost !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-800">Total wage cost</p>
                <p className="text-xs text-blue-600">{hours} hrs/week × {durationWeeks} weeks × €{parseFloat(salary).toFixed(2)}/hr</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">€{totalCost.toFixed(2)}</p>
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 disabled:opacity-60 transition-colors">
            {submitting ? t('loading') : totalCost ? `Post & Pay €${totalCost.toFixed(2)}` : t('postJob')}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
    </div>
  )
}
