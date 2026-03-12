-- Run this in your Supabase SQL Editor to enable stock tracking
ALTER TABLE store_config ADD COLUMN current_stock INT DEFAULT 100;
