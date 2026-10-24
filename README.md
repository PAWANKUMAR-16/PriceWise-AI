# PriceWise AI — Smart Shopping Price Comparison Platform

> 🎓 **B.Tech CSE Major Project** | Computer Science & Engineering

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.3-6DB33F?logo=spring)](https://spring.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2018-336791?logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Language-Java%2021-ED8B00?logo=openjdk)](https://openjdk.org/)
[![License](https://img.shields.io/badge/License-Academic%20Project-lightgrey)](LICENSE)

---

## 1. Project Overview

| Field | Details |
|-------|---------|
| **Project Title** | PriceWise AI — Smart Shopping Price Comparison & Tracking Platform |
| **Project Guide** | **Ms. Aarshi Ma'am** |
| **Academic Year** | 2025–2026 |
| **Degree / Branch** | B.Tech — Computer Science & Engineering |

### Team Members

| # | Name | Roll Number |
|---|------|-------------|
| 1 | **Pawan Kumar** | 6606345 |
| 2 | **Ravi Raj** | 6606348 |
| 3 | **Muskan Singh** | 6606417 |
| 4 | **Keshav Kumar Singh** | 6605469 |
| 5 | **Sneha Saw** | 6606754 |

### Project Objective

PriceWise AI solves the problem of price fragmentation across Indian e-commerce platforms (Amazon India, Flipkart, Croma). Shoppers waste significant time and money because they cannot easily compare real-time prices or know whether today's price is genuinely a good deal relative to historical prices. PriceWise AI aggregates multi-retailer price data, stores historical price observations in a PostgreSQL database, calculates data-driven deal scores, and presents an intuitive interactive interface — enabling smarter, evidence-based purchase decisions.

---

## 2. Problem Statement

### The Problem

With the growth of Indian e-commerce, identical products are listed on Amazon India, Flipkart, Croma, and other platforms at vastly different prices. These prices also change multiple times daily. A shopper buying a laptop today may pay ₹15,000 more than someone who bought it last week, simply because:

1. They checked only one platform.
2. They did not know whether the current price is historically high or low.
3. They had no mechanism to be notified when the price drops.

### Why Is It Needed?

- **Fragmented Market:** Products on Amazon are often ₹2,000–₹10,000 cheaper (or more expensive) than on Flipkart for the same model.
- **No Price Memory:** Platforms deliberately reset price history UI and show manipulated "crossed out" MRP values.
- **Consumer Loss:** Consumers collectively overpay billions of rupees annually due to lack of price intelligence.

### Our Solution

PriceWise AI provides:
- A unified search interface across 3 major Indian retailers.
- An interactive 30–90 day price history graph per product.
- An algorithmic Deal Score (0–100) comparing today's price against the historical median.
- Price drop alerts sent automatically when the target price is reached.
- A Chrome Extension that injects price comparisons directly into retailer product pages.

---

## 3. Features

### Core Features

- 🔍 **Multi-Retailer Product Search** — Search by name, brand, category, price range, and sort by relevance or deal score across Amazon India, Flipkart, and Croma.
- 💰 **Side-by-Side Price Comparison** — View all retailer offers for a product on one page with shipping cost, availability, and condition clearly listed.
- 📈 **Interactive Price History Chart** — Recharts-powered area chart showing 7-day, 30-day, and 90-day price curves with daily lowest aggregation per retailer.
- 🎯 **Algorithmic Deal Score** — Transparent 0–100 score calculated using historical median, current price, and data freshness. No guesswork — pure data.
- ⏰ **Price Drop Alerts** — Users set a target price; the system checks every 5 minutes and dispatches an in-app notification when the price is hit.
- 👤 **User Authentication** — Secure JWT-based registration and login. Watchlists and alerts are linked to user accounts.
- 📋 **Watchlist** — Save products to a personal watchlist with target prices for ongoing monitoring.
- 🔔 **Notification Center** — Full notification inbox listing triggered alerts and system messages.
- 🔌 **Chrome Browser Extension** — Manifest V3 extension that auto-detects product pages on Amazon/Flipkart/Croma and injects a PriceWise overlay card.
- 🛠️ **Admin Dashboard** — View data ingestion run history, provider health, and system metrics.

### UI/UX Highlights

- Responsive Tailwind CSS design working on mobile, tablet, and desktop.
- Dark gradient hero section with animated typing effect.
- Product gallery with 4-angle image carousel.
- Buyhatke-inspired deal scanner panel.
- WhatsApp share and clipboard copy functionality.

---

## 4. Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI component library |
| Vite | 5.3.4 | Build tool and dev server |
| TypeScript | 5.5.3 | Type-safe JavaScript |
| Tailwind CSS | 3.4.6 | Utility-first CSS framework |
| Recharts | 2.12.7 | Price history charts |
| React Router DOM | 6.26.0 | Client-side routing |
| TanStack Query | 5.51.1 | Server state management and caching |
| Axios | 1.7.2 | HTTP client |
| Lucide React | 0.408.0 | Icon library |
| date-fns | 3.6.0 | Date formatting and calculations |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 21 | Core language (LTS) |
| Spring Boot | 3.3.x | Application framework |
| Spring Security | 6.x | Authentication and authorization |
| JJWT | 0.12.5 | JWT token generation and validation |
| Spring Data JPA | 3.3.x | ORM abstraction over Hibernate |
| Hibernate | 6.x | JPA implementation |
| Flyway | 10.x | Database schema versioning and migrations |
| Lombok | 1.18.x | Boilerplate elimination |
| SpringDoc OpenAPI | 2.5.x | Swagger UI auto-generation |
| JUnit 5 | 5.x | Unit and integration testing |
| Mockito | 5.x | Mock-based testing |
| Maven | 3.9+ | Dependency management and build |

### Database

| Technology | Version | Purpose |
|-----------|---------|---------|
| PostgreSQL | 18 | Primary relational database |

### Browser Extension

| Technology | Purpose |
|-----------|---------|
| TypeScript | Extension logic |
| Chrome Manifest V3 | Extension platform |
| Vite | Extension build |

### Dev Tools

| Tool | Purpose |
|------|---------|
| VS Code | IDE |
| Postman | API testing |
| pgAdmin 4 | Database administration |
| Git + GitHub | Version control |

---

## 5. Project Structure

```
PriceWise-AI/
│
├── backend/                          # Spring Boot 3.3 + Java 21 Backend
│   ├── src/main/java/com/pricewise/
│   │   ├── PriceWiseApplication.java
│   │   ├── config/                   # Security config, CORS, beans
│   │   ├── controller/               # REST API controllers
│   │   │   ├── ProductController.java
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java
│   │   │   ├── WatchlistController.java
│   │   │   ├── PriceAlertController.java
│   │   │   ├── NotificationController.java
│   │   │   └── AdminController.java
│   │   ├── domain/
│   │   │   ├── entity/               # JPA Entities (10 tables)
│   │   │   ├── repository/           # Spring Data JPA Repos
│   │   │   └── dto/                  # Request/Response Records
│   │   ├── service/                  # Business logic layer
│   │   │   ├── ProductService.java
│   │   │   ├── AuthService.java
│   │   │   ├── WatchlistService.java
│   │   │   ├── PriceAlertService.java
│   │   │   └── AlertProcessorScheduler.java
│   │   ├── algorithm/
│   │   │   ├── DealScoringService.java
│   │   │   └── ProductMatchingService.java
│   │   ├── security/                 # JWT Filter, UserDetails
│   │   ├── adapter/                  # Provider adapters (Amazon, Synthetic)
│   │   └── exception/                # Global exception handler
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-dev.yml
│   │   └── db/migration/
│   │       ├── V1__create_core_tables.sql
│   │       ├── V2__seed_development_data.sql
│   │       └── V3__expand_product_catalog.sql
│   ├── src/test/                     # JUnit 5 tests
│   └── pom.xml
│
├── frontend/                         # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── api/                      # Axios API client modules
│   │   │   ├── client.ts             # JWT interceptor
│   │   │   ├── products.ts           # Product + price history APIs
│   │   │   ├── auth.ts
│   │   │   ├── watchlist.ts
│   │   │   ├── alerts.ts
│   │   │   └── admin.ts
│   │   ├── components/
│   │   │   ├── layout/               # Navbar, Footer, Layout
│   │   │   ├── products/             # ProductCard, PriceHistoryChart, OfferTable
│   │   │   ├── ui/                   # Button, Badge, Modal, Spinner, Input
│   │   │   └── watchlist/            # AlertForm, WatchlistItem
│   │   ├── pages/                    # Home, Search, ProductDetail, Watchlist...
│   │   ├── hooks/                    # useProducts, useWatchlist, useAuth
│   │   ├── context/                  # AuthContext (JWT state)
│   │   ├── types/                    # TypeScript interfaces
│   │   └── utils/                    # formatPrice, formatDate, productImages
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── extension/                        # Chrome Extension (Manifest V3)
│   ├── src/
│   │   ├── content.ts                # Injected into retailer pages
│   │   ├── background.ts             # Service worker
│   │   ├── popup.ts                  # Extension popup UI logic
│   │   └── api.ts                    # Extension API calls to backend
│   ├── popup.html
│   ├── manifest.json
│   └── package.json
│
├── run_backend.bat                   # One-click backend launcher (Windows)
├── run_frontend.bat                  # One-click frontend launcher (Windows)
├── run_all.bat                       # Launch everything together
├── seed_nothing_phone.sql            # Extra product seed data
└── README.md
```

---

## 6. Installation and Execution

### Prerequisites

| Tool | Version | Download |
|------|---------|---------|
| Java (JDK) | 21 | [Adoptium](https://adoptium.net/) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| PostgreSQL | 15+ | [postgresql.org](https://www.postgresql.org/download/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/PAWANKUMAR-16/PriceWise-AI.git
cd PriceWise-AI
```

---

### Step 2 — Database Setup

Open **pgAdmin 4** or **psql** and run:

```sql
CREATE DATABASE pricewise_db;
CREATE USER pricewise_user WITH PASSWORD 'pricewise_password';
GRANT ALL PRIVILEGES ON DATABASE pricewise_db TO pricewise_user;
```

---

### Step 3 — Backend Setup

```bash
cd backend
```

**On Windows (PowerShell):**
```powershell
$env:DATABASE_URL = "jdbc:postgresql://localhost:5432/pricewise_db"
$env:DATABASE_USERNAME = "pricewise_user"
$env:DATABASE_PASSWORD = "pricewise_password"
$env:JWT_SECRET = "pricewise-dev-secret-key-minimum-256-bits-long-for-hmac-sha256"
.\mvnw.cmd spring-boot:run "-Dspring.profiles.active=dev"
```

**On Linux / macOS:**
```bash
export DATABASE_URL="jdbc:postgresql://localhost:5432/pricewise_db"
export DATABASE_USERNAME="pricewise_user"
export DATABASE_PASSWORD="pricewise_password"
export JWT_SECRET="pricewise-dev-secret-key-minimum-256-bits-long-for-hmac-sha256"
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

> Flyway will automatically apply all 3 SQL migrations (V1, V2, V3) on first start, creating all 10 tables and seeding 42 products with 30-day historical price data.

**Backend API:** http://localhost:8080  
**Swagger UI:** http://localhost:8080/swagger-ui.html

---

### Step 4 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

**App URL:** http://localhost:5173

> All API calls from the frontend are automatically proxied to `http://localhost:8080` via the Vite dev server proxy.

---

### Step 5 — Chrome Extension (Optional)

```bash
cd extension
npm install
npm run build
```

In Chrome:
1. Go to `chrome://extensions`
2. Enable **Developer Mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder

---

### Windows One-Click Launch

Simply double-click **`run_all.bat`** from the project root to start both backend and frontend simultaneously.

---

## 7. Screenshots / Output

### Homepage — Hero & Product Search
![PriceWise AI Homepage](https://via.placeholder.com/900x500/1a1a2e/00d4ff?text=PriceWise+AI+-+Homepage+Hero)

### Product Search Results
![Search Results](https://via.placeholder.com/900x500/16213e/00d4ff?text=Search+Results+-+42+Products+with+Deal+Scores)

### Product Detail — Price Comparison Table
![Price Comparison](https://via.placeholder.com/900x500/0f3460/00d4ff?text=Multi-Store+Price+Comparison+Table)

### Product Detail — Interactive Price History Chart
![Price History Chart](https://via.placeholder.com/900x500/1a1a2e/10b981?text=30-Day+Price+History+Chart+with+Store+Filters)

### Deal Score Panel
![Deal Scanner](https://via.placeholder.com/900x500/16213e/f59e0b?text=Deal+Score+Panel+-+Hot+Deal+%2F+Fair+Price+Verdict)

### User Watchlist & Price Alerts
![Watchlist](https://via.placeholder.com/900x500/0f3460/f59e0b?text=Watchlist+-+Price+Alert+Setup)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/900x500/1a1a2e/a855f7?text=Admin+Dashboard+-+Ingestion+Runs+%26+Provider+Health)

### Chrome Extension Popup
![Chrome Extension](https://via.placeholder.com/400x300/16213e/00d4ff?text=Chrome+Extension+-+Injected+Price+Overlay)

---

## 8. DSA Concepts Used

### HashMap (Hash Table)

**Where used:** `ProductMatchingService.java`  
**Purpose:** Products are indexed in a `HashMap<String, Product>` by normalized external ID (e.g., Amazon ASIN). When the system receives a new price observation, it does an O(1) lookup to find the matching product record — far faster than a linear scan of 42+ products.

```java
// O(1) product lookup by external identifier
private final Map<String, Product> productIndex = new HashMap<>();
matchByExactId(String externalId) → productIndex.get(externalId)
```

---

### PriorityQueue (Min-Heap)

**Where used:** `ProductMatchingService.java`  
**Purpose:** When a product URL is resolved and multiple candidate products match partially (by brand, title tokens, model number), a `PriorityQueue` ranks the top-K candidates by similarity score. This avoids sorting the full candidate list — O(n log k) instead of O(n log n).

```java
PriorityQueue<ScoredCandidate> topK = new PriorityQueue<>(k, comparator);
// For each candidate: poll the minimum-scored if size > k
```

---

### Binary Search

**Where used:** `DealScoringService.java`  
**Purpose:** After sorting the 30–90 day price history array, binary search locates the median index in O(log n) time to compute the historical median price used in the deal score formula.

```java
List<BigDecimal> sortedPrices = history.stream()
    .map(ph -> ph.getPrice()).sorted().toList();
BigDecimal median = sortedPrices.get(sortedPrices.size() / 2); // Median via sorted index
```

---

### Sorting (Merge Sort / TimSort)

**Where used:**
1. `ProductController.java` — Retailer offers sorted by `totalPrice` (ascending) so the cheapest offer always appears first.
2. `PriceHistoryChart.tsx` — Frontend sorts raw history points by `observedAt` timestamp (ascending) before rendering the Recharts timeline.
3. `DealScoringService.java` — Prices sorted before median computation.

```java
// Offer list sorted by ascending total price
offers.sort(Comparator.comparing(o -> o.getPrice().add(o.getShippingCost())));
```

---

### Queue (FIFO)

**Where used:** `AlertProcessorScheduler.java`  
**Purpose:** The `@Scheduled` alert processor builds a queue of active price alerts to evaluate. Each alert is processed once per 5-minute tick. The FIFO order ensures fair evaluation — no alert starves while others are processed.

```java
// Conceptually: alerts are fetched as an ordered list (queue semantics)
List<PriceAlert> activeAlerts = priceAlertRepository.findByStatus(AlertStatus.ACTIVE);
for (PriceAlert alert : activeAlerts) { /* evaluate and notify */ }
```

---

### Sliding Window / Rolling Statistics

**Where used:** `DealScoringService.java`  
**Purpose:** The deal score computes a **data freshness score** based on whether the latest observation falls within a sliding 24-hour, 7-day, or 30-day window from `now()`. This time-window approach is analogous to a sliding window over a timestamp array.

```java
Duration freshness = Duration.between(latestObservedAt, Instant.now());
double freshnessScore = freshness.toHours() < 24 ? 1.0 :
                        freshness.toDays() < 7  ? 0.5 : 0.2;
```

---

### Hashing (String Normalization + Hash-Based Deduplication)

**Where used:** `ProductMatchingService.java`  
**Purpose:** Product titles are normalized (lowercased, punctuation removed, whitespace collapsed) and their hash is used to detect duplicate product entries during ingestion — preventing the same product from being stored twice under slightly different titles.

```java
String normalizeTitle(String title) {
    return title.toLowerCase().replaceAll("[^a-z0-9 ]", "").trim();
}
```

---

### Regex Pattern Matching (String Parsing)

**Where used:** `ProductService.java` — URL resolver  
**Purpose:** Amazon ASINs (10-character alphanumeric IDs), Flipkart PIDs, and Croma product IDs are extracted from retailer URLs using compiled `Pattern` objects. This allows the system to match a shared product URL to an existing catalog entry.

```java
private static final Pattern AMAZON_ASIN_PATTERN =
    Pattern.compile("/dp/([A-Z0-9]{10})(?:[/?]|$)");
```

---

### Time and Space Complexity Summary

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|-----------------|
| HashMap product lookup | O(1) average | O(n) |
| PriorityQueue top-K ranking | O(n log k) | O(k) |
| Binary search for median | O(log n) | O(1) |
| Offer list sorting | O(n log n) | O(1) |
| Alert queue processing | O(a) per tick | O(a) |
| URL regex matching | O(m) per URL | O(1) |
| Daily price aggregation (frontend) | O(n) | O(d) days |

*n = number of price history records, k = top-K candidates, a = active alerts, d = distinct days, m = URL length*

---

## 9. Learning Outcomes

Through the development of PriceWise AI, the team gained hands-on experience in:

1. **Full-Stack Architecture** — Designing a layered system with clear separation between presentation (React), business logic (Spring Boot services), and data persistence (PostgreSQL + JPA).

2. **RESTful API Design** — Creating well-structured, versioned REST APIs (`/api/v1/`) with proper HTTP status codes, request validation, and Swagger documentation.

3. **Database Design** — Designing normalized relational schemas with 10 tables, foreign key constraints, composite indexes, and Flyway-managed migrations for reproducible schema evolution.

4. **JWT Authentication** — Implementing stateless authentication using HS256 JWT tokens, integrating Spring Security filters, and managing auth state in the React frontend via context API.

5. **Algorithmic Thinking** — Applying DSA concepts (HashMap, PriorityQueue, Binary Search, Sorting) to real-world scenarios like product deduplication, deal scoring, and offer ranking.

6. **Data Visualization** — Building interactive time-series charts with Recharts, handling multi-retailer data aggregation, and implementing per-store filters with daily price grouping.

7. **Chrome Extension Development** — Learning Manifest V3 service workers, content scripts, and cross-origin message passing to build a browser extension that communicates with a local REST API.

8. **React Query & State Management** — Using TanStack Query for server-state caching, background refetching, and optimistic updates in the React frontend.

9. **TypeScript Discipline** — Writing fully-typed API contracts, component props, and hook return types, eliminating a class of runtime errors at compile time.

10. **Team Collaboration** — Coordinating module ownership (backend/frontend/extension), resolving integration issues across boundaries, and using Git for version-controlled collaboration.

---

## 10. Future Scope

| Feature | Description |
|---------|-------------|
| **Real Retailer Scraping** | Integrate Amazon Product Advertising API and Flipkart Affiliate API for live, real-time price fetching. |
| **Email / SMS Alerts** | Send price drop notifications via email (JavaMailSender) and SMS (Twilio) in addition to in-app alerts. |
| **Mobile App** | React Native or Flutter app consuming the same backend APIs for on-the-go price tracking. |
| **More Retailers** | Add Reliance Digital, Vijay Sales, Tata CLiQ, and Myntra to the comparison engine. |
| **ML Deal Prediction** | Train a regression model on historical price data to predict future price drops (e.g., during Diwali or Big Billion Day sales). |
| **Price Manipulation Detection** | Detect fake "original price" inflation (MRP fraud) by comparing the ratio of listed MRP to actual historical market prices. |
| **Social Sharing** | Generate shareable deal cards with product photo, price, and deal score for WhatsApp, Twitter, and Instagram. |
| **Voice Search** | Integrate Web Speech API in the frontend and voice commands in the Chrome Extension. |
| **Docker Deployment** | Containerize all three components (backend, frontend, PostgreSQL) using Docker Compose for one-command deployment. |
| **Redis Caching** | Cache frequently searched products and price data in Redis to reduce database load and improve response times. |

---

## 11. API Endpoints Reference

### Product APIs

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/v1/products` | Search and filter products (paginated) |
| GET | `/api/v1/products/{id}` | Get single product details |
| GET | `/api/v1/products/{id}/offers` | Get all retailer offers for a product |
| GET | `/api/v1/products/{id}/history` | Get 30/90-day price history |
| GET | `/api/v1/products/{id}/deal-score` | Get algorithmic deal score |
| GET | `/api/v1/products/resolve?url=` | Resolve product from retailer URL |

### Auth APIs

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login and receive JWT token |

### User & Alert APIs

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/v1/users/me` | Get current user profile |
| GET/POST | `/api/v1/watchlists` | Get/create watchlist entries |
| DELETE | `/api/v1/watchlists/{id}` | Remove from watchlist |
| GET/POST | `/api/v1/price-alerts` | Get/create price alerts |
| GET | `/api/v1/notifications` | Get notification inbox |

> Full interactive API documentation: **http://localhost:8080/swagger-ui.html**

---

## 12. References

| Resource | Link |
|---------|------|
| Spring Boot Official Docs | https://docs.spring.io/spring-boot/docs/current/reference/html/ |
| Spring Security JWT Guide | https://spring.io/guides |
| React 18 Documentation | https://react.dev/ |
| Vite Documentation | https://vitejs.dev/ |
| Tailwind CSS Docs | https://tailwindcss.com/docs |
| Recharts Documentation | https://recharts.org/en-US/ |
| TanStack Query (React Query) | https://tanstack.com/query/latest |
| PostgreSQL Documentation | https://www.postgresql.org/docs/ |
| Flyway Migrations | https://flywaydb.org/documentation/ |
| JJWT (Java JWT Library) | https://github.com/jwtk/jjwt |
| SpringDoc OpenAPI | https://springdoc.org/ |
| Chrome Extensions Manifest V3 | https://developer.chrome.com/docs/extensions/mv3/ |
| Amazon Product Advertising API | https://webservices.amazon.com/paapi5/documentation/ |
| Lucide React Icons | https://lucide.dev/ |
| Buyhatke (Inspiration) | https://www.buyhatke.com/ |
| Keepa.com (Inspiration) | https://keepa.com/ |
| GeeksforGeeks — DSA | https://www.geeksforgeeks.org/data-structures/ |

---

## 13. License

This project is developed as a **B.Tech CSE Major Project** for academic evaluation purposes.

```
Academic Project — B.Tech Computer Science & Engineering
Submitted to: Ms. Aarshi Ma'am (Project Guide)

Team:
  Pawan Kumar       (6606345)
  Ravi Raj          (6606348)
  Muskan Singh      (6606417)
  Keshav Kumar Singh(6605469)
  Sneha Saw         (6606754)

© 2026 — All rights reserved by the authors.
Not for commercial use without permission.
```

---

<div align="center">
  <strong>Built with ❤️ by Team PriceWise AI</strong><br/>
  B.Tech CSE Major Project | 2025–2026
</div>
