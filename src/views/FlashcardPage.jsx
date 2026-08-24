import { useState, useEffect } from "react";
import { T } from "../constants/theme";
import { speakSv } from "../services/api";
import { SvFlag } from "../components/SvFlag";
import { VnFlag } from "../components/VnFlag";
import { SubHeader } from "../components/SubHeader";

export default function FlashcardPage({ vocab, onBack }) {
    const [cat, setCat] = useState("Tất cả");
    const [mode, setMode] = useState("sv-vi");
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [pool, setPool] = useState([]);

    useEffect(() => {
        const filtered = cat === "Tất cả" ? vocab : vocab.filter((v) => {
            const vCats = v.categories || (v.category ? [v.category] : []);
            return vCats.includes(cat);
        });
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setPool(shuffled);
        setIdx(0);
        setFlipped(false);
    }, [cat, mode, vocab]);

    const fcCats = ["Tất cả", ...new Set(vocab.flatMap((v) => v.categories || (v.category ? [v.category] : [])).filter(Boolean))];
    const filtered = cat === "Tất cả" ? vocab : vocab.filter((v) => {
        const vCats = v.categories || (v.category ? [v.category] : []);
        return vCats.includes(cat);
    });

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
                <SubHeader
                    title="Flashcard"
                    icon="fa-solid fa-clone"
                    iconColor={T.pink}
                    iconBg="#FCE7F3"
                    onBack={onBack}
                />
                <div className="empty">
                    <div className="e-ico" style={{ color: T.pink, fontSize: 44 }}>
                        <i className="fa-solid fa-clone"></i>
                    </div>
                    <p>Thêm từ vào sổ tay trước nhé!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main">
            <SubHeader
                title="Flashcard"
                icon="fa-solid fa-clone"
                iconColor={T.pink}
                iconBg="#FCE7F3"
                onBack={onBack}
            />
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
                    <div className="e-ico" style={{ color: T.pink, fontSize: 44 }}>
                        <i className="fa-solid fa-clone"></i>
                    </div>
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
                                {card.category && (
                                    <span className="bdg" style={{ background: "rgba(255,255,255,.2)", color: "white", marginTop: 12 }}>
                                        {card.category}
                                    </span>
                                )}
                                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                    <i className="fa-solid fa-hand-pointer"></i> Nhấn để lật thẻ
                                </div>
                            </div>
                            <div className="fc-face fc-back">
                                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                    {mode === "sv-vi" ? <><VnFlag size={14} /> Nghĩa tiếng Việt</> : <><SvFlag size={14} /> Tiếng Thụy Điển</>}
                                </div>
                                <div style={{ fontSize: 26, fontWeight: 800, textAlign: "center" }}>{mode === "sv-vi" ? card.vi : card.sv}</div>
                                {flipped && (
                                    <button
                                        className="btn btn-sm"
                                        style={{ marginTop: 14, background: "rgba(255,255,255,.3)", border: "none", color: T.text, display: "inline-flex", alignItems: "center", gap: 6 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            speakSv(card.sv);
                                        }}
                                    >
                                        <i className="fa-solid fa-volume-high"></i> Nghe phát âm
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center" }}>
                        <button className="btn btn-s" style={{ flex: 1, fontSize: 16, padding: "12px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={prev} disabled={idx === 0}>
                            <i className="fa-solid fa-chevron-left"></i> Trước
                        </button>
                        <button className="btn btn-s btn-ico" style={{ width: 48, height: 48, fontSize: 18 }} onClick={() => speakSv(card.sv)} title="Phát âm">
                            <i className="fa-solid fa-volume-high"></i>
                        </button>
                        <button className="btn btn-p" style={{ flex: 1, fontSize: 16, padding: "12px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={next} disabled={idx === total - 1}>
                            Tiếp <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    );
}
