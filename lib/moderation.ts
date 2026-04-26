const BAD_WORDS = [
  'fuck', 'shit', 'bastard', 'asshole', 'bitch', 'cunt', 'dick', 'piss',
  'racist', 'nigger', 'faggot', 'retard', 'whore', 'slut',
  'kut', 'lul', 'eikel', 'hoer', 'kanker', 'godverdomme',
]

export function containsBadWords(text: string): { flagged: boolean; reason?: string } {
  const lower = text.toLowerCase()
  for (const word of BAD_WORDS) {
    if (lower.includes(word)) {
      return { flagged: true, reason: `Contains inappropriate language` }
    }
  }
  return { flagged: false }
}

export function moderateContent(text: string) {
  const result = containsBadWords(text)
  return result
}

export function isValidImageType(mimeType: string) {
  return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(mimeType)
}

export function isValidImageSize(sizeBytes: number) {
  return sizeBytes <= 5 * 1024 * 1024 // 5MB max
}
