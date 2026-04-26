'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function HomePage() {
  const { t, dir, initialized } = useLanguage()

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <h1 className="text-4xl font-extrabold">
          <span className="text-orange-500">Meedoen</span>
          <span className="text-blue-600">balie</span>
        </h1>
      </div>
    )
  }

  return (
    <div dir={dir} className="flex flex-col min-h-screen">
      <Navbar />
      <LandingPage t={t} />
    </div>
  )
}

function LandingPage({ t }: { t: (key: string) => string }) {
  const stages = [
    { labelKey: 'stageApplied',     color: 'bg-gray-100 text-gray-600',    icon: '📋' },
    { labelKey: 'stageIntake',      color: 'bg-blue-100 text-blue-600',    icon: '🗣️' },
    { labelKey: 'stageTrialDay',    color: 'bg-yellow-100 text-yellow-700', icon: '☀️' },
    { labelKey: 'stageTrialPeriod', color: 'bg-orange-100 text-orange-600', icon: '📅' },
    { labelKey: 'stageContracted',  color: 'bg-green-100 text-green-700',  icon: '✅' },
  ]

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-blue-50 py-12 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 sm:mb-6">
            <span className="text-orange-500">Meedoen</span>
            <span className="text-blue-600">balie</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('siteTagline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <Link href="/register?type=employer"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg text-center">
              🏢 {t('registerEmployer')}
            </Link>
            <Link href="/register?type=jobseeker"
              className="bg-orange-500 text-white px-8 py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg text-center">
              👤 {t('lookingForJob')}
            </Link>
            <Link href="/login"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-base sm:text-lg font-semibold hover:border-orange-400 hover:text-orange-500 transition-colors text-center">
              {t('login')}
            </Link>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-10 sm:py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">{t('landingVideo')}</h2>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe className="w-full h-full"
              src="https://www.youtube.com/embed/w3U2yUPyfT0"
              title="Meedoenbalie — How it works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
        </div>
      </section>

      {/* No cost banner */}
      <section className="py-10 sm:py-16 px-6 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="text-4xl sm:text-5xl mb-4">💡</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('noCost')}</h2>
          <p className="text-base sm:text-xl opacity-90 leading-relaxed">{t('noCostSub')}</p>
        </div>
      </section>

      {/* Application stages */}
      <section className="py-10 sm:py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">{t('applicationStages')}</h2>

          {/* Desktop: horizontal row */}
          <div className="hidden md:flex items-stretch gap-0">
            {stages.map((stage, i) => (
              <div key={stage.labelKey} className="flex flex-col items-center flex-1">
                <div className={`flex flex-col items-center p-4 rounded-xl ${stage.color} w-full text-center flex-1`}>
                  <span className="text-2xl mb-1">{stage.icon}</span>
                  <span className="font-semibold text-sm">{t(stage.labelKey)}</span>
                </div>
                {i < 4 && <div className="text-gray-400 px-1 text-lg font-bold mt-auto">→</div>}
              </div>
            ))}
          </div>

          {/* Mobile: vertical list */}
          <div className="flex flex-col gap-2 md:hidden">
            {stages.map((stage, i) => (
              <div key={stage.labelKey} className="flex flex-col items-center">
                <div className={`flex items-center gap-3 p-4 rounded-xl ${stage.color} w-full`}>
                  <span className="text-2xl">{stage.icon}</span>
                  <span className="font-semibold text-sm">{t(stage.labelKey)}</span>
                </div>
                {i < 4 && <div className="text-gray-400 text-lg font-bold py-1">↓</div>}
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">* {t('volunteerNote')}</p>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-300 py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-2">
            <span className="text-orange-400">Meedoen</span><span className="text-blue-400">balie</span>
          </div>
          <p className="text-sm">{t('footerTagline')}</p>
          <p className="text-xs text-gray-500 mt-4">© 2025 Meedoenbalie</p>
        </div>
      </footer>
    </main>
  )
}
