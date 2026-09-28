CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.guestbook_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INT NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'yellow',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.guestbook_entries TO anon;
GRANT SELECT ON public.guestbook_entries TO authenticated;
GRANT ALL ON public.guestbook_entries TO service_role;

ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guestbook entries" ON public.guestbook_entries
  FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.add_guestbook_entry(_name TEXT, _content TEXT, _color TEXT, _password TEXT)
RETURNS SETOF public.guestbook_entries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number INT;
BEGIN
  SELECT COALESCE(MAX(number), 0) + 1 INTO new_number FROM public.guestbook_entries;
  RETURN QUERY
  INSERT INTO public.guestbook_entries (number, name, content, color, password_hash)
  VALUES (new_number, _name, _content, _color, crypt(_password, gen_salt('bf')))
  RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_guestbook_entry(_id UUID, _password TEXT, _name TEXT, _content TEXT, _color TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.guestbook_entries
  SET name = _name, content = _content, color = _color, updated_at = now()
  WHERE id = _id AND password_hash = crypt(_password, password_hash);
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_guestbook_entry(_id UUID, _password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.guestbook_entries
  WHERE id = _id AND password_hash = crypt(_password, password_hash);
  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_guestbook_entry(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_guestbook_entry(UUID, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_guestbook_entry(UUID, TEXT) TO anon, authenticated;

INSERT INTO public.guestbook_entries (number, name, content, color, password_hash) VALUES
  (1, '김철수', '우리 반 친구들, 항상 밝게 웃는 모습이 보기 좋아요! 앞으로도 즐거운 학교생활 함께해요 😊', 'yellow', crypt('1234', gen_salt('bf'))),
  (2, '이영희', '힘들 때마다 서로 응원해주는 우리 반이 자랑스러워요. 모두모두 파이팅! 💙', 'blue', crypt('1234', gen_salt('bf'))),
  (3, '박민수', '점심시간에 같이 운동장에서 뛰어노는 게 제일 즐거워요. 우리 반 최고! 🌱', 'green', crypt('1234', gen_salt('bf')));