-- Add is_guest column to profiles table
ALTER TABLE public.profiles
ADD COLUMN is_guest BOOLEAN NOT NULL DEFAULT false;

-- Update RLS policies to allow admin client to create guest profiles
CREATE POLICY "Admin client can create guest profiles"
ON public.profiles FOR INSERT
WITH CHECK (is_guest = true);

-- Update RLS policies to allow admin client to view guest profiles
CREATE POLICY "Admin client can view guest profiles"
ON public.profiles FOR SELECT
USING (is_guest = true); 