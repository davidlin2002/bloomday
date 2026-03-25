import { useState, type FormEvent } from 'react'
import { useTaskStore } from '../../stores/task-store'
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG, type Category, type Difficulty } from '../../types'

interface CreateTaskFormProps {
  onClose: () => void
}

export default function CreateTaskForm({ onClose }: CreateTaskFormProps) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [category, setCategory] = useState<Category>('work')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const createTask = useTaskStore((s) => s.createTask)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    await createTask({
      title: title.trim(),
      notes: notes.trim() || undefined,
      category,
      difficulty,
      due_date: dueDate || null,
    })
    setSubmitting(false)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="種子名稱..."
        autoFocus
        required
        className="w-full px-3 py-2 rounded-xl bg-cream/80 border border-cream-dark
          text-sm text-brown placeholder-brown-light/50
          focus:outline-none focus:ring-2 focus:ring-garden/30 focus:border-garden/40
          transition-all duration-300"
      />

      {/* Category */}
      <div>
        <label className="block text-xs text-brown-light mb-1.5">分類</label>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(
            ([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-200
                  ${category === key
                    ? 'bg-garden/20 text-garden border border-garden/30'
                    : 'bg-cream/60 text-brown-light border border-transparent hover:bg-cream-dark/50'
                  }`}
              >
                {config.emoji} {config.label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-xs text-brown-light mb-1.5">難度</label>
        <div className="flex gap-1.5">
          {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(
            ([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setDifficulty(key)}
                className={`flex-1 px-2.5 py-1 rounded-lg text-xs transition-all duration-200
                  ${difficulty === key
                    ? 'bg-water/20 text-water border border-water/30'
                    : 'bg-cream/60 text-brown-light border border-transparent hover:bg-cream-dark/50'
                  }`}
              >
                {config.label} ({config.target})
              </button>
            ),
          )}
        </div>
      </div>

      {/* Due date */}
      <div>
        <label className="block text-xs text-brown-light mb-1.5">到期日（選填）</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl bg-cream/80 border border-cream-dark
            text-sm text-brown focus:outline-none focus:ring-2 focus:ring-garden/30
            transition-all duration-300"
        />
      </div>

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="備註（選填）..."
        rows={2}
        className="w-full px-3 py-2 rounded-xl bg-cream/80 border border-cream-dark
          text-sm text-brown placeholder-brown-light/50 resize-none
          focus:outline-none focus:ring-2 focus:ring-garden/30 focus:border-garden/40
          transition-all duration-300"
      />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="flex-1 py-2 rounded-xl bg-garden text-white text-sm font-medium
            hover:bg-garden/90 active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-300"
        >
          {submitting ? '種下中...' : '種下種子'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-sm text-brown-light
            hover:bg-cream-dark/50 transition-all duration-300"
        >
          取消
        </button>
      </div>
    </form>
  )
}
