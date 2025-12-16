-- Function to handle new user registration
-- First user becomes admin, others become editors by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Count existing users
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  
  -- First user becomes admin, others become editors
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'editor');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-assign roles on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();