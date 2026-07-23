import { emptyLocalizedText } from "@/lib/locale";
import type { LocalizedText } from "@/types/locale";
import type { PriceFeature, PriceInput } from "@/types/price";

export interface GonlinePricePackageSeed {
  name: string;
  favorite?: boolean;
  pricing: {
    fixed: number;
    gimmick: number;
  };
  deliverables: string[];
}

export const GONLINE_PRICE_CATEGORIES = [
  { id: "go-digital", label: "GO Digital" },
  { id: "social-media-management", label: "Social Media" },
  { id: "website-development", label: "Website" },
] as const;

export const GONLINE_GO_DIGITAL_PACKAGES: GonlinePricePackageSeed[] = [
  {
    name: "Go Start",
    favorite: false,
    pricing: { fixed: 5_300_000, gimmick: 7_500_000 },
    deliverables: [
      "1 Landing Page Website (brand introduction)",
      "12 Feed Content (desain statis / carousel)",
      "Basic social media setup & optimization",
      "Basic caption copywriting",
      "Reusable content design template",
      "Social media diarahkan ke website",
      "1x minor revision",
      "Timeline pengerjaan 3–4 minggu",
      "1 bulan layanan",
    ],
  },
  {
    name: "Go Growth",
    favorite: true,
    pricing: { fixed: 9_000_000, gimmick: 11_000_000 },
    deliverables: [
      "Website hingga 5 halaman (company profile)",
      "20 Feed Content (desain statis / carousel)",
      "4 Reels video content",
      "Monthly content planning",
      "Basic funnel structure (awareness → website)",
      "Strategic caption & CTA writing",
      "Insight review bulanan",
      "2x revision",
      "Timeline pengerjaan 3–4 minggu",
      "1 bulan layanan",
    ],
  },
  {
    name: "Go Level Up",
    favorite: false,
    pricing: { fixed: 16_500_000, gimmick: 20_500_000 },
    deliverables: [
      "Website hingga 10 halaman (full company profile)",
      "30 Content + Reels (mix visual & video)",
      "Basic brand identity setup",
      "Full funnel mapping (awareness → conversion)",
      "Landing page campaign",
      "Basic ads setup guidance",
      "Monthly performance report",
      "Strategic content direction",
      "Timeline pengerjaan 6–8 minggu",
      "1 bulan layanan",
    ],
  },
];

export const GONLINE_SOCMED_PACKAGES: GonlinePricePackageSeed[] = [
  {
    name: "Basic",
    favorite: false,
    pricing: { fixed: 4_500_000, gimmick: 6_500_000 },
    deliverables: [
      "12 Feed Content (static/carousel)",
      "6 Instagram Story",
      "1 bulan (ongoing)",
      "Basic caption writing",
      "1x monthly content planning",
      "Basic hashtag research",
      "5x revision total",
      "Scheduling & posting",
      "Simple monthly report",
    ],
  },
  {
    name: "Growth",
    favorite: true,
    pricing: { fixed: 8_900_000, gimmick: 13_000_000 },
    deliverables: [
      "20 Feed Content",
      "4 Reels",
      "12 Instagram Story",
      "1 bulan (ongoing)",
      "Strategic content pillar mapping",
      "CTA-based caption writing",
      "Monthly content calendar",
      "15x revision total",
      "Scheduling & optimization timing",
      "Basic competitor snapshot",
      "1x strategy call",
      "Insight report + recommendation",
      "Meta ADS Setup",
    ],
  },
  {
    name: "High Scale",
    favorite: false,
    pricing: { fixed: 15_000_000, gimmick: 21_000_000 },
    deliverables: [
      "30 Feed Content",
      "8 Reels",
      "1 bulan (ongoing)",
      "Full funnel content mapping (Awareness–Conversion)",
      "Advanced sales-driven copywriting",
      "Visual direction alignment",
      "1x revision per konten",
      "Weekly monitoring & adjustment",
      "2x strategy meeting",
      "Detailed performance report",
      "Basic ads setup guidance (tanpa budget)",
      "Meta ADS Setup",
    ],
  },
];

export const GONLINE_WEBSITE_PACKAGES: GonlinePricePackageSeed[] = [
  {
    name: "Landing Page",
    favorite: true,
    pricing: { fixed: 1_500_000, gimmick: 7_000_000 },
    deliverables: [
      "1 Static Page (scroll-based)",
      "Responsive (mobile optimized)",
      "Basic UI Design",
      "Basic SEO setup (meta & structure)",
      "Contact form / CTA integration",
      "1x revision per section",
    ],
  },
  {
    name: "Company Profile Website",
    favorite: false,
    pricing: { fixed: 3_000_000, gimmick: 19_000_000 },
    deliverables: [
      "Up to 5 Pages (Home, About, Services, Portfolio, Contact)",
      "Responsive design",
      "Structured layout & UX basic",
      "Basic SEO setup",
      "Contact form integration",
      "CMS integration (jika perlu)",
      "2x revision per page",
    ],
  },
  {
    name: "Showcase Product Website",
    favorite: false,
    pricing: { fixed: 7_000_000, gimmick: 24_000_000 },
    deliverables: [
      "Up to 8 Pages",
      "Product showcase layout",
      "Category structure",
      "Responsive design",
      "Basic on-page SEO",
      "Inquiry form / WhatsApp integration",
      "CMS product management basic",
      "2x revision per page",
    ],
  },
  {
    name: "Blog Website",
    favorite: false,
    pricing: { fixed: 12_000_000, gimmick: 31_000_000 },
    deliverables: [
      "Up to 10 Pages",
      "Blog system (CMS ready)",
      "Category & tagging structure",
      "Responsive UI/UX",
      "Basic SEO optimization",
      "Article template design",
      "Contact & CTA integration",
      "2x revision per page",
    ],
  },
  {
    name: "Custom Website",
    favorite: false,
    pricing: { fixed: 0, gimmick: 0 },
    deliverables: [
      "Fully Custom Design",
      "Unlimited Pages",
      "Advanced Features",
      "Custom Integrations",
      "Scalable Architecture",
      "Priority Support",
    ],
  },
];

const WA_PHONE = "6285117388880";
const WA_MESSAGE =
  "Halo Minline, aku mau konsultasi terkait layanan GONLINE.";

function localize(value: string): LocalizedText {
  return emptyLocalizedText(value.trim());
}

function toFeatures(deliverables: string[]): PriceFeature[] {
  return deliverables.map((name) => ({
    id: crypto.randomUUID(),
    name: localize(name),
  }));
}

function slugFor(categoryId: string, name: string) {
  return `${categoryId}-${name}`
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toPriceInput(
  categoryId: string,
  serviceLabel: string,
  description: string,
  pkg: GonlinePricePackageSeed,
): PriceInput {
  return {
    slug: slugFor(categoryId, pkg.name),
    serviceSlug: categoryId,
    category: categoryId,
    highlighted: Boolean(pkg.favorite),
    description: localize(description),
    service: localize(serviceLabel),
    packageName: localize(pkg.name),
    price: Math.max(0, Math.trunc(pkg.pricing.fixed)),
    strikethroughPrice: Math.max(0, Math.trunc(pkg.pricing.gimmick)),
    whatsappPhone: WA_PHONE,
    whatsappMessage: localize(WA_MESSAGE),
    isActive: true,
    features: toFeatures(pkg.deliverables),
  };
}

/** Canonical GONLINE price catalog for CMS seeding/sync. */
export function buildGonlinePriceInputs(): PriceInput[] {
  return [
    ...GONLINE_GO_DIGITAL_PACKAGES.map((pkg) =>
      toPriceInput(
        "go-digital",
        "GO Digital",
        "Paket bundling website + social media dari GONLINE.",
        pkg,
      ),
    ),
    ...GONLINE_SOCMED_PACKAGES.map((pkg) =>
      toPriceInput(
        "social-media-management",
        "Social Media",
        "Paket social media management GONLINE.",
        pkg,
      ),
    ),
    ...GONLINE_WEBSITE_PACKAGES.map((pkg) =>
      toPriceInput(
        "website-development",
        "Website",
        "Paket website development GONLINE.",
        pkg,
      ),
    ),
  ];
}
