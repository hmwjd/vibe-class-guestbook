import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

type ColorKey = "yellow" | "blue" | "green";

interface Entry {
  id: number;
  number: number;
  name: string;
  content: string;
  color: ColorKey;
  date: string;
}

const COLOR_LABEL: Record<ColorKey, string> = {
  yellow: "노란색",
  blue: "파란색",
  green: "초록색",
};

const COLOR_STYLE: Record<ColorKey, { bg: string; border: string; tag: string }> = {
  yellow: { bg: "#fff8d6", border: "#ffe082", tag: "#f9a825" },
  blue: { bg: "#e0f2fe", border: "#90caf9", tag: "#1e88e5" },
  green: { bg: "#dcf5e7", border: "#a5d6a7", tag: "#43a047" },
};

function formatDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const INITIAL: Entry[] = [
  { id: 1, number: 1, name: "김철수", content: "우리 반 친구들 모두 사랑해! 올해도 재밌게 지내자 🌼", color: "yellow", date: "2026년 3월 4일 09:20" },
  { id: 2, number: 15, name: "이영희", content: "쉬는 시간에 같이 놀아줘서 고마워~ 우리 오래오래 친하게 지내자!", color: "blue", date: "2026년 3월 5일 12:45" },
  { id: 3, number: 7, name: "박민수", content: "체육시간 축구 완전 재밌었다 ⚽ 다음에도 같은 팀 하자!", color: "green", date: "2026년 3월 6일 15:10" },
];

function Index() {
  const [entries, setEntries] = useState<Entry[]>(INITIAL);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<ColorKey>("yellow");
  const listRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLElement | null>(null);
  const [lastId, setLastId] = useState<number | null>(null);

  useEffect(() => {
    if (lastId != null && lastCardRef.current) {
      lastCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [lastId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(number, 10);
    if (!n || !name.trim() || !content.trim()) return;
    const newEntry: Entry = {
      id: Date.now(),
      number: n,
      name: name.trim(),
      content: content.trim(),
      color,
      date: formatDate(new Date()),
    };
    setEntries((prev) => [...prev, newEntry]);
    setLastId(newEntry.id);
    setNumber("");
    setName("");
    setContent("");
    setColor("yellow");
  };

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page">
      <style>{css}</style>
      <header className="site-header">
        <h1 className="site-title">교실 한 칸, 우리들의 방명록 📝</h1>
        <p className="site-desc">
          우리 반 친구들에게 남기고 싶은 따뜻한 한마디, 여기에 예쁘게 적어봐요 🌷
        </p>
        <nav className="nav">
          <a href="#write" onClick={scrollTo("write")}>✏️ 방명록 작성</a>
          <a href="#list" onClick={scrollTo("list")}>💌 친구들의 한마디 보기</a>
          <a href="#rules" onClick={scrollTo("rules")}>🤝 우리반 약속</a>
        </nav>
        <hr className="divider" />
      </header>

      <main className="main">
        <section id="write" className="section">
          <h2 className="section-title">✏️ 방명록 작성</h2>
          <form className="form card-shadow" onSubmit={handleSubmit}>
            <div className="row">
              <label>
                <span>번호</span>
                <input
                  type="number"
                  min={1}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="예: 3"
                  required
                />
              </label>
              <label>
                <span>이름</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 적어줘"
                  maxLength={20}
                  required
                />
              </label>
              <label>
                <span>카드 색상</span>
                <select value={color} onChange={(e) => setColor(e.target.value as ColorKey)}>
                  <option value="yellow">🍯 노란색</option>
                  <option value="blue">🌊 파란색</option>
                  <option value="green">🌱 초록색</option>
                </select>
              </label>
            </div>
            <label className="full">
              <span>남길 한마디</span>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="친구들에게 남기고 싶은 따뜻한 말을 적어봐요 💛"
                maxLength={300}
                required
              />
            </label>
            <button type="submit" className="submit-btn">등록하기 💌</button>
          </form>
        </section>

        <hr className="divider" />

        <section id="list" className="section">
          <h2 className="section-title">💌 친구들이 남긴 이야기</h2>
          <p className="count">현재 등록된 방명록: <strong>{entries.length}</strong>개</p>
          <div className="list" ref={listRef}>
            {entries.map((entry) => {
              const style = COLOR_STYLE[entry.color];
              const isLast = entry.id === lastId;
              return (
                <article
                  key={entry.id}
                  ref={isLast ? (el) => { lastCardRef.current = el; } : undefined}
                  className="entry-card"
                  style={{
                    backgroundColor: style.bg,
                    borderColor: style.border,
                  }}
                >
                  <div className="entry-head">
                    <span className="entry-num" style={{ backgroundColor: style.tag }}>
                      {entry.number}번
                    </span>
                    <h3 className="entry-name">{entry.name}</h3>
                    <span className="entry-color-label">{COLOR_LABEL[entry.color]}</span>
                  </div>
                  <p className="entry-content">{entry.content}</p>
                  <div className="entry-date">🕒 {entry.date}</div>
                </article>
              );
            })}
          </div>
        </section>

        <hr className="divider" />

        <section id="rules" className="section">
          <h2 className="section-title">🤝 우리반 방명록 약속</h2>
          <div className="rules card-shadow">
            <ul>
              <li>💛 친구의 마음을 따뜻하게 해주는 말만 남겨요.</li>
              <li>🌈 서로의 다름을 존중하고, 별명이나 놀리는 말은 쓰지 않아요.</li>
              <li>🌸 개인정보(전화번호, 주소 등)는 절대 적지 않아요.</li>
              <li>✨ 예쁜 말로 표현하면 우리반이 더 밝아져요.</li>
              <li>📚 방명록도 우리 교실의 일부! 소중히 다뤄요.</li>
            </ul>
          </div>
        </section>
      </main>

      <hr className="divider" />

      <footer className="site-footer">
        <p>© 2026 우리 반 방명록 Project. Created by 우리반 프론트엔드 개발자</p>
        <p className="small">개선 아이디어나 버그 발견 시 <strong>반장</strong>에게 건의해 주세요! 🙌</p>
      </footer>
    </div>
  );
}

const css = `
.page {
  min-height: 100vh;
  background-color: #faf6f0;
  color: #4a3e3d;
  font-family: 'Gowun Dodum', system-ui, sans-serif;
  padding: 24px 16px 48px;
  line-height: 1.6;
}
.site-header { max-width: 900px; margin: 0 auto; text-align: center; padding-top: 16px; }
.site-title {
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  color: #ff8a80;
  margin: 0 0 12px;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 0 rgba(255,138,128,0.15);
}
.site-desc { margin: 0 0 20px; color: #7a6b6a; font-size: 1.05rem; }
.nav {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;
  margin-bottom: 8px;
}
.nav a {
  background: #fff;
  border: 2px solid #ffd8cf;
  color: #4a3e3d;
  padding: 10px 18px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.98rem;
  box-shadow: 0 4px 10px rgba(255,171,145,0.15);
  transition: transform .25s ease, background .25s ease, color .25s ease, box-shadow .25s ease;
}
.nav a:hover {
  transform: translateY(-3px);
  background: #ffab91;
  color: #fff;
  box-shadow: 0 8px 18px rgba(255,138,128,0.28);
}
.divider {
  border: none;
  border-top: 3px dotted #ffd8cf;
  max-width: 900px;
  margin: 28px auto;
}
.main { max-width: 900px; margin: 0 auto; }
.section { margin: 24px 0; }
.section-title {
  color: #ffab91;
  font-size: 1.5rem;
  margin: 0 0 16px;
  padding-left: 6px;
}
.card-shadow {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 10px 24px rgba(74,62,61,0.08);
}
.form {
  padding: 24px;
  display: flex; flex-direction: column; gap: 16px;
  border: 2px solid #fff1e6;
}
.form .row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
@media (max-width: 640px) {
  .form .row { grid-template-columns: 1fr; }
}
.form label { display: flex; flex-direction: column; gap: 6px; font-size: 0.95rem; }
.form label span { font-weight: 700; color: #6b5a58; }
.form input, .form select, .form textarea {
  font-family: inherit;
  color: #4a3e3d;
  background: #fffaf3;
  border: 2px solid #ffe0d3;
  border-radius: 14px;
  padding: 10px 14px;
  font-size: 1rem;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.form input:focus, .form select:focus, .form textarea:focus {
  border-color: #ffab91;
  box-shadow: 0 0 0 4px rgba(255,171,145,0.2);
}
.form textarea { resize: vertical; min-height: 100px; }
.submit-btn {
  align-self: flex-end;
  background: linear-gradient(135deg, #ff8a80, #ffab91);
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 999px;
  font-family: inherit;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(255,138,128,0.35);
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
}
.submit-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
  box-shadow: 0 10px 22px rgba(255,138,128,0.45);
}
.count {
  background: #fff;
  display: inline-block;
  padding: 8px 16px;
  border-radius: 999px;
  border: 2px dashed #ffd8cf;
  margin-bottom: 16px;
  color: #6b5a58;
}
.count strong { color: #ff8a80; font-size: 1.15rem; }
.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.entry-card {
  border: 2px solid;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 8px 18px rgba(74,62,61,0.08);
  transition: transform .25s ease, box-shadow .25s ease;
  display: flex; flex-direction: column; gap: 10px;
}
.entry-card:hover {
  transform: translateY(-4px) rotate(-0.4deg);
  box-shadow: 0 14px 26px rgba(74,62,61,0.14);
}
.entry-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.entry-num {
  color: #fff;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
}
.entry-name { margin: 0; font-size: 1.15rem; color: #4a3e3d; }
.entry-color-label {
  margin-left: auto;
  font-size: 0.8rem;
  color: #7a6b6a;
  background: rgba(255,255,255,0.6);
  padding: 2px 10px;
  border-radius: 999px;
}
.entry-content {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background: rgba(255,255,255,0.55);
  padding: 12px 14px;
  border-radius: 14px;
}
.entry-date {
  font-size: 0.85rem;
  color: #7a6b6a;
  text-align: right;
}
.rules { padding: 24px 28px; border: 2px solid #fff1e6; }
.rules ul { margin: 0; padding-left: 4px; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.rules li { background: #fffaf3; padding: 10px 14px; border-radius: 14px; border: 1px dashed #ffd8cf; }
.site-footer { max-width: 900px; margin: 0 auto; text-align: center; color: #7a6b6a; font-size: 0.95rem; }
.site-footer .small { font-size: 0.85rem; margin-top: 4px; }
`;
