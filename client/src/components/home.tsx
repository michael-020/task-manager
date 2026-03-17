import { useEffect, useState } from "react"
import { useTaskStore } from "../store/taskStore"
import { useAuthStore } from "../store/authStore"
import { Trash2, Pencil, Check, RotateCcw } from "lucide-react"
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
  } = useTaskStore()

  const { user } = useAuthStore()

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
        task.description.toLowerCase().includes(search.toLowerCase())
      )
    })

  const handleCreate = async (data: any) => {
    await createTask(data)
    setShowCreate(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {user?.name}'s Tasks
          </h1>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            {createLoading ? "Adding..." : "+ Add Task"}
          </button>
        </div>

        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg text-sm"
        />

        <div className="flex gap-2 mb-6">
          {["all", "pending", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                filter === type
                  ? "bg-black text-white"
                  : "bg-white border"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <TaskSkeleton />
        ) : (
          <>
            {filteredTasks.length === 0 && (
              <div className="text-center text-gray-500 mt-10 text-sm">
                {tasks.length === 0
                  ? "No tasks yet. Create your first task."
                  : search.trim()
                  ? "No tasks match your search."
                  : `No ${filter} tasks found.`}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`bg-white p-4 rounded-xl border flex justify-between items-start gap-3 ${
                    task.status === "completed" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          task.status === "completed"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <h3
                        className={`font-medium text-sm truncate ${
                          task.status === "completed"
                            ? "line-through text-gray-400"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-500 ml-4 mb-1">
                        {task.description}
                      </p>
                    )}

                    {task.dueDate && (
                      <p className="text-xs text-gray-400 ml-4">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        toggleTask(
                          task._id,
                          task.status === "pending" ? "completed" : "pending"
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-lg border"
                    >
                      {task.status === "pending"
                        ? <Check size={15} />
                        : <RotateCcw size={15} />}
                    </button>

                    <button
                      onClick={() => setEditTask(task)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      onClick={() => setDeleteId(task._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && filteredTasks.length > 0 && (
              <div className="flex justify-center items-center gap-3 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => fetchTasks(currentPage - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-sm">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => fetchTasks(currentPage + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      </div>

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