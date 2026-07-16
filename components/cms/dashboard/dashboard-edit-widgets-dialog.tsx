"use client";

import { useBrand } from "@/components/shared/brand-provider";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogFooter,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DASHBOARD_WIDGET_OPTIONS,
  type DashboardWidgetId,
} from "@/config/dashboard";
import { isDashboardWidgetAvailableForBrand } from "@/lib/dashboard/brand-access";
import type { DashboardWidgetVisibility } from "@/lib/dashboard/storage";

interface DashboardEditWidgetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibility: DashboardWidgetVisibility;
  onToggle: (id: DashboardWidgetId, visible: boolean) => void;
  onReset: () => void;
}

export function DashboardEditWidgetsDialog({
  open,
  onOpenChange,
  visibility,
  onToggle,
  onReset,
}: DashboardEditWidgetsDialogProps) {
  const { featureBrand } = useBrand();
  const options = DASHBOARD_WIDGET_OPTIONS.filter((option) =>
    isDashboardWidgetAvailableForBrand(option.id, featureBrand),
  );

  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent size="sm">
        <CmsDialogHeader>
          <CmsDialogTitle>Edit widgets</CmsDialogTitle>
          <CmsDialogDescription>
            Choose which widgets appear on your dashboard for this brand. All
            available widgets are shown by default.
          </CmsDialogDescription>
        </CmsDialogHeader>

        <CmsDialogBody>
          <ul className="space-y-1">
            {options.map((option) => {
              const checked = visibility[option.id] !== false;

              return (
                <li
                  key={option.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-muted-foreground text-xs">
                      {option.description}
                    </p>
                  </div>
                  <Switch
                    checked={checked}
                    onCheckedChange={(value) =>
                      onToggle(option.id, value === true)
                    }
                    aria-label={`Show ${option.label}`}
                  />
                </li>
              );
            })}
          </ul>
        </CmsDialogBody>

        <CmsDialogFooter>
          <Button type="button" variant="outline" onClick={onReset}>
            Show all
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </CmsDialogFooter>
      </CmsDialogContent>
    </CmsDialog>
  );
}
