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
    
    -- Scale & Budget
    guest_count INTEGER NOT NULL,
    budget_min NUMERIC,
    budget_max NUMERIC NOT NULL,
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
