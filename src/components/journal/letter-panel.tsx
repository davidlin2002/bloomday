import { useEffect, useState, type FormEvent } from 'react'
import { useLetterStore } from '../../stores/letter-store'

export default function LetterPanel() {
  const { letters, revealedToday, fetchLetters, createLetter, markRevealed } = useLetterStore()
  const [showWrite, setShowWrite] = useState(false)
  const [content, setContent] = useState('')
  const [revealDate, setRevealDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchLetters()
  }, [fetchLetters])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !revealDate) return

    setSubmitting(true)
    await createLetter(content.trim(), revealDate)
    setSubmitting(false)
    setContent('')
    setRevealDate('')
    setShowWrite(false)
  }

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const buriedCount = letters.filter((l) => l.reveal_date > today).length

  return (
    <section>
      <h3 className="text-xs font-medium text-brown-light uppercase tracking-wider mb-3">
        給未來的信
      </h3>

      {/* Revealed letters notification */}
      {revealedToday.length > 0 && (
        <div className="space-y-2 mb-3">
          {revealedToday.map((letter) => (
            <div
              key={letter.id}
              className="bg-sunflower-light/30 border border-sunflower/30 rounded-xl p-3 animate-pulse"
            >
              <p className="text-[11px] text-sunflower mb-1">
                一顆種子發芽了！來自 {new Date(letter.created_at).toLocaleDateString('zh-TW')} 的你
              </p>
              <p className="text-sm text-brown leading-relaxed">{letter.content}</p>
              <button
                onClick={() => markRevealed(letter.id)}
                className="mt-2 text-[11px] text-brown-light hover:text-garden transition-colors"
              >
                已讀，收進花園
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Write new letter */}
      {showWrite ? (
        <form onSubmit={handleSubmit} className="bg-white/60 rounded-xl p-4 border border-cream-dark/50 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="寫一些話給未來的自己..."
            required
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-cream/60 border border-cream-dark
              text-sm text-brown placeholder-brown-light/50 resize-none
              focus:outline-none focus:ring-2 focus:ring-sunflower/30 focus:border-sunflower/40
              transition-all duration-300"
          />
          <div>
            <label className="block text-xs text-brown-light mb-1">什麼時候打開？</label>
            <input
              type="date"
              value={revealDate}
              onChange={(e) => setRevealDate(e.target.value)}
              min={minDate}
              required
              className="w-full px-3 py-1.5 rounded-xl bg-cream/60 border border-cream-dark
                text-sm text-brown focus:outline-none focus:ring-2 focus:ring-sunflower/30
                transition-all duration-300"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || !content.trim() || !revealDate}
              className="flex-1 py-2 rounded-xl bg-sunflower text-brown text-sm font-medium
                hover:bg-sunflower/90 active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-300"
            >
              {submitting ? '埋下中...' : '埋下種子'}
            </button>
            <button
              type="button"
              onClick={() => setShowWrite(false)}
              className="px-4 py-2 rounded-xl text-sm text-brown-light
                hover:bg-cream-dark/50 transition-all duration-300"
            >
              取消
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowWrite(true)}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-sunflower/30
            text-sm text-sunflower hover:bg-sunflower-light/10 hover:border-sunflower/50
            transition-all duration-300"
        >
          寫一封信給未來的自己
        </button>
      )}

      {/* Buried count */}
      {buriedCount > 0 && (
        <p className="text-[10px] text-brown-light/50 text-center mt-2">
          {buriedCount} 顆種子正在等待發芽...
        </p>
      )}
    </section>
  )
}
