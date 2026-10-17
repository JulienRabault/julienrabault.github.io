import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { TrendPoint } from "@/lib/admin-format";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// La lumière de la sphère pour les visiteurs ; les questions en trait, plus discrètes.
const config = {
  visitors: { label: "Visiteurs", color: "var(--ochre)" },
  questions: { label: "Questions", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const dayLabel = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
const fullDay = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

const formatTick = (day: string) => dayLabel.format(new Date(`${day}T12:00:00Z`));

/** Visiteurs et questions par jour, sur la période choisie. */
export function TrendChart({ points }: { points: TrendPoint[] }) {
  return (
    <ChartContainer className="aspect-auto h-[240px] w-full" config={config}>
      <AreaChart accessibilityLayer data={points} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="visitors-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-visitors)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-visitors)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="day"
          minTickGap={36}
          tickFormatter={formatTick}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tickMargin={6} width={32} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(day) => fullDay.format(new Date(`${String(day)}T12:00:00Z`))}
            />
          }
          cursor={false}
        />
        <Area
          dataKey="visitors"
          fill="url(#visitors-fill)"
          stroke="var(--color-visitors)"
          strokeWidth={2}
          type="monotone"
        />
        <Area
          dataKey="questions"
          fill="transparent"
          stroke="var(--color-questions)"
          strokeDasharray="4 4"
          strokeWidth={1.5}
          type="monotone"
        />
      </AreaChart>
    </ChartContainer>
  );
}
