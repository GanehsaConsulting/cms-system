export type PortfolioWorkType = "social-media" | "website";

export interface Portfolio {
  id: string;
  brandId: string;
  title: string;
  /** Client this work belongs to. */
  clientId: string;
  workType: PortfolioWorkType;
  coverImage: string;
  description: string;
  /** Live project / social URL. */
  url: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioInput {
  title: string;
  clientId: string;
  workType: PortfolioWorkType;
  coverImage: string;
  description: string;
  url: string;
  featured: boolean;
}
