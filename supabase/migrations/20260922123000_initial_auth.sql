-- Create enum
CREATE TYPE public.user_role AS ENUM ('client', 'planner');

-- Create profiles table
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

-- Create client_profiles table
CREATE TABLE public.client_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name text,
  phone text,
  city text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create planner_profiles table
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

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planner_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can read their own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (
  (select auth.uid()) = id 
  AND onboarding_completed = false
);

-- Client Profiles RLS Policies
CREATE POLICY "Users can read their own client profile" 
ON public.client_profiles FOR SELECT 
TO authenticated 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own client profile" 
ON public.client_profiles FOR INSERT 
TO authenticated 
WITH CHECK (
  (select auth.uid()) = user_id 
  AND (SELECT role FROM public.profiles WHERE id = (select auth.uid())) = 'client'
);

CREATE POLICY "Users can update their own client profile" 
ON public.client_profiles FOR UPDATE 
TO authenticated 
USING ((select auth.uid()) = user_id);

-- Planner Profiles RLS Policies
CREATE POLICY "Users can read their own planner profile" 
ON public.planner_profiles FOR SELECT 
TO authenticated 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own planner profile" 
ON public.planner_profiles FOR INSERT 
TO authenticated 
WITH CHECK (
  (select auth.uid()) = user_id 
  AND (SELECT role FROM public.profiles WHERE id = (select auth.uid())) = 'planner'
);

CREATE POLICY "Users can update their own planner profile" 
ON public.planner_profiles FOR UPDATE 
TO authenticated 
USING ((select auth.uid()) = user_id);

-- Timestamp triggers
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

-- Role Immutability Trigger
CREATE OR REPLACE FUNCTION public.prevent_profile_tampering()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Profile ID cannot be changed.';
  END IF;
  
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Profile role cannot be changed.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

CREATE TRIGGER ensure_profile_immutability BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_tampering();

-- Onboarding Integrity Function
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
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get current role
  SELECT role INTO user_role FROM public.profiles WHERE id = current_user_id;
  
  IF user_role IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  -- Verify subprofile exists
  IF user_role = 'client' THEN
    SELECT EXISTS (SELECT 1 FROM public.client_profiles WHERE user_id = current_user_id) INTO has_subprofile;
  ELSIF user_role = 'planner' THEN
    SELECT EXISTS (SELECT 1 FROM public.planner_profiles WHERE user_id = current_user_id) INTO has_subprofile;
  END IF;

  IF NOT has_subprofile THEN
    RAISE EXCEPTION 'Cannot complete onboarding without a corresponding % profile', user_role;
  END IF;

  -- Perform the update (since it's SECURITY DEFINER, it bypasses RLS on profiles UPDATE)
  UPDATE public.profiles SET onboarding_completed = true WHERE id = current_user_id;

END;
$$;

-- Revoke default public execute, grant to authenticated only
REVOKE EXECUTE ON FUNCTION public.complete_onboarding() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_onboarding() TO authenticated;
