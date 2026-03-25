import { useState } from 'react'
import { useTaskStore } from '../../stores/task-store'
import { useTimerStore } from '../../stores/timer-store'
import { CATEGORY_CONFIG, type Task } from '../../types'

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [showConfirmComplete, setShowConfirmComplete] = useState(false)
  const completeTask = useTaskStore((s) => s.completeTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const { startTimer, activeTaskId, phase } = useTimerStore()

  const config = CATEGORY_CONFIG[task.category]
  const isBloomed = task.status === 'bloomed'
  const isActive = activeTaskId === task.id
  const isTimerRunning = isActive && (phase === 'focus' || phase === 'break')
  // Compare date only (not time) — due_date is still valid on the day itself
  const isOverdue = task.due_date
    && new Date(task.due_date + 'T23:59:59') < new Date()
    && !isBloomed

  const progressDots = Array.from({ length: task.pomodoro_target }, (_, i) => (
    <span
      key={i}
      className={`inline-block w-1.5 h-1.5 rounded-full transition-colors duration-300
        ${i < task.pomodoro_completed ? 'bg-water' : 'bg-cream-dark'}`}
    />
  ))

  return (
    <div
      className={`rounded-xl p-3 border transition-all duration-300
        ${isBloomed
          ? 'bg-garden-light/20 border-garden/20'
          : isActive
            ? 'bg-water-light/20 border-water/30'
            : isOverdue
              ? 'bg-danger-light/10 border-danger/20'
              : 'bg-white/60 border-cream-dark/50 hover:border-cream-dark'
        }`}
    >
      {/* Top row: status icon + title + delete */}
      <div className="flex items-start gap-2">
        {/* Checkbox — click to complete (with confirmation) */}
        <button
          onClick={() => !isBloomed && setShowConfirmComplete(true)}
          disabled={isBloomed}
          title={isBloomed ? '已完成' : '標記完成'}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
            shrink-0 transition-all duration-300 cursor-pointer
            ${isBloomed
              ? 'bg-garden border-garden text-white cursor-default'
              : isActive
                ? 'bg-water/20 border-water hover:border-garden hover:bg-garden/10'
                : 'border-cream-dark hover:border-garden hover:bg-garden/10'
            }`}
        >
          {isBloomed && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{config.emoji}</span>
            <span
              className={`text-sm leading-tight ${isBloomed ? 'line-through text-brown-light' : 'text-brown'}`}
            >
              {task.title}
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1 mt-1.5">
            {progressDots}
            <span className="text-[10px] text-brown-light ml-1">
              {task.pomodoro_completed}/{task.pomodoro_target}
            </span>
          </div>
        </div>

        {/* Delete button (top-right, away from action buttons) */}
        {showConfirmDelete ? (
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={() => { deleteTask(task.id); setShowConfirmDelete(false) }}
                className="w-6 h-6 rounded text-[10px] bg-danger/10 text-danger
                  hover:bg-danger/20 transition-colors"
              >
                ✓
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="w-6 h-6 rounded text-[10px] text-brown-light
                  hover:bg-cream-dark/50 transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              title="刪除"
              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs
                text-brown-light/30 hover:text-danger hover:bg-danger-light/20
                transition-all duration-300 shrink-0"
            >
              ✕
            </button>
          )}
      </div>

      {/* Bottom row: action buttons (clearly separated) */}
      {!isBloomed && (
        <div className="flex items-center gap-2 mt-2 ml-7">
          {/* Water / Start pomodoro button */}
          <button
            onClick={() => startTimer(task.id)}
            disabled={isTimerRunning}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium
              transition-all duration-300
              ${isTimerRunning
                ? 'bg-water/20 text-water cursor-default'
                : 'bg-water-light/30 text-water hover:bg-water-light/50 active:scale-95'
              }`}
          >
            💧
            <span>{isTimerRunning ? '澆水中...' : '開始澆水'}</span>
          </button>

          {/* Manual complete button with confirmation */}
          {showConfirmComplete ? (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-brown-light">確定完成？</span>
              <button
                onClick={() => { completeTask(task.id); setShowConfirmComplete(false) }}
                className="px-2 py-0.5 rounded text-[10px] bg-garden/10 text-garden
                  hover:bg-garden/20 transition-colors font-medium"
              >
                確定
              </button>
              <button
                onClick={() => setShowConfirmComplete(false)}
                className="px-2 py-0.5 rounded text-[10px] text-brown-light
                  hover:bg-cream-dark/50 transition-colors"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmComplete(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs
                text-brown-light/60 hover:text-garden hover:bg-garden-light/20
                transition-all duration-300"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>標記完成</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
