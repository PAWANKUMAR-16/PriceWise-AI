/**
 * PriceWise AI — Extension Popup Script
 */

import type { ResolveResult, Offer, DealScore } from './types';

// ─── State ────────────────────────────────────────────────────────────────────

let currentProduct: ResolveResult | null = null;
const PRICEWISE_WEB_BASE = 'https://pricewise.ai'; // Update to deployed URL

// ─── DOM Helpers ──────────────────────────────────────────────────────────────

function $(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el;
}

function formatPrice(price: number | null, currency = 'INR'): string {
  if (price === null) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function getDealScoreColor(score: number): string {
  if (score >= 20) return '#10B981'; // emerald
  if (score >= 10) return '#F59E0B'; // amber
  return '#6B7280';                   // gray
}

// ─── Render Functions ─────────────────────────────────────────────────────────

function renderLoading(): void {
  $('app').innerHTML = `
    <div class="flex flex-col items-center justify-center h-48 gap-3">
      <div class="spinner"></div>
      <p class="text-sm text-gray-500">Looking up product...</p>
    </div>
  `;
}

function renderNotSupported(): void {
  $('app').innerHTML = `
    <div class="flex flex-col items-center justify-center h-48 gap-3 px-4 text-center">
      <span class="text-4xl">🔍</span>
      <h2 class="font-semibold text-gray-700">No product detected</h2>
      <p class="text-xs text-gray-500">
        Visit a product page on Amazon, Flipkart, or Croma to see price comparisons.
      </p>
    </div>
  `;
}

function renderError(message: string): void {
  $('app').innerHTML = `
    <div class="flex flex-col items-center justify-center h-48 gap-3 px-4 text-center">
      <span class="text-4xl">⚠️</span>
      <h2 class="font-semibold text-gray-700">Product not in catalogue</h2>
      <p class="text-xs text-gray-500">${message}</p>
    </div>
  `;
}

function renderProduct(product: ResolveResult): void {
  const bestOffer = product.offers.length > 0
    ? product.offers.reduce((a, b) =>
        (a.price + (a.shippingCost ?? 0)) <= (b.price + (b.shippingCost ?? 0)) ? a : b
      )
    : null;

  const offersHtml = product.offers
    .slice(0, 3)
    .map((o) => renderOfferRow(o))
    .join('');

  const dealHtml = product.dealScore ? renderDealScore(product.dealScore) : '';

  $('app').innerHTML = `
    <div class="p-3 space-y-3">
      <!-- Header -->
      <div>
        <p class="text-xs text-blue-600 font-medium uppercase tracking-wide">${product.brand}</p>
        <h2 class="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">${product.title}</h2>
        ${product.modelNumber ? `<p class="text-xs text-gray-400 mt-0.5">Model: ${product.modelNumber}</p>` : ''}
      </div>

      ${bestOffer ? `
      <!-- Best price -->
      <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center justify-between">
        <div>
          <p class="text-xs text-emerald-700 font-medium">Best price</p>
          <p class="text-lg font-bold text-emerald-800">${formatPrice(bestOffer.price)}</p>
          ${bestOffer.shippingCost ? `<p class="text-xs text-gray-500">+ ${formatPrice(bestOffer.shippingCost)} shipping</p>` : '<p class="text-xs text-emerald-600">Free shipping</p>'}
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-500">${bestOffer.retailerName}</p>
          <a href="${bestOffer.productUrl}" target="_blank" class="text-xs text-blue-600 hover:underline">Buy now →</a>
        </div>
      </div>
      ` : ''}

      ${dealHtml}

      <!-- All offers -->
      ${product.offers.length > 1 ? `
      <div>
        <p class="text-xs font-medium text-gray-500 mb-1">All offers</p>
        <div class="space-y-1">${offersHtml}</div>
      </div>
      ` : ''}

      <!-- Actions -->
      <div class="flex gap-2 pt-1">
        <a href="${product.pricewiseUrl}" target="_blank"
           class="flex-1 text-center text-xs bg-blue-600 text-white rounded-md py-1.5 hover:bg-blue-700 transition-colors">
          Full comparison →
        </a>
        <button id="watchlist-btn"
           class="flex-1 text-center text-xs border border-gray-300 text-gray-700 rounded-md py-1.5 hover:bg-gray-50 transition-colors">
          + Watchlist
        </button>
      </div>
    </div>
  `;

  document.getElementById('watchlist-btn')?.addEventListener('click', handleAddToWatchlist);
}

function renderOfferRow(offer: Offer): string {
  const total = offer.price + (offer.shippingCost ?? 0);
  return `
    <div class="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
      <span class="text-xs text-gray-600">${offer.retailerName}</span>
      <div class="text-right">
        <span class="text-xs font-semibold text-gray-800">${formatPrice(total)}</span>
        ${offer.shippingCost ? `<span class="text-xs text-gray-400"> (incl. ship.)</span>` : ''}
      </div>
    </div>
  `;
}

function renderDealScore(deal: DealScore): string {
  const color = getDealScoreColor(deal.score);
  const label = deal.score >= 20 ? 'Good Deal' : deal.score >= 10 ? 'Fair Price' : 'Typical Price';

  return `
    <div class="border rounded-lg p-2">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-medium text-gray-600">Deal Score</span>
        <span class="text-sm font-bold" style="color: ${color}">${Math.round(deal.score)}% — ${label}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-1.5">
        <div class="h-1.5 rounded-full transition-all" style="width: ${Math.min(deal.score, 100)}%; background-color: ${color}"></div>
      </div>
      ${deal.historicalMedian ? `
      <p class="text-xs text-gray-500 mt-1">
        Hist. median: ${formatPrice(deal.historicalMedian)}
        · Min: ${formatPrice(deal.historicalMin)}
        · Max: ${formatPrice(deal.historicalMax)}
      </p>
      ` : ''}
      <p class="text-xs text-gray-400 mt-0.5">Freshness: ${deal.dataFreshness}</p>
    </div>
  `;
}

// ─── Watchlist Handler ────────────────────────────────────────────────────────

async function handleAddToWatchlist(): Promise<void> {
  const token = await getToken();
  if (!token) {
    alert('Please log in to PriceWise to use watchlists.');
    chrome.tabs.create({ url: 'http://localhost:5173/login' });
    return;
  }

  if (!currentProduct) return;

  const targetPrice = prompt(
    'Set a target price alert (optional, press Enter to skip):',
    ''
  );

  const { addToWatchlist } = await import('./api');
  const PRICEWISE_API_BASE = 'http://localhost:8080/api/v1';

  const success = await addToWatchlist(
    PRICEWISE_API_BASE,
    currentProduct.productId,
    targetPrice ? parseFloat(targetPrice) : null,
    token
  );

  if (success) {
    alert('✓ Added to watchlist!');
  } else {
    alert('Failed to add to watchlist. Please try again.');
  }
}

async function getToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get('authToken', (result) => {
      resolve(result.authToken ?? null);
    });
  });
}

// ─── Initialization ───────────────────────────────────────────────────────────

async function init(): Promise<void> {
  renderLoading();

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    renderNotSupported();
    return;
  }

  // Request cached product data from background worker
  chrome.runtime.sendMessage(
    { type: 'GET_CACHED_PRODUCT', tabId: tab.id },
    (response) => {
      const product = response?.data as ResolveResult | null;

      if (!product) {
        renderNotSupported();
        return;
      }

      currentProduct = product;
      renderProduct(product);
    }
  );
}

document.addEventListener('DOMContentLoaded', init);
