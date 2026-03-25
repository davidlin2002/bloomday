import { useState } from 'react'
import { useTaskStore } from '../../stores/task-store'
import { useTimerStore } from '../../stores/timer-store'
import { CATEGORY_CONFIG, type Task } from '../../types'

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const completeTask = useTaskStore((s) => s.completeTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const { startTimer, activeTaskId } = useTimerStore()

  const config = CATEGORY_CONFIG[task.category]
  const isBloomed = task.status === 'bloomed'
  const isActive = activeTaskId === task.id
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isBloomed

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
      <div className="flex items-start gap-2">
        {/* Complete checkbox */}
        <button
          onClick={() => !isBloomed && completeTask(task.id)}
          disabled={isBloomed}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
            shrink-0 transition-all duration-300
            ${isBloomed
              ? 'bg-garden border-garden text-white'
              : 'border-cream-dark hover:border-garden'
            }`}
        >
          {isBloomed && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title row */}
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

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {!isBloomed && (
            <button
              onClick={() => startTimer(task.id)}
              disabled={isActive}
              title="開始澆水"
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm
                transition-all duration-300
                ${isActive
                  ? 'bg-water/20 text-water'
                  : 'hover:bg-water-light/30 text-brown-light hover:text-water'
                }`}
            >
              💧
            </button>
          )}
          {showConfirmDelete ? (
            <div className="flex items-center gap-0.5">
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
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs
                text-brown-light/40 hover:text-danger hover:bg-danger-light/20
                transition-all duration-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
