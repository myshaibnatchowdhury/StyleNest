# StyleNest Deployment Guide (Free Hosting)

StyleNest is built with standard Vite and React 19, making it compatible with zero-cost static hosting providers.

---

## Option 1: Vercel (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your `stylenest` repository.
4. Framework Preset will auto-detect **Vite**.
5. Under **Environment Variables**, optionally add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**. Your store will be live on a custom `.vercel.app` domain with free SSL.

---

## Option 2: Netlify

1. Sign in to [Netlify](https://www.netlify.com).
2. Click **Add new site** → **Import an existing project**.
3. Select your repository.
4. Set Build command: `npm run build`
5. Set Publish directory: `dist`
6. Click **Deploy Site**.

---

## Option 3: Cloudflare Pages

1. Sign in to the Cloudflare dashboard and go to **Compute (Workers & Pages)**.
2. Click **Create Application** → **Pages** → **Connect to Git**.
3. Build preset: **Vite**.
4. Output directory: `dist`.
5. Click **Save and Deploy**.
