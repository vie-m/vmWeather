import { Info, X } from 'lucide-react'

/** Dismissible, non-blocking message (e.g. geolocation denied). */
export default function Notice({ message, onDismiss }) {
  if (!message) return null
  return (
    <div
      role="status"
      className="fade-in flex items-start gap-3 rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-950 shadow-card"
    >
      <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss message"
        className="rounded-full p-0.5 hover:bg-amber-200 focus-visible:outline-amber-900"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
