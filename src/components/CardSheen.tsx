export default function CardSheen() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 mix-blend-screen transition-opacity duration-300 ease-out group-hover:opacity-35"
      style={{
        backgroundImage:
          'linear-gradient(115deg, transparent 44%, rgba(246, 206, 113, 0.22) 50%, transparent 56%)',
        backgroundSize: '320% 320%',
        backgroundPosition:
          'calc(100% - var(--glare-x, 50%)) calc(100% - var(--glare-y, 50%))',
      }}
    />
  )
}
