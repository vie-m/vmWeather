import { RotateCw, TriangleAlert } from 'lucide-react'
import Card from './Card.jsx'

export default function ErrorMessage({ title = 'Something went wrong', message, onRetry, className = '' }) {
  return (
    <Card as="div" role="alert" className={`flex flex-col items-start justify-center gap-3 ${className}`}>
      <TriangleAlert size={32} aria-hidden="true" className="text-amber-300" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-white/90">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
      >
        <RotateCw size={16} aria-hidden="true" />
        Try again
      </button>
    </Card>
  )
}
