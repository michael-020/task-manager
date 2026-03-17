import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useTaskStore } from '../store/taskStore'

interface Props {
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteModal({ onClose, onConfirm }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { deleteLoading } = useTaskStore()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
      <div
        ref={ref}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-lg font-semibold mb-4">
          Delete this task?
        </h2>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            disabled={deleteLoading}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}