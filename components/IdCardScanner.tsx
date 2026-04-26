'use client'
import { useState, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export type IdCardData = {
  lastName: string | null
  firstName: string | null
  fullName: string | null
  nationality: string | null
  dateOfBirth: string | null
  placeOfBirth: string | null
  docType: string | null
  frontDocNumber: string | null
  backDocNumber: string | null
  vnr: string | null
  validUntil: string | null
}

type Props = {
  onScanned: (data: IdCardData) => void
  compact?: boolean
}

export default function IdCardScanner({ onScanned, compact = false }: Props) {
  const { t } = useLanguage()
  const frontRef = useRef<HTMLInputElement>(null)
  const backRef = useRef<HTMLInputElement>(null)
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function handleFront(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFrontFile(f)
    setFrontPreview(URL.createObjectURL(f))
    setDone(false)
    setError('')
  }

  function handleBack(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBackFile(f)
    setBackPreview(URL.createObjectURL(f))
    setDone(false)
    setError('')
  }

  async function scan() {
    if (!frontFile && !backFile) { setError(t('scanUploadFirst')); return }
    setScanning(true)
    setError('')

    const fd = new FormData()
    if (frontFile) fd.append('front', frontFile)
    if (backFile) fd.append('back', backFile)

    const res = await fetch('/api/id-scan', { method: 'POST', body: fd })
    setScanning(false)

    if (!res.ok) {
      const d = await res.json()
      setError(d.error || t('error'))
      return
    }

    const data: IdCardData = await res.json()
    setDone(true)
    onScanned(data)
  }

  if (compact) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
        <div className="flex gap-2 mb-3">
          <label className="flex-1 cursor-pointer">
            <div className={`border rounded-lg p-2 text-center text-xs transition-colors ${frontFile ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-300 text-gray-500 hover:border-orange-300'}`}>
              {frontFile ? '✓ ' + t('scanFront') : '+ ' + t('scanFront')}
            </div>
            <input ref={frontRef} type="file" accept="image/*" capture="environment" onChange={handleFront} className="hidden" />
          </label>
          <label className="flex-1 cursor-pointer">
            <div className={`border rounded-lg p-2 text-center text-xs transition-colors ${backFile ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-300 text-gray-500 hover:border-orange-300'}`}>
              {backFile ? '✓ ' + t('scanBack') : '+ ' + t('scanBack')}
            </div>
            <input ref={backRef} type="file" accept="image/*" capture="environment" onChange={handleBack} className="hidden" />
          </label>
        </div>
        {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
        {done && <p className="text-green-600 text-xs mb-2">✓ {t('scanSuccess')}</p>}
        <button onClick={scan} disabled={scanning || (!frontFile && !backFile)}
          className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors">
          {scanning ? '⏳ ' + t('scanningCard') : '🔍 ' + t('scanAndFill')}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-orange-100">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">🪪</span>
        <div>
          <h3 className="font-bold text-gray-800">{t('scanIdCard')}</h3>
          <p className="text-sm text-gray-500">{t('scanIdCardSub')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <label className="cursor-pointer group">
          <div className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${frontPreview ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-orange-400 bg-gray-50'}`}>
            {frontPreview
              ? <img src={frontPreview} alt="front" className="w-full h-full object-cover rounded-xl" />
              : <>
                  <span className="text-3xl mb-2">📷</span>
                  <span className="text-sm font-medium text-gray-600">{t('scanFront')}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{t('scanFrontHint')}</span>
                </>}
          </div>
          <input type="file" accept="image/*" capture="environment" onChange={handleFront} className="hidden" />
        </label>

        <label className="cursor-pointer group">
          <div className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${backPreview ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-orange-400 bg-gray-50'}`}>
            {backPreview
              ? <img src={backPreview} alt="back" className="w-full h-full object-cover rounded-xl" />
              : <>
                  <span className="text-3xl mb-2">📷</span>
                  <span className="text-sm font-medium text-gray-600">{t('scanBack')}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{t('scanBackHint')}</span>
                </>}
          </div>
          <input type="file" accept="image/*" capture="environment" onChange={handleBack} className="hidden" />
        </label>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">{error}</div>}
      {done && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm mb-4">✓ {t('scanSuccess')}</div>}

      <button onClick={scan} disabled={scanning || (!frontFile && !backFile)}
        className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
        {scanning
          ? <><span className="animate-spin">⏳</span> {t('scanningCard')}</>
          : <><span>🔍</span> {t('scanAndFill')}</>}
      </button>
      <p className="text-xs text-gray-400 text-center mt-3">{t('scanPrivacyNote')}</p>
    </div>
  )
}
