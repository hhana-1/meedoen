'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { LANGUAGES, getTranslations, LangCode } from '@/lib/translations'

type LanguageContextType = {
  lang: LangCode
  setLang: (lang: LangCode) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
  hasChosen: boolean
  markChosen: () => void
  initialized: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
  dir: 'ltr',
  hasChosen: false,
  markChosen: () => {},
  initialized: false,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en')
  const [hasChosen, setHasChosen] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mdb_lang') as LangCode | null
      const chosen = localStorage.getItem('mdb_lang_chosen') === '1'
      if (stored && LANGUAGES.find(l => l.code === stored)) setLangState(stored)
      setHasChosen(chosen)
    } catch {}
    setInitialized(true)
  }, [])

  function setLang(code: LangCode) {
    setLangState(code)
    try { localStorage.setItem('mdb_lang', code) } catch {}
  }

  function markChosen() {
    setHasChosen(true)
    try { localStorage.setItem('mdb_lang_chosen', '1') } catch {}
  }

  const translations = getTranslations(lang)
  const dir = LANGUAGES.find(l => l.code === lang)?.dir === 'rtl' ? 'rtl' : 'ltr'

  function t(key: string): string {
    return translations[key] ?? getTranslations('en')[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: dir as 'ltr' | 'rtl', hasChosen, markChosen, initialized }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
