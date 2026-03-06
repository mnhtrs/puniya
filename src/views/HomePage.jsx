import { useState, useEffect } from "react";
import { T, getCatColor } from "../constants/theme";
import { speakSv } from "../services/api";
import DictPage from "./DictPage";
import ReviewPage from "./ReviewPage";
import FlashcardPage from "./FlashcardPage";
import GrammarPage from "./GrammarPage";
import MatematikPage from "./MatematikPage";
import KemiPage from "./KemiPage";
import SkillsPage from "./SkillsPage";

const SAMPLE_WORDS = [
    { sv: "hej", vi: "xin chào", category: "Cơ bản", aiData: { ipa: "/hɛj/", pronunciation: "hây" } },
    { sv: "tack", vi: "cảm ơn", category: "Cơ bản", aiData: { ipa: "/takː/", pronunciation: "tắc" } },
    { sv: "förstår", vi: "hiểu", category: "Động từ", aiData: { ipa: "/fœˈstɔːr/", pronunciation: "phơ-stoa" } },
    { sv: "välkommen", vi: "chào mừng", category: "Cơ bản", aiData: { ipa: "/ˈvɛlˌkɔmːɛn/", pronunciation: "vel-cô-men" } },
    { sv: "Sverige", vi: "Thụy Điển", category: "Địa lý", aiData: { ipa: "/ˈsvɛrjɛ/", pronunciation: "svê-ri-ê" } },
];

export default function HomePage({ vocab, setVocab, streak, goHome }) {
    const today = new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" });
    const [sec, setSec] = useState("home");
    const [dailyWord, setDailyWord] = useState(null);

    useEffect(() => {
        function pick() {
            if (!vocab.length) {
                setDailyWord(SAMPLE_WORDS[Math.floor(Date.now() / 300000) % SAMPLE_WORDS.length]);
                return;
            }
            const minLvl = Math.min(...vocab.map((v) => v.srsLevel || 0));
            const hpPool = vocab.filter((v) => (v.srsLevel || 0) === minLvl);
            setDailyWord(hpPool[Math.floor(Math.random() * hpPool.length)]);
        }
        pick();
        const t = setInterval(pick, 5 * 60 * 1000);
        return () => clearInterval(t);
    }, [vocab]);

    const SRS_COLORS = ["#9ca3af", "#ec4899", "#f59e0b", "#3b82f6", "#22c55e"];
    const SRS_LABELS = ["Mới", "Đang học", "Quen", "Thành thạo", "Thuộc"];
    const srsCount = [0, 1, 2, 3, 4].map((lvl) => vocab.filter((v) => (v.srsLevel || 0) === lvl).length);
    const total = vocab.length;

    if (sec === "dict") return <DictPage vocab={vocab} setVocab={setVocab} onBack={() => setSec("home")} />;
    if (sec === "review") return <ReviewPage vocab={vocab} setVocab={setVocab} onBack={() => setSec("home")} />;
    if (sec === "flash") return <FlashcardPage vocab={vocab} onBack={() => setSec("home")} />;
    if (sec === "gram") return <GrammarPage onBack={() => setSec("home")} />;
    if (sec === "math") return <MatematikPage onBack={() => setSec("home")} />;
    if (sec === "chem") return <KemiPage onBack={() => setSec("home")} />;
    if (sec === "skills_listening") return <SkillsPage initialTab="listening" onBack={() => setSec("home")} />;
    if (sec === "skills_speaking") return <SkillsPage initialTab="speaking" onBack={() => setSec("home")} />;
    if (sec === "skills_reading") return <SkillsPage initialTab="reading" onBack={() => setSec("home")} />;
    if (sec === "skills_writing") return <SkillsPage initialTab="writing" onBack={() => setSec("home")} />;

    return (
        <div className="main">
            <div className="card card-g">
                <div style={{ fontSize: 12, color: T.textL, fontWeight: 600, marginBottom: 3 }}>{today}</div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>Chào mừng trở lại! 🌸</div>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <div style={{ fontSize: 13 }}>
                        <strong>{total}</strong> <span style={{ color: T.textL }}>từ</span>
                    </div>
                    <div style={{ fontSize: 13 }}>
                        🔥<strong>{streak}</strong>
                    </div>
                    <div style={{ fontSize: 13 }}>
                        ⭐<strong>{vocab.filter((v) => v.starred).length}</strong>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: T.text, letterSpacing: 0.3 }}>📊 Mức độ học thuộc</div>
                    <div style={{ fontSize: 11, color: T.textL, fontWeight: 700 }}>{total} từ trong sổ</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 90, marginBottom: 10, padding: "0 4px" }}>
                    {[1, 2, 3, 4].map((lvl) => {
                        const count = srsCount[lvl];
                        const pct = total > 0 ? (count / total) * 100 : 0;
                        const barH = total === 0 ? 3 : Math.max(pct * 0.82, count > 0 ? 8 : 3);
                        return (
                            <div key={lvl} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                                <div style={{ fontSize: 12, fontWeight: 900, color: count > 0 ? SRS_COLORS[lvl] : "#d1d5db", minHeight: 18, textAlign: "center" }}>
                                    {count > 0 ? count : "–"}
                                </div>
                                <div
                                    style={{
                                        width: "100%",
                                        height: barH,
                                        background: count > 0 ? SRS_COLORS[lvl] : "#f3f4f6",
                                        borderRadius: "6px 6px 0 0",
                                        transition: "height .6s cubic-bezier(.4,0,.2,1)",
                                        border: count === 0 ? `2px dashed #e5e7eb` : "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: "flex", gap: 8, padding: "0 4px" }}>
                    {[1, 2, 3, 4].map((lvl) => (
                        <div
                            key={lvl}
                            style={{
                                flex: 1,
                                textAlign: "center",
                                fontSize: 10,
                                fontWeight: 800,
                                color: srsCount[lvl] > 0 ? SRS_COLORS[lvl] : "#9ca3af",
                                lineHeight: 1.3,
                                borderTop: `3px solid ${srsCount[lvl] > 0 ? SRS_COLORS[lvl] : "#e5e7eb"}`,
                                paddingTop: 5,
                            }}
                        >
                            {SRS_LABELS[lvl]}
                        </div>
                    ))}
                </div>
                {total === 0 && (
                    <div style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: T.textL, fontStyle: "italic" }}>
                        Thêm từ vào sổ tay để xem thống kê học thuộc 👆
                    </div>
                )}
                {srsCount[0] > 0 && total > 0 && (
                    <div style={{ marginTop: 8, padding: "5px 10px", background: T.pinkP, borderRadius: 8, fontSize: 11, color: T.pink, fontWeight: 700, textAlign: "center" }}>
                        ⚠️ {srsCount[0]} từ mới chưa ôn lần nào
                    </div>
                )}
            </div>

            {dailyWord && (
                <div className="card" style={{ border: `2px solid ${T.pinkL}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 16 }}>💡</span>
                            <div style={{ fontSize: 12, fontWeight: 900, color: T.pink, letterSpacing: 0.3 }}>
                                {total === 0 ? "Từ mẫu hôm nay" : "Từ cần ôn hôm nay"}
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {total > 0 && (
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: SRS_COLORS[dailyWord.srsLevel || 0],
                                        background: SRS_COLORS[dailyWord.srsLevel || 0] + "22",
                                        borderRadius: 20,
                                        padding: "2px 8px",
                                        border: `1px solid ${SRS_COLORS[dailyWord.srsLevel || 0]}44`,
                                    }}
                                >
                                    {SRS_LABELS[dailyWord.srsLevel || 0]}
                                </span>
                            )}
                            {total > 0 && (
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[1, 2, 3, 4].map((lvl) => (
                                        <div
                                            key={lvl}
                                            style={{
                                                width: 12,
                                                height: 5,
                                                borderRadius: 3,
                                                background: lvl <= (dailyWord.srsLevel || 0) ? SRS_COLORS[dailyWord.srsLevel || 0] : "#e5e7eb",
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 32, fontWeight: 900, color: T.pink, lineHeight: 1.1, marginBottom: 4 }}>{dailyWord.sv}</div>
                            {dailyWord.aiData?.ipa && (
                                <code style={{ fontSize: 12, color: T.purple, background: T.purpleL, padding: "2px 8px", borderRadius: 6, display: "inline-block", marginBottom: 4, fontWeight: 700 }}>
                                    {dailyWord.aiData.ipa}
                                </code>
                            )}
                            {dailyWord.aiData?.pronunciation && (
                                <div style={{ fontSize: 12, color: T.textL, marginBottom: 6, cursor: "pointer", fontWeight: 600 }} onClick={() => speakSv(dailyWord.sv)}>
                                    🔊 /{dailyWord.aiData.pronunciation}/
                                </div>
                            )}
                            <div style={{ fontSize: 17, color: T.text, fontWeight: 700, marginBottom: 4 }}>{dailyWord.vi}</div>
                            {dailyWord.category && <span className="bdg bdg-pk">{dailyWord.category}</span>}
                        </div>
                        <button className="btn btn-p" style={{ flexShrink: 0, width: 44, height: 44, padding: 0, fontSize: 20 }} onClick={() => speakSv(dailyWord.sv)}>
                            🔊
                        </button>
                    </div>
                </div>
            )}

            <div className="sec-title">📚 Công cụ học</div>
            <div className="qa">
                {[
                    { ico: "🃏", title: "Flashcard", desc: "Lật thẻ nhớ", color: "#F0F0FF", fn: () => setSec("flash") },
                    { ico: "✏️", title: "Ngữ pháp", desc: "14 chủ điểm", color: "#FFF8E1", fn: () => setSec("gram") },
                    { ico: "🔎", title: "Từ điển", desc: "Kiểu Cambridge", color: "#E0F7FA", fn: () => setSec("dict") },
                    { ico: "🎯", title: "Ôn tập", desc: "Duolingo-style", color: T.pinkP, fn: () => setSec("review") },
                ].map((a) => (
                    <button key={a.title} className="qa-btn" style={{ background: a.color }} onClick={a.fn}>
                        <span className="qa-ico">{a.ico}</span>
                        <span className="qa-title">{a.title}</span>
                        <span className="qa-desc">{a.desc}</span>
                    </button>
                ))}
            </div>

            <div className="sec-title">🎓 Luyện 4 kỹ năng</div>
            <div className="qa">
                {[
                    { ico: "🎧", title: "Nghe", desc: "Luyện nghe hiểu", color: "#FFF0F6", fn: () => setSec("skills_listening") },
                    { ico: "🗣️", title: "Nói", desc: "Luyện phát âm", color: T.purpleL, fn: () => setSec("skills_speaking") },
                    { ico: "📖", title: "Đọc", desc: "Đọc hiểu văn bản", color: T.mintL, fn: () => setSec("skills_reading") },
                    { ico: "✍️", title: "Viết", desc: "Luyện viết câu", color: "#FEF3C7", fn: () => setSec("skills_writing") },
                ].map((a) => (
                    <button key={a.title} className="qa-btn" style={{ background: a.color }} onClick={a.fn}>
                        <span className="qa-ico">{a.ico}</span>
                        <span className="qa-title">{a.title}</span>
                        <span className="qa-desc">{a.desc}</span>
                    </button>
                ))}
            </div>

            <div className="sec-title">🔬 Khoa học</div>
            <div className="qa">
                <button className="qa-btn" style={{ background: "#EEF2FF" }} onClick={() => setSec("math")}>
                    <span className="qa-ico">🔢</span>
                    <span className="qa-title">Toán học</span>
                    <span className="qa-desc">Åk 7–9 + Gymnasium</span>
                </button>
                <button className="qa-btn" style={{ background: "#F0FFF4" }} onClick={() => setSec("chem")}>
                    <span className="qa-ico">⚗️</span>
                    <span className="qa-title">Hóa học</span>
                    <span className="qa-desc">Åk 7–9 + Gymnasium</span>
                </button>
            </div>

            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 800, color: T.pink, marginBottom: 8 }}>💡 Mẹo phát âm</div>
                <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                    <strong style={{ color: T.pink }}>sj/skj/sch/stj</strong> → /ɧ/ (thổi hơi cả hai bên miệng)
                    <br />
                    <em>sjö, skjuta, schema, stjärna</em>
                    <br />
                    <strong style={{ color: T.pink }}>tj/kj/k(e,i,y,ä,ö)</strong> → /ɕ/ (giống "ch" nhẹ)
                    <br />
                    <em>tjugo, kjol, kina, kyrka</em>
                </div>
            </div>
        </div>
    );
}
