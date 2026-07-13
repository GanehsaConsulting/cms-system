import { NOTIFICATION_WIDGET_SURFACE } from "@/config/notification-center";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const ACCENT = "#fb92a1";

function getMonthCells(now: Date) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = Array.from(
    { length: firstWeekday },
    () => null,
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function NotificationWidgetCalendar() {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" })
    .format(now)
    .toUpperCase();
  const month = new Intl.DateTimeFormat("en-US", { month: "long" })
    .format(now)
    .toUpperCase();
  const day = now.getDate();
  const cells = getMonthCells(now);

  return (
    <div
      className={cn(
        NOTIFICATION_WIDGET_SURFACE,
        "col-span-2 flex min-h-38 items-stretch gap-3 overflow-hidden px-4 py-3.5",
      )}
    >
      <div className="flex w-22 shrink-0 flex-col justify-between py-0.5">
        <div>
          <p className="font-semibold text-[11px] text-foreground/90 leading-none tracking-[0.02em]">
            {weekday}
          </p>
          <p
            className="mt-0.5 font-normal text-[3.25rem] text-foreground leading-none tracking-tight"
            style={{
              fontFamily:
                '"New York", "Iowan Old Style", "Apple Garamond", Baskerville, Georgia, serif',
            }}
          >
            {day}
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground leading-snug">
          No events today
        </p>
      </div>

      <div className="flex min-w-0 flex-1 flex-col pt-0.5">
        <p
          className="mb-1.5 font-semibold text-[11px] leading-none tracking-[0.04em]"
          style={{ color: ACCENT }}
        >
          {month}
        </p>

        <div className="grid grid-cols-7 gap-y-0.5 text-center">
          {WEEKDAYS.map((label, index) => (
            <span
              key={`wd-${label}-${index}`}
              className="py-0.5 font-medium text-[9px] text-foreground/55"
            >
              {label}
            </span>
          ))}

          {cells.map((value, index) => {
            const isToday = value === day;

            return (
              <span
                key={`day-${index}`}
                className={cn(
                  "mx-auto flex size-[1.15rem] items-center justify-center text-[10px] tabular-nums leading-none",
                  value == null && "invisible",
                  isToday
                    ? "rounded-full font-semibold text-[#1c1c1e]"
                    : "font-medium text-foreground/90",
                )}
                style={isToday ? { backgroundColor: ACCENT } : undefined}
              >
                {value}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
