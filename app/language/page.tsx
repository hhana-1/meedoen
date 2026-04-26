'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { LANGUAGES, LangCode } from '@/lib/translations'
import { useRouter } from 'next/navigation'

export default function LanguagePage() {
  const { setLang, markChosen } = useLanguage()
  const router = useRouter()

  function choose(code: LangCode) {
    setLang(code)
    markChosen()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex flex-col">
      <div className="px-6 pt-12 pb-6 text-center">
        <h1 className="text-4xl font-extrabold mb-1">
          <span className="text-orange-500">Meedoen</span>
          <span className="text-blue-600">balie</span>
        </h1>
        <p className="text-gray-500 mt-2">Choose your language</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-10 flex flex-col gap-3">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onPointerDown={() => choose(lang.code as LangCode)}
            className="w-full flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 active:bg-orange-50 active:border-orange-300 transition-colors text-left"
          >
            <span className="text-4xl leading-none">{lang.flag}</span>
            <span className="font-semibold text-gray-800 text-lg">{lang.name}</span>
            <span className="ml-auto text-gray-300 text-xl">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
