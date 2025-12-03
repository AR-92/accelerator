-- Billing/Subscription Tables

-- Subscription Plans Table
CREATE TABLE public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    credits_included INTEGER DEFAULT 0,
    features JSONB, -- Store plan features as JSON
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Subscriptions Table
CREATE TABLE public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id) -- One active subscription per user
);

-- Billing History/Invoices Table
CREATE TABLE public.billing_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.user_subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
    billing_period_start TIMESTAMP WITH TIME ZONE,
    billing_period_end TIMESTAMP WITH TIME ZONE,
    invoice_number VARCHAR(100) UNIQUE,
    payment_method VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscription_plans_active ON public.subscription_plans(is_active) WHERE is_active = true;
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_billing_history_user_id ON public.billing_history(user_id);
CREATE INDEX idx_billing_history_created_at ON public.billing_history(created_at DESC);

-- RLS Policies
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

-- Subscription plans: Public read
CREATE POLICY "Subscription plans are viewable by everyone" ON public.subscription_plans
    FOR SELECT USING (true);

-- User subscriptions: Users can only see their own
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Billing history: Users can only see their own
CREATE POLICY "Users can view their own billing history" ON public.billing_history
    FOR SELECT USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, credits_included, features) VALUES
('Starter', 'Perfect for getting started', 9.99, 99.99, 100, '["Up to 3 projects", "Basic analytics", "Email support"]'),
('Pro', 'For growing businesses', 29.99, 299.99, 500, '["Unlimited projects", "Advanced analytics", "Priority support", "Team collaboration"]'),
('Enterprise', 'For large organizations', NULL, NULL, 2000, '["Everything in Pro", "Custom integrations", "Dedicated support", "SLA guarantee"]');
