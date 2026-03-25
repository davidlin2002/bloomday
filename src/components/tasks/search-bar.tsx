import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { CATEGORY_CONFIG, type Task, type JournalEntry } from '../../types'

interface SearchResults {
  tasks: Task[]
  journals: JournalEntry[]
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<number | null>(null)

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const search = async (q: string) => {
    if (!q.trim()) {
      setResults(null)
      setOpen(false)
      return
    }

    setSearching(true)
    setOpen(true)

    // Search tasks by title (simple ILIKE for reliability)
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .ilike('title', `%${q}%`)
      .limit(5)

    // Search journal entries by content
    const { data: journals } = await supabase
      .from('journal_entries')
      .select('*')
      .ilike('content', `%${q}%`)
      .order('entry_date', { ascending: false })
      .limit(5)

    setResults({
      tasks: (tasks as Task[]) || [],
      journals: (journals as JournalEntry[]) || [],
    })
    setSearching(false)
  }

  const handleChange = (val: string) => {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => search(val), 400)
  }

  const highlight = (text: string, q: string) => {
    if (!q.trim()) return text
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-sunflower-light/60 text-brown rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const totalResults = results ? results.tasks.length + results.journals.length : 0

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => results && setOpen(true)}
        placeholder="搜尋種子或日記..."
        className="w-full px-3 py-2 rounded-xl bg-cream/80 border border-cream-dark
          text-sm text-brown placeholder-brown-light/50
          focus:outline-none focus:ring-2 focus:ring-garden/30 focus:border-garden/40
          transition-all duration-300"
      />

      {/* Dropdown results */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm
          rounded-xl border border-cream-dark shadow-lg z-50 max-h-[360px] overflow-y-auto">
          {searching ? (
            <div className="p-3 text-center">
              <span className="text-xs text-brown-light">搜尋中...</span>
            </div>
          ) : totalResults === 0 ? (
            <div className="p-3 text-center">
              <span className="text-xs text-brown-light">找不到結果</span>
            </div>
          ) : (
            <div className="py-1">
              {/* Task results */}
              {results!.tasks.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[10px] text-brown-light/60 uppercase tracking-wider">
                    種子
                  </p>
                  {results!.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="px-3 py-2 hover:bg-cream/60 transition-colors cursor-default"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{CATEGORY_CONFIG[task.category].emoji}</span>
                        <span className="text-sm text-brown">
                          {highlight(task.title, query)}
                        </span>
                        {task.status === 'bloomed' && (
                          <span className="text-[10px] text-garden">已綻放</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Journal results */}
              {results!.journals.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[10px] text-brown-light/60 uppercase tracking-wider border-t border-cream-dark/30">
                    日記
                  </p>
                  {results!.journals.map((entry) => (
                    <div
                      key={entry.id}
                      className="px-3 py-2 hover:bg-cream/60 transition-colors cursor-default"
                    >
                      <p className="text-[11px] text-brown-light mb-0.5">{entry.entry_date}</p>
                      <p className="text-xs text-brown line-clamp-2">
                        {highlight(entry.content, query)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
