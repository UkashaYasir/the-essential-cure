-- Create transformations table
CREATE TABLE IF NOT EXISTS public.transformations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id INTEGER REFERENCES public.products(id),
    before_url TEXT NOT NULL,
    after_url TEXT NOT NULL,
    concern TEXT NOT NULL,
    customer_name TEXT,
    duration TEXT,
    review_url TEXT,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access for transformations' AND tablename = 'transformations') THEN
        CREATE POLICY "Allow public read access for transformations"
            ON public.transformations FOR SELECT
            USING (true);
    END IF;

    -- Create policy to allow admin full access
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin full access for transformations' AND tablename = 'transformations') THEN
        CREATE POLICY "Allow admin full access for transformations"
            ON public.transformations FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transformations_concern ON public.transformations(concern);
CREATE INDEX IF NOT EXISTS idx_transformations_created_at ON public.transformations(created_at);
