'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

type Employer = {
  id: string; companyName: string; description: string | null; logo: string | null
  website: string | null; phone: string | null; address: string | null
  verified: boolean; orgType: string | null; kvkNumber: string | null
  jobListings: { id: string; title: string; location: string | null; hoursPerWeek: number | null; category: string | null; createdAt: string }[]
  user: { id: string }
}

const ORG_LABELS: Record<string, string> = {
  enterprise: '🏢 Enterprise / Company',
  nonprofit: '🌱 Non-Profit (Stichting/Vereniging)',
  anbi: '💛 ANBI (Public Benefit Organisation)',
  sports: '⚽ Sports Club / Community Centre',
}

export default function EmployerPage() {
  const { id } = useParams() as { id: string }
  const { user } = useAuth()
  const { t, dir } = useLanguage()
  const [employer, setEmployer] = useState<Employer | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)
  const [reviews, setReviews] = useState<{ id: string; rating: number; comment: string }[]>([])

  const isOwn = user?.employerProfile?.id === id

  useEffect(() => {
    fetch(`/api/employer/${id}`).then(r => r.json()).then(data => {
      if (data.error) return
      setEmployer(data)
      setDescription(data.description || '')
      setWebsite(data.website || '')
      setPhone(data.phone || '')
      setAddress(data.address || '')
      setLoading(false)
      fetch(`/api/reviews?toUserId=${data.user.id}`).then(r => r.json()).then(setReviews)
    })
  }, [id])

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/employer/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, website, phone, address }),
    })
    if (res.ok) {
      const updated = await res.json()
      setEmployer(prev => prev ? { ...prev, ...updated } : prev)
      setEditing(false)
    }
    setSaving(false)
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setEmployer(prev => prev ? { ...prev, logo: url } : prev)
    }
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null

  if (loading) return (
    <div dir={dir} className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center text-gray-400">{t('loading')}</div>
    </div>
  )
  if (!employer) return null

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 w-full">
        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-blue-100 flex items-center justify-center text-3xl">
                {employer.logo ? <img src={employer.logo} alt="" className="w-full h-full object-cover" /> : '🏢'}
              </div>
              {isOwn && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-blue-700 text-sm">
                  ✏️ <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{employer.companyName}</h1>
                  {employer.orgType && <p className="text-gray-500 text-sm mt-0.5">{ORG_LABELS[employer.orgType] || employer.orgType}</p>}
                  {employer.verified
                    ? <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ {t('verified')}</span>
                    : <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">⏳ {t('notVerified')}</span>
                  }
                  {avgRating !== null && (
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(s => <span key={s} className={s <= Math.round(avgRating) ? 'star-filled' : 'star-empty'}>★</span>)}
                      <span className="text-sm text-gray-500 ml-1">({reviews.length})</span>
                    </div>
                  )}
                </div>
                {isOwn && (
                  <button onClick={() => setEditing(!editing)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    {editing ? t('cancel') : t('editProfile')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {editing ? (
            <div className="mt-6 flex flex-col gap-4">
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                placeholder="Tell job seekers about your company..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input value={website} onChange={e => setWebsite(e.target.value)} placeholder={t('companyWebsite')}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('companyPhone')}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder={t('companyAddress')}
                  className="col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <button onClick={handleSave} disabled={saving}
                className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60">
                {saving ? t('loading') : t('save')}
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              {employer.description && <p className="text-gray-700 leading-relaxed">{employer.description}</p>}
              {employer.address && <p>📍 {employer.address}</p>}
              {employer.phone && <p>📞 {employer.phone}</p>}
              {employer.website && <a href={employer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">🌐 {employer.website}</a>}
              {employer.kvkNumber && <p>KvK: {employer.kvkNumber}</p>}
            </div>
          )}
        </div>

        {employer.jobListings.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-4">{t('jobListings')} ({employer.jobListings.length})</h2>
            <div className="flex flex-col gap-3">
              {employer.jobListings.map(job => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.location} {job.hoursPerWeek && `• ${job.hoursPerWeek} hrs/week`}</p>
                  </div>
                  <span className="text-orange-500 text-sm">View →</span>
                </Link>
              ))}
            </div>
            {isOwn && (
              <Link href="/jobs/create" className="block mt-4 text-center text-sm text-blue-600 border border-blue-200 rounded-lg py-2 hover:bg-blue-50">
                + {t('postJob')}
              </Link>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">{t('reviews')} {reviews.length > 0 && `(${reviews.length})`}</h2>
            <Link href={`/employer/${id}/reviews`} className="text-orange-500 text-sm hover:underline">{t('viewAll')}</Link>
          </div>
          {reviews.length === 0
            ? <p className="text-gray-400 text-sm">{t('noReviews')}</p>
            : reviews.slice(0, 3).map(r => (
              <div key={r.id} className="border-t border-gray-100 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
                <div className="flex mb-1">{[1,2,3,4,5].map(s => <span key={s} className={s <= r.rating ? 'star-filled text-sm' : 'star-empty text-sm'}>★</span>)}</div>
                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
