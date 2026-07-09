# 🏠 DreamHomes — Frontend

A premium, production-grade real estate platform built with **React + TypeScript + Vite**.

![DreamHomes Preview](./public/logo.png)

---

## 🌐 Live Demo

- **Frontend (Vercel):**[ _Deploy URL after publishing_](https://dream-homes-hazel.vercel.app/)
- **Backend (Render):** [https://dreamhomesback.onrender.com](https://dreamhomesback.onrender.com)

---

## ✨ Features

### 🔐 Authentication
- JWT-based login & registration with Refresh Token (httpOnly cookie)
- Role-based access control: `USER` / `OWNER` / `ADMIN`
- Protected routes with `ProtectedRoute` component
- Auth guard hook (`useAuthGuard`) — shows toast + redirect for guests

### 🏡 Properties
- Browse all active listings with advanced filters (type, city, price, bedrooms)
- Property detail pages with owner card (name, phone, email)
- Featured and latest listings on homepage
- For Sale / For Rent dedicated pages
- Fully paginated property list

### 📊 Owner Dashboard
- My listings table with View / Edit / Delete actions
- Add new property form (image upload via Cloudinary or URL)
- Edit existing property
- Stats cards (total listings, for sale, for rent, favorites, messages)

### ❤️ Favorites
- Toggle favorites for any property (owner data synced in real-time)
- Favorites count badge in navbar

### 💬 Messages
- Contact property owner via messaging system
- Unread message badge in navbar

### 👤 User Profile
- Edit name, email, phone, avatar
- Owner details automatically synced to all their property listings in Redux (no refresh needed)

### 🌍 Localization (i18n)
- Full bilingual support: **Arabic (RTL)** and **English (LTR)**
- Language toggle in navbar

### 🌙 Dark Mode
- Full dark / light mode toggle with system preference support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (with JWT interceptors) |
| Styling | Vanilla CSS (custom design system) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/DreamHomes.git
cd DreamHomes
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5000/api
```

For production (Vercel), set:
```env
VITE_API_URL=https://dreamhomesback.onrender.com/api
```

### Run Development Server

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # Navbar, Footer, MainLayout
│   ├── ui/           # PropertyCard, Modal, Toast, Spinner
│   └── auth/         # ProtectedRoute
├── contexts/
│   └── LanguageContext.tsx  # i18n (AR/EN)
├── hooks/
│   ├── useAuthGuard.ts      # Route guard hook
│   └── useAppStore.ts       # Typed Redux hooks
├── pages/
│   ├── auth/         # LoginPage, RegisterPage
│   ├── dashboard/    # DashboardPage, PropertyFormPage, AnalyticsPage
│   ├── public/       # HomePage, PropertiesPage, PropertyDetailPage ...
│   └── user/         # ProfilePage, FavoritesPage, MessagesPage
├── routes/
│   └── AppRouter.tsx # All routes with protection
├── services/
│   └── api.ts        # Axios instance + interceptors
├── store/
│   └── slices/       # authSlice, propertySlice, uiSlice, messageSlice
├── types/
│   └── index.ts      # TypeScript interfaces
└── utils/
    └── propertyMapper.ts   # Backend → Frontend data mapper
```

---

## 🔐 Authentication Flow

```
User registers/logs in → JWT access token stored in localStorage
                        → Refresh token in httpOnly cookie
On 401 → Axios interceptor auto-refreshes token → Retries original request
On refresh fail → Clears storage → Redirects to /login
```

---

## 🌍 Deployment (Vercel)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set Environment Variable:
   - `VITE_API_URL` = `https://dreamhomesback.onrender.com/api`
4. Deploy ✅

The `vercel.json` already handles SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📄 Backend Repository

> [DreamHomes Backend](https://github.com/YOUR_USERNAME/DreamHomesback) — Node.js + Express + Prisma + Supabase PostgreSQL

---

## 👨‍💻 Author

**Dalin Alkuwatli**

---

## 📝 License

MIT
