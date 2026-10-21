/**
 * PriceWise AI — Content Script
 *
 * Runs on supported retailer pages. Detects product information,
 * notifies the background service worker, and injects the Buyhatke-style
 * in-page floating price comparison widget.
 */

import type { ProductSignals, ResolveResult } from './types';

interface RetailerConfig {
  name: string;
  extractSignals: () => ProductSignals | null;
}

// ─── Retailer-specific extractors ────────────────────────────────────────────

const RETAILER_CONFIGS: Record<string, RetailerConfig> = {
  'amazon.in': {
    name: 'Amazon India',
    extractSignals(): ProductSignals | null {
      const asinMatch =
        window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/) ||
        window.location.pathname.match(/\/gp\/product\/([A-Z0-9]{10})/);

      const asin =
        asinMatch?.[1] ??
        document.querySelector<HTMLInputElement>('#ASIN')?.value ??
        null;

      if (!asin) return null;

      const title =
        document.querySelector('#productTitle')?.textContent?.trim() ?? '';
      const priceText =
        document.querySelector('.a-price-whole')?.textContent?.trim() ?? '';

      return {
        retailer: 'amazon.in',
        externalId: asin,
        url: window.location.href,
        title,
        currentPriceText: priceText,
      };
    },
  },

  'flipkart.com': {
    name: 'Flipkart',
    extractSignals(): ProductSignals | null {
      const pid = new URLSearchParams(window.location.search).get('pid');
      if (!pid) return null;

      const title =
        document.querySelector('h1.yhB1nd')?.textContent?.trim() ??
        document.querySelector('span.B_NuCI')?.textContent?.trim() ??
        '';

      const priceText =
        document.querySelector('div._30jeq3')?.textContent?.trim() ?? '';

      return {
        retailer: 'flipkart.com',
        externalId: pid,
        url: window.location.href,
        title,
        currentPriceText: priceText,
      };
    },
  },

  'croma.com': {
    name: 'Croma',
    extractSignals(): ProductSignals | null {
      const idMatch = window.location.pathname.match(/\/p\/(\d+)/);
      if (!idMatch) return null;

      const title =
        document.querySelector('h1.pdp-title')?.textContent?.trim() ??
        document.querySelector('h1')?.textContent?.trim() ??
        '';

      const priceText =
        document.querySelector('.pdp-price')?.textContent?.trim() ?? '';

      return {
        retailer: 'croma.com',
        externalId: idMatch[1],
        url: window.location.href,
        title,
        currentPriceText: priceText,
      };
    },
  },
};

// ─── Buyhatke-Style In-Page Floating Comparison Widget ────────────────────────

let widgetHostElement: HTMLDivElement | null = null;
let shadowRoot: ShadowRoot | null = null;
let isMinimized = false;

function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return 'N/A';
  return '₹' + amount.toLocaleString('en-IN');
}

function injectFloatingWidget(data: ResolveResult, currentRetailer: string): void {
  // If already injected, remove previous one
  if (widgetHostElement) {
    widgetHostElement.remove();
    widgetHostElement = null;
    shadowRoot = null;
  }

  widgetHostElement = document.createElement('div');
  widgetHostElement.id = 'pricewise-inpage-container';
  shadowRoot = widgetHostElement.attachShadow({ mode: 'open' });
  document.body.appendChild(widgetHostElement);

  renderWidget(data, currentRetailer);
}

function renderWidget(data: ResolveResult, currentRetailer: string): void {
  if (!shadowRoot) return;

  const webAppUrl = `http://localhost:5173/products/${data.productId}`;
  const lowestPrice = data.dealScore?.currentBestPrice ?? (data.offers[0]?.price || 0);
  const lowestEver = data.dealScore?.historicalMin ?? lowestPrice;
  const currentStoreOffer = data.offers.find((o) =>
    o.retailerName.toLowerCase().includes(currentRetailer.toLowerCase())
  );
  const currentStorePrice = currentStoreOffer?.price ?? lowestPrice;

  // Find if another store is cheaper
  const cheapestOffer = [...data.offers].sort((a, b) => a.price - b.price)[0];
  const isCompetitorCheaper =
    cheapestOffer &&
    currentStoreOffer &&
    cheapestOffer.price < currentStoreOffer.price;
  const savings = isCompetitorCheaper ? currentStoreOffer.price - cheapestOffer.price : 0;

  // Buyhatke Verdict
  let verdictText = 'Good Deal';
  let verdictColor = '#10B981';
  let verdictBg = '#ECFDF5';

  if (isCompetitorCheaper) {
    verdictText = `Save ${formatCurrency(savings)} on ${cheapestOffer.retailerName}!`;
    verdictColor = '#F59E0B';
    verdictBg = '#FFFBEB';
  } else if (currentStorePrice <= lowestEver * 1.03) {
    verdictText = 'Lowest Price Ever!';
    verdictColor = '#10B981';
    verdictBg = '#ECFDF5';
  } else {
    verdictText = `₹${Math.round(currentStorePrice - lowestEver).toLocaleString('en-IN')} Above Lowest`;
    verdictColor = '#EF4444';
    verdictBg = '#FEF2F2';
  }

  const styles = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .pw-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 12px 36px -4px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.08);
      width: 330px;
      overflow: hidden;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .pw-header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }
    .pw-header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pw-logo-pill {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .pw-title {
      font-size: 13px;
      font-weight: 700;
    }
    .pw-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .pw-btn-icon {
      background: transparent;
      border: none;
      color: #ffffff;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 4px;
      border-radius: 4px;
      opacity: 0.85;
    }
    .pw-btn-icon:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.2);
    }
    .pw-body {
      padding: 14px;
      display: flex;
      flex-col: column;
      gap: 12px;
      flex-direction: column;
    }
    .pw-verdict-box {
      background: ${verdictBg};
      border: 1px solid ${verdictColor}40;
      color: ${verdictColor};
      border-radius: 10px;
      padding: 8px 10px;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .pw-metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .pw-metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px 10px;
    }
    .pw-metric-label {
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .pw-metric-value {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    .pw-metric-value.lowest {
      color: #10b981;
    }
    .pw-offers-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .pw-offers-title {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
    }
    .pw-offer-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding: 6px 8px;
      border-radius: 8px;
      background: #f1f5f9;
      text-decoration: none;
      color: inherit;
      transition: background 0.15s ease;
    }
    .pw-offer-row:hover {
      background: #e2e8f0;
    }
    .pw-offer-seller {
      font-weight: 600;
      color: #334155;
    }
    .pw-offer-price {
      font-weight: 700;
      color: #0f172a;
    }
    .pw-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 4px;
    }
    .pw-btn-action {
      background: #3b82f6;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: background 0.15s ease;
    }
    .pw-btn-action:hover {
      background: #2563eb;
    }
    .pw-btn-secondary {
      background: #f1f5f9;
      color: #1e293b;
      border: 1px solid #cbd5e1;
    }
    .pw-btn-secondary:hover {
      background: #e2e8f0;
    }
    /* Minimized Badge */
    .pw-minimized-pill {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 10px 16px;
      border-radius: 9999px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s ease;
    }
    .pw-minimized-pill:hover {
      transform: scale(1.05);
    }
  `;

  if (isMinimized) {
    shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="pw-minimized-pill" id="pw-open-btn">
        <span>⚡ PriceWise:</span>
        <span>${formatCurrency(lowestPrice)}</span>
      </div>
    `;
    shadowRoot.getElementById('pw-open-btn')?.addEventListener('click', () => {
      isMinimized = false;
      renderWidget(data, currentRetailer);
    });
    return;
  }

  const offersHtml = data.offers
    .slice(0, 3)
    .map(
      (o) => `
      <a href="${o.productUrl || webAppUrl}" target="_blank" class="pw-offer-row">
        <span class="pw-offer-seller">${o.retailerName}</span>
        <span class="pw-offer-price">${formatCurrency(o.price)}</span>
      </a>
    `
    )
    .join('');

  shadowRoot.innerHTML = `
    <style>${styles}</style>
    <div class="pw-widget">
      <div class="pw-header" id="pw-header-toggle">
        <div class="pw-header-left">
          <span class="pw-logo-pill">PRICEWISE</span>
          <span class="pw-title">Price Radar</span>
        </div>
        <div class="pw-controls">
          <button class="pw-btn-icon" id="pw-minimize-btn" title="Minimize">−</button>
          <button class="pw-btn-icon" id="pw-close-btn" title="Close">×</button>
        </div>
      </div>

      <div class="pw-body">
        <div class="pw-verdict-box">
          <span>${verdictText}</span>
          <span>⚡</span>
        </div>

        <div class="pw-metrics-grid">
          <div class="pw-metric-card">
            <div class="pw-metric-label">Best Price</div>
            <div class="pw-metric-value">${formatCurrency(lowestPrice)}</div>
          </div>
          <div class="pw-metric-card">
            <div class="pw-metric-label">Lowest Ever</div>
            <div class="pw-metric-value lowest">${formatCurrency(lowestEver)}</div>
          </div>
        </div>

        <div class="pw-offers-list">
          <div class="pw-offers-title">Retailer Comparison</div>
          ${offersHtml}
        </div>

        <div class="pw-actions">
          <a href="${webAppUrl}" target="_blank" class="pw-btn-action">
            📊 View Chart
          </a>
          <a href="${webAppUrl}" target="_blank" class="pw-btn-action pw-btn-secondary">
            🔔 Drop Alert
          </a>
        </div>
      </div>
    </div>
  `;

  shadowRoot.getElementById('pw-minimize-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    isMinimized = true;
    renderWidget(data, currentRetailer);
  });

  shadowRoot.getElementById('pw-close-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (widgetHostElement) {
      widgetHostElement.remove();
      widgetHostElement = null;
      shadowRoot = null;
    }
  });
}

// ─── Main detection logic ─────────────────────────────────────────────────────

function detectAndNotify(): void {
  const hostname = window.location.hostname.replace(/^www\./, '');
  const config = RETAILER_CONFIGS[hostname];

  if (!config) return;

  const signals = config.extractSignals();
  if (!signals) return;

  console.log(`[PriceWise] Product detected on ${config.name}:`, signals);

  // Notify background worker
  chrome.runtime.sendMessage(
    {
      type: 'PRODUCT_DETECTED',
      url: window.location.href,
      signals,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.warn('[PriceWise] Background not ready:', chrome.runtime.lastError.message);
        return;
      }
      if (response?.success && response.data) {
        console.log('[PriceWise] Product resolved:', response.data);
        // Inject floating Buyhatke comparison card directly into the page!
        injectFloatingWidget(response.data, config.name);
      }
    }
  );
}

// Run after page is fully loaded
detectAndNotify();

// Re-detect on SPA navigation
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    setTimeout(detectAndNotify, 1000);
  }
});

observer.observe(document.body, { childList: true, subtree: true });
