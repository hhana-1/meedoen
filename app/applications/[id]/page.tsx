'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const STAGE_CONFIGS = [
  { key: 'applied', labelKey: 'stageApplied', color: 'bg-gray-100 text-gray-600', icon: '📋' },
  { key: 'intake', labelKey: 'stageIntake', color: 'bg-blue-100 text-blue-700', icon: '🗣️' },
  { key: 'trialDay', labelKey: 'stageTrialDay', color: 'bg-yellow-100 text-yellow-700', icon: '☀️' },
  { key: 'trialPeriod', labelKey: 'stageTrialPeriod', color: 'bg-orange-100 text-orange-700', icon: '📅' },
  { key: 'contract', labelKey: 'stageContracted', color: 'bg-green-100 text-green-700', icon: '✅' },
  { key: 'hired', labelKey: 'stageHired', color: 'bg-green-200 text-green-800', icon: '🎉' },
  { key: 'rejected', labelKey: 'stageRejected', color: 'bg-red-100 text-red-600', icon: '❌' },
]

type ApplicationDetail = {
  id: string
  stage: string
  status: string
  createdAt: string
  coverLetter: string | null
  notes: string | null
  jobListing: {
    id: string
    title: string
    description: string | null
    location: string | null
    category: string | null
    hoursPerWeek: number | null
    employer: { id: string; companyName: string; logo: string | null }
  }
  user?: { id: string; email: string; jobSeekerProfile: { id: string; name: string | null; picture: string | null; bio: string | null; phone: string | null } | null }
}

export default function ApplicationDetailPage() {
  const { id } = useParams() as { id: string }
  const { user, loading } = useAuth()
  const { t, dir } = useLanguage()
  const router = useRouter()
  const [app, setApp] = useState<ApplicationDetail | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    fetch(`/api/applications/${id}`).then(r => r.json()).then(data => {
      if (!data.error) {
        setApp(data)
        setNotes(data.notes || '')
      }
      setDataLoading(false)
    })
  }, [user, id])

  async function updateStage(stage: string) {
    setUpdating(true)
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
    if (res.ok) setApp(prev => prev ? { ...prev, stage } : prev)
    setUpdating(false)
  }

  async function saveNotes() {
    setSavingNotes(true)
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    })
    if (res.ok) setApp(prev => prev ? { ...prev, notes } : prev)
    setSavingNotes(false)
  }

  if (loading || !user) return (
    <div dir={dir} className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center text-gray-400">{t('loading')}</div>
    </div>
  )

  if (dataLoading) return (
    <div dir={dir} className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center text-gray-400">{t('loading')}</div>
    </div>
  )

  if (!app) return (
    <div dir={dir} className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center text-gray-400">Application not found.</div>
    </div>
  )

  const stageCfg = STAGE_CONFIGS.find(s => s.key === app.stage) || STAGE_CONFIGS[0]
  const stageLabel = t(stageCfg.labelKey)
  const stageIndex = STAGE_CONFIGS.findIndex(s => s.key === app.stage)
  const progressStages = STAGE_CONFIGS.filter(s => !['hired', 'rejected'].includes(s.key))
  const applicantName = app.user?.jobSeekerProfile?.name || app.user?.email || ''

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 w-full">
        <Link href="/applications" className="text-orange-500 hover:underline text-sm mb-6 inline-block">← {t('myApplications')}</Link>

        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Link href={`/jobs/${app.jobListing.id}`} className="text-2xl font-bold text-gray-800 hover:text-orange-500">
                {app.jobListing.title}
              </Link>
              <Link href={`/employer/${app.jobListing.employer.id}`} className="block text-gray-500 hover:text-blue-600 mt-1">
                {app.jobListing.employer.companyName}
              </Link>
              {app.jobListing.location && <p className="text-gray-400 text-sm mt-0.5">📍 {app.jobListing.location}</p>}
              {app.jobListing.hoursPerWeek && <p className="text-gray-400 text-sm">🕐 {app.jobListing.hoursPerWeek} hrs/week</p>}
            </div>
            <span className={`text-sm px-3 py-1.5 rounded-full font-medium flex items-center gap-1 ${stageCfg.color}`}>
              {stageCfg.icon} {stageLabel}
            </span>
          </div>

          {user.role === 'jobseeker' && (
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">Application progress</p>
              <div className="flex items-center gap-1">
                {progressStages.map((s, i) => (
                  <div key={s.key} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${i <= stageIndex ? 'bg-orange-500' : 'bg-gray-200'}`} />
                    {i < progressStages.length - 1 && <div className={`h-0.5 w-8 ${i < stageIndex ? 'bg-orange-500' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>
              <div className="flex gap-1 mt-1">
                {progressStages.map((s, i) => (
                  <div key={s.key} style={{ width: i < progressStages.length - 1 ? '44px' : '12px' }}>
                    <p className="text-xs text-gray-400 truncate">{t(s.labelKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
        </div>

        {app.coverLetter && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-3">Cover Letter</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
          </div>
        )}

        {user.role === 'employer' && (
          <>
            {app.user?.jobSeekerProfile && (
              <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <h2 className="font-bold text-gray-800 mb-4">Applicant</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center flex-shrink-0">
                    {app.user.jobSeekerProfile.picture
                      ? <img src={app.user.jobSeekerProfile.picture} alt="" className="w-full h-full object-cover" />
                      : <span className="text-2xl">👤</span>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{applicantName}</p>
                    {app.user.jobSeekerProfile.phone && (
                      <p className="text-sm text-gray-500 mt-0.5">📞 {app.user.jobSeekerProfile.phone}</p>
                    )}
                    {app.user.jobSeekerProfile.bio && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{app.user.jobSeekerProfile.bio}</p>}
                  </div>
                  <Link href={`/profile/${app.user.jobSeekerProfile.id}`}
                    className="ml-auto text-orange-500 text-sm font-medium hover:underline">
                    View Profile →
                  </Link>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h2 className="font-bold text-gray-800 mb-4">Update Stage</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STAGE_CONFIGS.map(s => (
                  <button key={s.key} onClick={() => updateStage(s.key)} disabled={updating}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${app.stage === s.key ? s.color + ' border-current' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'} disabled:opacity-50`}>
                    {s.icon} {t(s.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h2 className="font-bold text-gray-800 mb-3">Notes for applicant</h2>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Add notes visible to the applicant..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-3"
              />
              <button onClick={saveNotes} disabled={savingNotes}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 text-sm">
                {savingNotes ? t('loading') : t('save')}
              </button>
            </div>
          </>
        )}

        {user.role === 'jobseeker' && app.notes && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h2 className="font-bold text-blue-800 mb-2">📝 Message from employer</h2>
            <p className="text-blue-700 leading-relaxed">{app.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
