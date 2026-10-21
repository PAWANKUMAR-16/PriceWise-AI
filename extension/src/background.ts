/**
 * PriceWise AI — Background Service Worker (Manifest V3)
 *
 * Responsibilities:
 * - Listen for messages from content scripts
 * - Communicate with the PriceWise backend API
 * - Manage authentication token storage
 * - Handle badge updates when a product is resolved
 */

import { resolveProductByUrl, getProductOffers, getProductDealScore } from './api';
import type { ResolveResult } from './types';

const PRICEWISE_API_BASE = 'http://localhost:8080/api/v1';

// Store resolved product data keyed by tabId for quick popup access
const tabProductCache: Map<number, ResolveResult> = new Map();

chrome.runtime.onInstalled.addListener(() => {
  console.log('[PriceWise] Extension installed.');
  chrome.action.setBadgeBackgroundColor({ color: '#3B82F6' });
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;

  if (message.type === 'PRODUCT_DETECTED') {
    // Content script detected a supported product page
    handleProductDetected(message.url, message.signals, tabId)
      .then((result) => {
        sendResponse({ success: true, data: result });
      })
      .catch((err) => {
        console.error('[PriceWise] Failed to resolve product:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // Keep message channel open for async response
  }

  if (message.type === 'GET_CACHED_PRODUCT') {
    // Popup requesting cached product data
    const tabIdRequested = message.tabId as number;
    const cached = tabProductCache.get(tabIdRequested);
    sendResponse({ data: cached ?? null });
    return false;
  }

  if (message.type === 'GET_AUTH_TOKEN') {
    chrome.storage.local.get('authToken', (result) => {
      sendResponse({ token: result.authToken ?? null });
    });
    return true;
  }

  if (message.type === 'SET_AUTH_TOKEN') {
    chrome.storage.local.set({ authToken: message.token }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'CLEAR_AUTH_TOKEN') {
    chrome.storage.local.remove('authToken', () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

async function handleProductDetected(
  url: string,
  signals: Record<string, string>,
  tabId: number | undefined
): Promise<ResolveResult> {
  const token = await getStoredToken();

  // Resolve product against PriceWise catalogue
  const resolveResult = await resolveProductByUrl(PRICEWISE_API_BASE, url, token);

  if (!resolveResult || !resolveResult.productId) {
    updateBadge(tabId, null);
    throw new Error('Product not found in PriceWise catalogue');
  }

  // Fetch offers and deal score in parallel
  const [offers, dealScore] = await Promise.all([
    getProductOffers(PRICEWISE_API_BASE, resolveResult.productId, token),
    getProductDealScore(PRICEWISE_API_BASE, resolveResult.productId, token),
  ]);

  const result: ResolveResult = {
    ...resolveResult,
    offers,
    dealScore,
  };

  // Cache result for this tab
  if (tabId !== undefined) {
    tabProductCache.set(tabId, result);
    updateBadge(tabId, dealScore?.score ?? null);
  }

  return result;
}

function updateBadge(tabId: number | undefined, score: number | null): void {
  if (tabId === undefined) return;

  if (score === null) {
    chrome.action.setBadgeText({ text: '', tabId });
    return;
  }

  const text = score >= 10 ? `${Math.round(score)}%` : '✓';
  const color = score >= 20 ? '#10B981' : score >= 10 ? '#F59E0B' : '#6B7280';

  chrome.action.setBadgeText({ text, tabId });
  chrome.action.setBadgeBackgroundColor({ color, tabId });
}

// Clean up cache when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabProductCache.delete(tabId);
});

async function getStoredToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get('authToken', (result) => {
      resolve(result.authToken ?? null);
    });
  });
}
