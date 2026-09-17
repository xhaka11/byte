import razeImg from "@/assets/agents/raze.png";
import fadeImg from "@/assets/agents/fade.png";
import deadlockImg from "@/assets/agents/deadlock.png";
import phoenixImg from "@/assets/agents/phoenix.png";
import jettImg from "@/assets/agents/jett.png";
import neonImg from "@/assets/agents/neon.png";
import yoruImg from "@/assets/agents/yoru.png";

const AGENT_IMAGES: Record<string, string> = {
  Raze: razeImg,
  Fade: fadeImg,
  Deadlock: deadlockImg,
  Phoenix: phoenixImg,
  Jett: jettImg,
  Neon: neonImg,
  Yoru: yoruImg,
};

export function getAgentImage(agentName: string): string | undefined {
  return AGENT_IMAGES[agentName];
}
