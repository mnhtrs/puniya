import { useState, useRef, useEffect } from "react";
import { speakSv } from "../services/api";
import { svAutocomplete, lookupWordFull } from "../services/api";
import { T } from "../constants/theme";

export function WordDetailModal({ word, onClose, onDelete }) {
    if (!word) return null;
    const ai = word.aiData;
    return (
        <div className="ov" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
                <div className="m-handle" />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                        <div className="dict-word">{word.sv}</div>
                        {ai?.pronunciation && (
                            <div className="pron-pill" onClick={() => speakSv(word.sv)}>
                                🔊 {ai.pronunciation}
                                {ai.ipa && <span style={{ opacity: 0.7, fontSize: 11 }}> · {ai.ipa}</span>}
                            </div>
                        )}
                        <div style={{ fontSize: 15, color: T.textL, marginTop: 6 }}>{word.vi}</div>
                    </div>
                    <button className="btn btn-ico btn-s" onClick={() => speakSv(word.sv)}>🔊</button>
                </div>

                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
                    {word.category && <span className="bdg bdg-pk">{word.category}</span>}
                    {ai?.partOfSpeech && <span className="bdg bdg-pu">{ai.partOfSpeech}</span>}
                    {ai?.gender && ai.gender !== "không áp dụng" && <span className="bdg bdg-bl">{ai.gender}</span>}
                    {ai?.pluralForm && <span className="bdg bdg-mn">Số nhiều: {ai.pluralForm}</span>}
                </div>

                {ai?.verbForms && (
                    <div className="card" style={{ padding: "10px 13px", marginBottom: 11 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: T.textL, marginBottom: 5 }}>CHIA ĐỘNG TỪ</div>
                        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>{ai.verbForms}</div>
                    </div>
                )}

                {ai?.viDefinitions?.length > 0 && (
                    <div style={{ marginBottom: 13 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: T.textL, marginBottom: 7 }}>ĐỊNH NGHĨA</div>
                        {ai.viDefinitions.map((d, i) => (
                            <div
                                key={i}
                                style={{
                                    fontSize: 14,
                                    color: T.text,
                                    marginBottom: 6,
                                    paddingLeft: 12,
                                    borderLeft: `2px solid ${T.pinkL}`,
                                    lineHeight: 1.6,
                                }}
                            >
                                {d}
                            </div>
                        ))}
                    </div>
                )}

                {ai?.viExamples?.length > 0 && (
                    <div style={{ marginBottom: 13 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: T.textL, marginBottom: 7 }}>VÍ DỤ CÂU</div>
                        {ai.viExamples.map((ex, i) => (
                            <div key={i} className="ex-item">
                                <div className="ex-sv" style={{ cursor: "pointer" }} onClick={() => speakSv(ex.sv)}>
                                    {ex.sv} <span style={{ fontSize: 12 }}>🔊</span>
                                </div>
                                <div className="ex-vi">{ex.vi}</div>
                            </div>
                        ))}
                    </div>
                )}

                {ai?.usage && (
                    <div style={{ marginBottom: 13 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: T.textL, marginBottom: 7 }}>CÁCH DÙNG</div>
                        <div style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>{ai.usage}</div>
                    </div>
                )}

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                    {ai?.synonyms?.length > 0 && (
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: T.textL }}>Đồng nghĩa:</div>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
                                {ai.synonyms.map((s, i) => (
                                    <span key={i} className="bdg bdg-mn" style={{ cursor: "pointer" }} onClick={() => speakSv(s)}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {ai?.antonyms?.length > 0 && (
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: T.textL }}>Trái nghĩa:</div>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
                                {ai.antonyms.map((s, i) => (
                                    <span key={i} className="bdg bdg-yl">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {onDelete && (
                    <button className="btn btn-s" style={{ width: "100%", color: "#ef4444" }} onClick={() => onDelete(word.id)}>
                        🗑️ Xóa từ này
                    </button>
                )}
            </div>
        </div>
    );
}

export function AddWordModal({ onClose, onSave }) {
    const [sv, setSv] = useState("");
    const [sugs, setSugs] = useState([]);
    const [showSug, setShowSug] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [viVal, setViVal] = useState("");
    const [catVal, setCatVal] = useState("");
    const debRef = useRef(null);

    function handleSvChange(val) {
        setSv(val);
        setResult(null);
        setViVal("");
        clearTimeout(debRef.current);
        if (!val.trim()) {
            setSugs([]);
            setShowSug(false);
            return;
        }
        debRef.current = setTimeout(async () => {
            const s = await svAutocomplete(val.trim());
            setSugs(s);
            setShowSug(s.length > 0);
        }, 200);
    }

    async function pickWord(word) {
        setSv(word);
        setSugs([]);
        setShowSug(false);
        setLoading(true);
        setResult(null);
        const res = await lookupWordFull(word);
        setResult(res);
        if (res?.aiData?.viMeaning) setViVal(res.aiData.viMeaning);
        if (res?.aiData?.partOfSpeech) setCatVal(res.aiData.partOfSpeech);
        setLoading(false);
    }

    function doSave() {
        if (!sv.trim() || !viVal.trim()) return;
        onSave({
            sv: sv.trim(),
            vi: viVal.trim(),
            category: catVal.trim() || "Chung",
            aiData: result?.aiData || null,
            lookupData: result?.wkData || null,
        });
    }

    const ai = result?.aiData;

    return (
        <div className="ov" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "92vh", overflowY: "auto" }}>
                <div className="m-handle" />
                <div className="sec-title" style={{ marginBottom: 14 }}>✨ Thêm từ mới</div>
                <div style={{ position: "relative", marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.textL, display: "block", marginBottom: 5 }}>
                        🇸🇪 Từ tiếng Thụy Điển
                    </label>
                    <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none", zIndex: 1 }}>🔍</span>
                        <input
                            className="inp"
                            style={{ paddingLeft: 34, fontSize: 15 }}
                            placeholder="Gõ từ..."
                            value={sv}
                            onChange={(e) => handleSvChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && sv.trim()) pickWord(sv.trim());
                                if (e.key === "Escape") setShowSug(false);
                            }}
                            onBlur={() => setTimeout(() => setShowSug(false), 180)}
                            onFocus={() => sugs.length > 0 && setShowSug(true)}
                            autoFocus
                            autoComplete="off"
                        />
                        {showSug && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 1px)",
                                    left: 0,
                                    right: 0,
                                    background: "#fff",
                                    borderRadius: "0 0 14px 14px",
                                    boxShadow: "0 8px 30px rgba(0,0,0,.18)",
                                    border: `1.5px solid ${T.border}`,
                                    borderTop: "none",
                                    zIndex: 400,
                                    maxHeight: 240,
                                    overflowY: "auto",
                                }}
                            >
                                {sugs.map((s, i) => (
                                    <div
                                        key={i}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            pickWord(s);
                                        }}
                                        style={{
                                            padding: "11px 14px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            cursor: "pointer",
                                            borderBottom: i < sugs.length - 1 ? `1px solid ${T.border}` : "none",
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = T.pinkP)}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                                    >
                                        <span style={{ color: T.textL, fontSize: 13 }}>🔍</span>
                                        <span style={{ flex: 1 }}>{s}</span>
                                        <span style={{ fontSize: 11, color: T.textL, fontWeight: 400 }}>↵ chọn</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "16px 0" }}>
                        <div className="dots">
                            <div className="dot" />
                            <div className="dot" />
                            <div className="dot" />
                        </div>
                        <div style={{ fontSize: 12, color: T.textL, marginTop: 5 }}>Đang tra từ điển...</div>
                    </div>
                )}

                {ai && !loading && (
                    <div style={{ border: `2px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 12, background: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: T.pink, lineHeight: 1.1 }}>{ai.word || sv}</div>
                                {ai.ipa && (
                                    <code style={{ fontSize: 12, color: T.purple, background: T.purpleL, padding: "1px 8px", borderRadius: 6, display: "inline-block", marginTop: 3 }}>
                                        {ai.ipa}
                                    </code>
                                )}
                                {ai.pronunciation && <div style={{ fontSize: 11, color: T.textL, marginTop: 2 }}>/{ai.pronunciation}/</div>}
                            </div>
                            <button className="btn btn-ico btn-s" onClick={() => speakSv(ai.word || sv)}>🔊</button>
                        </div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                            {ai.partOfSpeech && <span className="bdg bdg-pk">{ai.partOfSpeech}</span>}
                            {ai.gender && ai.gender !== "ej tillämpligt" && <span className="bdg bdg-bl">{ai.gender}</span>}
                            {ai.level && <span className="bdg bdg-mn">{ai.level}</span>}
                        </div>
                        {ai.inflection && (
                            <div style={{ fontSize: 12, background: "#f5f5f5", padding: "5px 9px", borderRadius: 7, marginBottom: 8, fontStyle: "italic", color: "#555" }}>
                                📋 {ai.inflection}
                            </div>
                        )}
                        <div style={{ fontSize: 19, fontWeight: 900, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
                            {ai.viMeaning}
                        </div>
                        {(ai.definitions || []).filter((d) => d.vi).map((def, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <div style={{ display: "flex", gap: 7, alignItems: "baseline", marginBottom: 3 }}>
                                    <span style={{ background: T.pink, color: "#fff", borderRadius: 4, padding: "0 6px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                    <div style={{ fontSize: 14, fontWeight: 700 }}>{def.vi}</div>
                                </div>
                                {def.en && <div style={{ fontSize: 12, color: T.textL, fontStyle: "italic", paddingLeft: 24, marginBottom: 3 }}>{def.en}</div>}
                                {(def.examples || []).filter((e) => e.sv).map((ex, j) => (
                                    <div
                                        key={j}
                                        style={{ marginLeft: 24, marginTop: 4, padding: "5px 9px", background: "#f9f5ff", borderRadius: 8, borderLeft: `3px solid ${T.purple}`, cursor: "pointer" }}
                                        onClick={() => speakSv(ex.sv)}
                                    >
                                        <div style={{ fontSize: 13, fontWeight: 700, color: T.purple, fontStyle: "italic" }}>{ex.sv} 🔊</div>
                                        <div style={{ fontSize: 12, color: T.textL }}>{ex.vi}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {ai.usage && (
                            <div style={{ background: "#fffbea", border: `1px solid ${T.yellow}`, borderRadius: 8, padding: "7px 10px", marginBottom: 8 }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: "#b45309", marginBottom: 2 }}>📝 GHI CHÚ</div>
                                <div style={{ fontSize: 12, lineHeight: 1.6 }}>{ai.usage}</div>
                            </div>
                        )}
                        {(ai.synonyms || []).filter(Boolean).length > 0 && (
                            <div style={{ marginBottom: 5, fontSize: 12 }}>
                                <span style={{ fontWeight: 700, color: T.textL }}>Đồng nghĩa: </span>
                                {ai.synonyms.filter(Boolean).map((s, i) => (
                                    <span
                                        key={i}
                                        style={{ color: T.pink, fontWeight: 700, cursor: "pointer", marginRight: 6 }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            pickWord(s);
                                        }}
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        )}
                        {(ai.collocations || []).filter(Boolean).length > 0 && (
                            <div style={{ fontSize: 12, color: T.textL }}>
                                <span style={{ fontWeight: 700 }}>Kết hợp: </span>
                                {ai.collocations.filter(Boolean).join(" • ")}
                            </div>
                        )}
                    </div>
                )}

                <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.textL, display: "block", marginBottom: 5 }}>🇻🇳 Nghĩa tiếng Việt</label>
                    <input className="inp" placeholder="Nghĩa tiếng Việt..." value={viVal} onChange={(e) => setViVal(e.target.value)} />
                </div>
                <div style={{ marginBottom: 15 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.textL, display: "block", marginBottom: 5 }}>🏷️ Phân loại</label>
                    <input className="inp" placeholder="VD: Danh từ, Du lịch..." value={catVal} onChange={(e) => setCatVal(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 9 }}>
                    <button className="btn btn-s" style={{ flex: 1 }} onClick={onClose}>Hủy</button>
                    <button className="btn btn-p" style={{ flex: 2 }} onClick={doSave} disabled={!sv.trim() || !viVal.trim()}>💾 Lưu từ</button>
                </div>
            </div>
        </div>
    );
}

export function EditWordModal({ word, onClose, onSave }) {
    const [sv, setSv] = useState(word.sv);
    const [vi, setVi] = useState(word.vi);
    const [cat, setCat] = useState(word.category || "");

    return (
        <div className="ov" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="m-handle" />
                <div className="sec-title">✏️ Chỉnh sửa từ</div>
                <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: T.textL, display: "block", marginBottom: 6 }}>Tiếng Thụy Điển</label>
                    <input className="inp" value={sv} onChange={(e) => setSv(e.target.value)} />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: T.textL, display: "block", marginBottom: 6 }}>Tiếng Việt</label>
                    <input className="inp" value={vi} onChange={(e) => setVi(e.target.value)} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: T.textL, display: "block", marginBottom: 6 }}>Phân loại</label>
                    <input className="inp" value={cat} onChange={(e) => setCat(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn btn-s" style={{ flex: 1 }} onClick={onClose}>Hủy</button>
                    <button className="btn btn-p" style={{ flex: 2 }} onClick={() => onSave({ ...word, sv, vi, category: cat || "Chung" })}>Lưu</button>
                </div>
            </div>
        </div>
    );
}
