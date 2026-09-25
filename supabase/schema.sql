-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. Table: categories
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'both')),
    icon TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 2. Table: providers
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 3. Table: transactions
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    title TEXT NOT NULL,
    description TEXT,
    amount NUMERIC NOT NULL,
    quantity NUMERIC DEFAULT 1 NOT NULL,
    total NUMERIC NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    occurred_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    raw_input TEXT
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_occurred_at ON public.transactions(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_provider_id ON public.transactions(provider_id);

-- ==============================================================================
-- 4. Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Categories RLS:
-- Everyone can read global categories (user_id IS NULL) or their own
CREATE POLICY "Allow read categories" ON public.categories
    FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Allow insert own categories" ON public.categories
    FOR INSERT WITH CHECK (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));

CREATE POLICY "Allow update own categories" ON public.categories
    FOR UPDATE USING (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));

CREATE POLICY "Allow delete own categories" ON public.categories
    FOR DELETE USING (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));

-- Providers RLS:
CREATE POLICY "Allow read providers" ON public.providers
    FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Allow insert own providers" ON public.providers
    FOR INSERT WITH CHECK (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));

CREATE POLICY "Allow update own providers" ON public.providers
    FOR UPDATE USING (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));

CREATE POLICY "Allow delete own providers" ON public.providers
    FOR DELETE USING (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));

-- Transactions RLS:
CREATE POLICY "Allow read transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));

CREATE POLICY "Allow insert transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));

CREATE POLICY "Allow update transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));

CREATE POLICY "Allow delete transactions" ON public.transactions
    FOR DELETE USING (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));

-- ==============================================================================
-- 5. Seed Data (Default Global Categories & Providers)
-- ==============================================================================
INSERT INTO public.categories (name, type, icon, color) VALUES
    ('Makanan & Minuman', 'expense', 'Utensils', '#f97316'),
    ('Transportasi', 'expense', 'Car', '#06b6d4'),
    ('Belanja Harian', 'expense', 'ShoppingBag', '#3b82f6'),
    ('Tagihan & Utilitas', 'expense', 'Receipt', '#eab308'),
    ('Hiburan', 'expense', 'Gamepad2', '#a855f7'),
    ('Kesehatan', 'expense', 'HeartPulse', '#ef4444'),
    ('Pendidikan', 'expense', 'GraduationCap', '#10b981'),
    ('Gaji / Upah', 'income', 'Wallet', '#22c55e'),
    ('Bonus & Freelance', 'income', 'Sparkles', '#14b8a6'),
    ('Investasi', 'income', 'TrendingUp', '#8b5cf6'),
    ('Lainnya', 'both', 'MoreHorizontal', '#64748b')
ON CONFLICT DO NOTHING;

INSERT INTO public.providers (name, icon, is_active) VALUES
    ('Cash', 'Banknote', true),
    ('DANA', 'Smartphone', true),
    ('GoPay', 'Smartphone', true),
    ('OVO', 'Smartphone', true),
    ('ShopeePay', 'Smartphone', true),
    ('BCA', 'CreditCard', true),
    ('BRI', 'CreditCard', true),
    ('Mandiri', 'CreditCard', true),
    ('Lainnya', 'Wallet', true)
ON CONFLICT DO NOTHING;
