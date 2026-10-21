-- V2__seed_development_data.sql
-- Seed initial development data: retailers, products, listings, 30 days of price history, offers, and sample users

-- 1. Insert Retailers
INSERT INTO retailers (id, name, code, website_url, is_active, created_at) VALUES
(1, 'Amazon India', 'AMAZON_IN', 'https://www.amazon.in', true, CURRENT_TIMESTAMP),
(2, 'Flipkart', 'FLIPKART', 'https://www.flipkart.com', true, CURRENT_TIMESTAMP),
(3, 'Croma', 'CROMA', 'https://www.croma.com', true, CURRENT_TIMESTAMP);

ALTER SEQUENCE retailers_id_seq RESTART WITH 10;

-- 2. Insert Users
-- Passwords are encrypted with BCrypt (password: password123)
-- Hash: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi
INSERT INTO users (id, name, email, password_hash, role, status, created_at) VALUES
(1, 'Admin User', 'admin@pricewise.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'ROLE_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP),
(2, 'Test Shopper', 'user@pricewise.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'ROLE_USER', 'ACTIVE', CURRENT_TIMESTAMP);

ALTER SEQUENCE users_id_seq RESTART WITH 10;

-- 3. Insert 10 Sample Products
INSERT INTO products (id, title, brand, model_number, category, attributes, created_at) VALUES
(1, 'Apple MacBook Air M2 13.6-inch 8GB 256GB SSD Midnight', 'Apple', 'MLXW3HN/A', 'Laptops', '{"color": "Midnight", "ram": "8GB", "storage": "256GB", "screen_size": "13.6 inch", "chip": "Apple M2"}', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(2, 'Dell XPS 13 9315 Laptop Intel Evo Core i5-1230U 16GB 512GB SSD', 'Dell', 'XPS9315-i5-16-512', 'Laptops', '{"color": "Sky Blue", "ram": "16GB", "storage": "512GB", "processor": "Core i5-1230U"}', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(3, 'Lenovo ThinkPad X1 Carbon Gen 11 Intel Core i7-1355U 16GB 512GB', 'Lenovo', '21HM004FUS', 'Laptops', '{"color": "Deep Black", "ram": "16GB", "storage": "512GB", "processor": "Core i7-1355U"}', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(4, 'Apple iPhone 15 Pro 128GB Natural Titanium', 'Apple', 'MTV13HN/A', 'Smartphones', '{"color": "Natural Titanium", "storage": "128GB", "display": "6.1 Super Retina XDR"}', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(5, 'Samsung Galaxy S24 Ultra 5G 12GB RAM 256GB Storage Titanium Gray', 'Samsung', 'SM-S928B', 'Smartphones', '{"color": "Titanium Gray", "ram": "12GB", "storage": "256GB", "stylus": true}', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(6, 'Google Pixel 8 Pro 5G 128GB Obsidian', 'Google', 'GA04833-US', 'Smartphones', '{"color": "Obsidian", "ram": "12GB", "storage": "128GB", "camera": "50MP Triple"}', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(7, 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones', 'Sony', 'WH1000XM5/B', 'Audio', '{"color": "Black", "type": "Over-Ear", "battery": "30 hours", "anc": true}', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(8, 'Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones', 'Bose', '866724-0100', 'Audio', '{"color": "Triple Black", "type": "Over-Ear", "anc": true}', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(9, 'Apple Watch Series 9 GPS 45mm Midnight Aluminium Case Sport Band', 'Apple', 'MR9A3HN/A', 'Wearables', '{"case_size": "45mm", "connectivity": "GPS", "color": "Midnight"}', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(10, 'Logitech MX Master 3S Performance Wireless Ergonomic Mouse Quiet Clicks', 'Logitech', '910-006561', 'Accessories', '{"color": "Graphite", "dpi": "8000 DPI", "connectivity": "Bluetooth + USB receiver"}', CURRENT_TIMESTAMP - INTERVAL '60 days');

ALTER SEQUENCE products_id_seq RESTART WITH 20;

-- 4. Insert Retailer Listings
-- Listings for MacBook Air M2 (Product 1)
INSERT INTO retailer_listings (id, retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at) VALUES
(1, 1, 1, 'B0B3C57X2W', 'https://www.amazon.in/dp/B0B3C57X2W', 'midnight-8-256', true, CURRENT_TIMESTAMP),
(2, 2, 1, 'FLIP-MBA-M2-256', 'https://www.flipkart.com/apple-macbook-air-m2-8gb-256gb/p/itme35848', 'midnight-8-256', true, CURRENT_TIMESTAMP),
(3, 3, 1, 'CROMA-256843', 'https://www.croma.com/apple-macbook-air-m2-chip-8gb-256gb/p/256843', 'midnight-8-256', true, CURRENT_TIMESTAMP);

-- Listings for Dell XPS 13 (Product 2)
INSERT INTO retailer_listings (id, retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at) VALUES
(4, 1, 2, 'B0B5G82F1M', 'https://www.amazon.in/dp/B0B5G82F1M', 'sky-i5-16-512', true, CURRENT_TIMESTAMP),
(5, 2, 2, 'FLIP-DELL-XPS9315', 'https://www.flipkart.com/dell-xps-13-core-i5-12th-gen/p/itmdelxps9315', 'sky-i5-16-512', true, CURRENT_TIMESTAMP);

-- Listings for Lenovo ThinkPad (Product 3)
INSERT INTO retailer_listings (id, retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at) VALUES
(6, 1, 3, 'B0C7J99XYZ', 'https://www.amazon.in/dp/B0C7J99XYZ', 'i7-16-512', true, CURRENT_TIMESTAMP),
(7, 3, 3, 'CROMA-302199', 'https://www.croma.com/lenovo-thinkpad-x1-carbon-gen-11/p/302199', 'i7-16-512', true, CURRENT_TIMESTAMP);

-- Listings for iPhone 15 Pro (Product 4)
INSERT INTO retailer_listings (id, retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at) VALUES
(8, 1, 4, 'B0CHX1W1XY', 'https://www.amazon.in/dp/B0CHX1W1XY', 'natural-titanium-128', true, CURRENT_TIMESTAMP),
(9, 2, 4, 'FLIP-IPHONE15PRO-128', 'https://www.flipkart.com/apple-iphone-15-pro-natural-titanium-128-gb/p/itmiphone15pro', 'natural-titanium-128', true, CURRENT_TIMESTAMP),
(10, 3, 4, 'CROMA-275141', 'https://www.croma.com/apple-iphone-15-pro-128gb-natural-titanium/p/275141', 'natural-titanium-128', true, CURRENT_TIMESTAMP);

-- Listings for Samsung S24 Ultra (Product 5)
INSERT INTO retailer_listings (id, retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at) VALUES
(11, 1, 5, 'B0CQYH5NKL', 'https://www.amazon.in/dp/B0CQYH5NKL', 'gray-12-256', true, CURRENT_TIMESTAMP),
(12, 2, 5, 'FLIP-SAMS24U-256', 'https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itms24u256', 'gray-12-256', true, CURRENT_TIMESTAMP);

-- Listings for Pixel 8 Pro (Product 6)
INSERT INTO retailer_listings (id, retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at) VALUES
(13, 2, 6, 'FLIP-PIXEL8PRO-128', 'https://www.flipkart.com/google-pixel-8-pro-obsidian-128-gb/p/itmpixel8pro', 'obsidian-128', true, CURRENT_TIMESTAMP),
(14, 1, 6, 'B0CGTS2K8J', 'https://www.amazon.in/dp/B0CGTS2K8J', 'obsidian-128', true, CURRENT_TIMESTAMP);

-- Listings for Sony WH-1000XM5 (Product 7)
INSERT INTO retailer_listings (id, retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at) VALUES
(15, 1, 7, 'B09XS7JWHH', 'https://www.amazon.in/dp/B09XS7JWHH', 'black', true, CURRENT_TIMESTAMP),
(16, 2, 7, 'FLIP-SONYXM5-BLK', 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itmsonxm5', 'black', true, CURRENT_TIMESTAMP),
(17, 3, 7, 'CROMA-258901', 'https://www.croma.com/sony-wh-1000xm5-bluetooth-noise-cancelling-headphones/p/258901', 'black', true, CURRENT_TIMESTAMP);

-- Listings for Bose QC45 (Product 8)
INSERT INTO retailer_listings (id, retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at) VALUES
(18, 1, 8, 'B098FKXT8L', 'https://www.amazon.in/dp/B098FKXT8L', 'black', true, CURRENT_TIMESTAMP),
(19, 3, 8, 'CROMA-245389', 'https://www.croma.com/bose-quietcomfort-45-bluetooth-headphone/p/245389', 'black', true, CURRENT_TIMESTAMP);

-- Listings for Apple Watch Series 9 (Product 9)
INSERT INTO retailer_listings (id, retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at) VALUES
(20, 1, 9, 'B0CHX4S79N', 'https://www.amazon.in/dp/B0CHX4S79N', 'midnight-45mm', true, CURRENT_TIMESTAMP),
(21, 2, 9, 'FLIP-APPLEW9-45', 'https://www.flipkart.com/apple-watch-series-9-gps-45mm/p/itmappw945', 'midnight-45mm', true, CURRENT_TIMESTAMP);

-- Listings for Logitech MX Master 3S (Product 10)
INSERT INTO retailer_listings (id, retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at) VALUES
(22, 1, 10, 'B09HM94VDS', 'https://www.amazon.in/dp/B09HM94VDS', 'graphite', true, CURRENT_TIMESTAMP),
(23, 2, 10, 'FLIP-LOGI-MX3S', 'https://www.flipkart.com/logitech-mx-master-3s-wireless-mouse/p/itmlogimx3s', 'graphite', true, CURRENT_TIMESTAMP);

ALTER SEQUENCE retailer_listings_id_seq RESTART WITH 50;

-- 5. Insert Current Active Offers
INSERT INTO offers (listing_id, price, shipping_cost, currency, availability, observed_at) VALUES
(1, 92990.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(2, 94990.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(3, 93490.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(4, 109990.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(5, 112500.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(6, 142990.00, 0.00, 'INR', 'LIMITED_STOCK', CURRENT_TIMESTAMP),
(7, 145000.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(8, 127990.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(9, 129900.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(10, 128490.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(11, 129999.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(12, 131999.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(13, 97999.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(14, 99999.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(15, 26990.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(16, 27990.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(17, 26990.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(18, 22990.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(19, 23490.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(20, 39900.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(21, 41900.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(22, 8995.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP),
(23, 9495.00, 0.00, 'INR', 'IN_STOCK', CURRENT_TIMESTAMP);

-- 6. Insert 30 Days of Price History Observations for all listings
-- Generate daily variations over the past 30 days
DO $$
DECLARE
    listing_rec RECORD;
    day_idx INT;
    base_p DECIMAL(12,2);
    fluctuation DECIMAL(12,2);
    obs_time TIMESTAMPTZ;
BEGIN
    FOR listing_rec IN SELECT id FROM retailer_listings LOOP
        -- Select a base price depending on listing
        IF listing_rec.id IN (1, 2, 3) THEN base_p := 94000.00;
        ELSIF listing_rec.id IN (4, 5) THEN base_p := 112000.00;
        ELSIF listing_rec.id IN (6, 7) THEN base_p := 145000.00;
        ELSIF listing_rec.id IN (8, 9, 10) THEN base_p := 130000.00;
        ELSIF listing_rec.id IN (11, 12) THEN base_p := 131000.00;
        ELSIF listing_rec.id IN (13, 14) THEN base_p := 99000.00;
        ELSIF listing_rec.id IN (15, 16, 17) THEN base_p := 28000.00;
        ELSIF listing_rec.id IN (18, 19) THEN base_p := 24000.00;
        ELSIF listing_rec.id IN (20, 21) THEN base_p := 42000.00;
        ELSE base_p := 9500.00;
        END IF;

        FOR day_idx IN 1..30 LOOP
            obs_time := CURRENT_TIMESTAMP - (day_idx || ' days')::INTERVAL;
            -- Small sinusoidal/pseudo-random price shift:
            fluctuation := ROUND((SIN(day_idx + listing_rec.id) * (base_p * 0.04))::NUMERIC, 2);

            INSERT INTO price_histories (listing_id, price, shipping_cost, currency, observed_at, source_reference)
            VALUES (listing_rec.id, base_p + fluctuation, 0.00, 'INR', obs_time, 'SEED_OBSERVATION_DAY_' || day_idx);
        END LOOP;

        -- Add current price history observation as of today
        INSERT INTO price_histories (listing_id, price, shipping_cost, currency, observed_at, source_reference)
        SELECT listing_id, price, shipping_cost, currency, observed_at, 'CURRENT_OFFER_OBSERVATION'
        FROM offers WHERE listing_id = listing_rec.id;
    END LOOP;
END $$;

-- 7. Insert Sample Watchlists & Price Alerts
INSERT INTO watchlists (user_id, product_id, target_price, created_at) VALUES
(2, 1, 90000.00, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(2, 4, 125000.00, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(2, 7, 25000.00, CURRENT_TIMESTAMP - INTERVAL '1 day');

INSERT INTO price_alerts (user_id, product_id, target_price, status, created_at) VALUES
(2, 1, 93000.00, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(2, 7, 27000.00, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 10, 8500.00, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '1 day');

INSERT INTO notifications (user_id, type, payload, read_at, created_at) VALUES
(2, 'PRICE_DROP', '{"productId": 1, "productTitle": "Apple MacBook Air M2", "previousPrice": 95990.00, "currentPrice": 92990.00, "savings": 3000.00}', NULL, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(2, 'WELCOME', '{"message": "Welcome to PriceWise AI! Start tracking products and get instant deal alerts."}', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '5 days');
