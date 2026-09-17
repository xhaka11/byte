import { getAgentImage } from "@/lib/agent-images";

interface AgentImageProps {
  name: string;
  size?: "sm" | "md";
  className?: string;
}

export function AgentImage({ name, size = "sm", className = "" }: AgentImageProps) {
  const img = getAgentImage(name);
  const sizeClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const fontSize = size === "sm" ? "text-xs" : "text-sm";

  if (!img) {
    return (
      <div
        className={`${sizeClass} shrink-0 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold ${className}`}
      >
        <span className={fontSize}>{name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img
      src={img}
      alt={name}
      className={`${sizeClass} shrink-0 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${className}`}
      loading="lazy"
      width={size === "sm" ? 28 : 36}
      height={size === "sm" ? 28 : 36}
    />
  );
}
