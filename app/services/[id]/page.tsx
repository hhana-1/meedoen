'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

type ServiceDetail = {
  id: string
  serviceType: string
  description: string | null
  createdAt: string
  profile: {
    id: string
    picture: string | null
    bio: string | null
    age: number | null
    hoursPerWeek: number | null
    shifts: string | null
    languages: string | null
    user: { id: string }
  }
}

export default function ServiceDetailPage() {
  const { id } = useParams() as { id: string }
  const { t, dir } = useLanguage()
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/services/${id}`).then(r => r.json()).then(data => {
      if (!data.error) setService(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div dir={dir} className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center text-gray-400">{t('loading')}</div>
    </div>
  )

  if (!service) return (
    <div dir={dir} className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center text-gray-400">Service not found.</div>
    </div>
  )

  const shifts: string[] = (() => { try { return JSON.parse(service.profile.shifts || '[]') } catch { return [] } })()
  const languages: string[] = (() => { try { return JSON.parse(service.profile.languages || '[]') } catch { return [] } })()

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10 w-full">
        <Link href="/services" className="text-orange-500 hover:underline text-sm mb-6 inline-block">← {t('back')}</Link>

        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center flex-shrink-0">
              {service.profile.picture
                ? <img src={service.profile.picture} alt="" className="w-full h-full object-cover" />
                : <span className="text-3xl">👤</span>}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🔧 {service.serviceType}</h1>
              <p className="text-gray-400 text-sm mt-1">{new Date(service.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {service.description && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">About this service</h2>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          )}

          {service.profile.bio && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">{t('bio')}</h2>
              <p className="text-gray-600 leading-relaxed">{service.profile.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            {service.profile.age && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-1">Age</p>
                <p className="font-medium text-gray-700">{service.profile.age}</p>
              </div>
            )}
            {service.profile.hoursPerWeek && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-1">{t('hoursPerWeek')}</p>
                <p className="font-medium text-gray-700">{service.profile.hoursPerWeek} hrs/week</p>
              </div>
            )}
          </div>

          {shifts.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-2">{t('shifts')}</p>
              <div className="flex flex-wrap gap-2">
                {shifts.map(s => (
                  <span key={s} className="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-400 text-xs mb-2">{t('languages')}</p>
              <div className="flex flex-wrap gap-2">
                {languages.map(l => (
                  <span key={l} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">{l}</span>
                ))}
              </div>
            </div>
          )}

          <Link href={`/profile/${service.profile.id}`}
            className="block w-full text-center bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
            View Full Profile →
          </Link>
        </div>
      </div>
    </div>
  )
}
