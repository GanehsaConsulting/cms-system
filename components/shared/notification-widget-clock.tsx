"use client";

import { useEffect, useState } from "react";
import { NOTIFICATION_WIDGET_SURFACE } from "@/config/notification-center";
import { cn } from "@/lib/utils";

const FACE_SIZE = 100;
const CENTER = FACE_SIZE / 2;

function getClockParts(now: Date) {
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  return {
    hourDeg: hours * 30 + minutes * 0.5,
    minuteDeg: minutes * 6 + seconds * 0.1,
    secondDeg: seconds * 6 + ms * 0.006,
    label: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(now),
  };
}

export function NotificationWidgetClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 50);
    return () => window.clearInterval(id);
  }, []);

  const { hourDeg, minuteDeg, secondDeg, label } = getClockParts(now);

  return (
    <div
      className={cn(
        NOTIFICATION_WIDGET_SURFACE,
        "flex aspect-square items-center justify-center p-2.5",
      )}
      role="img"
      aria-label={`Clock ${label}`}
    >
      <svg
        viewBox={`0 0 ${FACE_SIZE} ${FACE_SIZE}`}
        className="size-full drop-shadow-[0_1px_2px_rgb(0_0_0/0.12)]"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={48}
          fill="#ffffff"
          className="dark:fill-[#f5f5f7]"
        />

        {Array.from({ length: 60 }, (_, index) => {
          const isHour = index % 5 === 0;
          const rotation = index * 6;
          const outer = 46.5;
          const inner = isHour ? 41.5 : 44;

          return (
            <line
              key={`tick-${index}`}
              x1={CENTER}
              y1={CENTER - outer}
              x2={CENTER}
              y2={CENTER - inner}
              stroke="#1c1c1e"
              strokeWidth={isHour ? 1.35 : 0.55}
              strokeLinecap="round"
              transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
            />
          );
        })}

        {Array.from({ length: 12 }, (_, index) => {
          const value = index + 1;
          const angle = ((value * 30 - 90) * Math.PI) / 180;
          const radius = 33.5;
          const x = CENTER + radius * Math.cos(angle);
          const y = CENTER + radius * Math.sin(angle);

          return (
            <text
              key={`num-${value}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#1c1c1e"
              fontSize="9.5"
              fontWeight="600"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              {value}
            </text>
          );
        })}

        <g transform={`rotate(${hourDeg} ${CENTER} ${CENTER})`}>
          <line
            x1={CENTER}
            y1={CENTER + 3}
            x2={CENTER}
            y2={CENTER - 22}
            stroke="#1c1c1e"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </g>

        <g transform={`rotate(${minuteDeg} ${CENTER} ${CENTER})`}>
          <line
            x1={CENTER}
            y1={CENTER + 4}
            x2={CENTER}
            y2={CENTER - 32}
            stroke="#1c1c1e"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </g>

        <g transform={`rotate(${secondDeg} ${CENTER} ${CENTER})`}>
          <line
            x1={CENTER}
            y1={CENTER + 10}
            x2={CENTER}
            y2={CENTER - 38}
            stroke="#ff9500"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </g>

        <circle cx={CENTER} cy={CENTER} r="2.1" fill="#1c1c1e" />
        <circle cx={CENTER} cy={CENTER} r="0.85" fill="#ff9500" />
      </svg>
    </div>
  );
}
