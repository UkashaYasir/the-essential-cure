-- Add usage limit and count columns to coupons table
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS usage_limit INT DEFAULT NULL;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS usage_count INT DEFAULT 0;

-- Function to safely redeem a coupon (atomic increment)
CREATE OR REPLACE FUNCTION redeem_coupon(p_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE coupons
    SET usage_count = usage_count + 1
    WHERE code = p_code 
      AND active = true 
      AND (usage_limit IS NULL OR usage_count < usage_limit);

    IF FOUND THEN
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$;
