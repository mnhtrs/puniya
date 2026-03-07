import { useState, useEffect } from "react";
import { T } from "../constants/theme";
import { speakSv } from "../services/api";
import { SvFlag } from "../components/SvFlag";
import { VnFlag } from "../components/VnFlag";

export default function FlashcardPage({ vocab, onBack }) {
    const [cat, setCat] = useState("Tất cả");
    const [mode, setMode] = useState("sv-vi");
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [pool, setPool] = useState([]);

    useEffect(() => {
        const filtered = cat === "Tất cả" ? vocab : vocab.filter((v) => v.category === cat);
        // Shuffle for better learning
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setPool(shuffled);
        setIdx(0);
        setFlipped(false);
    }, [cat, mode, vocab]); // Removed vocab.length, use vocab directly for robustness

    const fcCats = ["Tất cả", ...new Set(vocab.map((v) => v.category).filter(Boolean))];
    const filtered = cat === "Tất cả" ? vocab : vocab.filter((v) => v.category === cat);

    const card = pool[idx];
    const total = pool.length;

    function prev() {
        setIdx((i) => Math.max(0, i - 1));
        setFlipped(false);
    }
    function next() {
        setIdx((i) => Math.min(total - 1, i + 1));
        setFlipped(false);
    }

    if (vocab.length === 0) {
        return (
            <div className="main">
                <button className="btn btn-s" style={{ marginBottom: 14, fontSize: 12, padding: "5px 12px" }} onClick={onBack}>
                    ← Trang chủ
                </button>
                <div className="empty">
                    <div className="e-ico">🃏</div>
                    <p>Thêm từ vào sổ tay trước nhé!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main">
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
                <button className="btn btn-s" style={{ fontSize: 12, padding: "5px 12px" }} onClick={onBack}>
                    ← Trang chủ
                </button>
                <div className="sec-title" style={{ marginBottom: 0 }}>🃏 Flashcard</div>
            </div>
            <div className="tabs">
                <div
                    className={`tab ${mode === "sv-vi" ? "active" : ""}`}
                    onClick={() => {
                        setMode("sv-vi");
                        setIdx(0);
                        setFlipped(false);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                    <SvFlag size={14} /> → <VnFlag size={14} />
                </div>
                <div
                    className={`tab ${mode === "vi-sv" ? "active" : ""}`}
                    onClick={() => {
                        setMode("vi-sv");
                        setIdx(0);
                        setFlipped(false);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                    <VnFlag size={14} /> → <SvFlag size={14} />
                </div>
                {fcCats.map((c) => (
                    <div key={c} className={`tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
                        {c}
                    </div>
                ))}
            </div>

            {filtered.length < 1 ? (
                <div className="empty">
                    <div className="e-ico">🃏</div>
                    <p>Không có từ trong nhóm này</p>
                </div>
            ) : card ? (
                <>
                    <div style={{ textAlign: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: T.textL, fontWeight: 700 }}>
                            {idx + 1} / {total}
                        </span>
                        <div style={{ height: 5, background: T.border, borderRadius: 3, marginTop: 6 }}>
                            <div
                                style={{
                                    height: "100%",
                                    width: `${((idx + 1) / total) * 100}%`,
                                    background: `linear-gradient(90deg,${T.pink},${T.purple})`,
                                    borderRadius: 3,
                                    transition: "width .3s",
                                }}
                            />
                        </div>
                    </div>

                    <div className="fc-wrap" onClick={() => setFlipped((f) => !f)}>
                        <div className={`fc-inner ${flipped ? "flipped" : ""}`}>
                            <div className="fc-face fc-front">
                                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                    {mode === "sv-vi" ? <><SvFlag size={14} /> Tiếng Thụy Điển</> : <><VnFlag size={14} /> Tiếng Việt</>}
                                </div>
                                <div style={{ fontSize: 30, fontWeight: 900, color: "white", textAlign: "center" }}>{mode === "sv-vi" ? card.sv : card.vi}</div>
                                {mode === "sv-vi" && card.aiData?.ipa && <div style={{ fontSize: 13, opacity: 0.8, marginTop: 8, fontFamily: "monospace" }}>{card.aiData.ipa}</div>}
                                {mode === "sv-vi" && card.aiData?.pronunciation && <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>/{card.aiData.pronunciation}/</div>}
                                {card.category && (
                                    <span className="bdg" style={{ background: "rgba(255,255,255,.2)", color: "white", marginTop: 12 }}>
                                        {card.category}
                                    </span>
                                )}
                                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 14 }}>👆 Nhấn để lật</div>
                            </div>
                            <div className="fc-face fc-back">
                                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                    {mode === "sv-vi" ? <><VnFlag size={14} /> Nghĩa tiếng Việt</> : <><SvFlag size={14} /> Tiếng Thụy Điển</>}
                                </div>
                                <div style={{ fontSize: 26, fontWeight: 800, textAlign: "center" }}>{mode === "sv-vi" ? card.vi : card.sv}</div>
                                {mode === "vi-sv" && card.aiData?.pronunciation && <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>{card.aiData.pronunciation}</div>}
                                {flipped && (
                                    <button
                                        className="btn btn-sm"
                                        style={{ marginTop: 14, background: "rgba(255,255,255,.3)", border: "none", color: T.text }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            speakSv(card.sv);
                                        }}
                                    >
                                        🔊 Nghe
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 4, alignItems: "center" }}>
                        <button className="btn btn-s" style={{ flex: 1, fontSize: 18, padding: "12px 0" }} onClick={prev} disabled={idx === 0}>
                            ‹ Trước
                        </button>
                        <button className="btn btn-s" style={{ padding: "12px 14px", background: "transparent", border: "none", fontSize: 16 }} onClick={() => speakSv(card.sv)}>
                            🔊
                        </button>
                        <button className="btn btn-p" style={{ flex: 1, fontSize: 18, padding: "12px 0" }} onClick={next} disabled={idx === total - 1}>
                            Tiếp ›
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    );
}
