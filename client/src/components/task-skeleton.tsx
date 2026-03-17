export default function TaskSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border animate-pulse"
        >
          <div className="h-3 w-1/3 bg-gray-200 rounded mb-2" />
          <div className="h-2 w-1/2 bg-gray-200 rounded mb-1" />
          <div className="h-2 w-1/4 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}