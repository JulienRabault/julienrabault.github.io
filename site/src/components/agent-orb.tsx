import { useMediaQuery } from "@/lib/use-media-query";
import { useTheme } from "@/lib/use-theme";
import { cn } from "@/lib/utils";
import { Dithering } from "@paper-design/shaders-react";

// La présence de l'agent : une sphère tramée en ocre. Elle tourne lentement au repos et s'emballe quand l'agent lit ou écrit.
const ORB_COLOR = { dark: "#df9a4e", light: "#9a6322" } as const;
const SPEED = { idle: 0.18, active: 1.1 } as const;

interface AgentOrbProps {
  size: number;
  active?: boolean;
  /** Taille d'un point de trame, en pixels CSS. */
  dot?: number;
  className?: string;
}

export function AgentOrb({ size, active = false, dot = 2, className }: AgentOrbProps) {
  const [theme] = useTheme();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const speed = reduced ? 0 : active ? SPEED.active : SPEED.idle;

  return (
    <Dithering
      aria-hidden
      className={cn("shrink-0", className)}
      colorBack="#00000000"
      colorFront={ORB_COLOR[theme]}
      shape="sphere"
      size={dot}
      speed={speed}
      style={{ width: size, height: size }}
      type="4x4"
    />
  );
}
