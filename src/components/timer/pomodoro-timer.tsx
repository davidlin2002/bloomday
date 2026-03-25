import { useTimerStore, FOCUS_PRESETS, BREAK_PRESETS } from '../../stores/timer-store'
import { useTaskStore } from '../../stores/task-store'

export default function PomodoroTimer() {
  const {
    activeTaskId, phase, secondsRemaining, totalSeconds,
    focusMinutes, breakMinutes,
    setFocusMinutes, setBreakMinutes,
    pauseTimer, resumeTimer, resetTimer, intervalId,
  } = useTimerStore()
  const tasks = useTaskStore((s) => s.tasks)

  const activeTask = activeTaskId ? tasks.find((t) => t.id === activeTaskId) : null
  const isPaused = phase !== 'idle' && !intervalId
  const isRunning = phase !== 'idle' && !!intervalId
  const isIdle = phase === 'idle'

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Progress ring
  const progress = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <section>
      <h3 className="text-xs font-medium text-brown-light uppercase tracking-wider mb-3">
        澆水計時器
      </h3>
      <div className="bg-white/60 rounded-xl p-5 border border-cream-dark/50 text-center">
        {/* Duration selectors — only when idle */}
        {isIdle && (
          <div className="mb-4 space-y-2">
            <div>
              <span className="text-[11px] text-brown-light">專注</span>
              <div className="flex justify-center gap-1.5 mt-1">
                {FOCUS_PRESETS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setFocusMinutes(m)}
                    className={`px-2 py-0.5 rounded-lg text-xs transition-all duration-200
                      ${focusMinutes === m
                        ? 'bg-water/20 text-water border border-water/30 font-medium'
                        : 'text-brown-light hover:bg-cream-dark/50'
                      }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-brown-light">休息</span>
              <div className="flex justify-center gap-1.5 mt-1">
                {BREAK_PRESETS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setBreakMinutes(m)}
                    className={`px-2 py-0.5 rounded-lg text-xs transition-all duration-200
                      ${breakMinutes === m
                        ? 'bg-sunflower/20 text-brown border border-sunflower/30 font-medium'
                        : 'text-brown-light hover:bg-cream-dark/50'
                      }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timer circle */}
        <div className="relative inline-block mb-3">
          <svg width="128" height="128" className="-rotate-90">
            <circle
              cx="64" cy="64" r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-cream-dark"
            />
            <circle
              cx="64" cy="64" r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-1000 ease-linear
                ${phase === 'focus' ? 'text-water' : phase === 'break' ? 'text-sunflower' : 'text-cream-dark'}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-light text-brown font-serif tabular-nums">
              {timeDisplay}
            </span>
            {phase === 'focus' && (
              <span className="text-[10px] text-water mt-0.5">專注中 💧</span>
            )}
            {phase === 'break' && (
              <span className="text-[10px] text-sunflower mt-0.5">休息中 ☀️</span>
            )}
          </div>
        </div>

        {/* Active task name */}
        {activeTask && (
          <p className="text-xs text-brown-light mb-3 truncate px-2">
            {activeTask.title}
          </p>
        )}
        {!activeTask && isIdle && (
          <p className="text-xs text-brown-light mb-3">選擇一顆種子開始澆水</p>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {isIdle ? (
            <button
              disabled
              className="px-6 py-2 rounded-xl bg-water text-white text-sm font-medium
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-300"
            >
              開始
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={resumeTimer}
                  className="px-5 py-2 rounded-xl bg-water text-white text-sm font-medium
                    hover:bg-water/90 active:scale-[0.98]
                    transition-all duration-300"
                >
                  繼續
                </button>
              ) : isRunning ? (
                <button
                  onClick={pauseTimer}
                  className="px-5 py-2 rounded-xl bg-brown-light/20 text-brown text-sm font-medium
                    hover:bg-brown-light/30 active:scale-[0.98]
                    transition-all duration-300"
                >
                  暫停
                </button>
              ) : null}
              <button
                onClick={resetTimer}
                className="px-4 py-2 rounded-xl text-sm text-brown-light
                  hover:bg-cream-dark/50 transition-all duration-300"
              >
                重設
              </button>
            </>
          )}
        </div>

        {/* Session count for active task */}
        {activeTask && (
          <p className="text-[10px] text-brown-light/60 mt-3">
            已完成 {activeTask.pomodoro_completed} / {activeTask.pomodoro_target} 次澆水
          </p>
        )}
      </div>
    </section>
  )
}
