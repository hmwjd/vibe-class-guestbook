CREATE OR REPLACE FUNCTION public.add_guestbook_entry(_name TEXT, _content TEXT, _color TEXT, _password TEXT)
RETURNS SETOF public.guestbook_entries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  new_number INT;
BEGIN
  SELECT COALESCE(MAX(number), 0) + 1 INTO new_number FROM public.guestbook_entries;
  RETURN QUERY
  INSERT INTO public.guestbook_entries (number, name, content, color, password_hash)
  VALUES (new_number, _name, _content, _color, extensions.crypt(_password, extensions.gen_salt('bf')))
  RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_guestbook_entry(_id UUID, _password TEXT, _name TEXT, _content TEXT, _color TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  UPDATE public.guestbook_entries
  SET name = _name, content = _content, color = _color, updated_at = now()
  WHERE id = _id AND password_hash = extensions.crypt(_password, password_hash);
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_guestbook_entry(_id UUID, _password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  DELETE FROM public.guestbook_entries
  WHERE id = _id AND password_hash = extensions.crypt(_password, password_hash);
  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_guestbook_entry(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_guestbook_entry(UUID, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_guestbook_entry(UUID, TEXT) TO anon, authenticated;