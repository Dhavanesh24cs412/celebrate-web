-- Specialized Event Schema Extension

-- 1. Style Categories
CREATE TABLE public.event_type_style_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type_id UUID NOT NULL REFERENCES public.event_types(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    selection_type TEXT NOT NULL DEFAULT 'single',
    sort_order INT NOT NULL DEFAULT 0,
    is_required BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Style Options
CREATE TABLE public.event_type_style_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.event_type_style_categories(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    label TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Event Requirements (JSONB Extension)
CREATE TABLE public.event_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    custom_requirements TEXT,
    structured_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Client Event Style Preferences
CREATE TABLE public.client_event_style_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    style_category_id UUID NOT NULL REFERENCES public.event_type_style_categories(id),
    style_option_id UUID NOT NULL REFERENCES public.event_type_style_options(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, style_option_id)
);

-- 5. Reference Media
CREATE TABLE public.client_event_reference_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT,
    file_size_bytes BIGINT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.event_type_style_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_type_style_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_event_style_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_event_reference_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Style categories globally readable" ON public.event_type_style_categories FOR SELECT USING (true);
CREATE POLICY "Style options globally readable" ON public.event_type_style_options FOR SELECT USING (true);

-- Requirement privacy based on event ownership
CREATE POLICY "Clients manage their event requirements" ON public.event_requirements FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = event_requirements.event_id AND client_id = auth.uid())
);

CREATE POLICY "Clients manage their style preferences" ON public.client_event_style_preferences FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = client_event_style_preferences.event_id AND client_id = auth.uid())
);

CREATE POLICY "Clients manage their reference media" ON public.client_event_reference_media FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = client_event_reference_media.event_id AND client_id = auth.uid())
);
