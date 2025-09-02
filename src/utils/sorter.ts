import kanjiRomajiMap from '@/data/kanjiRomajiMap'
import { FileNode } from '@/types/file'
import { francAll, franc } from 'franc-min'
import { pinyin } from 'pinyin-pro'
import { toRomaji } from 'wanakana'

export const fileSorter = (files: FileNode[], foldersFirst: boolean, sortBy: string, orderBy: string) => {
  return [...files].sort((a, b) => {
    if (foldersFirst) {
      if (a.folder === 1 && b.folder === 0) {
        return -1
      }
      if (a.folder === 0 && b.folder === 1) {
        return 1
      }
    }

    let compareResult = 0

    if (sortBy === 'name') {
      compareResult = fileModeNameCollator(a, b)
    } else if (sortBy === 'size') {
      compareResult = a.size - b.size
    } else if (sortBy === 'datetime' && a.lastModifiedDateTime && b.lastModifiedDateTime) {
      compareResult = new Date(a.lastModifiedDateTime).getTime() - new Date(b.lastModifiedDateTime).getTime()
    }

    return orderBy === 'asc' ? compareResult : -compareResult
  })
}

export const normalizeNameForSort = (name: string): string => {
  let normalized = name

  const kanjiRegex = new RegExp(Object.keys(kanjiRomajiMap).join('|'), 'g')

  if (/[ぁ-んァ-ン]/.test(normalized) || francAll(normalized).some(guess => guess[0] === 'jpn')) {
    normalized = normalized.replace(kanjiRegex, (match) => (kanjiRomajiMap[match as keyof typeof kanjiRomajiMap] || match))
    normalized = toRomaji(normalized, { upcaseKatakana: true })
  }
  else if (/[\u4e00-\u9fa5]/.test(normalized) || franc(normalized) === 'cmn') {
    normalized = pinyin(normalized, { toneType: 'none', nonZh: 'consecutive' })
  }

  return normalized
    .toLowerCase()
    .replace(/[._!"'()[\]-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function fileModeNameCollator(a: FileNode, b: FileNode): number {
  const normalizedA = normalizeNameForSort(a.name)
  const normalizedB = normalizeNameForSort(b.name)

  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

  return collator.compare(normalizedA, normalizedB)
}