import { NOTIFICATION_WIDGET_SURFACE } from "@/config/notification-center";
import { cn } from "@/lib/utils";

interface RingStat {
  label: string;
  detail: string;
  value: number;
  max: number;
  color: string;
  track: string;
}

const RINGS: RingStat[] = [
  {
    label: "Articles",
    detail: "12/20",
    value: 12,
    max: 20,
    color: "#ff2d55",
    track: "#ff2d5533",
  },
  {
    label: "Prices",
    detail: "8/12",
    value: 8,
    max: 12,
    color: "#30d158",
    track: "#30d15833",
  },
  {
    label: "Clients",
    detail: "5/10",
    value: 5,
    max: 10,
    color: "#00c7be",
    track: "#00c7be33",
  },
];

const SIZE = 86;
const CENTER = SIZE / 2;
const STROKE = 7.5;
const GAP = 2.5;

function ringRadius(index: number) {
  return CENTER - STROKE / 2 - index * (STROKE + GAP);
}

export function NotificationWidgetActivity() {
  return (
    <div
      className={cn(
        NOTIFICATION_WIDGET_SURFACE,
        "col-span-2 flex items-center gap-4 py-3.5 pr-4 pl-3.5",
      )}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="shrink-0"
        role="img"
        aria-label="Activity rings"
      >
        <title>Activity rings</title>
        {RINGS.map((ring, index) => {
          const radius = ringRadius(index);
          const circumference = 2 * Math.PI * radius;
          const progress = Math.min(1, ring.value / ring.max);
          const offset = circumference * (1 - progress);

          return (
            <g key={ring.label}>
              <circle
                cx={CENTER}
                cy={CENTER}
                r={radius}
                fill="none"
                stroke={ring.track}
                strokeWidth={STROKE}
              />
              <circle
                cx={CENTER}
                cy={CENTER}
                r={radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
              />
            </g>
          );
        })}
      </svg>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {RINGS.map((ring) => (
          <div key={ring.label} className="flex items-baseline justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: ring.color }}
                aria-hidden
              />
              <span className="truncate font-semibold text-[13px] leading-none">
                {ring.label}
              </span>
            </div>
            <span
              className="shrink-0 font-semibold text-[13px] tabular-nums leading-none"
              style={{ color: ring.color }}
            >
              {ring.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
