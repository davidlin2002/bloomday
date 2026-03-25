import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex items-center justify-center min-h-[200px] p-6">
          <div className="text-center bg-white/60 rounded-2xl p-8 border border-cream-dark/50 max-w-md">
            <div className="text-3xl mb-3">🥀</div>
            <h3 className="text-lg font-serif text-brown mb-2">哎呀，出了點問題</h3>
            <p className="text-sm text-brown-light mb-4">
              {this.state.error?.message || '發生了未知的錯誤'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-garden text-white text-sm font-medium
                hover:bg-garden/90 transition-colors"
            >
              重新整理
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
