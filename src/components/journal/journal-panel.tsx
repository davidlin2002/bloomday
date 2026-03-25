import { useEffect, useState, useRef, useCallback } from 'react'
import { useJournalStore } from '../../stores/journal-store'
import { MOOD_CONFIG } from '../../types'

export default function JournalPanel() {
  const { todayEntry, loading, saving, fetchTodayEntry, saveEntry } = useJournalStore()
  const [content, setContent] = useState('')
  const [learning, setLearning] = useState('')
  const [mood, setMood] = useState(3)
  const [showHistory, setShowHistory] = useState(false)
  const saveTimeout = useRef<number | null>(null)

  useEffect(() => {
    fetchTodayEntry()
  }, [fetchTodayEntry])

  // Sync from store when entry loads
  useEffect(() => {
    if (todayEntry) {
      setContent(todayEntry.content)
      setLearning(todayEntry.learning || '')
      setMood(todayEntry.mood)
    }
  }, [todayEntry])

  // Auto-save with debounce
  const debouncedSave = useCallback(
    (newContent: string, newMood: number, newLearning: string) => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
      saveTimeout.current = window.setTimeout(() => {
        if (newContent.trim()) {
          saveEntry(newContent, newMood, newLearning)
        }
      }, 1500)
    },
    [saveEntry],
  )

  const handleContentChange = (val: string) => {
    setContent(val)
    debouncedSave(val, mood, learning)
  }

  const handleLearningChange = (val: string) => {
    setLearning(val)
    debouncedSave(content, mood, val)
  }

  const handleMoodChange = (val: number) => {
    setMood(val)
    if (content.trim()) {
      debouncedSave(content, val, learning)
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-brown-light uppercase tracking-wider">
          園藝日記
        </h3>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-[10px] text-brown-light/60 hover:text-brown-light transition-colors"
        >
          {showHistory ? '回到今天' : '瀏覽過去'}
        </button>
      </div>

      {showHistory ? (
        <JournalHistory />
      ) : (
        <div className="bg-white/60 rounded-xl p-4 border border-cream-dark/50">
          {/* Mood selector */}
          <div className="flex justify-center gap-2 mb-3">
            {MOOD_CONFIG.map((m) => (
              <button
                key={m.value}
                onClick={() => handleMoodChange(m.value)}
                className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center
                  transition-all duration-300
                  ${mood === m.value
                    ? 'bg-sunflower-light/50 scale-110 shadow-sm'
                    : 'hover:bg-cream-dark/50'
                  }`}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="今天的花園裡發生了什麼..."
            className="w-full h-24 px-3 py-2 rounded-xl bg-cream/60 border border-cream-dark
              text-sm text-brown placeholder-brown-light/50 resize-none
              focus:outline-none focus:ring-2 focus:ring-garden/30 focus:border-garden/40
              transition-all duration-300"
          />

          {/* Learning */}
          <textarea
            value={learning}
            onChange={(e) => handleLearningChange(e.target.value)}
            placeholder="今天學到了什麼..."
            className="w-full h-16 mt-2 px-3 py-2 rounded-xl bg-cream/60 border border-cream-dark
              text-sm text-brown placeholder-brown-light/50 resize-none
              focus:outline-none focus:ring-2 focus:ring-garden/30 focus:border-garden/40
              transition-all duration-300"
          />

          {/* Status */}
          <div className="flex items-center justify-end mt-2">
            {saving && (
              <span className="text-[10px] text-brown-light/50">儲存中...</span>
            )}
            {!saving && !loading && todayEntry && (
              <span className="text-[10px] text-garden/60">已儲存</span>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

function JournalHistory() {
  const { entries, fetchEntries } = useJournalStore()

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  if (entries.length === 0) {
    return (
      <div className="bg-white/60 rounded-xl p-4 border border-cream-dark/50">
        <p className="text-sm text-brown-light italic text-center py-3">
          還沒有任何日記
        </p>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    })
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {entries.map((entry) => {
        const moodEmoji = MOOD_CONFIG.find((m) => m.value === entry.mood)?.emoji || '☁️'
        return (
          <div
            key={entry.id}
            className="bg-white/60 rounded-xl p-3 border border-cream-dark/50"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">{moodEmoji}</span>
              <span className="text-[11px] text-brown-light">{formatDate(entry.entry_date)}</span>
            </div>
            <p className="text-xs text-brown leading-relaxed line-clamp-3">
              {entry.content}
            </p>
            {entry.learning && (
              <p className="text-[11px] text-garden/80 mt-1.5 border-t border-cream-dark/30 pt-1.5">
                {entry.learning}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
