import { useEffect, useState } from "react"
import { useTaskStore } from "../store/taskStore"
import { useAuthStore } from "../store/authStore"
import { Trash2, CheckCircle } from "lucide-react"
import DeleteModal from "./delete-modal"
import CreateTaskModal from "./create-task-modal"

export default function Home() {
  const { tasks, fetchTasks, createTask, toggleTask, deleteTask } = useTaskStore()
  const { user } = useAuthStore()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {user?.name}'s Tasks
          </h1>

          <button
            onClick={() => setShowCreate(true)}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            + Add Task
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between"
            >
              <div>
                <h3 className="font-semibold">{task.title}</h3>

                {task.description && (
                  <p className="text-sm text-gray-600">
                    {task.description}
                  </p>
                )}

                {task.dueDate && (
                  <p className="text-xs text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleString()}
                  </p>
                )}

                <p className="text-xs mt-1">
                  Status:{" "}
                  <span
                    className={
                      task.status === "completed"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }
                  >
                    {task.status}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    toggleTask(
                      task._id,
                      task.status === "pending"
                        ? "completed"
                        : "pending"
                    )
                  }
                  className="text-green-500"
                >
                  <CheckCircle size={20} />
                </button>

                <button
                  onClick={() => setDeleteId(task._id)}
                  className="text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

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
          onSubmit={(data) => createTask(data)}
        />
      )}
    </div>
  )
}