"use client";

import { useEffect, useState } from "react";
import { DashboardDigitalClock } from "@/components/cms/dashboard/dashboard-digital-clock";
import { DashboardWidget } from "@/components/cms/dashboard/dashboard-widget";
import { useBrand } from "@/components/shared/brand-provider";
import {
  formatDashboardDate,
  getTimeOfDayGreeting,
} from "@/config/dashboard";
import { CURRENT_CMS_USER } from "@/config/cms-user";
import { CMS_NAME } from "@/config/nav";

function getFirstName(fullName: string) {
  const first = fullName.trim().split(/\s+/)[0];
  return first || fullName;
}

export function DashboardGreeting() {
  const { activeBrand } = useBrand();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const firstName = getFirstName(CURRENT_CMS_USER.name);
  const brandName = activeBrand?.name ?? CMS_NAME;
  const greetingBase = now ? getTimeOfDayGreeting(now) : "Welcome back";
  const greeting = `${greetingBase}, ${firstName}`;
  const dateLabel = now ? formatDashboardDate(now) : "Today";

  return (
    <DashboardWidget
      variant="glass"
      className="flex flex-row items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4"
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-muted-foreground text-xs">
          {dateLabel}
          <span className="mx-1.5 text-muted-foreground/50">·</span>
          {brandName}
        </p>
        <h1 className="mt-0.5 truncate font-semibold text-xl tracking-tight text-foreground sm:text-2xl">
          {greeting}
        </h1>
      </div>

      <DashboardDigitalClock />
    </DashboardWidget>
  );
}
