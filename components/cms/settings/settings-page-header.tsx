import { SettingsTabs } from "@/components/cms/settings/settings-tabs";
import { CmsPageHeaderActionsSlot } from "@/components/shared/cms-page-header-actions";
import {
  SETTINGS_PAGE_DESCRIPTION,
  SETTINGS_PAGE_TITLE,
} from "@/config/settings";

interface SettingsPageHeaderProps {
  actions?: React.ReactNode;
}

export function SettingsPageHeader({ actions }: SettingsPageHeaderProps) {
  return (
    <header className="mb-4 w-full shrink-0 space-y-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-semibold text-xl tracking-tight">
            {SETTINGS_PAGE_TITLE}
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {SETTINGS_PAGE_DESCRIPTION}
          </p>
        </div>
        {actions ?? <CmsPageHeaderActionsSlot />}
      </div>
      <SettingsTabs />
    </header>
  );
}
