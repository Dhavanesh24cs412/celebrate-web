-- Master Schema Consolidation (2026-10-06)
-- Replicates the exact state of the production database, incorporating Auth, Profiles, Events (with JSONB), and Storage.

-- ==========================================
-- 1. ENUMS
-- ==========================================
CREATE TYPE public.user_role AS ENUM ('client', 'planner');
CREATE TYPE public.venue_status AS ENUM ('selected', 'shortlisting', 'not_selected');
CREATE TYPE public.budget_flexibility AS ENUM ('fixed', 'slightly_flexible', 'flexible');
CREATE TYPE public.event_lifecycle_state AS ENUM ('draft', 'published', 'active', 'completed', 'cancelled', 'open', 'booked');

-- ==========================================
-- 2. AUTH & PROFILES
-- ==========================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  first_name text,
  last_name text,
  avatar_url text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.client_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name text,
  phone text,
  city text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.planner_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name text,
  contact_name text,
  phone text,
  city text,
  short_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Profiles Triggers & Functions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER client_profiles_updated_at BEFORE UPDATE ON public.client_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER planner_profiles_updated_at BEFORE UPDATE ON public.planner_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.prevent_profile_tampering()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id THEN RAISE EXCEPTION 'Profile ID cannot be changed.'; END IF;
  IF NEW.role IS DISTINCT FROM OLD.role THEN RAISE EXCEPTION 'Profile role cannot be changed.'; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

CREATE TRIGGER ensure_profile_immutability BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_tampering();

CREATE OR REPLACE FUNCTION public.complete_onboarding()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_user_id uuid;
  user_role public.user_role;
  has_subprofile boolean := false;
BEGIN
  current_user_id := (select auth.uid());
  IF current_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT role INTO user_role FROM public.profiles WHERE id = current_user_id;
  IF user_role IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;
  IF user_role = 'client' THEN SELECT EXISTS (SELECT 1 FROM public.client_profiles WHERE user_id = current_user_id) INTO has_subprofile;
  ELSIF user_role = 'planner' THEN SELECT EXISTS (SELECT 1 FROM public.planner_profiles WHERE user_id = current_user_id) INTO has_subprofile; END IF;
  IF NOT has_subprofile THEN RAISE EXCEPTION 'Cannot complete onboarding without a corresponding % profile', user_role; END IF;
  UPDATE public.profiles SET onboarding_completed = true WHERE id = current_user_id;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.complete_onboarding() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_onboarding() TO authenticated;

-- ==========================================
-- 3. EVENTS TAXONOMY
-- ==========================================
CREATE TABLE public.event_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    styles text[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 4. CORE EVENTS TABLE
-- ==========================================
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
    venue_address TEXT,
    
    -- Scale & Budget (Stored in Lakhs)
    guest_count INTEGER NOT NULL,
    budget_min NUMERIC CHECK (budget_min >= 0.5),
    budget_max NUMERIC NOT NULL CHECK (budget_max <= 500.0 AND (budget_min IS NULL OR budget_max >= budget_min)),
    budget_flexibility public.budget_flexibility,
    
    -- Status
    status public.event_lifecycle_state NOT NULL DEFAULT 'draft',
    
    -- JSONB Extensibility Columns (added manually to prod)
    services JSONB DEFAULT '[]'::jsonb,
    requirements JSONB DEFAULT '{}'::jsonb,
    style_preferences JSONB DEFAULT '{}'::jsonb,
    reference_media JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT TO authenticated USING ((select auth.uid()) = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = id AND onboarding_completed = false);
CREATE POLICY "Users can read their own client profile" ON public.client_profiles FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert their own client profile" ON public.client_profiles FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id AND (SELECT role FROM public.profiles WHERE id = (select auth.uid())) = 'client');
CREATE POLICY "Users can update their own client profile" ON public.client_profiles FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can read their own planner profile" ON public.planner_profiles FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert their own planner profile" ON public.planner_profiles FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id AND (SELECT role FROM public.profiles WHERE id = (select auth.uid())) = 'planner');
CREATE POLICY "Users can update their own planner profile" ON public.planner_profiles FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id);

-- Events Policies
CREATE POLICY "Taxonomy is globally readable" ON public.event_types FOR SELECT USING (true);
CREATE POLICY "Clients can view their own events" ON public.events FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can insert their own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update their own events" ON public.events FOR UPDATE USING (auth.uid() = client_id);

-- ==========================================
-- 6. STORAGE BUCKETS
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('client-event-media', 'client-event-media', false) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Clients can upload to client-event-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'client-event-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Clients can view their own media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'client-event-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Clients can delete their own media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'client-event-media' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ==========================================
-- 7. SEED DATA
-- ==========================================
INSERT INTO public.event_types (name) VALUES 
('Wedding'), ('Reception'), ('Engagement'), ('Corporate'), ('Haldi'), ('Mehandi'), ('Sangeet'), ('Birthday'), ('Private Parties')
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- 8. PLANNER PORTFOLIOS & PROFILES EXTENSION
-- ==========================================

-- Alter Existing Table (Basic Info)
ALTER TABLE public.planner_profiles 
ADD COLUMN IF NOT EXISTS company_address text,
ADD COLUMN IF NOT EXISTS instagram text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS operatable_cities text[] DEFAULT '{}';

-- Create Portfolio Table (Event-specific Offerings)
CREATE TABLE IF NOT EXISTS public.planner_portfolios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    planner_id uuid NOT NULL REFERENCES public.planner_profiles(user_id) ON DELETE CASCADE,
    event_type_id uuid NOT NULL REFERENCES public.event_types(id),
    
    -- Budget limits for this specific event type (Stored in Lakhs)
    budget_min numeric CHECK (budget_min >= 0.5),
    budget_max numeric CHECK (budget_max <= 100.0 AND budget_max >= budget_min),
    
    -- Array of strings mapping to EVENT_WIZARD_CONFIG services
    services jsonb DEFAULT '[]'::jsonb,
    
    -- Crucial for CLIP Matching: Stores grouped images 
    -- Expected structure: [{ "theme_name": string, "images": string[] }] (max 4 images per theme)
    themes jsonb DEFAULT '[]'::jsonb, 
    
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    -- Ensure a planner only has one portfolio configuration per event type
    UNIQUE(planner_id, event_type_id)
);

-- Row Level Security for Portfolios
ALTER TABLE public.planner_portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Planners can manage their own portfolios" ON public.planner_portfolios 
  FOR ALL TO authenticated USING (auth.uid() = planner_id);
CREATE POLICY "Portfolios are readable by authenticated clients" ON public.planner_portfolios 
  FOR SELECT TO authenticated USING (true);

-- Storage Bucket for Planner Portfolios
INSERT INTO storage.buckets (id, name, public) VALUES ('planner-portfolio-media', 'planner-portfolio-media', false) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Planners can upload portfolio media" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'planner-portfolio-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Planners can view their own portfolio media" ON storage.objects 
  FOR SELECT TO authenticated USING (bucket_id = 'planner-portfolio-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Planners can delete their own portfolio media" ON storage.objects 
  FOR DELETE TO authenticated USING (bucket_id = 'planner-portfolio-media' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ==========================================
-- 9. SEED EVENT STYLES
-- ==========================================
UPDATE public.event_types SET styles = ARRAY['Traditional', 'Modern', 'Luxury', 'Simple', 'Boho'] WHERE name = 'Wedding';
UPDATE public.event_types SET styles = ARRAY['Elegant', 'Luxury', 'Modern', 'Traditional', 'Minimal'] WHERE name = 'Reception';
UPDATE public.event_types SET styles = ARRAY['Simple', 'Elegant', 'Traditional', 'Modern', 'Luxury'] WHERE name = 'Engagement';
UPDATE public.event_types SET styles = ARRAY['Professional', 'Modern', 'Creative', 'Minimalist'] WHERE name = 'Corporate';
UPDATE public.event_types SET styles = ARRAY['Traditional', 'Modern'] WHERE name = 'Haldi';
UPDATE public.event_types SET styles = ARRAY['Traditional', 'Boho', 'Modern'] WHERE name = 'Mehandi';
UPDATE public.event_types SET styles = ARRAY['Luxury', 'Modern', 'Traditional'] WHERE name = 'Sangeet';
UPDATE public.event_types SET styles = ARRAY['Themed', 'Minimal', 'Luxury'] WHERE name = 'Birthday';
UPDATE public.event_types SET styles = ARRAY['Casual', 'Themed', 'Vibeful'] WHERE name = 'Private Parties';
