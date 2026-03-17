import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
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
        className="bg-white p-6 rounded-xl shadow-md w-96 flex flex-col gap-3"
      >
        <h2 className="text-lg font-semibold">
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

        <button className="bg-black text-white p-2 rounded">
          {initialData ? "Update" : "Create"}
        </button>
      </form>
    </div>,
    document.body
  )
}