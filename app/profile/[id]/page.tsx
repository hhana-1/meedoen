'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import IdCardScanner, { IdCardData } from '@/components/IdCardScanner'

const SERVICES_LIST = ['Cleaning', 'Painting', 'Gardening', 'Moving help', 'Cooking', 'Childcare', 'Tutoring', 'IT support', 'Translation', 'Driving', 'Construction help', 'Other']
const LANGUAGES_LIST = ['Arabic', 'Dutch', 'English', 'French', 'German', 'Russian', 'Somali', 'Tigrinya', 'Turkish', 'Ukrainian', 'Dari', 'Pashto', 'Farsi', 'Other']
const SHIFT_OPTIONS = ['Morning (6:00–14:00)', 'Afternoon (14:00–22:00)', 'Night (22:00–06:00)', 'Flexible']

type Profile = {
  id: string; name: string | null; picture: string | null; bio: string | null; age: number | null
  experience: string | null; education: string | null; languages: string | null
  hoursPerWeek: number | null; shifts: string | null
  linkedin: string | null; instagram: string | null; twitter: string | null; facebook: string | null
  nationality: string | null
  services: { id: string; serviceType: string; description: string | null }[]
  user: { id: string; email: string }
}

export default function ProfilePage() {
  const { id } = useParams() as { id: string }
  const { user } = useAuth()
  const { t, dir } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Edit state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [age, setAge] = useState('')
  const [hours, setHours] = useState('')
  const [selectedShifts, setSelectedShifts] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')
  const [twitter, setTwitter] = useState('')
  const [experience, setExperience] = useState<{ title: string; employer: string; start: string; end: string; current: boolean }[]>([])
  const [education, setEducation] = useState<{ degree: string; school: string; year: string }[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [reviews, setReviews] = useState<{ id: string; rating: number; comment: string; from: { role: string; employerProfile: { companyName: string } | null } }[]>([])

  useEffect(() => {
    async function load() {
      const own = user?.jobSeekerProfile?.id === id
      setIsOwnProfile(own)

      const [profileRes] = await Promise.all([fetch(`/api/profile/${id}`)])
      if (!profileRes.ok) { router.push('/jobs'); return }
      const p: Profile = await profileRes.json()
      setProfile(p)
      setName(p.name || '')
      setBio(p.bio || '')
      setAge(p.age?.toString() || '')
      setHours(p.hoursPerWeek?.toString() || '')
      setSelectedShifts(p.shifts ? JSON.parse(p.shifts) : [])
      setSelectedLanguages(p.languages ? JSON.parse(p.languages) : [])
      setLinkedin(p.linkedin || '')
      setInstagram(p.instagram || '')
      setTwitter(p.twitter || '')
      setExperience(p.experience ? JSON.parse(p.experience) : [])
      setEducation(p.education ? JSON.parse(p.education) : [])
      setSelectedServices(p.services.map(s => s.serviceType))
      setLoading(false)

      // Load reviews and private data in parallel
      const tasks: Promise<void>[] = [
        fetch(`/api/reviews?toUserId=${p.user.id}`).then(r => r.ok ? r.json() : []).then(setReviews),
      ]
      if (own) {
        tasks.push(
          fetch('/api/profile').then(r => r.ok ? r.json() : null).then(priv => {
            if (priv?.phone) setPhone(priv.phone)
          })
        )
      }
      await Promise.all(tasks)
    }
    load()
  }, [id, user, router])

  function handleScanned(data: IdCardData) {
    if (data.fullName) setName(data.fullName)
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, bio, age, experience, education, languages: selectedLanguages, hoursPerWeek: hours, shifts: selectedShifts, linkedin, instagram, twitter }),
    })
    if (res.ok) {
      const updated = await res.json()
      setProfile(prev => prev ? { ...prev, ...updated } : prev)
      setEditing(false)
    }
    setSaving(false)
  }

  async function handlePictureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setProfile(prev => prev ? { ...prev, picture: url } : prev)
    }
    setUploading(false)
  }

  async function addService(serviceType: string) {
    if (selectedServices.includes(serviceType)) return
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceType }),
    })
    if (res.ok) setSelectedServices(prev => [...prev, serviceType])
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null
  const displayName = profile?.name || profile?.user.email.split('@')[0] || ''

  if (loading) return (
    <div dir={dir} className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center text-gray-400">{t('loading')}</div>
    </div>
  )

  if (!profile) return null

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 w-full">
        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                {profile.picture
                  ? <img src={profile.picture} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-4xl">👤</span>}
              </div>
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-orange-600 text-sm">
                  {uploading ? '⏳' : '✏️'}
                  <input type="file" accept="image/*" onChange={handlePictureUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{t('profileOf')} {displayName}</h1>
                  {profile.age && <p className="text-gray-500 mt-0.5">{t('age')}: {profile.age}</p>}
                  {avgRating !== null && (
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={s <= Math.round(avgRating) ? 'star-filled' : 'star-empty'}>★</span>
                      ))}
                      <span className="text-sm text-gray-500 ml-1">({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <button onClick={() => setEditing(!editing)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
                    {editing ? t('cancel') : t('editProfile')}
                  </button>
                )}
              </div>

              {editing ? (
                <div className="mt-4 flex flex-col gap-3">
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder={t('fullName')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  <div>
                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                      placeholder={t('phoneNumber')}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    <p className="text-xs text-gray-400 mt-1">{t('phonePrivateNote')}</p>
                  </div>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                    placeholder={t('bio')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                  <div className="flex gap-3">
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder={t('age')}
                      className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    <input type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder={t('hoursPerWeek')}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>
              ) : (
                profile.bio && <p className="text-gray-600 mt-3 leading-relaxed">{profile.bio}</p>
              )}
            </div>
          </div>

          {profile.hoursPerWeek && !editing && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">⏱️ {profile.hoursPerWeek} hrs/week</span>
              {profile.shifts && JSON.parse(profile.shifts).map((s: string) => (
                <span key={s} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          )}
        </div>

        {editing && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col gap-5">
            <IdCardScanner onScanned={handleScanned} compact />

            <h3 className="font-bold text-gray-700">{t('preferredShifts')}</h3>
            <div className="flex flex-wrap gap-2">
              {SHIFT_OPTIONS.map(s => (
                <button type="button" key={s} onClick={() => setSelectedShifts(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${selectedShifts.includes(s) ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-600 hover:border-orange-300'}`}>
                  {s}
                </button>
              ))}
            </div>

            <h3 className="font-bold text-gray-700">{t('languagesSpoken')}</h3>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES_LIST.map(l => (
                <button type="button" key={l} onClick={() => setSelectedLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${selectedLanguages.includes(l) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}>
                  {l}
                </button>
              ))}
            </div>

            <h3 className="font-bold text-gray-700">{t('social')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[['LinkedIn', linkedin, setLinkedin], ['Instagram', instagram, setInstagram], ['Twitter / X', twitter, setTwitter]].map(([name, val, set]) => (
                <input key={String(name)} value={String(val)} onChange={e => (set as (v: string) => void)(e.target.value)}
                  placeholder={String(name)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              ))}
            </div>

            <button onClick={handleSave} disabled={saving} className="bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-60">
              {saving ? t('loading') : t('save')}
            </button>
          </div>
        )}

        {(profile.languages && !editing) && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-3">{t('languagesSpoken')}</h2>
            <div className="flex flex-wrap gap-2">
              {JSON.parse(profile.languages).map((l: string) => (
                <span key={l} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{l}</span>
              ))}
            </div>
          </div>
        )}

        {profile.services.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-3">{t('myServices')}</h2>
            <div className="flex flex-wrap gap-2">
              {profile.services.map(s => (
                <span key={s.id} className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-sm font-medium">{s.serviceType}</span>
              ))}
            </div>
          </div>
        )}

        {isOwnProfile && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-3">{t('offerService')}</h2>
            <div className="flex flex-wrap gap-2">
              {SERVICES_LIST.map(s => (
                <button key={s} onClick={() => addService(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${selectedServices.includes(s) ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-600 hover:border-orange-300'}`}>
                  {selectedServices.includes(s) ? '✓ ' : '+ '}{s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">{t('reviews')} {reviews.length > 0 && `(${reviews.length})`}</h2>
            <Link href={`/profile/${id}/reviews`} className="text-orange-500 text-sm hover:underline">{t('viewAll')}</Link>
          </div>
          {reviews.length === 0
            ? <p className="text-gray-400 text-sm">{t('noReviews')}</p>
            : reviews.slice(0, 3).map(r => (
              <div key={r.id} className="border-t border-gray-100 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={s <= r.rating ? 'star-filled text-sm' : 'star-empty text-sm'}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{r.from.role === 'employer' ? r.from.employerProfile?.companyName : t('jobSeekerRole')}</span>
                </div>
                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))
          }
          {!isOwnProfile && user && (
            <Link href={`/profile/${id}/reviews`} className="block mt-4 text-center text-sm text-orange-500 border border-orange-200 rounded-lg py-2 hover:bg-orange-50">
              {t('writeReview')}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
