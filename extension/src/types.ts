/**
 * PriceWise AI — Shared TypeScript Types for the Browser Extension
 */

export interface ProductSignals {
  retailer: string;
  externalId: string;
  url: string;
  title: string;
  currentPriceText: string;
}

export interface Offer {
  id: number;
  retailerName: string;
  retailerCode: string;
  price: number;
  shippingCost: number | null;
  currency: string;
  availability: string;
  productUrl: string;
  observedAt: string;
}

export interface DealScore {
  score: number;
  explanation: string;
  historicalMin: number | null;
  historicalMax: number | null;
  historicalMedian: number | null;
  dataFreshness: 'HIGH' | 'MEDIUM' | 'LOW';
  currentBestPrice: number | null;
}

export interface PriceHistoryPoint {
  observedAt: string;
  price: number;
  currency: string;
}

export interface ResolveResult {
  productId: number;
  title: string;
  brand: string;
  modelNumber: string | null;
  category: string;
  pricewiseUrl: string;
  offers: Offer[];
  dealScore: DealScore | null;
}
