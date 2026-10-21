/**
 * PriceWise AI — Extension API Client
 *
 * Communicates with the PriceWise backend. All credentials stay on the
 * backend; the extension only uses a user JWT (never provider API keys).
 */

import type { Offer, DealScore, ResolveResult } from './types';

export async function resolveProductByUrl(
  apiBase: string,
  url: string,
  token: string | null
): Promise<ResolveResult | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(
      `${apiBase}/products/resolve?url=${encodeURIComponent(url)}`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Resolve API error: ${response.status}`);
    }

    return (await response.json()) as ResolveResult;
  } catch (err) {
    console.error('[PriceWise API] resolveProductByUrl failed:', err);
    return null;
  }
}

export async function getProductOffers(
  apiBase: string,
  productId: number,
  token: string | null
): Promise<Offer[]> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${apiBase}/products/${productId}/offers`, { headers });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : (data.content ?? []);
  } catch {
    return [];
  }
}

export async function getProductDealScore(
  apiBase: string,
  productId: number,
  token: string | null
): Promise<DealScore | null> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${apiBase}/products/${productId}/deal-score`, { headers });
    if (!response.ok) return null;
    return (await response.json()) as DealScore;
  } catch {
    return null;
  }
}

export async function addToWatchlist(
  apiBase: string,
  productId: number,
  targetPrice: number | null,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(`${apiBase}/watchlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, targetPrice }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
