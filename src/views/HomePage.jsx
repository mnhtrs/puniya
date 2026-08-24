import { useState, useEffect } from "react";
import { T } from "../constants/theme";
import { speakSv } from "../services/api";
import { SvFlag } from "../components/SvFlag";
import DictPage from "./DictPage";
import ReviewPage from "./ReviewPage";
import FlashcardPage from "./FlashcardPage";
import GrammarPage from "./GrammarPage";
import MatematikPage from "./MatematikPage";
import KemiPage from "./KemiPage";
import SkillsPage from "./SkillsPage";

export default function HomePage({ vocab, setVocab, streak }) {
    const [sec, setSec] = useState(() => {
        return new URLSearchParams(window.location.search).get("q") ? "dict" : "home";
    });
    const [dailyWord, setDailyWord] = useState(null);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handlePop = () => {
            const q = new URLSearchParams(window.location.search).get("q");
            if (q) setSec("dict");
            else setSec("home");
        };
        const resetHome = () => {
            setSec("home");
            if (window.location.search) {
                const url = new URL(window.location);
                url.searchParams.delete("q");
                window.history.pushState({}, "", url);
            }
        };
        window.addEventListener("popstate", handlePop);
        window.addEventListener("goHomeSignal", resetHome);
        return () => {
            window.removeEventListener("popstate", handlePop);
            window.removeEventListener("goHomeSignal", resetHome);
        };
    }, []);

    const timeStr = time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const dateStr = time.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const svMonth = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"][time.getMonth()];
    const clockAndDate = `Klockan är ${timeStr}, den ${time.getDate()} ${svMonth} ${time.getFullYear()} (${dateStr})`;

    useEffect(() => {
        function pick() {
            if (!vocab.length) {
                setDailyWord({
                    sv: "stygg",
                    vi: "nghịch ngợm, bướng bỉnh / xấu tính",
                    category: "Tính từ",
                    aiData: { ipa: "/stʏɡ/", pronunciation: "stuyg" },
                    srsLevel: 1
                });
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
            {/* Welcome banner */}
            <div className="card card-g" style={{ padding: "22px 24px" }}>
                <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, color: "#2D1B2D", display: "flex", alignItems: "center", gap: 8 }}>
                        <span>Chào mừng trở lại!</span>
                        <span>🌸</span>
                    </div>
                    <div style={{ fontSize: 13, color: T.text, fontWeight: 700, lineHeight: 1.6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <SvFlag size={16} /> <span style={{ color: "#E64980", fontWeight: 800 }}>{clockAndDate}</span>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 16, paddingTop: 14, borderTop: "1px solid rgba(255,107,157,0.15)", flexWrap: "wrap" }}>
                    <div style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fa-solid fa-bullseye" style={{ color: "#FF6B9D", fontSize: 14 }}></i>
                        <strong>{total}</strong> <span style={{ color: T.textL }}>từ đã lưu</span>
                    </div>
                    <div style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fa-solid fa-fire" style={{ color: "#FF6B6B", fontSize: 14 }}></i>
                        <strong>{streak}</strong> <span style={{ color: T.textL }}>ngày liên tiếp</span>
                    </div>
                    <div style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fa-solid fa-star" style={{ color: "#F59E0B", fontSize: 14 }}></i>
                        <strong>{vocab.filter((v) => v.starred).length}</strong> <span style={{ color: T.textL }}>yêu thích</span>
                    </div>
                </div>
            </div>

            {/* SRS Progress Chart */}
            <div className="card" style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#2D1B2D", display: "flex", alignItems: "center", gap: 8 }}>
                        <i className="fa-solid fa-chart-simple" style={{ color: "#A855F7" }}></i>
                        <span>Tiến độ ghi nhớ (SRS)</span>
                    </div>
                    <div className="bdg bdg-pk" style={{ fontSize: 11 }}>{total} từ vựng</div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 160, marginBottom: 12, padding: "0 4px" }}>
                    {[0, 1, 2, 3, 4].map((lvl) => {
                        const count = srsCount[lvl];
                        const pct = total > 0 ? (count / total) * 100 : 0;
                        const barH = total === 0 ? 6 : Math.max(pct * 1.2, count > 0 ? 16 : 6);
                        return (
                            <div key={lvl} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: count > 0 ? SRS_COLORS[lvl] : "#94a3b8" }}>{count}</div>
                                <div
                                    style={{
                                        width: "100%",
                                        height: barH,
                                        background: count > 0 ? SRS_COLORS[lvl] : "#F1F5F9",
                                        borderRadius: "8px 8px 0 0",
                                        transition: "height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                                        boxShadow: count > 0 ? `0 4px 12px ${SRS_COLORS[lvl]}33` : "none",
                                        border: count === 0 ? "1.5px dashed #E2E8F0" : "none",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    {[0, 1, 2, 3, 4].map((lvl) => (
                        <div key={lvl} style={{
                            flex: 1, textAlign: "center", fontSize: 10, fontWeight: 800,
                            color: srsCount[lvl] > 0 ? SRS_COLORS[lvl] : "#94a3b8",
                            borderTop: `3px solid ${srsCount[lvl] > 0 ? SRS_COLORS[lvl] : "#F1F5F9"}`,
                            paddingTop: 6, opacity: 0.95
                        }}>
                            {SRS_LABELS[lvl]}
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Word */}
            {dailyWord && (
                <div className="card card-g" style={{ padding: "24px 26px", position: "relative", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 18 }}>🌸</span>
                            <div style={{ fontSize: 13, fontWeight: 900, color: "#E64980", letterSpacing: 0.5, textTransform: "uppercase" }}>
                                {total === 0 ? "Từ vựng hôm nay (Ví dụ)" : "Hãy ôn tập từ này"}
                            </div>
                        </div>
                        {total > 0 && (
                            <div style={{ display: "flex", gap: 3 }}>
                                {[1, 2, 3, 4].map((lvl) => (
                                    <div key={lvl} style={{
                                        width: 14, height: 6, borderRadius: 3,
                                        background: lvl <= (dailyWord.srsLevel || 0) ? (dailyWord.srsLevel >= 4 ? "#22c55e" : "#ec4899") : "#E5E7EB"
                                    }} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 40, fontWeight: 900, color: "#FF6B9D", lineHeight: 1.1, marginBottom: 8, letterSpacing: -0.5 }}>{dailyWord.sv}</div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                                {dailyWord.aiData?.ipa && (
                                    <div className="pron-pill" onClick={() => speakSv(dailyWord.sv)} style={{ fontSize: 13, padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                                        <i className="fa-solid fa-volume-high"></i>
                                        <span>{dailyWord.aiData.ipa}</span>
                                    </div>
                                )}
                                {dailyWord.category && <span className="bdg bdg-pu" style={{ fontSize: 11, padding: "3px 10px" }}>{dailyWord.category}</span>}
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#2D1B2D", opacity: 0.9 }}>{dailyWord.vi}</div>
                        </div>
                        <button className="btn btn-p" style={{ width: 56, height: 56, borderRadius: 18, fontSize: 20, flexShrink: 0 }} onClick={() => speakSv(dailyWord.sv)} title="Nghe phát âm chuẩn Thụy Điển">
                            <i className="fa-solid fa-volume-high"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Learning Tools */}
            <div className="sec-title">
                <i className="fa-solid fa-book-open" style={{ color: "#FF6B9D" }}></i>
                <span>Công cụ học tập</span>
            </div>
            <div className="qa">
                {[
                    { icon: "fa-solid fa-clone", title: "Flashcard", desc: "Lật thẻ ghi nhớ", color: "#F0F4FF", fn: () => setSec("flash") },
                    { icon: "fa-solid fa-book", title: "Ngữ pháp", desc: "14 chủ điểm chuẩn", color: "#FFF9E6", fn: () => setSec("gram") },
                    { icon: "fa-solid fa-book-bookmark", title: "Từ điển", desc: "Kiểu Cambridge", color: "#E6FAFA", fn: () => setSec("dict") },
                    { icon: "fa-solid fa-bullseye", title: "Ôn tập", desc: "Trắc nghiệm & gõ từ", color: "#FFF0F6", fn: () => setSec("review") },
                ].map((a) => (
                    <button key={a.title} className="qa-btn" style={{ background: a.color }} onClick={a.fn}>
                        <span className="qa-ico" style={{ color: "#FF6B9D" }}>
                            <i className={a.icon}></i>
                        </span>
                        <span className="qa-title">{a.title}</span>
                        <span className="qa-desc">{a.desc}</span>
                    </button>
                ))}
            </div>

            {/* 4 Skills */}
            <div className="sec-title">
                <i className="fa-solid fa-graduation-cap" style={{ color: "#A855F7" }}></i>
                <span>Luyện 4 kỹ năng</span>
            </div>
            <div className="qa">
                {[
                    { icon: "fa-solid fa-headphones", title: "Luyện nghe", desc: "Nghe audio Thụy Điển", color: "#FFF0F6", fn: () => setSec("skills_listening") },
                    { icon: "fa-solid fa-microphone", title: "Luyện nói", desc: "Phát âm & câu mẫu", color: "#F5EEFF", fn: () => setSec("skills_speaking") },
                    { icon: "fa-solid fa-book-open-reader", title: "Luyện đọc", desc: "Đoạn văn & câu hỏi", color: "#EBFBEE", fn: () => setSec("skills_reading") },
                    { icon: "fa-solid fa-pen-to-square", title: "Luyện viết", desc: "AI sửa & nhận xét", color: "#FEF7E6", fn: () => setSec("skills_writing") },
                ].map((a) => (
                    <button key={a.title} className="qa-btn" style={{ background: a.color }} onClick={a.fn}>
                        <span className="qa-ico" style={{ color: "#A855F7" }}>
                            <i className={a.icon}></i>
                        </span>
                        <span className="qa-title">{a.title}</span>
                        <span className="qa-desc">{a.desc}</span>
                    </button>
                ))}
            </div>

            {/* Science */}
            <div className="sec-title">
                <i className="fa-solid fa-flask" style={{ color: "#3B82F6" }}></i>
                <span>Khoa học Thụy Điển</span>
            </div>
            <div className="qa">
                <button className="qa-btn" style={{ background: "#EEF2FF" }} onClick={() => setSec("math")}>
                    <span className="qa-ico" style={{ color: "#3B82F6" }}>
                        <i className="fa-solid fa-calculator"></i>
                    </span>
                    <span className="qa-title">Toán học</span>
                    <span className="qa-desc">Åk 7–9 + Gymnasium</span>
                </button>
                <button className="qa-btn" style={{ background: "#F0FFF4" }} onClick={() => setSec("chem")}>
                    <span className="qa-ico" style={{ color: "#10B981" }}>
                        <i className="fa-solid fa-flask"></i>
                    </span>
                    <span className="qa-title">Hóa học</span>
                    <span className="qa-desc">Åk 7–9 + Gymnasium</span>
                </button>
            </div>

            {/* Pronunciation tips */}
            <div className="card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#FF6B9D", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fa-solid fa-lightbulb" style={{ color: "#F59E0B" }}></i>
                    <span>Mẹo phát âm tiếng Thụy Điển</span>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.8, color: "#2D1B2D" }}>
                    <strong style={{ color: "#FF6B9D" }}>sj/skj/sch/stj</strong> → /ɧ/ (thổi hơi cả hai bên miệng): <em>sjö, skjuta, schema, stjärna</em>
                    <br />
                    <strong style={{ color: "#FF6B9D" }}>tj/kj/k(e,i,y,ä,ö)</strong> → /ɕ/ (giống "ch" nhẹ): <em>tjugo, kjol, kina, kyrka</em>
                </div>
            </div>
        </div>
    );
}
