# StyleNest E-Commerce Platform — Wear Your Vibe

> **StyleNest** is a modern, high-performance, full-stack clothing & lifestyle e-commerce platform built to match the attached UI reference design with pixel-accurate layout, luxury typography, dynamic multi-attribute product variations, manual payment verifications (bKash, Nagad, Rocket, COD), comprehensive admin dashboard, and anti-fraud protections.

---

## 🎨 Brand Identity & Color Palette

- **Primary Forest Green**: `#173B32` (Header accents, announcement bar, navigation, buttons, admin sidebar)
- **Accent Terracotta**: `#C9684B` (Hero CTA buttons, sale badges, active nav line, cart badge, primary highlights)
- **Warm Cream**: `#FAF5ED` (Background surfaces, soft card backgrounds)
- **Charcoal**: `#292824` (Typography, deep neutral accents)
- **Pure White**: `#FFFFFF` (Cards, product surfaces, contrast modals)
- **Zero Blue**: Follows brand guideline strictly avoiding blue for all brand elements.

---

## 🚀 Key Features

### 1. Customer Storefront
- **Announcement Bar**: Configurable top bar with free shipping thresholds, Track Order link, Help & FAQs.
- **Header**: Authentic StyleNest draped-hanger logo, live product search, user profile menu, wishlist counter, shopping cart drawer toggle.
- **Navigation Bar**: Quick category filtering for Women, Men, Kids, Traditional, Accessories, New Arrivals, and Sale.
- **Hero Carousel**: Multiple high-fashion slides with tag pills, typography, custom CTAs, smooth transitions, and manual arrows.
- **Service Highlights**: Free Shipping on orders over ৳ 2,000, 7-day easy returns, 100% secure payment, and 24/7 customer support.
- **Shop by Category**: 5 image cards matching the screenshot with smooth zoom hover and "Shop Now" links.
- **Latest Collection**: 5-column responsive product card grid featuring:
  - Product badges (`New`, `-20%`).
  - Wishlist heart toggle with persistent state.
  - Interactive color swatches that dynamically swap the active image and update variant pricing!
  - Terracotta "Add to Cart" button.
- **Interactive Slide-Out Cart Drawer**: Matches screenshot with live item counts, size/color tags, quantity controls `[- 1 +]`, item deletion, free shipping progress bar, subtotal, and checkout CTA.
- **Product Details Modal**: Multi-image gallery, variant selectors (size pills, color swatches), real-time price & stock updates, SKU, description, size chart, and reviews.
- **Checkout & Anti-Fraud Engine**:
  - Full address and Bangladesh mobile number (`01XXXXXXXXX`) validation.
  - Fake order protection (duplicate order cooldown flagging, address brevity checks, honeypot bot trap).
  - Promo code discounts (e.g. `WELCOME10`, `FESTIVE200`).
  - Shipping fee calculation (Free above ৳ 2,000; ৳ 70 Inside Dhaka; ৳ 130 Outside Dhaka).
  - Manual payment gateways (Cash on Delivery, bKash, Nagad, Rocket) with merchant numbers, step-by-step instructions, and TrxID reference input.
- **Order Success & Tracking**: Confetti celebration, printable order invoice, and live step-by-step timeline tracker (Pending → Confirmed → Processing → Shipped → Delivered).

---

### 2. Admin Dashboard
- **Dashboard Analytics**: Real-time metric cards for Total Users (1,248+), Total Products (352+), Total Orders (486+), and Pending Orders.
- **Sales Overview Line Chart**: Smooth SVG bezier curve matching reference screenshot (Oct 19 - Oct 25) with hover tooltips and customizable date ranges.
- **Add Product Form**: Tabbed interface (Basic Info, Variations, Images, Inventory, SEO) with automatic SKU generation and category assignment.
- **Product Variations Table**: Enforces individual regular price, sale price, SKU, and stock for every single size and color combination.
- **Order Management Table**: Real-time status pills (Pending, Processing, Shipped, Delivered), order inspect modal, fake risk alert score, and manual bKash/Nagad/Rocket TrxID verification.
- **User Management Table**: Search users, update account status (Active, Inactive, Suspended), and promote/demote roles securely.
- **Stock Management Table**: Live inventory view with quick stock adjustment and audit trail.
- **Category Management**: Create, edit, and safely archive categories.
- **Store Settings**: Admin can edit phone, email, address, bKash/Nagad/Rocket numbers, payment instructions, and shipping fees without modifying code.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 3
- **Icons**: Lucide React + Custom SVG Brand Icons
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security and Stored Procedures)
- **Local Persistence**: Integrated resilient fallback hydrating state from `localStorage` if Supabase credentials are not yet configured.

---

## ⚡ Quick Start Guide

### 1. Run Development Server
```bash
cd "C:\Users\UESR\.gemini\antigravity\scratch\stylenest"
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Build for Production
```bash
npm run build
```

### 3. Demo Admin Credentials
Click **Login | Register** in the top header and choose **Admin Profile (One-Click)** or use:
- **Email**: `admin@stylenest.com`
- **Role**: `admin`
- Or click the **Admin Panel** toggle button in the top navigation bar.

---

## 🛡️ Database & Supabase Integration

Full migration and seed scripts are included in the repository:
- `supabase/migrations/20261026_init_stylenest.sql` (Tables, Foreign Keys, RLS policies, atomic order procedure)
- `supabase/seed.sql` (Initial products, categories, slides, coupons, and settings)

See `SUPABASE_SETUP.md` for a 3-minute setup guide to connect your Supabase cloud project.
