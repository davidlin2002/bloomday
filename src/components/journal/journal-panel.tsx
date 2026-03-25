import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJournalStore } from '../../stores/journal-store'
import { MOOD_CONFIG } from '../../types'

export default function JournalPanel() {
  const { todayEntry, loading, saving, fetchTodayEntry, saveEntry } = useJournalStore()
  const [content, setContent] = useState('')
  const [learning, setLearning] = useState('')
  const [mood, setMood] = useState(3)
  const [showHistory, setShowHistory] = useState(false)
  const [expanded, setExpanded] = useState(false)
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

  // Close on Escape
  useEffect(() => {
    if (!expanded) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [expanded])

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

  const journalForm = (isExpanded: boolean) => (
    <div className={isExpanded
      ? 'bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-cream-dark/30 shadow-xl w-full'
      : 'bg-white/60 rounded-xl p-4 border border-cream-dark/50'
    }>
      {/* Header in expanded mode */}
      {isExpanded && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif text-brown font-medium">
            園藝日記
          </h2>
          <button
            onClick={() => setExpanded(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center
              text-brown-light hover:text-brown hover:bg-cream-dark/50
              transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Mood selector */}
      <div className={`flex justify-center gap-2 ${isExpanded ? 'mb-4' : 'mb-3'}`}>
        {MOOD_CONFIG.map((m) => (
          <button
            key={m.value}
            onClick={() => handleMoodChange(m.value)}
            className={`rounded-lg flex items-center justify-center
              transition-all duration-300
              ${isExpanded ? 'w-10 h-10 text-xl' : 'w-8 h-8 text-lg'}
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

      {/* Content — click to expand in sidebar mode */}
      {isExpanded ? (
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="今天的花園裡發生了什麼..."
          autoFocus
          className="w-full h-48 px-3 py-2 rounded-xl bg-cream/60 border border-cream-dark
            text-base leading-relaxed text-brown placeholder-brown-light/50 resize-none
            focus:outline-none focus:ring-2 focus:ring-garden/30 focus:border-garden/40
            transition-all duration-300"
        />
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-left px-3 py-2 rounded-xl bg-cream/60 border border-cream-dark
            hover:border-garden/30 hover:bg-cream/80 transition-all duration-200
            min-h-[60px] group"
        >
          {content ? (
            <p className="text-sm text-brown line-clamp-2">{content}</p>
          ) : (
            <p className="text-sm text-brown-light/50">今天的花園裡發生了什麼...（點擊展開編輯）</p>
          )}
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-brown-light/40
            group-hover:text-brown-light/60 transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            點擊展開大視窗編輯
          </div>
        </button>
      )}

      {/* Learning — only show in expanded mode */}
      {isExpanded && (
        <textarea
          value={learning}
          onChange={(e) => handleLearningChange(e.target.value)}
          placeholder="今天學到了什麼..."
          className="w-full h-28 mt-2 px-3 py-2 rounded-xl bg-cream/60 border border-cream-dark
            text-base leading-relaxed text-brown placeholder-brown-light/50 resize-none
            focus:outline-none focus:ring-2 focus:ring-garden/30 focus:border-garden/40
            transition-all duration-300"
        />
      )}

      {/* Status */}
      <div className="flex items-center justify-end mt-2">
        {isExpanded && (
          <button
            onClick={() => setExpanded(false)}
            className="mr-auto px-3 py-1 rounded-lg text-xs text-brown-light
              hover:bg-cream-dark/50 transition-colors"
          >
            Esc 收起
          </button>
        )}
        {saving && (
          <span className="text-[10px] text-brown-light/50">儲存中...</span>
        )}
        {!saving && !loading && todayEntry && (
          <span className="text-[10px] text-garden/60">已儲存</span>
        )}
      </div>
    </div>
  )

  return (
    <>
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
          journalForm(false)
        )}
      </section>

      {/* Expanded modal overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-brown/30 backdrop-blur-sm"
              onClick={() => setExpanded(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal content */}
            <motion.div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {journalForm(true)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function JournalHistory() {
  const { entries, fetchEntries } = useJournalStore()
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)

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
    <>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {entries.map((entry) => {
          const moodEmoji = MOOD_CONFIG.find((m) => m.value === entry.mood)?.emoji || '☁️'
          return (
            <button
              key={entry.id}
              onClick={() => setSelectedEntry(entry.id)}
              className="w-full text-left bg-white/60 rounded-xl p-3 border border-cream-dark/50
                hover:border-cream-dark hover:bg-white/80 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">{moodEmoji}</span>
                <span className="text-[11px] text-brown-light">{formatDate(entry.entry_date)}</span>
              </div>
              <p className="text-xs text-brown leading-relaxed line-clamp-3">
                {entry.content}
              </p>
              {entry.learning && (
                <p className="text-[11px] text-garden/80 mt-1.5 border-t border-cream-dark/30 pt-1.5 line-clamp-2">
                  {entry.learning}
                </p>
              )}
            </button>
          )
        })}
      </div>

      {/* History entry expanded modal */}
      <AnimatePresence>
        {selectedEntry && (() => {
          const entry = entries.find((e) => e.id === selectedEntry)
          if (!entry) return null
          const moodItem = MOOD_CONFIG.find((m) => m.value === entry.mood)
          return (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-brown/30 backdrop-blur-sm"
                onClick={() => setSelectedEntry(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10
                  bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-cream-dark/30 shadow-xl"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{moodItem?.emoji || '☁️'}</span>
                    <span className="text-sm text-brown-light">{formatDate(entry.entry_date)}</span>
                    <span className="text-xs text-brown-light/50">{moodItem?.label}</span>
                  </div>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                      text-brown-light hover:text-brown hover:bg-cream-dark/50
                      transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="bg-cream/40 rounded-xl p-4 mb-3">
                  <p className="text-sm text-brown leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>

                {entry.learning && (
                  <div className="bg-garden-light/10 rounded-xl p-4 border border-garden/10">
                    <p className="text-[11px] text-garden font-medium mb-1">今日學習</p>
                    <p className="text-sm text-brown leading-relaxed whitespace-pre-wrap">
                      {entry.learning}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </>
  )
}
