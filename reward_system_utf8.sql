ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lifetime_points INTEGER DEFAULT 0;
CREATE OR REPLACE FUNCTION redeem_points_for_coupon(p_phone TEXT, p_points_to_spend INT, p_discount_value INT)
RETURNS TEXT AS \$\$
DECLARE
    v_coupon_code TEXT;
    v_current_points INT;
BEGIN
    -- Check current points
    SELECT points INTO v_current_points FROM profiles WHERE phone = p_phone;
    
    IF v_current_points < p_points_to_spend THEN
        RAISE EXCEPTION 'Insufficient points';
    END IF;

    -- Generate a random coupon code
    v_coupon_code := 'CURE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));

    -- Decrement points
    UPDATE profiles SET points = points - p_points_to_spend WHERE phone = p_phone;

    -- Create the coupon
    INSERT INTO coupons (code, value, active, usage_limit, usage_count)
    VALUES (v_coupon_code, p_discount_value, true, 1, 0);

    RETURN v_coupon_code;
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER;
