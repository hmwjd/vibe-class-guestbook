CREATE TABLE public.guestbook_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'yellow',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.guestbook_entries TO anon;
GRANT SELECT, INSERT ON public.guestbook_entries TO authenticated;
GRANT ALL ON public.guestbook_entries TO service_role;

ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guestbook entries" ON public.guestbook_entries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add a guestbook entry" ON public.guestbook_entries FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO public.guestbook_entries (number, name, content, color, created_at) VALUES
  (1, '김철수', '우리 반 친구들 모두 사랑해! 올해도 재밌게 지내자 🌼', 'yellow', '2026-03-04 09:20:00+09'),
  (15, '이영희', '쉬는 시간에 같이 놀아줘서 고마워~ 우리 오래오래 친하게 지내자!', 'blue', '2026-03-05 12:45:00+09'),
  (7, '박민수', '체육시간 축구 완전 재밌었다 ⚽ 다음에도 같은 팀 하자!', 'green', '2026-03-06 15:10:00+09');