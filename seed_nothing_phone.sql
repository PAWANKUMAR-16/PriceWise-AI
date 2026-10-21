DO $$
DECLARE
    new_pid BIGINT;
    croma_lid BIGINT;
    amazon_lid BIGINT;
    flip_lid BIGINT;
BEGIN
    INSERT INTO products (title, brand, model_number, category, attributes)
    VALUES ('Nothing Phone 3a 5G (8GB RAM, 128GB, White)', 'Nothing', 'A142-WHITE', 'Smartphones', '{"color": "White", "ram": "8GB", "storage": "128GB", "display": "6.7-inch 120Hz Flexible AMOLED 3000 nits", "processor": "MediaTek Dimensity 7200 Pro"}')
    RETURNING id INTO new_pid;

    INSERT INTO retailer_listings (retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at)
    VALUES (3, new_pid, '7164459', 'https://www.croma.com/nothing-phone-3a-5g-8gb-ram-128gb-white/p/7164459', 'white-8-128', true, NOW())
    RETURNING id INTO croma_lid;

    INSERT INTO retailer_listings (retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at)
    VALUES (1, new_pid, 'B0D1NOTH3A', 'https://www.amazon.in/dp/B0D1NOTH3A', 'white-8-128', true, NOW())
    RETURNING id INTO amazon_lid;

    INSERT INTO retailer_listings (retailer_id, product_id, external_product_id, product_url, variant_key, is_active, last_seen_at)
    VALUES (2, new_pid, 'itm0987654321', 'https://www.flipkart.com/nothing-phone-3a-5g-white-128-gb/p/itm0987654321', 'white-8-128', true, NOW())
    RETURNING id INTO flip_lid;

    -- Offers
    INSERT INTO offers (listing_id, price, shipping_cost, currency, availability, observed_at)
    VALUES 
      (croma_lid, 20394.00, 0.00, 'INR', 'IN_STOCK', NOW()),
      (amazon_lid, 23999.00, 0.00, 'INR', 'OUT_OF_STOCK', NOW()),
      (flip_lid, 24999.00, 0.00, 'INR', 'IN_STOCK', NOW());

    -- Price History
    INSERT INTO price_histories (listing_id, price, shipping_cost, currency, observed_at, source_reference)
    VALUES
      (croma_lid, 22999.00, 0.00, 'INR', NOW() - INTERVAL '25 days', 'HISTORY'),
      (croma_lid, 21999.00, 0.00, 'INR', NOW() - INTERVAL '15 days', 'HISTORY'),
      (croma_lid, 24943.00, 0.00, 'INR', NOW() - INTERVAL '10 days', 'HISTORY'),
      (croma_lid, 20394.00, 0.00, 'INR', NOW() - INTERVAL '2 days', 'HISTORY'),
      (croma_lid, 20394.00, 0.00, 'INR', NOW(), 'CURRENT');

    RAISE NOTICE 'Inserted Nothing Phone 3a successfully with ID %', new_pid;
END $$;
