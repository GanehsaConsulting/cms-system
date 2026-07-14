"use client";

import {
  sfArrowUpRight,
  sfBellFill,
  sfBuilding2Fill,
  sfCalendar,
  sfChecklist,
  sfCheckmark,
  sfChevronDown,
  sfChevronLeft,
  sfChevronRight,
  sfChevronUp,
  sfClockFill,
  sfCloudSunFill,
  sfDesktopcomputer,
  sfDocumentFill,
  sfDollarsignCircleFill,
  sfEllipsis,
  sfExclamationmarkTriangleFill,
  sfEyeFill,
  sfFolder,
  sfGearshapeFill,
  sfGlobeFill,
  sfInfoCircleFill,
  sfKeyFill,
  sfLine3Horizontal,
  sfLine3HorizontalDecreaseCircle,
  sfLockFill,
  sfMagnifyingglass,
  sfMessageFill,
  sfMoonFill,
  sfPaintpaletteFill,
  sfPencil,
  sfPerson2Fill,
  sfPersonCropCircleFill,
  sfPhotoFill,
  sfPlayRectangleFill,
  sfPlus,
  sfRectanglePortraitAndArrowRightFill,
  sfSidebarLeft,
  sfSparkles,
  sfSquareAndArrowUpFill,
  sfSquareGrid2x2Fill,
  sfSunMaxFill,
  sfTagFill,
  sfTextPageFill,
  sfTrashFill,
  sfXmark,
} from "@bradleyhodges/sfsymbols";
import { SFIcon } from "@bradleyhodges/sfsymbols-react";
import type { IconDefinition } from "@bradleyhodges/sfsymbols-types";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
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

export const ArrowUpRightIcon = createSFIcon(
  sfArrowUpRight,
  "ArrowUpRightIcon",
);
export const BellIcon = createSFIcon(sfBellFill, "BellIcon");
export const Building2Icon = createSFIcon(sfBuilding2Fill, "Building2Icon");
export const CalendarIcon = createSFIcon(sfCalendar, "CalendarIcon");
export const CaretDownIcon = createSFIcon(sfChevronDown, "CaretDownIcon");
export const CaretLeftIcon = createSFIcon(sfChevronLeft, "CaretLeftIcon");
export const CaretRightIcon = createSFIcon(sfChevronRight, "CaretRightIcon");
export const CaretUpIcon = createSFIcon(sfChevronUp, "CaretUpIcon");
export const CheckIcon = createSFIcon(sfCheckmark, "CheckIcon");
export const ChecklistIcon = createSFIcon(sfChecklist, "ChecklistIcon");
export const ClockIcon = createSFIcon(sfClockFill, "ClockIcon");
export const CloudSunIcon = createSFIcon(sfCloudSunFill, "CloudSunIcon");
export const DesktopIcon = createSFIcon(sfDesktopcomputer, "DesktopIcon");
export const DocumentIcon = createSFIcon(sfDocumentFill, "DocumentIcon");
export const DollarSignIcon = createSFIcon(
  sfDollarsignCircleFill,
  "DollarSignIcon",
);
export const DotsThreeIcon = createSFIcon(sfEllipsis, "DotsThreeIcon");
export const EyeIcon = createSFIcon(sfEyeFill, "EyeIcon");
export const FileTextIcon = createSFIcon(sfTextPageFill, "FileTextIcon");
export const FilterIcon = createSFIcon(
  sfLine3HorizontalDecreaseCircle,
  "FilterIcon",
);
export const FolderOpenIcon = createSFIcon(sfFolder, "FolderOpenIcon");
export const GearSixIcon = createSFIcon(sfGearshapeFill, "GearSixIcon");
export const GlobeIcon = createSFIcon(sfGlobeFill, "GlobeIcon");
export const InfoIcon = createSFIcon(sfInfoCircleFill, "InfoIcon");
export const KeyIcon = createSFIcon(sfKeyFill, "KeyIcon");
export const ListIcon = createSFIcon(sfLine3Horizontal, "ListIcon");
export const LockIcon = createSFIcon(sfLockFill, "LockIcon");
export const MagnifyingGlassIcon = createSFIcon(
  sfMagnifyingglass,
  "MagnifyingGlassIcon",
);
export const MessageIcon = createSFIcon(sfMessageFill, "MessageIcon");
export const MoonIcon = createSFIcon(sfMoonFill, "MoonIcon");
export const PaintpaletteIcon = createSFIcon(
  sfPaintpaletteFill,
  "PaintpaletteIcon",
);
export const PencilSimpleIcon = createSFIcon(sfPencil, "PencilSimpleIcon");
export const Person2Icon = createSFIcon(sfPerson2Fill, "Person2Icon");
export const PersonIcon = createSFIcon(sfPersonCropCircleFill, "PersonIcon");
export const PhotoIcon = createSFIcon(sfPhotoFill, "PhotoIcon");
export const PlayRectangleIcon = createSFIcon(
  sfPlayRectangleFill,
  "PlayRectangleIcon",
);
export const PlusIcon = createSFIcon(sfPlus, "PlusIcon");
export const LogoutIcon = createSFIcon(
  sfRectanglePortraitAndArrowRightFill,
  "LogoutIcon",
);
export const SidebarIcon = createSFIcon(sfSidebarLeft, "SidebarIcon");
export const SparkleIcon = createSFIcon(sfSparkles, "SparkleIcon");
export const SquaresFourIcon = createSFIcon(
  sfSquareGrid2x2Fill,
  "SquaresFourIcon",
);
export const SunIcon = createSFIcon(sfSunMaxFill, "SunIcon");
export const TagIcon = createSFIcon(sfTagFill, "TagIcon");
export const TrashIcon = createSFIcon(sfTrashFill, "TrashIcon");
export const UploadSimpleIcon = createSFIcon(
  sfSquareAndArrowUpFill,
  "UploadSimpleIcon",
);
export const WarningIcon = createSFIcon(
  sfExclamationmarkTriangleFill,
  "WarningIcon",
);
export const XIcon = createSFIcon(sfXmark, "XIcon");
