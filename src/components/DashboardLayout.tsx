import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDocumentTitle } from '../hooks/use-document-title'
import { useThemeStore } from '../stores/theme-store'
import TaskList from './tasks/task-list'
import SearchBar from './tasks/search-bar'
import PomodoroTimer from './timer/pomodoro-timer'
import JournalPanel from './journal/journal-panel'
import GardenView from './garden/garden-view'
import AudioPlayer from './audio-player'
import LetterPanel from './journal/letter-panel'

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'
  useDocumentTitle()

  const today = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Gardener'

  return (
    <div className={`h-svh flex flex-col ${isDark ? 'dark bg-[#1a1612]' : 'bg-cream'}`}>
      {/* Top Bar */}
      <header className={`h-14 shrink-0 flex items-center justify-between px-4 lg:px-6 backdrop-blur-sm border-b
        ${isDark ? 'bg-[#221e1a]/80 border-[#3a3430] text-[#e8dfd4]' : 'bg-white/50 border-cream-dark'}`}>
        <div className="flex items-center gap-2">
          {/* Mobile/tablet toggle for left panel */}
          <button
            onClick={() => { setLeftOpen(!leftOpen); setRightOpen(false) }}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center
              text-brown-light hover:bg-cream-dark/50 transition-colors"
            title="種子列表"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 className="text-lg font-serif font-semibold text-brown tracking-wide">
            Bloomday
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex">
            <AudioPlayer />
          </div>
          <span className="text-sm text-brown-light hidden sm:inline">{today}</span>
          <span className="text-sm text-brown hidden sm:inline">
            嗨，{displayName}
          </span>
          {/* Mobile/tablet toggle for right panel */}
          <button
            onClick={() => { setRightOpen(!rightOpen); setLeftOpen(false) }}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center
              text-brown-light hover:bg-cream-dark/50 transition-colors"
            title="計時器與日記"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center
              text-brown-light hover:bg-cream-dark/50 transition-colors"
            title={isDark ? '切換淺色模式' : '切換深色模式'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={signOut}
            className="text-xs text-brown-light hover:text-danger transition-colors duration-300 px-2 py-1 rounded-lg hover:bg-danger-light/20"
          >
            登出
          </button>
        </div>
      </header>

      {/* Three-panel layout */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Left Sidebar — Seeds */}
        {/* Desktop: always visible. Tablet/mobile: overlay */}
        <aside
          className={`
            shrink-0 border-r backdrop-blur-sm overflow-y-auto p-4
            transition-transform duration-300 ease-out
            lg:relative lg:translate-x-0 lg:w-[300px]
            absolute inset-y-0 left-0 z-30 w-[300px]
            ${isDark ? 'bg-[#1a1612]/90 border-[#3a3430]' : 'bg-white/30 border-cream-dark'}
            ${leftOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="space-y-4">
            <SearchBar />
            <TaskList />
          </div>
        </aside>

        {/* Center — Garden View */}
        <main className="flex-1 min-w-0 overflow-hidden relative">
          <GardenView />
        </main>

        {/* Right Panel — Timer & Journal */}
        <aside
          className={`
            shrink-0 border-l backdrop-blur-sm overflow-y-auto p-4
            transition-transform duration-300 ease-out
            lg:relative lg:translate-x-0 lg:w-[340px]
            absolute inset-y-0 right-0 z-30 w-[340px]
            ${isDark ? 'bg-[#1a1612]/90 border-[#3a3430]' : 'bg-white/30 border-cream-dark'}
            ${rightOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="space-y-6">
            <PomodoroTimer />
            <JournalPanel />
            <LetterPanel />
          </div>
        </aside>

        {/* Backdrop overlay for mobile/tablet panels */}
        {(leftOpen || rightOpen) && (
          <div
            className="lg:hidden absolute inset-0 z-20 bg-brown/20 backdrop-blur-[2px]"
            onClick={() => { setLeftOpen(false); setRightOpen(false) }}
          />
        )}
      </div>
    </div>
  )
}
