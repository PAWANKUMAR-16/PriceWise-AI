# PriceWise AI — Backend Service

> High-performance Spring Boot 3.3 + Java 21 REST API and algorithmic engine for **PriceWise AI**, the smart shopping price comparison platform.

---

## 🚀 Key Features

- **Multi-Retailer Ingestion & Adapters**: Plug-and-play provider adapters (Amazon PA-API, Flipkart, Croma, Synthetic dev data) with automated and on-demand ingestion.
- **Intelligent Deal Scoring Engine**: Calculates real-time deal scores (0–100) using historical median prices (binary search), statistical deviation, and observation freshness weighting.
- **Fuzzy & Token Product Matching**: Jaccard token similarity, regex hardware model code extraction, and PriorityQueue ranking for multi-store product deduplication.
- **Automated Price Alert Processor**: Spring `@Scheduled` background worker running every 5 minutes with idempotency and duplicate alert dampening.
- **JWT & Role-based Security**: Stateless HMAC-SHA256 authentication using JJWT 0.12.5, BCrypt password hashing, and role-based access (`ROLE_USER`, `ROLE_ADMIN`).
- **Interactive AI Shopping Assistant**: Chatbot advice, multi-product side-by-side comparison, and budget-tailored recommendations.
- **OpenAPI 3.0 / Swagger UI**: Built-in interactive documentation and test sandbox.

---

## 🛠 Tech Stack

- **Language**: Java 21 (LTS)
- **Framework**: Spring Boot 3.3.4
- **Persistence**: Spring Data JPA & Hibernate 6
- **Database**: PostgreSQL 15+
- **Database Migrations**: Flyway Core + Flyway PostgreSQL
- **Security**: Spring Security 6 + JJWT 0.12.5 (HS256)
- **API Docs**: SpringDoc OpenAPI 2.6.0 (`/swagger-ui.html`)
- **Build Tool**: Apache Maven

---

## 📁 Package Structure

```text
com.pricewise
├── PriceWiseApplication.java       # Spring Boot main class (@EnableScheduling)
├── adapter/                        # Provider adapters (PriceDataAdapter, Synthetic, Amazon)
├── algorithm/                      # DealScoringService & ProductMatchingService
├── config/                         # SecurityConfig, CorsConfig, OpenApiConfig
├── controller/                     # REST API Controllers (V1)
├── domain/
│   ├── dto/                        # Request/Response Java Records
│   ├── entity/                     # JPA Entities (Retailer, Product, Offer, etc.)
│   └── repository/                 # Spring Data JPA Repositories
├── exception/                      # GlobalExceptionHandler and custom exceptions
├── security/                       # JwtUtil, JwtAuthenticationFilter, CustomUserDetailsService
└── service/                        # Core business logic & AlertProcessorScheduler
```

---

## ⚙️ Configuration & Environment Variables

Copy `.env.example` to `.env` or set the following environment variables:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/pricewise_db` | JDBC URL for PostgreSQL |
| `DATABASE_USERNAME` | `pricewise_user` | Database user |
| `DATABASE_PASSWORD` | `pricewise_password` | Database password |
| `JWT_SECRET` | *(256-bit hex/string)* | Secret key for signing JWT tokens |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Allowed origins for web/extension |
| `AMAZON_API_KEY` | *(optional)* | Amazon PA-API Access Key |
| `AMAZON_PARTNER_TAG` | `pricewise-21` | Amazon Associates tracking ID |

---

## 🗄 Database Migrations & Seed Data

Flyway automatically executes migrations on startup:
1. `V1__create_core_tables.sql`: 10 core tables with indexing:
   - `retailers`, `products`, `retailer_listings`, `offers`, `price_histories`, `users`, `watchlists`, `price_alerts`, `notifications`, `ingestion_runs`
2. `V2__seed_development_data.sql`:
   - 3 Retailers: Amazon India, Flipkart, Croma
   - 10 Tech products (MacBook Air M2, Dell XPS 13, ThinkPad X1, iPhone 15 Pro, S24 Ultra, Pixel 8 Pro, Sony XM5, Bose QC45, Apple Watch 9, MX Master 3S)
   - 30 days of daily price observations per listing
   - Sample current offers, watchlists, alerts, and user accounts

### Default Seed Accounts (Password: `password123`)
- **Admin**: `admin@pricewise.com` (Role: `ROLE_ADMIN`)
- **Shopper**: `user@pricewise.com` (Role: `ROLE_USER`)

---

## 📖 API Endpoints Summary

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register a new account
- `POST /api/v1/auth/login` — Login and receive JWT Bearer token

### Products (`/api/v1/products`)
- `GET /api/v1/products` — Filter products (`q`, `brand`, `category`, `minPrice`, `maxPrice`, `page`, `size`)
- `GET /api/v1/products/{id}` — Get product details and retailer listings
- `GET /api/v1/products/{id}/offers` — Get all current active store offers
- `GET /api/v1/products/{id}/history` — Full price timeline with min, max, and median stats
- `GET /api/v1/products/{id}/deal-score` — Algorithmic deal score (0–100) and buying rating
- `GET /api/v1/products/resolve?url={url}` — Identify product from raw retailer link

### Watchlists & Price Alerts (Requires Auth)
- `GET /api/v1/watchlists` — View user's saved items
- `POST /api/v1/watchlists` — Add product to watchlist
- `DELETE /api/v1/watchlists/{id}` — Remove from watchlist
- `GET /api/v1/price-alerts` — List user's price alerts
- `POST /api/v1/price-alerts` — Set target price threshold alert
- `PATCH /api/v1/price-alerts/{id}` — Update alert status or target price
- `GET /api/v1/notifications` — View price drop alerts
- `PATCH /api/v1/notifications/{id}/read` — Mark notification read

### AI Shopping Assistant (`/api/v1/assistant`)
- `POST /api/v1/assistant/chat` — Conversational deal inquiries and advice
- `POST /api/v1/assistant/compare` — Compare 2 to 5 products with side-by-side deal analysis
- `POST /api/v1/assistant/recommendations` — Best value suggestions by budget & preferences

### Admin Management (`/api/v1/admin`) — Requires `ROLE_ADMIN`
- `GET /api/v1/admin/ingestion/runs` — Ingestion run audit logs
- `GET /api/v1/admin/providers` — Integrated retailer providers status
- `POST /api/v1/admin/ingestion/{provider}/run` — Trigger on-demand sync
- `GET /api/v1/admin/health/summary` — System and JVM metrics summary

---

## 🏃 Running the Application

### Prerequisites
- JDK 21 installed (`java -version`)
- Maven 3.9+ or use Maven wrapper
- PostgreSQL database running (or Docker container)

### Step 1: Start PostgreSQL
```bash
docker run --name pricewise-postgres \
  -e POSTGRES_DB=pricewise_db \
  -e POSTGRES_USER=pricewise_user \
  -e POSTGRES_PASSWORD=pricewise_password \
  -p 5432:5432 -d postgres:16-alpine
```

### Step 2: Build & Run
```bash
# Build
mvn clean package -DskipTests

# Run
mvn spring-boot:run
```

### Step 3: Explore API Docs
Open your browser to [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
