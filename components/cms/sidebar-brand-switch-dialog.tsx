"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { SidebarBrandSwitchItem } from "@/components/cms/sidebar-brand-switch-item";
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
import { cn } from "@/lib/utils";

export function SidebarBrandSwitchDialog() {
  const router = useRouter();
  const {
    brands,
    activeBrandId,
    setActiveBrandId,
    switcherOpen,
    setSwitcherOpen,
  } = useBrand();

  const sortedBrands = useMemo(
    () =>
      [...brands].sort((left, right) => {
        if (left.status !== right.status) {
          return left.status === "active" ? -1 : 1;
        }

        return left.name.localeCompare(right.name);
      }),
    [brands],
  );

  function handleSelect(id: string) {
    setActiveBrandId(id);
    setSwitcherOpen(false);
    router.refresh();
  }

  function handleOpenSettings() {
    setSwitcherOpen(false);
    router.push("/settings");
  }

  return (
    <CmsDialog open={switcherOpen} onOpenChange={setSwitcherOpen}>
      <CmsDialogContent size="sm">
        <CmsDialogHeader>
          <CmsDialogTitle>Switch brand</CmsDialogTitle>
          <CmsDialogDescription>
            Choose a brand workspace. Sidebar modules follow each brand&apos;s
            settings.
          </CmsDialogDescription>
        </CmsDialogHeader>

        <CmsDialogBody className={cn("space-y-0.5 py-3")}>
          {sortedBrands.length === 0 ? (
            <div className="rounded-(--radius-inner) border border-(--separator) border-dashed px-4 py-8 text-center">
              <p className="font-medium text-sm">No brands yet</p>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                Add a brand in Settings to start switching workspaces.
              </p>
              <Button
                type="button"
                className="mt-4 h-8"
                onClick={handleOpenSettings}
              >
                Open Settings
              </Button>
            </div>
          ) : (
            sortedBrands.map((brand) => (
              <SidebarBrandSwitchItem
                key={brand.id}
                brand={brand}
                isActive={brand.id === activeBrandId}
                onSelect={handleSelect}
              />
            ))
          )}
        </CmsDialogBody>

        {sortedBrands.length > 0 ? (
          <CmsDialogFooter className="justify-start sm:justify-start">
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2"
              nativeButton={false}
              render={<Link href="/settings" />}
              onClick={() => setSwitcherOpen(false)}
            >
              Manage brands
            </Button>
          </CmsDialogFooter>
        ) : null}
      </CmsDialogContent>
    </CmsDialog>
  );
}
