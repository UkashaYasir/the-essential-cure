-- 1. Atomic Stock Decrement Functions
-- Use these in Cart.tsx via supabase.rpc()

-- Decrement Main Store Stock
CREATE OR REPLACE FUNCTION decrement_store_stock(qty int)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_stock int;
BEGIN
    UPDATE store_config 
    SET current_stock = current_stock - qty 
    WHERE id = 1 AND current_stock >= qty
    RETURNING current_stock INTO new_stock;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient stock in store_config';
    END IF;

    RETURN new_stock;
END;
$$;

-- Decrement Individual Product Stock
CREATE OR REPLACE FUNCTION decrement_product_stock(p_id bigint, qty int)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_stock int;
BEGIN
    UPDATE products 
    SET stock = stock - qty 
    WHERE id = p_id AND stock >= qty
    RETURNING stock INTO new_stock;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient stock for product id %', p_id;
    END IF;

    RETURN new_stock;
END;
$$;

-- 2. Lockdown RLS Policies
-- Current policies are "true", allowing anyone to modify anything.

-- store_config: Public can READ (to see prices/status), but only authenticated admins can UPDATE.
DROP POLICY IF EXISTS "Public Access Config" ON store_config;
CREATE POLICY "Public Read Config" ON store_config FOR SELECT USING (true);
CREATE POLICY "Admin Update Config" ON store_config FOR UPDATE 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- orders: Public can INSERT (checkout) and READ THEIR OWN (if using auth, but here we use ID).
-- For this project, we'll allow public INSERT, but lock SELECT to require the specific order ID + Phone (handled in SQL or app).
-- Most importantly: Public CANNOT delete or update status.
DROP POLICY IF EXISTS "Public Access Orders" ON orders;
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Own Orders" ON orders FOR SELECT USING (true); -- We filter by phone + ID in the app.
CREATE POLICY "Admin All Orders" ON orders FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- products: Public can READ, but only admins can INSERT/UPDATE/DELETE.
DROP POLICY IF EXISTS "Public Access Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin Manage Products" ON products FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- jazzcash_payments & receipts
DROP POLICY IF EXISTS "Public Access Payments" ON jazzcash_payments;
CREATE POLICY "Public Insert Payments" ON jazzcash_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Select Payments" ON jazzcash_payments FOR SELECT 
  USING (auth.role() = 'authenticated');
