import { getAgentIconUrl } from "@/lib/agent-uuids";

interface AgentImageProps {
  name: string;
  size?: "sm" | "md";
  className?: string;
}

export function AgentImage({ name, size = "sm", className = "" }: AgentImageProps) {
  const url = getAgentIconUrl(name);
  const sizeClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";

  if (!url) {
    return (
      <div
        className={`${sizeClass} shrink-0 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold ${className}`}
      >
        <span className={size === "sm" ? "text-xs" : "text-sm"}>{name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      className={`${sizeClass} shrink-0 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${className}`}
      loading="lazy"
      width={size === "sm" ? 28 : 36}
      height={size === "sm" ? 28 : 36}
    />
  );
}
