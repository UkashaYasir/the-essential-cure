# The Essential Cure 🌿✨

![The Essential Cure Hair Oil](public/products/main-product.png)

### **Elevating Natural Hair Care with a Premium E-Commerce Experience**

Built for **luxury, speed, and conversion**, The Essential Cure is a state-of-the-art hair care platform centered around a single high-performance botanical oil. The platform combines deep storytelling with advanced e-commerce functionality to deliver a seamless shopping journey.

---

## 💎 Key Features

### 🛍️ Premium Shopping Experience
- **Single-Product Focused**: Optimized to showcase **The Essential Cure Hair Oil** with high-conversion landing pages.
- **Dynamic Cart System**: A sleek, glassmorphism-inspired mini-cart for frictionless checkout.
- **Order Tracking**: Real-time tracking system for customer transparency.

### 🧠 Intelligent Personalization
- **Hair Quiz Engine**: A custom-built diagnostic tool that analyzes hair concerns and matches users with the perfect treatment plan.
- **Lead Collection**: Integrated marketing engine that captures valuable user data to drive secondary conversions.

### 🖼️ Transformation Hub
- **Before & After Gallery**: A high-aesthetic, filterable masonry gallery showcasing real verified results.
- **SEO Optimized**: Built-in JSON-LD schemas for Image Galleries to maximize search engine visibility.

### 🔐 Advanced Admin Suite
- **Comprehensive Analytics**: Interactive sales charts, regional dominance heatmaps, and inventory health metrics.
- **Order Management**: Full-lifecycle order handling with notes, returns, and message templates.
- **Automated Media**: Integrated image compression for all admin-uploaded content to ensure lightning-fast performance.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + Framer Motion (Luxury Animations)
- **Backend/Database**: Supabase (PostgreSQL + RLS Security)
- **Icons**: Lucide React
- **Analytics**: Custom-built Ledger & Order Analytics

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/UkashaYasir/the-essential-cure.git
cd the-essential-cure
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Database Setup
Apply the SQL migrations located in the root directory to your Supabase project in the following order:
1. `setup_full_schema.sql`
2. `transformations_schema.sql`
3. `quiz_leads_schema.sql`
4. `production_seed.sql`

### 5. Run Development Server
```bash
npm run dev
```

---

## 🛡️ Security & Performance
- **Row Level Security (RLS)**: Sensitive user data and orders are protected at the database level.
- **Optimized Assets**: Modern WebP formats and code-splitting ensure a < 3s load time for premium users.

---

## 📄 License
Created by **UkashaYasir**. All rights reserved.
