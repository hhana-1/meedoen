'use client'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { t, dir } = useLanguage()

  const JOBSEEKER_RIGHTS = [
    { icon: '⏱️', title: t('rightHours'), text: t('rightHoursText') },
    { icon: '💰', title: t('rightWage'), text: t('rightWageText') },
    { icon: '📋', title: t('rightTwv'), text: t('rightTwvText') },
    { icon: '🏥', title: t('rightHealth'), text: t('rightHealthText') },
    { icon: '🤝', title: t('rightProef'), text: t('rightProefText') },
    { icon: '📄', title: t('rightContract'), text: t('rightContractText') },
    { icon: '🚫', title: t('rightNoDiscrim'), text: t('rightNoDiscrimText') },
  ]

  const EMPLOYER_LAWS = [
    { icon: '📝', title: t('lawTwv'), text: t('lawTwvText') },
    { icon: '💶', title: t('lawWage'), text: t('lawWageText') },
    { icon: '🧪', title: t('lawProef'), text: t('lawProefText') },
    { icon: '🏢', title: t('lawNonprofit'), text: t('lawNonprofitText') },
    { icon: '📃', title: t('lawContract'), text: t('lawContractText') },
    { icon: '🔍', title: t('lawBackground'), text: t('lawBackgroundText') },
    { icon: '✅', title: t('lawNoCostEmployer'), text: t('lawNoCostEmployerText') },
  ]
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div dir={dir} className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-xl animate-pulse">{t('loading')}</div>
        </div>
      </div>
    )
  }

  const items = user.role === 'jobseeker' ? JOBSEEKER_RIGHTS : EMPLOYER_LAWS
  const title = user.role === 'jobseeker' ? t('yourRights') : t('employerLaws')
  const subtitle = user.role === 'jobseeker' ? t('rightsTitle') : t('lawsTitle')

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">{user.role === 'employer' ? '🏢 ' + (user.employerProfile?.companyName || '') : '👤 ' + t('jobSeekerRole')}</p>
              <h1 className="text-2xl font-bold text-gray-800 mt-1">{t('dashboard')}</h1>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
              {user.role === 'employer' && !user.employerProfile?.verified && (
                <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">{t('notVerified')}</span>
              )}
              {user.role === 'employer' && user.employerProfile?.verified && (
                <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">✓ {t('verified')}</span>
              )}
            </div>
            <div className="flex flex-col gap-2 text-right">
              {user.role === 'jobseeker' ? (
                <>
                  <Link href={`/profile/${user.jobSeekerProfile?.id}`} className="text-sm text-orange-500 hover:underline font-medium">{t('editProfile')}</Link>
                  <Link href="/applications" className="text-sm text-gray-500 hover:text-gray-700">{t('myApplications')}</Link>
                  <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-700">{t('findJobs')}</Link>
                  <Link href="/services" className="text-sm text-gray-500 hover:text-gray-700">{t('offerService')}</Link>
                </>
              ) : (
                <>
                  <Link href={`/employer/${user.employerProfile?.id}`} className="text-sm text-blue-600 hover:underline font-medium">{t('editProfile')}</Link>
                  <Link href="/jobs/create" className="text-sm text-gray-500 hover:text-gray-700">{t('postJob')}</Link>
                  <Link href="/applications" className="text-sm text-gray-500 hover:text-gray-700">{t('myApplications')}</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-500 mb-8">{subtitle}</p>
          <div className="grid md:grid-cols-2 gap-5">
            {items.map((item) => (
              <div key={item.title} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
