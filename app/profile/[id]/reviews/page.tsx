'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

type Review = {
  id: string
  rating: number
  comment: string
  createdAt: string
  from: { id: string; role: string; employerProfile: { companyName: string } | null }
}

export default function ProfileReviewsPage() {
  const { id } = useParams() as { id: string }
  const { user } = useAuth()
  const { t, dir } = useLanguage()
  const [reviews, setReviews] = useState<Review[]>([])
  const [targetUserId, setTargetUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch(`/api/profile/${id}`).then(r => r.json()).then(p => {
      setTargetUserId(p.user.id)
      fetch(`/api/reviews?toUserId=${p.user.id}`).then(r => r.json()).then(data => {
        setReviews(data)
        setLoading(false)
      })
    })
  }, [id])

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toUserId: targetUserId, rating, comment }),
    })
    setSubmitting(false)
    if (res.ok) {
      const newReview = await res.json()
      setReviews(prev => [{ ...newReview, from: { id: user!.id, role: user!.role, employerProfile: user?.employerProfile ? { companyName: user.employerProfile.companyName } : null } }, ...prev])
      setSuccess(true)
      setComment('')
    } else {
      const data = await res.json()
      setError(data.error || t('error'))
    }
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 w-full">
        <Link href={`/profile/${id}`} className="text-orange-500 hover:underline text-sm mb-6 inline-block">← {t('back')}</Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('reviews')}</h1>
        {avgRating !== null && (
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className={s <= Math.round(avgRating) ? 'star-filled text-xl' : 'star-empty text-xl'}>★</span>)}</div>
            <span className="text-gray-600 font-semibold">{avgRating.toFixed(1)}</span>
            <span className="text-gray-400 text-sm">({reviews.length} {t('reviews').toLowerCase()})</span>
          </div>
        )}

        {user && user.id !== targetUserId && !success && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="font-bold text-gray-800 mb-4">{t('writeReview')}</h2>
            {error && <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={submitReview} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('rating')}</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button type="button" key={s} onClick={() => setRating(s)}
                      className={`text-3xl transition-colors ${s <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('comment')}</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={4}
                  placeholder="Share your experience working with this person..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              </div>
              <button type="submit" disabled={submitting}
                className="bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-60">
                {submitting ? t('loading') : t('submit')}
              </button>
            </form>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl text-center mb-6">
            ✅ {t('success')} Review submitted.
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400 py-10">{t('loading')}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-400 py-10">{t('noReviews')}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className={s <= review.rating ? 'star-filled' : 'star-empty'}>★</span>)}</div>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-3">
                  — {review.from.role === 'employer' ? review.from.employerProfile?.companyName : 'Job seeker'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
