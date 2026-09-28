CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS password_hash text;

-- renumber existing entries in order
WITH o AS (SELECT id, row_number() OVER (ORDER BY created_at, id) rn FROM public.guestbook_entries)
UPDATE public.guestbook_entries g SET number = o.rn FROM o WHERE g.id = o.id;

CREATE SEQUENCE IF NOT EXISTS public.guestbook_entries_number_seq OWNED BY public.guestbook_entries.number;
SELECT setval('public.guestbook_entries_number_seq', COALESCE((SELECT max(number) FROM public.guestbook_entries), 0) + 1, false);
ALTER TABLE public.guestbook_entries ALTER COLUMN number SET DEFAULT nextval('public.guestbook_entries_number_seq');

-- hide password hash; block direct writes
DROP POLICY IF EXISTS "Anyone can add a guestbook entry" ON public.guestbook_entries;
REVOKE ALL ON public.guestbook_entries FROM anon, authenticated;
GRANT SELECT (id, number, name, content, color, created_at) ON public.guestbook_entries TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.add_guestbook_entry(_name text, _content text, _color text, _password text)
RETURNS TABLE(id uuid, number int, name text, content text, color text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  IF length(trim(_name)) = 0 OR length(trim(_name)) > 20 OR length(trim(_content)) = 0 OR length(_content) > 300
     OR _color NOT IN ('yellow','blue','green') OR length(_password) < 4 OR length(_password) > 50 THEN
    RAISE EXCEPTION 'invalid input';
  END IF;
  RETURN QUERY INSERT INTO public.guestbook_entries AS g (name, content, color, password_hash)
    VALUES (trim(_name), trim(_content), _color, crypt(_password, gen_salt('bf')))
    RETURNING g.id, g.number, g.name, g.content, g.color, g.created_at;
END; $$;

CREATE OR REPLACE FUNCTION public.update_guestbook_entry(_id uuid, _password text, _name text, _content text, _color text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE n int;
BEGIN
  IF length(trim(_name)) = 0 OR length(trim(_name)) > 20 OR length(trim(_content)) = 0 OR length(_content) > 300
     OR _color NOT IN ('yellow','blue','green') THEN RAISE EXCEPTION 'invalid input'; END IF;
  UPDATE public.guestbook_entries SET name = trim(_name), content = trim(_content), color = _color
   WHERE id = _id AND password_hash IS NOT NULL AND password_hash = crypt(_password, password_hash);
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END; $$;

CREATE OR REPLACE FUNCTION public.delete_guestbook_entry(_id uuid, _password text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE n int;
BEGIN
  DELETE FROM public.guestbook_entries
   WHERE id = _id AND password_hash IS NOT NULL AND password_hash = crypt(_password, password_hash);
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END; $$;

GRANT EXECUTE ON FUNCTION public.add_guestbook_entry(text,text,text,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_guestbook_entry(uuid,text,text,text,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_guestbook_entry(uuid,text) TO anon, authenticated;