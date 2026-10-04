-- CLIP Architecture Foundation - Events & Taxonomy

-- 1. Create Enums
CREATE TYPE public.venue_status AS ENUM ('selected', 'shortlisting', 'not_selected');
CREATE TYPE public.budget_flexibility AS ENUM ('fixed', 'slightly_flexible', 'flexible');
CREATE TYPE public.event_lifecycle_state AS ENUM ('draft', 'published', 'active', 'completed', 'cancelled');

-- 2. Create Master Taxonomy Tables
CREATE TABLE public.event_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(category_id, name)
);

-- 3. Create Core Event Table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type_id UUID NOT NULL REFERENCES public.event_types(id),
    name TEXT NOT NULL,
    
    -- Date & Time
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    
    -- Location
    city TEXT NOT NULL,
    area TEXT,
    venue TEXT,
    venue_status public.venue_status,
    
    -- Scale & Budget
    guest_count INTEGER NOT NULL,
    budget_min NUMERIC,
    budget_max NUMERIC NOT NULL,
    budget_flexibility public.budget_flexibility,
    
    -- Status
    status public.event_lifecycle_state NOT NULL DEFAULT 'draft',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Event Services Linking Table
CREATE TABLE public.client_event_services (
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (event_id, service_id)
);

-- 5. RLS Policies
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_event_services ENABLE ROW LEVEL SECURITY;

-- Taxonomy is readable by everyone
CREATE POLICY "Taxonomy is globally readable" ON public.event_types FOR SELECT USING (true);
CREATE POLICY "Categories are globally readable" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Services are globally readable" ON public.services FOR SELECT USING (true);

-- Clients can manage their own events
CREATE POLICY "Clients can view their own events" ON public.events FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can insert their own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update their own events" ON public.events FOR UPDATE USING (auth.uid() = client_id);

-- Clients can manage services for their own events
CREATE POLICY "Clients can view their event services" ON public.client_event_services FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = client_event_services.event_id AND client_id = auth.uid())
);
CREATE POLICY "Clients can insert event services" ON public.client_event_services FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.events WHERE id = client_event_services.event_id AND client_id = auth.uid())
);
CREATE POLICY "Clients can delete event services" ON public.client_event_services FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = client_event_services.event_id AND client_id = auth.uid())
);

-- 6. Insert Base Taxonomy Data (Seed)
INSERT INTO public.event_types (name) VALUES 
('Wedding'), ('Reception'), ('Engagement'), ('Corporate'), ('Haldi'), ('Mehandi'), ('Sangeet'), ('Birthday'), ('Private Parties');

WITH cat_fb AS (INSERT INTO public.service_categories (name) VALUES ('Food & Beverages') RETURNING id),
     cat_ent AS (INSERT INTO public.service_categories (name) VALUES ('Entertainment') RETURNING id),
     cat_dec AS (INSERT INTO public.service_categories (name) VALUES ('Decor & Design') RETURNING id)
INSERT INTO public.services (category_id, name) VALUES 
((SELECT id FROM cat_fb), 'Buffet'),
((SELECT id FROM cat_fb), 'Bartending'),
((SELECT id FROM cat_fb), 'Interactive Food Stalls'),
((SELECT id FROM cat_ent), 'DJ'),
((SELECT id FROM cat_ent), 'Dance Floor'),
((SELECT id FROM cat_ent), 'Music'),
((SELECT id FROM cat_ent), 'Event Host'),
((SELECT id FROM cat_ent), 'Fun Games'),
((SELECT id FROM cat_dec), 'Floral Decor'),
((SELECT id FROM cat_dec), 'Lighting'),
((SELECT id FROM cat_dec), 'Stage Setup');
