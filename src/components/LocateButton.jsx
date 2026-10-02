import { Loader2, LocateFixed } from 'lucide-react'

export default function LocateButton({ onClick, isLocating }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocating}
      aria-label="Use my location"
      title="Use my location"
      className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-black/25 px-4 text-sm font-semibold text-white transition-colors hover:bg-black/35 disabled:cursor-wait disabled:opacity-70"
    >
      {isLocating ? (
        <Loader2 size={20} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
      ) : (
        <LocateFixed size={20} aria-hidden="true" />
      )}
      <span className="hidden sm:inline">My location</span>
    </button>
  )
}
