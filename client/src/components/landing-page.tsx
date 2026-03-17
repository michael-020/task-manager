export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">

      <nav className="flex justify-between items-center px-10 py-5 border-b border-[#e2e0d8]">
        <span className="text-lg font-semibold text-[#1a1a18]">Taskly</span>
        <div className="flex gap-2 items-center">
          <a
            href="/login"
            className="px-4 py-2 text-sm text-[#6b6b60] rounded-lg hover:text-[#1a1a18] hover:bg-[#eae8e2]"
          >
            Log in
          </a>
          <a
            href="/register"
            className="px-5 py-2 text-sm bg-[#1a1a18] text-[#f5f4f0] rounded-lg hover:bg-[#2e2e2a]"
          >
            Get started
          </a>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#e8e6de] rounded-full text-xs text-[#6b6b60] mb-7">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          Simple task management
        </div>

        <h1 className="text-[clamp(2.75rem,6vw,4.5rem)] text-[#1a1a18] font-bold leading-tight max-w-[680px] mb-5">
          Get things done,
          <br />
          <span className="italic text-[#8a8a7a]">without the noise</span>
        </h1>

        <p className="text-[#6b6b60] text-base leading-relaxed max-w-[420px] mb-9">
          Create tasks, set due dates, and track your progress — all in one clean, distraction-free space.
        </p>

        <div className="flex gap-3 flex-wrap justify-center mb-12">
          <a
            href="/register"
            className="px-8 py-3 bg-[#1a1a18] text-[#f5f4f0] rounded-xl text-sm font-medium hover:bg-[#2e2e2a] transition"
          >
            Start for free
          </a>
          <a
            href="/login"
            className="px-8 py-3 border border-[#d4d2ca] text-[#1a1a18] rounded-xl text-sm hover:border-[#1a1a18] hover:bg-[#eae8e2] transition"
          >
            Log in
          </a>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          <div className="bg-white border border-[#e2e0d8] rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-[#1a1a18] shadow-sm">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
            Design new homepage
            <span className="text-xs text-[#9e9e8e] ml-3">Due Mar 22</span>
          </div>

          <div className="bg-white border border-[#e2e0d8] rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-[#9e9e8e] shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="line-through">Write API docs</span>
            <span className="text-xs ml-3">Done</span>
          </div>

          <div className="bg-white border border-[#e2e0d8] rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-[#1a1a18] shadow-sm">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
            Review pull requests
            <span className="text-xs text-[#9e9e8e] ml-3">Due Mar 25</span>
          </div>
        </div>
      </main>

      <footer className="px-10 py-4 border-t border-[#e2e0d8] flex justify-center items-center gap-6 text-xs text-[#9e9e8e]">
        <span>No credit card required</span>
        <span>·</span>
        <span>Free to use</span>
        <span>·</span>
        <span>Open source</span>
      </footer>
    </div>
  )
}