import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('密碼至少需要 6 個字元')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, displayName || 'Gardener')
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-cream relative overflow-hidden">
      {/* Watercolor background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-lavender-light/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-sunflower-light/30 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-bloom-light/25 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-56 h-56 rounded-full bg-garden-light/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-semibold text-brown mb-2">
            Bloomday
          </h1>
          <p className="text-brown-light text-sm">
            開始種下你的第一顆種子
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/80">
          <h2 className="text-xl font-serif font-medium text-brown mb-6 text-center">
            建立帳號
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-light/30 border border-danger/20 text-danger rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-brown-light mb-1.5">顯示名稱</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-cream/80 border border-cream-dark
                  text-brown placeholder-brown-light/50 text-sm
                  focus:outline-none focus:ring-2 focus:ring-garden/30 focus:border-garden/40
                  transition-all duration-300"
                placeholder="你的園丁名稱"
              />
            </div>

            <div>
              <label className="block text-sm text-brown-light mb-1.5">電子郵件</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-cream/80 border border-cream-dark
                  text-brown placeholder-brown-light/50 text-sm
                  focus:outline-none focus:ring-2 focus:ring-garden/30 focus:border-garden/40
                  transition-all duration-300"
                placeholder="hello@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-brown-light mb-1.5">密碼</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-cream/80 border border-cream-dark
                  text-brown placeholder-brown-light/50 text-sm
                  focus:outline-none focus:ring-2 focus:ring-garden/30 focus:border-garden/40
                  transition-all duration-300"
                placeholder="至少 6 個字元"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-garden text-white font-medium text-sm
                hover:bg-garden/90 active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300 ease-out mt-2"
            >
              {loading ? '建立中...' : '建立帳號'}
            </button>
          </form>

          <p className="text-center text-sm text-brown-light mt-6">
            已經有帳號？{' '}
            <Link to="/login" className="text-garden font-medium hover:underline">
              登入
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
