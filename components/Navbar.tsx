'use client'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { LANGUAGES, LangCode } from '@/lib/translations'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { t, lang, setLang, dir } = useLanguage()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  return (
    <nav dir={dir} className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-500">Meedoen</span>
            <span className="text-2xl font-bold text-blue-600">balie</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
              {t('findJobs')}
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
              {t('services')}
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                  {t('dashboard')}
                </Link>
                {user.role === 'jobseeker' && (
                  <Link href="/applications" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                    {t('myApplications')}
                  </Link>
                )}
                {user.role === 'employer' && (
                  <Link href="/jobs/create" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                    {t('postJob')}
                  </Link>
                )}
                <Link href={user.role === 'jobseeker'
                  ? `/profile/${user.jobSeekerProfile?.id ?? 'me'}`
                  : `/employer/${user.employerProfile?.id ?? 'me'}`}
                  className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                  {t('myProfile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-500 font-medium transition-colors"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                  {t('login')}
                </Link>
                <Link href="/register" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                  {t('register')}
                </Link>
              </>
            )}

            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-gray-600 hover:text-orange-500 font-medium transition-colors"
              >
                <span>{LANGUAGES.find(l => l.code === lang)?.flag}</span>
                <span className="text-sm">{lang.toUpperCase()}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code as LangCode); setLangOpen(false) }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2 ${lang === l.code ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          <Link href="/jobs" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>{t('findJobs')}</Link>
          <Link href="/services" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>{t('services')}</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>{t('dashboard')}</Link>
              <button onClick={handleLogout} className="text-red-500 font-medium py-2 text-left">{t('logout')}</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>{t('login')}</Link>
              <Link href="/register" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-center font-medium" onClick={() => setMenuOpen(false)}>{t('register')}</Link>
            </>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code as LangCode); setMenuOpen(false) }}
                className={`text-xl ${lang === l.code ? 'ring-2 ring-orange-400 rounded' : ''}`}
              >
                {l.flag}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
