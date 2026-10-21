# PriceWise AI — Smart Shopping Intelligence Platform

> B.Tech CSE Major Project | React + Vite + TypeScript + Java 21 + Spring Boot + PostgreSQL

Compare prices across retailers, track historical price trends, discover genuine deals, and get AI-powered shopping assistance.

---

## Project Structure

```
price tracer/
├── backend/          # Spring Boot 3.3 + Java 21 + Maven
├── frontend/         # React + Vite + TypeScript + Tailwind CSS
├── extension/        # Chrome Extension (Manifest V3 + TypeScript)
└── README.md
```

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Java | 21 | Required |
| Maven | 3.9+ | Or use `./mvnw` wrapper |
| Node.js | 20+ | For frontend & extension |
| npm | 10+ | |
| PostgreSQL | 15+ | Running locally on port 5432 |

---

## Database Setup

```sql
-- Run in psql as superuser
CREATE DATABASE pricewise_db;
CREATE USER pricewise_user WITH PASSWORD 'pricewise_password';
GRANT ALL PRIVILEGES ON DATABASE pricewise_db TO pricewise_user;
```

---

## Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env
# Edit .env with your values

# Run with dev profile (shows SQL, uses dev seeds)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# API will be available at http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### Environment Variables

See `backend/.env.example` for all required variables.

Key variables:
- `DATABASE_URL` — PostgreSQL JDBC URL
- `DATABASE_USERNAME` / `DATABASE_PASSWORD` — DB credentials
- `JWT_SECRET` — Long random string (min 32 chars)
- `AMAZON_API_KEY` / `AMAZON_PARTNER_TAG` — Amazon PA API credentials
- `GEMINI_API_KEY` — Google Gemini API key for AI assistant

---

## Frontend Setup

```bash
cd frontend

npm install
npm run dev

# App available at http://localhost:5173
# API requests are proxied to http://localhost:8080
```

---

## Browser Extension Setup

```bash
cd extension

npm install
npm run build        # One-time build
npm run dev          # Watch mode for development
```

Then in Chrome:
1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/` folder (it reads `manifest.json` from root)

---

## Development Workflow

```
Terminal 1: PostgreSQL (running locally)
Terminal 2: cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
Terminal 3: cd frontend && npm run dev
Terminal 4: cd extension && npm run dev   (optional)
```

---

## API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs

---

## Key Features

- 🔍 **Product Search** — Search and filter products across retailers
- 💰 **Price Comparison** — Side-by-side offer comparison with total cost
- 📈 **Price History** — Interactive charts of historical price movements
- 🎯 **Deal Scoring** — Transparent algorithm comparing current vs. historical prices
- ⏰ **Price Alerts** — Get notified when prices drop to your target
- 🤖 **AI Assistant** — Gemini-powered shopping assistant grounded in real data
- 🔌 **Browser Extension** — Instant comparisons on Amazon, Flipkart, and Croma

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Charts | Recharts |
| Backend | Java 21 + Spring Boot 3.3 |
| ORM | Spring Data JPA + Hibernate |
| Auth | Spring Security + JWT (JJWT 0.12) |
| Database | PostgreSQL 15 |
| Migrations | Flyway |
| AI | Google Gemini (provider-agnostic layer) |
| Extension | TypeScript + Chrome Manifest V3 |
| Testing | JUnit 5 + Mockito + Testcontainers |
| API Docs | SpringDoc OpenAPI |

---

## DSA Components (Academic Requirement)

| Algorithm | Location | Purpose |
|-----------|----------|---------|
| HashMap | `ProductMatchingService` | Index products by normalized ID |
| PriorityQueue | `ProductMatchingService` | Top-K candidate ranking |
| Binary Search | `DealScoringService` | Locate price intervals |
| Sliding Window | `DealScoringService` | Rolling price statistics |
| Sorting | `ProductController` | Rank offers by total price |
| Trie | `SearchSuggestionService` | Prefix-based suggestions |
| Graph | `ProductRelationGraph` | Variant relationships |
| Queue | `AlertProcessorScheduler` | Background alert jobs |

---

## Testing

```bash
cd backend

# Run all tests
./mvnw test

# Run with coverage report
./mvnw verify

# Coverage report: target/site/jacoco/index.html
```

---

## Deployment

See `docs/deployment.md` for Docker and cloud hosting instructions.

---

## License

Academic project — B.Tech CSE Major Project.
