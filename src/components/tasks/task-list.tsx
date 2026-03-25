import { useEffect, useState, useMemo } from 'react'
import { useTaskStore } from '../../stores/task-store'
import TaskItem from './task-item'
import CreateTaskForm from './create-task-form'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export default function TaskList() {
  const { tasks, loading, error, fetchTasks } = useTaskStore()
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const today = getToday()

  const todayTasks = useMemo(
    () =>
      tasks.filter((t) => {
        if (t.status === 'bloomed') return false
        if (!t.due_date) return true // no due date = today
        return t.due_date <= today
      }),
    [tasks, today],
  )

  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== 'bloomed' && t.due_date && t.due_date > today)
        .sort((a, b) => (a.due_date! > b.due_date! ? 1 : -1)),
    [tasks, today],
  )

  const recentBloomed = useMemo(
    () =>
      tasks
        .filter((t) => t.status === 'bloomed')
        .slice(0, 5),
    [tasks],
  )

  // Group upcoming by date
  const upcomingGrouped = useMemo(() => {
    const groups: Record<string, typeof upcomingTasks> = {}
    for (const task of upcomingTasks) {
      const date = task.due_date!
      if (!groups[date]) groups[date] = []
      groups[date].push(task)
    }
    return groups
  }, [upcomingTasks])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (dateStr === tomorrow.toISOString().split('T')[0]) return '明天'
    return date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-5">
      {/* Error message */}
      {error && (
        <div className="bg-danger-light/30 border border-danger/20 text-danger rounded-xl px-3 py-2 text-xs">
          {error}
        </div>
      )}

      {/* Add button */}
      {!showCreate && (
        <button
          onClick={() => setShowCreate(true)}
          className="w-full py-2 rounded-xl border-2 border-dashed border-garden/30
            text-sm text-garden hover:bg-garden-light/10 hover:border-garden/50
            transition-all duration-300"
        >
          + 種下新種子
        </button>
      )}

      {showCreate && <CreateTaskForm onClose={() => setShowCreate(false)} />}

      {/* Today's seeds */}
      <section>
        <h3 className="text-xs font-medium text-brown-light uppercase tracking-wider mb-2">
          今日種子 {todayTasks.length > 0 && `(${todayTasks.length})`}
        </h3>
        {loading ? (
          <div className="text-center py-4">
            <div className="text-lg animate-pulse">🌱</div>
          </div>
        ) : todayTasks.length === 0 ? (
          <div className="bg-white/60 rounded-xl p-3 border border-cream-dark/50">
            <p className="text-sm text-brown-light italic text-center py-3">
              還沒有種子，開始種下第一顆吧
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming seeds */}
      <section>
        <h3 className="text-xs font-medium text-brown-light uppercase tracking-wider mb-2">
          即將到來
        </h3>
        {Object.keys(upcomingGrouped).length === 0 ? (
          <div className="bg-white/60 rounded-xl p-3 border border-cream-dark/50">
            <p className="text-sm text-brown-light italic text-center py-3">
              工具棚裡還是空的
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(upcomingGrouped).map(([date, dateTasks]) => (
              <div key={date}>
                <p className="text-[11px] text-brown-light/70 mb-1.5 pl-1">
                  {formatDate(date)}
                </p>
                <div className="space-y-2">
                  {dateTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent bloomed */}
      {recentBloomed.length > 0 && (
        <section>
          <h3 className="text-xs font-medium text-brown-light uppercase tracking-wider mb-2">
            最近綻放
          </h3>
          <div className="space-y-2">
            {recentBloomed.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
