-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles: users can see their own roles, admins can see all
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update lagrange tables to allow editing by authenticated users with editor/admin role
DROP POLICY IF EXISTS "Anyone can view axes" ON public.lagrange_axes;
CREATE POLICY "Anyone can view axes"
ON public.lagrange_axes FOR SELECT USING (true);

CREATE POLICY "Editors can insert axes"
ON public.lagrange_axes FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can update axes"
ON public.lagrange_axes FOR UPDATE
USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete axes"
ON public.lagrange_axes FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update lagrange_nodes policies
DROP POLICY IF EXISTS "Anyone can view nodes" ON public.lagrange_nodes;
CREATE POLICY "Anyone can view nodes"
ON public.lagrange_nodes FOR SELECT USING (true);

CREATE POLICY "Editors can insert nodes"
ON public.lagrange_nodes FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can update nodes"
ON public.lagrange_nodes FOR UPDATE
USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete nodes"
ON public.lagrange_nodes FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update lagrange_connections policies
DROP POLICY IF EXISTS "Anyone can view connections" ON public.lagrange_connections;
CREATE POLICY "Anyone can view connections"
ON public.lagrange_connections FOR SELECT USING (true);

CREATE POLICY "Editors can insert connections"
ON public.lagrange_connections FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can update connections"
ON public.lagrange_connections FOR UPDATE
USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete connections"
ON public.lagrange_connections FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));