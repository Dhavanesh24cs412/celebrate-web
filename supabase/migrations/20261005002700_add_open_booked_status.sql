-- Add 'open' and 'booked' states to the event_lifecycle_state ENUM
ALTER TYPE public.event_lifecycle_state ADD VALUE IF NOT EXISTS 'open';
ALTER TYPE public.event_lifecycle_state ADD VALUE IF NOT EXISTS 'booked';
