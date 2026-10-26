-- ==============================================================================
-- StyleNest Seed Data for Supabase
-- File: supabase/seed.sql
-- ==============================================================================

-- 1. STORE SETTINGS
INSERT INTO public.store_settings (
  id, store_name, tagline, announcement_bar_text, announcement_bar_active,
  phone, email, address, free_shipping_threshold, inside_dhaka_shipping,
  outside_dhaka_shipping, cod_active, bkash_active, bkash_number, bkash_type,
  bkash_instructions, nagad_active, nagad_number, nagad_type, nagad_instructions,
  rocket_active, rocket_number, rocket_type, rocket_instructions,
  facebook_url, instagram_url, pinterest_url, youtube_url
) VALUES (
  'primary', 'StyleNest', 'WEAR YOUR VIBE', 'Free shipping on orders above ৳ 2000', true,
  '+880 1712 345678', 'support@stylenest.com', 'GEC Circle, Chattogram, Bangladesh',
  2000, 70, 130, true,
  true, '01712-345678', 'Merchant', 'Go to bKash App > Make Payment > Enter Merchant Number > Enter Order Amount > Enter Reference: Order# > Complete PIN',
  true, '01812-345678', 'Merchant', 'Go to Nagad App > Merchant Pay > Enter Number > Enter Order Amount > Enter Reference: Order# > Complete PIN',
  true, '01912-345678-9', 'Personal', 'Go to Rocket > Send Money / Merchant Pay > Enter Number with 12 digits > Enter Amount > Confirm PIN',
  'https://facebook.com/stylenest.official', 'https://instagram.com/stylenest.fashion',
  'https://pinterest.com/stylenest', 'https://youtube.com/@stylenest'
) ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  tagline = EXCLUDED.tagline;

-- 2. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, is_active, order_index) VALUES
('cat-women', 'Women', 'women', 'Contemporary & ethnic apparel curated for modern elegance.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', true, 1),
('cat-men', 'Men', 'men', 'Tailored shirts, casual essentials, and classic smart wear.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', true, 2),
('cat-kids', 'Kids', 'kids', 'Playful, comfortable, and breathable clothing for boys and girls.', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80', true, 3),
('cat-traditional', 'Traditional', 'traditional', 'Handcrafted sarees, embroidered panjabis, and heritage collections.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', true, 4),
('cat-accessories', 'Accessories', 'accessories', 'Leather bags, fedora hats, scarves, and styling accessories.', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', true, 5)
ON CONFLICT (id) DO NOTHING;

-- 3. PRODUCTS
INSERT INTO public.products (id, name, slug, sku, description, category_id, regular_price, sale_price, rating, reviews_count, is_new, is_featured, is_sale, is_published, images) VALUES
('prod-kurti', 'Floral Printed Kurti', 'floral-printed-kurti', 'SN-W-KURTI-01', 'Exquisite floral printed kurti crafted with pure breathable cotton. Features delicate golden thread embroidery around the neckline, matching borders, and a flowing silhouette.', 'cat-women', 1650, 1250, 4.8, 12, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80']),
('prod-casual-shirt', 'Casual Shirt', 'casual-shirt', 'SN-M-SHIRT-02', 'Timeless full-sleeve casual button-down shirt made from premium breathable linen-cotton blend. Tailored modern fit with crisp collar and horn-finish buttons.', 'cat-men', 1650, 1450, 4.5, 8, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80']),
('prod-kids-tshirt', 'Kids T-Shirt', 'kids-t-shirt', 'SN-K-TEE-03', 'Ultra-soft organic cotton crewneck tee for boys and girls. Non-allergenic natural dye, durable reinforced stitching, and tagless design for itchy-free all-day wear.', 'cat-kids', 1200, 950, 4.0, 6, false, true, true, true, ARRAY['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80']),
('prod-printed-saree', 'Printed Saree', 'printed-saree', 'SN-T-SAREE-04', 'Heritage block-printed cotton silk saree with rich terracotta and maroon traditional motifs. Drapes effortlessly with graceful fluidity. Includes unstitched blouse piece.', 'cat-traditional', 2950, 2350, 5.0, 10, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80']),
('prod-polo-tshirt', 'Polo T-Shirt', 'polo-t-shirt', 'SN-M-POLO-05', 'Refined pique cotton polo shirt featuring a ribbed collar, two-button placket, and side-vent hem. Engineered to maintain structure wash after wash.', 'cat-men', 1500, 1200, 4.6, 7, false, true, true, true, ARRAY['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80']),
('prod-wide-leg-pants', 'Wide Leg Pants', 'wide-leg-pants', 'SN-W-PANTS-06', 'High-waisted wide-leg tailored trousers with front pleats, slant pockets, and a clean hook closure. Effortless chic silhouette for workwear or casual outings.', 'cat-women', 2100, 1800, 4.7, 15, false, false, true, true, ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'])
ON CONFLICT (id) DO NOTHING;

-- 4. PRODUCT VARIANTS
INSERT INTO public.product_variants (id, product_id, size, color, color_code, regular_price, sale_price, stock, sku, image_url, is_active) VALUES
('var-kurti-s-green', 'prod-kurti', 'S', 'Green', '#173B32', 1650, 1250, 25, 'SN-KURTI-S-GRN', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', true),
('var-kurti-m-green', 'prod-kurti', 'M', 'Green', '#173B32', 1650, 1250, 18, 'SN-KURTI-M-GRN', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', true),
('var-kurti-l-green', 'prod-kurti', 'L', 'Green', '#173B32', 1650, 1200, 12, 'SN-KURTI-L-GRN', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', true),
('var-shirt-m-beige', 'prod-casual-shirt', 'M', 'Beige', '#D7C49C', 1650, 1450, 15, 'SN-SHIRT-M-BGE', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', true),
('var-shirt-l-beige', 'prod-casual-shirt', 'L', 'Beige', '#D7C49C', 1650, 1450, 5, 'SN-SHIRT-L-BGE', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', true),
('var-kids-m-mint', 'prod-kids-tshirt', 'M', 'Mint', '#88D49E', 1200, 950, 12, 'SN-KID-M-MNT', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80', true),
('var-saree-free-maroon', 'prod-printed-saree', 'Free Size', 'Maroon', '#7B1113', 2950, 2350, 0, 'SN-SAREE-FS-MRN', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', true),
('var-saree-free-black', 'prod-printed-saree', 'Free Size', 'Black', '#292824', 2950, 2350, 6, 'SN-SAREE-FS-BLK', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80', true),
('var-polo-m-black', 'prod-polo-tshirt', 'M', 'Black', '#292824', 1500, 1200, 22, 'SN-POLO-M-BLK', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80', true),
('var-polo-l-black', 'prod-polo-tshirt', 'L', 'Black', '#292824', 1500, 1200, 20, 'SN-POLO-L-BLK', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80', true),
('var-pants-m-black', 'prod-wide-leg-pants', 'M', 'Black', '#292824', 2100, 1800, 25, 'SN-PANTS-M-BLK', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 5. CAROUSEL SLIDES
INSERT INTO public.carousel_slides (id, tag, title, subtitle, cta_text, cta_link, image_url, order_index, is_active) VALUES
('slide-1', 'NEW SEASON COLLECTION', 'Style for Every Chapter', 'Trendy outfits. Timeless comfort. Only at StyleNest.', 'Shop Now', '#latest-collection', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80', 1, true),
('slide-2', 'HERITAGE & TRADITION', 'Elegance Reimagined', 'Hand-woven artisan sarees and royal kurtis for your finest occasions.', 'Explore Traditional', '#category-traditional', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80', 2, true)
ON CONFLICT (id) DO NOTHING;
