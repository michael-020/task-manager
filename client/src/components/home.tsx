import { useEffect, useState } from "react"
import { useTaskStore } from "../store/taskStore"
import { useAuthStore } from "../store/authStore"
import { Trash2, Pencil, Check, RotateCcw, Plus, Search, LogOut } from "lucide-react"
import DeleteModal from "./delete-modal"
import CreateTaskModal from "./create-task-modal"
import TaskSkeleton from "./task-skeleton"

export default function Home() {
  const {
    tasks,
    fetchTasks,
    createTask,
    toggleTask,
    deleteTask,
    updateTask,
    currentPage,
    totalPages,
    loading,
    createLoading,
    totalTasks,
    completedTasks,
    pendingTasks,
  } = useTaskStore()

  const { user, logout, logoutLoading } = useAuthStore()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editTask, setEditTask] = useState<any>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchTasks(1)
  }, [])

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true
      return task.status === filter
    })
    .filter((task) => {
      if (!search.trim()) return true
      return (
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase())
      )
    })

  const handleCreate = async (data: any) => {
    await createTask(data)
    setShowCreate(false)
  }

  const filteredTotal =
    filter === "all" ? totalTasks : filter === "completed" ? completedTasks : pendingTasks

  const showPagination = !search.trim() && filteredTotal > 5 && totalPages > 1

  return (
    <div className="min-h-screen bg-neutral-100">

      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <span className="text-base font-semibold text-neutral-900">Taskly</span>
          <button
            disabled={logoutLoading}
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <LogOut size={15} />
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6">

        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">Welcome back</p>
            <h1 className="text-base font-semibold text-neutral-800">{user?.name}</h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} />
            {createLoading ? "Adding..." : "New Task"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", value: totalTasks, color: "text-neutral-800" },
            { label: "Pending", value: pendingTasks, color: "text-amber-600" },
            { label: "Completed", value: completedTasks, color: "text-green-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-neutral-200 px-4 py-3">
              <p className="text-xs text-neutral-400 mb-1">{label}</p>
              <p className={`text-2xl font-semibold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>

          <div className="flex bg-white border border-neutral-200 rounded-lg overflow-hidden">
            {["all", "pending", "completed"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-3 py-2 text-sm capitalize transition-colors ${
                  filter === type
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <TaskSkeleton />
        ) : (
          <>
            {filteredTasks.length === 0 && (
              <div className="text-center text-neutral-400 text-sm py-16">
                {tasks.length === 0
                  ? "No tasks yet — create your first one."
                  : search.trim()
                  ? "No tasks match your search."
                  : `No ${filter} tasks.`}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`bg-white border border-neutral-200 rounded-xl px-4 py-3 flex justify-between items-center gap-3 transition-opacity ${
                    task.status === "completed" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          task.status === "completed" ? "bg-green-500" : "bg-amber-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-medium truncate ${
                          task.status === "completed"
                            ? "line-through text-neutral-400"
                            : "text-neutral-800"
                        }`}
                      >
                        {task.title}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 ml-3.5">
                      {task.description && (
                        <div className="text-xs text-neutral-400 truncate">{task.description}</div>
                      )}
                      {task.dueDate && (
                        <div className="text-xs text-neutral-400 whitespace-nowrap flex-shrink-0">
                          Due Date: {new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() =>
                        toggleTask(task._id, task.status === "pending" ? "completed" : "pending")
                      }
                      title={task.status === "pending" ? "Mark complete" : "Mark pending"}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      {task.status === "pending" ? <Check size={14} /> : <RotateCcw size={14} />}
                    </button>

                    <button
                      onClick={() => setEditTask(task)}
                      title="Edit"
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      onClick={() => setDeleteId(task._id)}
                      title="Delete"
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showPagination && filteredTasks.length > 0 && (
              <div className="flex justify-center items-center gap-3 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => fetchTasks(currentPage - 1)}
                  className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg bg-white disabled:opacity-40 hover:bg-neutral-50 transition-colors"
                >
                  Prev
                </button>
                <span className="text-sm text-neutral-400">{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => fetchTasks(currentPage + 1)}
                  className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg bg-white disabled:opacity-40 hover:bg-neutral-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {deleteId && (
        <DeleteModal
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            deleteTask(deleteId)
            setDeleteId(null)
          }}
        />
      )}

      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}

      {editTask && (
        <CreateTaskModal
          initialData={editTask}
          onClose={() => setEditTask(null)}
          onSubmit={(data) => {
            updateTask(editTask._id, data)
            setEditTask(null)
          }}
        />
      )}
    </div>
  )
}