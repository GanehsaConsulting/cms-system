import { NotificationWidgetActivity } from "@/components/shared/notification-widget-activity";
import { NotificationWidgetCalendar } from "@/components/shared/notification-widget-calendar";
import { NotificationWidgetClock } from "@/components/shared/notification-widget-clock";
import { NotificationWidgetWeather } from "@/components/shared/notification-widget-weather";

export function NotificationCenterWidgets() {
  return (
    <section aria-label="Widgets" className="grid grid-cols-2 gap-2.5">
      <NotificationWidgetClock />
      <NotificationWidgetWeather />
      <NotificationWidgetCalendar />
      <NotificationWidgetActivity />
    </section>
  );
}
