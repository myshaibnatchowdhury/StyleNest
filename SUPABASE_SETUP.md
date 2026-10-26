# Supabase Setup Guide for StyleNest

Follow these steps to connect your free Supabase database with StyleNest in under 3 minutes.

---

## Step 1: Create a Free Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project**.
3. Choose a project name (e.g. `stylenest-store`), select a strong database password, and pick the closest region (e.g. Singapore or Mumbai).
4. Wait ~1 minute for Supabase to provision your project.

---

## Step 2: Run the Database Migrations

1. In your Supabase Project dashboard, open the **SQL Editor** from the left navigation bar.
2. Click **New query**.
3. Copy the full contents of `supabase/migrations/20261026_init_stylenest.sql` and paste it into the editor.
4. Click **Run**. This will create:
   - Tables: `profiles`, `categories`, `products`, `product_variants`, `orders`, `order_items`, `coupons`, `carousel_slides`, `store_settings`, `stock_movements`.
   - Strict Row Level Security (RLS) policies isolating customer data and granting admin permissions.
   - Transactional stored procedure `create_secure_order` that handles stock deductions and fraud checks atomically.

---

## Step 3: Run the Seed Data

1. In the **SQL Editor**, click **New query**.
2. Copy the full contents of `supabase/seed.sql` and paste it into the editor.
3. Click **Run**. This populates:
   - Initial categories (Women, Men, Kids, Traditional, Accessories)
   - Initial products (Floral Printed Kurti, Casual Shirt, Kids T-Shirt, Printed Saree, Polo T-Shirt, Wide Leg Pants)
   - Variations, hero carousel slides, and store settings.

---

## Step 4: Configure Storage Buckets

1. Open **Storage** from the Supabase sidebar.
2. Click **New bucket**.
3. Name it `products` and check **Public bucket**.
4. Click **Save**.

---

## Step 5: Connect StyleNest via Environment Variables

1. In your Supabase dashboard, navigate to **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon (public)** key.
3. In your project root, open `.env` and fill in your keys:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart the development server:
   ```bash
   npm run dev
   ```

---

## Creating the First Admin Account

1. Register an account on the customer website using `admin@stylenest.com`.
2. In Supabase Dashboard, open **Table Editor** → `profiles`.
3. Locate your user record and change the `role` column from `'customer'` to `'admin'`.
4. Refresh your browser; you now have full admin authorization!
