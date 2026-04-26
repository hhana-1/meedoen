'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
  const { login } = useAuth()
  const { t, dir } = useLanguage()
  const router = useRouter()
  const [role, setRole] = useState<'jobseeker' | 'employer'>('jobseeker')
  const [email, setEmail] = useState('')
  const [vnr, setVnr] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const credential = role === 'jobseeker' ? vnr : password
    const result = await login(email, credential)
    setLoading(false)
    if (result.ok) {
      router.push('/dashboard')
    } else {
      setError(result.error || t('error'))
    }
  }

  function switchRole(r: 'jobseeker' | 'employer') {
    setRole(r)
    setError('')
    setEmail('')
    setVnr('')
    setPassword('')
  }

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('loginTitle')}</h1>

          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => switchRole('jobseeker')}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${role === 'jobseeker' ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:text-gray-800'}`}
            >
              👤 Login as job seeker
            </button>
            <button
              type="button"
              onClick={() => switchRole('employer')}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${role === 'employer' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-800'}`}
            >
              🏢 Login as employer
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {role === 'jobseeker' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">V-nummer</label>
                <input
                  type="password"
                  value={vnr}
                  onChange={e => setVnr(e.target.value)}
                  required
                  placeholder="10-digit V-NR"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-60 mt-2 ${role === 'employer' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            >
              {loading ? t('loading') : t('login')}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            {t('noAccount')}{' '}
            <Link href={`/register?type=${role}`} className="text-orange-500 font-semibold hover:underline">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
