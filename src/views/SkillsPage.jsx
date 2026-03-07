import { useState, useEffect } from "react";
import { T } from "../constants/theme";
import { speakSv, aiWritingFeedback } from "../services/api";
import { LISTENINGS, SPEAKINGS, READINGS, WRITINGS } from "../constants/skillsData";
import { SvFlag } from "../components/SvFlag";
import { VnFlag } from "../components/VnFlag";

export default function SkillsPage({ initialTab, onBack }) {
    const [tab, setTab] = useState(initialTab || "listening");
    const [lIdx, setLIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [showTrans, setShowTrans] = useState(false);
    const [sIdx, setSIdx] = useState(0);
    const [recording, setRecording] = useState(false);
    const [rIdx, setRIdx] = useState(0);
    const [showAns, setShowAns] = useState({});
    const [showRT, setShowRT] = useState(false);
    const [wIdx, setWIdx] = useState(0);
    const [wText, setWText] = useState("");
    const [wFeedback, setWFeedback] = useState("");
    const [loadingFB, setLoadingFB] = useState(false);

    useEffect(() => {
        if (initialTab) setTab(initialTab);
    }, [initialTab]);

    function playAudio(text) {
        setPlaying(true);
        setShowTrans(false);
        speakSv(text);
        setTimeout(() => setPlaying(false), text.length * 75 + 600);
    }

    async function getFeedback() {
        if (!wText.trim()) return;
        setLoadingFB(true);
        setWFeedback("");
        const fb = await aiWritingFeedback(wText, WRITINGS[wIdx].prompt);
        setWFeedback(fb);
        setLoadingFB(false);
    }

    const skillTabs = [
        { id: "listening", label: "👂 Nghe" },
        { id: "speaking", label: "🗣️ Nói" },
        { id: "reading", label: "📖 Đọc" },
        { id: "writing", label: "✍️ Viết" },
    ];

    return (
        <div className="main">
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
                <button className="btn btn-s" style={{ fontSize: 12, padding: "5px 12px" }} onClick={onBack}>
                    ← Trang chủ
                </button>
                <div className="sec-title" style={{ marginBottom: 0 }}>🎓 Luyện kỹ năng</div>
            </div>
            <div className="tabs">
                {skillTabs.map((t) => (
                    <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                        {t.label}
                    </div>
                ))}
            </div>

            {/* LISTENING */}
            {tab === "listening" && (
                <div>
                    <div className="tabs">
                        {LISTENINGS.map((e, i) => (
                            <div
                                key={e.id}
                                className={`tab ${lIdx === i ? "active" : ""}`}
                                onClick={() => {
                                    setLIdx(i);
                                    setShowTrans(false);
                                }}
                            >
                                Bài {i + 1}
                            </div>
                        ))}
                    </div>
                    <div className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <span className="bdg bdg-pk">{LISTENINGS[lIdx].level}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: T.textL }}>{LISTENINGS[lIdx].title}</span>
                        </div>
                        <div className="audio-pl">
                            {playing ? (
                                <div className="wave">
                                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                        <div key={n} className="wbar" style={{ animationDelay: `${n * 0.1}s` }} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ fontSize: 44 }}>🎧</div>
                            )}
                            <div style={{ fontSize: 13, color: T.textL, fontWeight: 600 }}>{playing ? "Đang phát..." : "Nhấn nghe"}</div>
                            <button className="btn btn-p" onClick={() => playAudio(LISTENINGS[lIdx].text)} disabled={playing}>
                                {playing ? "⏸ Đang phát" : "▶ Nghe"}
                            </button>
                        </div>
                    </div>
                    <div className="card">
                        <div style={{ fontSize: 14, fontWeight: 800, color: T.pink, marginBottom: 9, display: "flex", alignItems: "center", gap: 6 }}>
                            <SvFlag size={14} /> Văn bản
                        </div>
                        <div style={{ fontSize: 15, lineHeight: 1.85, fontWeight: 600 }}>{LISTENINGS[lIdx].text}</div>
                        <button className="btn btn-s btn-sm" style={{ marginTop: 11 }} onClick={() => setShowTrans((s) => !s)}>
                            {showTrans ? "🙈 Ẩn dịch" : "👀 Xem dịch"}
                        </button>
                        {showTrans && <div style={{ marginTop: 10, padding: 12, background: T.pinkP, borderRadius: 12, fontSize: 13, color: T.textL, lineHeight: 1.7, display: "flex", gap: 8, alignItems: "flex-start" }}><VnFlag size={14} style={{ marginTop: 2, flexShrink: 0 }} /> <span>{LISTENINGS[lIdx].translation}</span></div>}
                    </div>
                    <div className="card">
                        <div style={{ fontSize: 14, fontWeight: 800, color: T.pink, marginBottom: 9, display: "flex", alignItems: "center", gap: 6 }}>
                            📚 Từ vựng <SvFlag size={14} /> <VnFlag size={14} />
                        </div>
                        {LISTENINGS[lIdx].vocab.map((v, i) => {
                            const [sv, vi] = v.split(" = ");
                            return (
                                <div key={i} className="vi-item" style={{ marginBottom: 7, padding: "10px 14px" }} onClick={() => speakSv(sv)}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                                        <SvFlag size={14} />
                                        <span style={{ fontSize: 15, fontWeight: 800, color: T.pink }}>{sv}</span>
                                        <span style={{ color: T.textL, margin: "0 6px" }}>→</span>
                                        <VnFlag size={14} />
                                        <span style={{ fontSize: 14, color: T.textL }}>{vi}</span>
                                    </div>
                                    <span style={{ marginLeft: "auto", fontSize: 14 }}>🔊</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* SPEAKING */}
            {tab === "speaking" && (
                <div>
                    <div className="tabs">
                        {SPEAKINGS.map((e, i) => (
                            <div key={e.id} className={`tab ${sIdx === i ? "active" : ""}`} onClick={() => setSIdx(i)}>
                                Bài {i + 1}
                            </div>
                        ))}
                    </div>
                    <div className="card card-g">
                        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>🗣️ {SPEAKINGS[sIdx].title}</div>
                        <div style={{ fontSize: 14, color: T.textL, lineHeight: 1.65, marginBottom: 10 }}>{SPEAKINGS[sIdx].hint}</div>
                        <div style={{ background: "white", borderRadius: 12, padding: "10px 13px", border: `1px solid ${T.border}` }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: T.textL, marginBottom: 5 }}>Câu mẫu:</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: T.pink, lineHeight: 1.75 }}>{SPEAKINGS[sIdx].example}</div>
                        </div>
                    </div>
                    <div className="card" style={{ textAlign: "center", padding: 26 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 15 }}>{recording ? "🔴 Đang luyện nói..." : "Nhấn để bắt đầu luyện nói"}</div>
                        <button className={`rec-btn ${recording ? "on" : ""}`} onClick={() => setRecording((r) => !r)}>
                            {recording ? "⏹" : "🎤"}
                        </button>
                        <div style={{ fontSize: 12, color: T.textL, marginTop: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            {recording ? "🔴 Đang đọc mẫu..." : <><SvFlag size={14} /> Luyện phát âm Thuỵ Điển</>}
                        </div>
                    </div>
                    <div className="card">
                        <div style={{ fontSize: 14, fontWeight: 800, color: T.pink, marginBottom: 9 }}>💡 Nghe phát âm chuẩn</div>
                        <button className="btn btn-p" style={{ width: "100%" }} onClick={() => speakSv(SPEAKINGS[sIdx].example)}>
                            🔊 Nghe câu mẫu
                        </button>
                    </div>
                </div>
            )}

            {/* READING */}
            {tab === "reading" && (
                <div>
                    <div className="tabs">
                        {READINGS.map((r, i) => (
                            <div
                                key={r.id}
                                className={`tab ${rIdx === i ? "active" : ""}`}
                                onClick={() => {
                                    setRIdx(i);
                                    setShowAns({});
                                    setShowRT(false);
                                }}
                            >
                                Bài {i + 1}
                            </div>
                        ))}
                    </div>
                    <div className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
                            <div style={{ fontSize: 16, fontWeight: 800 }}>{READINGS[rIdx].title}</div>
                            <span className="bdg bdg-pk">{READINGS[rIdx].level}</span>
                        </div>
                        <div style={{ fontSize: 15, lineHeight: 1.9, fontWeight: 500, marginBottom: 11 }}>{READINGS[rIdx].text}</div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn btn-s btn-sm" onClick={() => speakSv(READINGS[rIdx].text)} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                🔊 Nghe
                            </button>
                            <button className="btn btn-s btn-sm" onClick={() => setShowRT((s) => !s)} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <VnFlag size={12} /> {showRT ? "Ẩn" : "Dịch"}
                            </button>
                        </div>
                        {showRT && (
                            <div style={{ marginTop: 11, padding: 12, background: T.pinkP, borderRadius: 12, fontSize: 13, color: T.textL, lineHeight: 1.75, borderLeft: `3px solid ${T.pink}`, display: "flex", gap: 8 }}>
                                <VnFlag size={14} style={{ marginTop: 3, flexShrink: 0 }} /> <span>{READINGS[rIdx].translation}</span>
                            </div>
                        )}
                    </div>
                    <div className="card">
                        <div style={{ fontSize: 14, fontWeight: 800, color: T.pink, marginBottom: 11 }}>❓ Câu hỏi</div>
                        {READINGS[rIdx].questions.map((q, i) => (
                            <div key={i} style={{ marginBottom: 13 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                                    {i + 1}. {q.q}
                                </div>
                                <div style={{ fontSize: 12, color: T.textL, marginBottom: 7 }}>({q.vi})</div>
                                <button className="btn btn-s btn-sm" onClick={() => setShowAns((p) => ({ ...p, [i]: !p[i] }))}>
                                    {showAns[i] ? "🙈 Ẩn" : "💡 Đáp án"}
                                </button>
                                {showAns[i] && <div style={{ marginTop: 7, padding: "8px 12px", background: "#D1FAE5", borderRadius: 10, fontSize: 14, fontWeight: 700, color: "#059669" }}>✅ {q.a}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* WRITING */}
            {tab === "writing" && (
                <div>
                    <div className="tabs">
                        {WRITINGS.map((w, i) => (
                            <div
                                key={w.id}
                                className={`tab ${wIdx === i ? "active" : ""}`}
                                onClick={() => {
                                    setWIdx(i);
                                    setWText("");
                                    setWFeedback("");
                                }}
                            >
                                Bài {i + 1}
                            </div>
                        ))}
                    </div>
                    <div className="card card-g">
                        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 7 }}>{WRITINGS[wIdx].title}</div>
                        <div style={{ fontSize: 14, color: T.textL, lineHeight: 1.65, marginBottom: 9 }}>{WRITINGS[wIdx].prompt}</div>
                        <div style={{ background: "white", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: T.pink, fontWeight: 600 }}>💡 {WRITINGS[wIdx].tip}</div>
                    </div>
                    <div className="card">
                        <div style={{ fontSize: 14, fontWeight: 800, color: T.pink, marginBottom: 9, display: "flex", alignItems: "center", gap: 5 }}>
                            ✍️ <SvFlag size={14} /> Viết tiếng Thụy Điển
                        </div>
                        <textarea className="warea" placeholder="Viết tiếng Thụy Điển vào đây..." value={wText} onChange={(e) => setWText(e.target.value)} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 9 }}>
                            <span style={{ fontSize: 12, color: T.textL }}>{wText.length} ký tự</span>
                            <button className="btn btn-p btn-sm" onClick={getFeedback} disabled={!wText.trim() || loadingFB}>
                                {loadingFB ? "⏳ Đang chấm..." : "🤖 Nhận xét AI"}
                            </button>
                        </div>
                    </div>
                    {wFeedback && (
                        <div className="card">
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#C084FC", marginBottom: 9 }}>🤖 Nhận xét</div>
                            <div style={{ fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{wFeedback}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
