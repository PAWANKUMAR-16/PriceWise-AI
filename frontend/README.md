# PriceWise AI - Frontend

PriceWise AI is a smart shopping price comparison and tracking platform built with React 18, Vite, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Data Fetching & Cache**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Charts & Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 📁 Directory Structure

```
src/
├── api/                  # Axios API services with JWT interceptors
│   ├── admin.ts
│   ├── alerts.ts
│   ├── assistant.ts
│   ├── auth.ts
│   ├── client.ts
│   ├── products.ts
│   └── watchlist.ts
├── components/           # Reusable UI & Feature components
│   ├── admin/            # Admin dashboard components
│   ├── assistant/        # AI shopping assistant chat components
│   ├── auth/             # Route guards & authentication components
│   ├── layout/           # Navbar, Footer, and App Layout
│   ├── products/         # Product cards, grids, offers table, charts
│   ├── ui/               # Reusable primitives (Button, Modal, Input, Badge, etc.)
│   └── watchlist/        # Watchlist item rows and alert forms
├── context/              # React Context (AuthContext)
├── hooks/                # Custom React Query & Auth hooks
├── pages/                # Route page components
│   ├── Admin.tsx
│   ├── Assistant.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   ├── Notifications.tsx
│   ├── ProductDetail.tsx
│   ├── Register.tsx
│   ├── Search.tsx
│   └── Watchlist.tsx
├── types/                # TypeScript interfaces & types
└── utils/                # Date, price, and deal score formatting utilities
```

## 🛠️ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 3. Build for production
```bash
npm run build
```

## 🛡️ Demo Accounts
When running locally without backend services:
- **Shopper**: `shopper@pricewise.ai` / `password123`
- **Admin**: `admin@pricewise.ai` / `admin1234`
