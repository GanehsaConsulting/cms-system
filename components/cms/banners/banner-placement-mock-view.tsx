import type { BannerPlacementMock } from "@/config/banner-placements";
import { BannerPlacementMockBottom } from "@/components/cms/banners/banner-placement-mock-bottom";
import { BannerPlacementMockCta } from "@/components/cms/banners/banner-placement-mock-cta";
import { BannerPlacementMockHomepage } from "@/components/cms/banners/banner-placement-mock-homepage";
import { BannerPlacementMockMegaMenu } from "@/components/cms/banners/banner-placement-mock-mega-menu";
import { BannerPlacementMockPopup } from "@/components/cms/banners/banner-placement-mock-popup";

interface BannerPlacementMockViewProps {
  mock: BannerPlacementMock;
  images?: string[];
  className?: string;
}

export function BannerPlacementMockView({
  mock,
  images = [],
  className,
}: BannerPlacementMockViewProps) {
  switch (mock) {
    case "homepage":
      return (
        <BannerPlacementMockHomepage images={images} className={className} />
      );
    case "popup":
      return (
        <BannerPlacementMockPopup images={images} className={className} />
      );
    case "mega-menu":
      return (
        <BannerPlacementMockMegaMenu images={images} className={className} />
      );
    case "bottom":
      return (
        <BannerPlacementMockBottom images={images} className={className} />
      );
    case "cta":
      return <BannerPlacementMockCta images={images} className={className} />;
  }
}
