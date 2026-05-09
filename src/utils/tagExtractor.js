import { TAG_KEYWORDS } from '../config'

export function extractTags(description) {
  const lower = description.toLowerCase()
  return Object.entries(TAG_KEYWORDS)
    .filter(([, keywords]) => keywords.some(kw => lower.includes(kw)))
    .map(([tag]) => tag)
}
