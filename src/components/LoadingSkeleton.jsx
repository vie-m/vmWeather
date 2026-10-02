import Card from './Card.jsx'

const Bone = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-white/20 motion-reduce:animate-none ${className}`} />
)

function CurrentSkeleton() {
  return (
    <>
      <div className="space-y-2">
        <Bone className="h-7 w-48" />
        <Bone className="h-4 w-32" />
        <Bone className="h-4 w-40" />
      </div>
      <div className="flex items-center justify-between">
        <Bone className="h-20 w-40" />
        <Bone className="h-16 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Bone key={index} className="h-16 rounded-2xl" />
        ))}
      </div>
    </>
  )
}

function HourlySkeleton() {
  return (
    <>
      <Bone className="mb-3 h-6 w-40" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 10 }, (_, index) => (
          <Bone key={index} className="h-32 w-[4.5rem] shrink-0 rounded-2xl" />
        ))}
      </div>
    </>
  )
}

function DailySkeleton() {
  return (
    <>
      <Bone className="mb-3 h-6 w-32" />
      <div className="space-y-2">
        {Array.from({ length: 7 }, (_, index) => (
          <Bone key={index} className="h-10 w-full" />
        ))}
      </div>
    </>
  )
}

const VARIANTS = {
  current: { Content: CurrentSkeleton, label: 'current weather', className: 'flex flex-col justify-between gap-6' },
  hourly: { Content: HourlySkeleton, label: 'hourly forecast', className: '' },
  daily: { Content: DailySkeleton, label: '7-day forecast', className: '' },
}

/** Skeleton placeholder shaped like the section it stands in for. */
export default function LoadingSkeleton({ variant }) {
  const { Content, label, className } = VARIANTS[variant]
  return (
    <Card as="div" role="status" aria-busy="true" className={className}>
      <span className="sr-only">Loading {label}…</span>
      <Content />
    </Card>
  )
}
