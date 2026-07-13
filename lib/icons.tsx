"use client";

import {
  sfArrowUpRight,
  sfBuilding2Fill,
  sfCheckmark,
  sfChevronDown,
  sfChevronLeft,
  sfChevronRight,
  sfChevronUp,
  sfDesktopcomputer,
  sfDollarsignCircleFill,
  sfEllipsis,
  sfGearshapeFill,
  sfLine3Horizontal,
  sfLine3HorizontalDecreaseCircle,
  sfMagnifyingglass,
  sfMoonFill,
  sfPaintpaletteFill,
  sfPencil,
  sfPlus,
  sfSidebarLeft,
  sfSparkles,
  sfSquareAndArrowUpFill,
  sfSquareGrid2x2Fill,
  sfSunMaxFill,
  sfTextPageFill,
  sfTrashFill,
  sfXmark,
} from "@bradleyhodges/sfsymbols";
import { SFIcon } from "@bradleyhodges/sfsymbols-react";
import type { IconDefinition } from "@bradleyhodges/sfsymbols-types";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { SF_ICON_SIZE } from "@/config/icons";
import { cn } from "@/lib/utils";

export type IconProps = Omit<
  ComponentPropsWithoutRef<typeof SFIcon>,
  "icon"
> & {
  className?: string;
};

export type Icon = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>;

function createSFIcon(symbol: IconDefinition, displayName: string): Icon {
  const IconComponent = forwardRef<SVGSVGElement, IconProps>(
    function IconComponent({ className, size, ...props }, ref) {
      return (
        <SFIcon
          ref={ref}
          icon={symbol}
          size={size ?? SF_ICON_SIZE}
          className={cn("shrink-0", className)}
          {...props}
        />
      );
    },
  );

  IconComponent.displayName = displayName;
  return IconComponent;
}

export const ArrowUpRightIcon = createSFIcon(sfArrowUpRight, "ArrowUpRightIcon");
export const Building2Icon = createSFIcon(sfBuilding2Fill, "Building2Icon");
export const CaretDownIcon = createSFIcon(sfChevronDown, "CaretDownIcon");
export const CaretLeftIcon = createSFIcon(sfChevronLeft, "CaretLeftIcon");
export const CaretRightIcon = createSFIcon(sfChevronRight, "CaretRightIcon");
export const CaretUpIcon = createSFIcon(sfChevronUp, "CaretUpIcon");
export const CheckIcon = createSFIcon(sfCheckmark, "CheckIcon");
export const DesktopIcon = createSFIcon(sfDesktopcomputer, "DesktopIcon");
export const DollarSignIcon = createSFIcon(
  sfDollarsignCircleFill,
  "DollarSignIcon",
);
export const DotsThreeIcon = createSFIcon(sfEllipsis, "DotsThreeIcon");
export const FileTextIcon = createSFIcon(sfTextPageFill, "FileTextIcon");
export const FilterIcon = createSFIcon(
  sfLine3HorizontalDecreaseCircle,
  "FilterIcon",
);
export const GearSixIcon = createSFIcon(sfGearshapeFill, "GearSixIcon");
export const ListIcon = createSFIcon(sfLine3Horizontal, "ListIcon");
export const MagnifyingGlassIcon = createSFIcon(
  sfMagnifyingglass,
  "MagnifyingGlassIcon",
);
export const MoonIcon = createSFIcon(sfMoonFill, "MoonIcon");
export const PaintpaletteIcon = createSFIcon(
  sfPaintpaletteFill,
  "PaintpaletteIcon",
);
export const PencilSimpleIcon = createSFIcon(sfPencil, "PencilSimpleIcon");
export const PlusIcon = createSFIcon(sfPlus, "PlusIcon");
export const SidebarIcon = createSFIcon(sfSidebarLeft, "SidebarIcon");
export const SparkleIcon = createSFIcon(sfSparkles, "SparkleIcon");
export const SquaresFourIcon = createSFIcon(
  sfSquareGrid2x2Fill,
  "SquaresFourIcon",
);
export const SunIcon = createSFIcon(sfSunMaxFill, "SunIcon");
export const TrashIcon = createSFIcon(sfTrashFill, "TrashIcon");
export const UploadSimpleIcon = createSFIcon(
  sfSquareAndArrowUpFill,
  "UploadSimpleIcon",
);
export const XIcon = createSFIcon(sfXmark, "XIcon");
