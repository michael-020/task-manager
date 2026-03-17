import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

interface Props {
  onClose: () => void
  onSubmit: (data: {
    title: string
    description?: string
    dueDate?: string
  }) => void
}

export default function CreateTaskModal({ onClose, onSubmit }: Props) {
  const ref = useRef<HTMLFormElement>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")

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
    onSubmit({ title, description, dueDate: dueDate ? dueDate : undefined })
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96 flex flex-col gap-3"
      >
        <h2 className="text-lg font-semibold">Create Task</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 rounded"
        />

        <button className="bg-black text-white p-2 rounded">
          Create
        </button>
      </form>
    </div>,
    document.body
  )
}