/** Shared glass-style card used by every dashboard section. */
export default function Card({ as: Tag = 'section', padded = true, className = '', children, ...props }) {
  const padding = padded ? 'p-4 sm:p-5' : ''
  return (
    <Tag
      className={`min-w-0 rounded-3xl border border-white/20 bg-slate-900/25 text-white shadow-card backdrop-blur-md ${padding} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
