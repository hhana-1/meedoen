'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const SERVICE_TYPES = [
  'Cleaning', 'Painting', 'Gardening', 'Moving help', 'Cooking', 'Childcare',
  'Tutoring', 'IT support', 'Translation', 'Driving', 'Construction help',
  'Delivery', 'Pet care', 'Elderly care', 'Event help', 'Other',
]

type ServiceEntry = {
  id: string
  serviceType: string
  description: string | null
  createdAt: string
  profile: {
    id: string
    picture: string | null
    bio: string | null
    user: { id: string }
  }
}

type Grouped = { [type: string]: ServiceEntry[] }

export default function ServicesPage() {
  const { t, dir } = useLanguage()
  const { user } = useAuth()
  const [services, setServices] = useState<ServiceEntry[]>([])
  const [filterType, setFilterType] = useState('')
  const [loading, setLoading] = useState(true)
  const [showRequest, setShowRequest] = useState(false)
  const [newType, setNewType] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams()
    if (filterType) params.set('type', filterType)
    setLoading(true)
    fetch(`/api/services?${params}`).then(r => r.json()).then(data => {
      setServices(data)
      setLoading(false)
    })
  }, [filterType])

  async function addService() {
    if (!newType) return
    setAdding(true)
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceType: newType, description: newDesc }),
    })
    setAdding(false)
    if (res.ok) {
      const entry = await res.json()
      setServices(prev => [entry, ...prev])
      setShowRequest(false)
      setNewType('')
      setNewDesc('')
    }
  }

  const grouped: Grouped = {}
  services.forEach(s => {
    if (!grouped[s.serviceType]) grouped[s.serviceType] = []
    grouped[s.serviceType].push(s)
  })

  const displayTypes = filterType ? [filterType] : Object.keys(grouped)

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('servicesList')}</h1>
            <p className="text-gray-500 mt-1">{t('findPeopleServices')}</p>
          </div>
          {user?.role === 'jobseeker' && (
            <Link href={`/profile/${user.jobSeekerProfile?.id}`} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 text-sm">
              + {t('offerService')}
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setFilterType('')}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${!filterType ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300 hover:border-orange-300'}`}>
            {t('all')}
          </button>
          {SERVICE_TYPES.map(s => (
            <button key={s} onClick={() => setFilterType(s === filterType ? '' : s)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${filterType === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300 hover:border-orange-300'}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">{t('loading')}</div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔧</div>
            <p className="text-gray-400">{t('noServicesFound')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {displayTypes.map(type => (
              <div key={type}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🔧 {type}
                  <span className="text-sm font-normal text-gray-400">({grouped[type]?.length || 0} {t('applicantsLabel')})</span>
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(grouped[type] || []).map(service => (
                    <Link key={service.id} href={`/profile/${service.profile.id}`}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-orange-200 transition-all group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center flex-shrink-0">
                          {service.profile.picture
                            ? <img src={service.profile.picture} alt="" className="w-full h-full object-cover" />
                            : <span className="text-xl">👤</span>}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
                            Worker #{service.profile.id.slice(-4)}
                          </p>
                          <p className="text-xs text-gray-400">{new Date(service.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {service.profile.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">{service.profile.bio}</p>
                      )}
                      {service.description && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">{service.description}</p>
                      )}
                      <div className="mt-3 text-xs text-orange-500 font-medium">{t('viewProfile')} →</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-gray-600 mb-3">{t('requestNewService')}</p>
          {showRequest ? (
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <input value={newType} onChange={e => setNewType(e.target.value)} placeholder="Service name"
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2} placeholder="Describe the service..."
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              <div className="flex gap-2">
                <button onClick={addService} disabled={adding || !newType}
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-60 text-sm">
                  {adding ? t('loading') : t('submit')}
                </button>
                <button onClick={() => setShowRequest(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm">{t('cancel')}</button>
              </div>
            </div>
          ) : (
            <button onClick={() => { if (!user) { window.location.href = '/login' } else { setShowRequest(true) } }}
              className="border-2 border-dashed border-orange-300 text-orange-500 px-6 py-3 rounded-xl hover:bg-orange-50 font-medium text-sm transition-colors">
              + {t('requestNewService')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
