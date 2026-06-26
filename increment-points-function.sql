-- Create increment function for points
CREATE OR REPLACE FUNCTION increment(amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json->>'sub')::integer + amount;
END;
$$;

-- Wait, actually, better to update using raw SQL
-- Here's a better approach: use a function that increments the points directly

CREATE OR REPLACE FUNCTION increment_points(user_id uuid, points_to_add integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + points_to_add
  WHERE id = user_id;
END;
$$;
