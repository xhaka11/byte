export function Emblem({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M4 6 L26 40 L44 40 L44 24 L30 6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="miter"
      />
      <path d="M11 12 L24 32 L18 32 L11 21 Z" fill="currentColor" />
    </svg>
  );
}
