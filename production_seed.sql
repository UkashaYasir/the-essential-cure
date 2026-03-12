-- Clean up existing data to avoid conflicts
TRUNCATE transformations, products CASCADE;

-- Insert the Core Product
INSERT INTO products (id, name, description, price, sale_price, image_url, active, stock, category, tags, gallery, cogs)
VALUES (
    1,
    'The Essential Cure Hair Oil',
    'A powerful blend of 100% natural botanical oils formulated to stop hair fall, promote rapid growth, and restore natural shine and thickness.',
    1700,
    '1450',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop',
    true,
    500,
    'Treatment',
    ARRAY['Hair Fall', 'Growth', 'Luxury'],
    ARRAY['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da'],
    450
);

-- Insert High-Quality Transformations for the Core Product
INSERT INTO transformations (customer_name, before_url, after_url, concern, duration, verified, product_id)
VALUES 
('Heba K.', 'https://images.unsplash.com/photo-1519681393784-d120267933ba', 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb', 'Hair Fall', '4 Weeks', true, 1),
('Ayesha Z.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', 'Thinning', '8 Weeks', true, 1),
('Sana M.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', 'Dry Scalp', '6 Weeks', true, 1);
