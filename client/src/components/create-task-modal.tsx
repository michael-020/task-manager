import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useTaskStore } from '../store/taskStore'
import { X } from "lucide-react"

interface Props {
  onClose: () => void
  onSubmit: (data: {
    title: string
    description: string
    dueDate?: string
  }) => void
  initialData?: {
    title: string
    description?: string
    dueDate?: string
  }
}

export default function CreateTaskModal({ onClose, onSubmit, initialData }: Props) {
  const ref = useRef<HTMLFormElement>(null)

  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? initialData.dueDate.slice(0, 10) : ""
  )
  const { createLoading, updateLoading } = useTaskStore()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      dueDate: dueDate ? dueDate : undefined,
    })
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96 flex flex-col gap-3 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        <h2 className="text-lg font-semibold pt-2">
          {initialData ? "Update Task" : "Create Task"}
        </h2>

        <label className="text-sm">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <label className="text-sm">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        <label className="text-sm">Due Date (optional)</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          disabled={createLoading || updateLoading}
          className="bg-black text-white p-2 rounded"
        >
          {initialData
            ? updateLoading
              ? "Updating..."
              : "Update"
            : createLoading
              ? "Creating..."
              : "Create"}
        </button>
      </form>
    </div>,
    document.body
  )
}