import { useState, useEffect } from "react";
import { T, getCatColor } from "../constants/theme";
import { speakSv } from "../services/api";
import { SvFlag } from "../components/SvFlag";
import { VnFlag } from "../components/VnFlag";
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
    const [sec, setSec] = useState("home");
    const [dailyWord, setDailyWord] = useState(null);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeStr = time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const dateStr = time.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const svMonth = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"][time.getMonth()];
    const clockAndDate = `Klockan är ${timeStr}, den ${time.getDate()} ${svMonth} ${time.getFullYear()} (${dateStr})`;

    useEffect(() => {
        function pick() {
            if (!vocab.length) {
                setDailyWord(null);
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

    const SRS_COLORS = ["#94a3b8", "#f472b6", "#fbbf24", "#60a5fa", "#34d399"];
    const SRS_LABELS = ["Chưa học", "Đang học", "Đang thuộc", "Đã thuộc", "Thành thạo"];
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
            <div className="card card-g" style={{ padding: "20px 24px" }}>
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Chào mừng trở lại! 🌸</div>
                    <div style={{ fontSize: 13, color: T.text, fontWeight: 700, lineHeight: 1.7, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <SvFlag size={16} /> <span style={{ color: T.pink, fontWeight: 900 }}>{clockAndDate}</span>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 20, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                    <div style={{ fontSize: 14 }}>🎯 <strong>{total}</strong> <span style={{ color: T.textL }}>từ đã lưu</span></div>
                    <div style={{ fontSize: 14 }}>🔥 <strong>{streak}</strong> <span style={{ color: T.textL }}>ngày</span></div>
                    <div style={{ fontSize: 14 }}>⭐ <strong>{vocab.filter((v) => v.starred).length}</strong> <span style={{ color: T.textL }}>yêu thích</span></div>
                </div>
            </div>

            <div className="card" style={{ padding: "18px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: T.text }}>📊 Thống kê tiến độ ghi nhớ</div>
                    <div className="bdg bdg-pk" style={{ fontSize: 11 }}>{total} từ vựng</div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 220, marginBottom: 12, padding: "0 5px" }}>
                    {[0, 1, 2, 3, 4].map((lvl) => {
                        const count = srsCount[lvl];
                        const pct = total > 0 ? (count / total) * 100 : 0;
                        const barH = total === 0 ? 4 : Math.max(pct * 1.1, count > 0 ? 12 : 4);
                        return (
                            <div key={lvl} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                                <div style={{ fontSize: 13, fontWeight: 900, color: count > 0 ? SRS_COLORS[lvl] : "#94a3b8" }}>{count}</div>
                                <div
                                    style={{
                                        width: "100%",
                                        height: barH,
                                        background: count > 0 ? SRS_COLORS[lvl] : "#f1f5f9",
                                        borderRadius: "8px 8px 0 0",
                                        transition: "height 0.8s ease-out",
                                        boxShadow: count > 0 ? `0 4px 12px ${SRS_COLORS[lvl]}22` : "none",
                                        border: count === 0 ? "2px dashed #e2e8f0" : "none",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                    {[0, 1, 2, 3, 4].map((lvl) => (
                        <div key={lvl} style={{
                            flex: 1, textAlign: "center", fontSize: 10, fontWeight: 800,
                            color: srsCount[lvl] > 0 ? SRS_COLORS[lvl] : "#94a3b8",
                            borderTop: `4px solid ${srsCount[lvl] > 0 ? SRS_COLORS[lvl] : "#f1f5f9"}`,
                            paddingTop: 6, opacity: 0.9
                        }}>
                            {SRS_LABELS[lvl]}
                        </div>
                    ))}
                </div>
            </div>

            {dailyWord && (
                <div className="card card-g" style={{ padding: "24px 30px", border: `2px solid ${T.pinkL}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", right: -20, top: -20, opacity: 0.1, transform: "rotate(-15deg)", pointerEvents: "none" }}>
                        <SvFlag size={120} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 20 }}>🌟</span>
                            <div style={{ fontSize: 14, fontWeight: 900, color: T.pink, letterSpacing: 0.5, textTransform: "uppercase" }}>
                                {total === 0 ? "Từ vựng (Ví dụ)" : "Hãy ôn tập từ này"}
                            </div>
                        </div>
                        {total > 0 && (
                            <div style={{ display: "flex", gap: 3 }}>
                                {[1, 2, 3, 4].map((lvl) => (
                                    <div key={lvl} style={{
                                        width: 14, height: 6, borderRadius: 3,
                                        background: lvl <= (dailyWord.srsLevel || 0) ? (dailyWord.srsLevel >= 4 ? "#22c55e" : "#ec4899") : "#e5e7eb"
                                    }} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 48, fontWeight: 900, color: T.pink, lineHeight: 1.1, marginBottom: 8, letterSpacing: -1 }}>{dailyWord.sv}</div>
                            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                                {dailyWord.aiData?.pronunciation && (
                                    <div className="pron-pill" onClick={() => speakSv(dailyWord.sv)} style={{ fontSize: 14, padding: "6px 14px" }}>
                                        🔊 /{dailyWord.aiData.pronunciation}/
                                    </div>
                                )}
                                {dailyWord.category && <span className="bdg bdg-pu" style={{ fontSize: 12, padding: "4px 12px" }}>{dailyWord.category}</span>}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: T.text, opacity: 0.9 }}>{dailyWord.vi}</div>
                        </div>
                        <button className="btn btn-p" style={{ width: 64, height: 64, borderRadius: 20, fontSize: 30, boxShadow: "0 10px 25px rgba(255,107,157,0.3)" }} onClick={() => speakSv(dailyWord.sv)}>
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
