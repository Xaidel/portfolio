export default function CardSheen() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 mix-blend-screen transition-opacity duration-300 ease-out group-hover:opacity-80"
      style={{
        background:
          'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(246, 206, 113, 0.11) 0%, rgba(246, 206, 113, 0.04) 35%, transparent 70%)',
      }}
    />
  )
}
