import { useState, useRef } from "react";
import { T } from "../constants/theme";
import { svAutocomplete, lookupWordFull, speakSv } from "../services/api";
import { dbAdd } from "../services/db";

export default function DictPage({ vocab, setVocab, onBack }) {
    const [query, setQuery] = useState("");
    const [sugs, setSugs] = useState([]);
    const [showSug, setShowSug] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [saved, setSaved] = useState(false);
    const debRef = useRef(null);

    function handleChange(val) {
        setQuery(val);
        setResult(null);
        setSaved(false);
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

    async function doLookup(word) {
        setQuery(word);
        setSugs([]);
        setShowSug(false);
        setLoading(true);
        setResult(null);
        setSaved(false);
        const res = await lookupWordFull(word);
        setResult(res);
        setLoading(false);
    }

    async function saveWord() {
        const ai = result?.aiData;
        if (!ai || !query) return;
        const entry = {
            sv: query,
            vi: ai.viMeaning || query,
            category: ai.partOfSpeech || "Từ điển",
            aiData: ai,
            lookupData: result.wkData,
            createdAt: Date.now(),
        };
        const id = await dbAdd("vocab", entry);
        setVocab((prev) => [...prev, { ...entry, id }]);
        setSaved(true);
    }

    const ai = result?.aiData;

    return (
        <div className="main">
            {onBack && (
                <button className="btn btn-s" style={{ marginBottom: 10, fontSize: 12, padding: "5px 12px" }} onClick={onBack}>
                    ← Trang chủ
                </button>
            )}
            <div className="sec-title">🔎 Từ điển Thụy Điển</div>

            <div style={{ position: "relative", marginBottom: 13, display: "flex", gap: 8 }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🇸🇪</span>
                    <input
                        className="inp"
                        style={{ paddingLeft: 35 }}
                        placeholder="Gõ từ..."
                        value={query}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && query.trim()) doLookup(query.trim());
                            if (e.key === "Escape") setShowSug(false);
                        }}
                        onBlur={() => setTimeout(() => setShowSug(false), 180)}
                        onFocus={() => sugs.length > 0 && setShowSug(true)}
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
                                zIndex: 300,
                                maxHeight: 240,
                                overflowY: "auto",
                            }}
                        >
                            {sugs.map((s, i) => (
                                <div
                                    key={i}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        doLookup(s);
                                    }}
                                    style={{
                                        padding: "10px 14px",
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
                                    <span style={{ fontSize: 11, color: T.textL, fontWeight: 400 }}>↵</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button className="btn btn-p" style={{ flexShrink: 0, padding: "0 14px" }} onClick={() => query.trim() && doLookup(query.trim())} disabled={!query.trim() || loading}>
                    {loading ? "⌛" : "Tra"}
                </button>
            </div>

            {loading && (
                <div style={{ textAlign: "center", padding: 20 }}>
                    <div className="dots">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                    </div>
                    <div style={{ fontSize: 13, color: T.textL, marginTop: 6 }}>Đang tra từ điển...</div>
                </div>
            )}

            {result &&
                !loading &&
                (ai ? (
                    <div className="card" style={{ padding: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                            <div>
                                <div style={{ fontSize: 32, fontWeight: 900, color: T.pink, lineHeight: 1.1 }}>{ai.word || query}</div>
                                {ai.ipa && (
                                    <code style={{ fontSize: 13, color: T.purple, background: T.purpleL, padding: "2px 9px", borderRadius: 7, display: "inline-block", marginTop: 4 }}>
                                        {ai.ipa}
                                    </code>
                                )}
                                {ai.pronunciation && <div style={{ fontSize: 12, color: T.textL, marginTop: 3 }}>🔊 /{ai.pronunciation}/</div>}
                            </div>
                            <button className="btn btn-ico btn-s" onClick={() => speakSv(ai.word || query)}>
                                🔊
                            </button>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                            {ai.partOfSpeech && <span className="bdg bdg-pk">{ai.partOfSpeech}</span>}
                            {ai.gender && ai.gender !== "ej tillämpligt" && <span className="bdg bdg-bl">{ai.gender}</span>}
                            {ai.level && <span className="bdg bdg-mn">{ai.level}</span>}
                        </div>
                        {ai.inflection && (
                            <div style={{ fontSize: 12, background: "#f5f5f5", padding: "6px 10px", borderRadius: 8, marginBottom: 10, fontStyle: "italic", color: "#555" }}>
                                📋 {ai.inflection}
                            </div>
                        )}
                        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>{ai.viMeaning}</div>
                        {(ai.definitions || []).filter((d) => d.vi).map((def, i) => (
                            <div key={i} style={{ marginBottom: 13 }}>
                                <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
                                    <span style={{ background: T.pink, color: "#fff", borderRadius: 4, padding: "1px 7px", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                    <div style={{ fontSize: 15, fontWeight: 700 }}>{def.vi}</div>
                                </div>
                                {def.en && <div style={{ fontSize: 13, color: T.textL, fontStyle: "italic", paddingLeft: 26, marginBottom: 4 }}>{def.en}</div>}
                                {(def.examples || []).filter((e) => e.sv).map((ex, j) => (
                                    <div
                                        key={j}
                                        style={{ marginLeft: 26, marginBottom: 6, padding: "7px 11px", background: "#f9f5ff", borderRadius: 10, borderLeft: `3px solid ${T.purple}`, cursor: "pointer" }}
                                        onClick={() => speakSv(ex.sv)}
                                    >
                                        <div style={{ fontSize: 14, fontWeight: 700, color: T.purple, fontStyle: "italic" }}>{ex.sv} 🔊</div>
                                        <div style={{ fontSize: 13, color: T.textL, marginTop: 3 }}>{ex.vi}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {ai.usage && (
                            <div style={{ background: "#fffbea", border: `1px solid ${T.yellow}`, borderRadius: 9, padding: "8px 11px", marginBottom: 10 }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: "#b45309", marginBottom: 2 }}>📝 GHI CHÚ CÁCH DÙNG</div>
                                <div style={{ fontSize: 13, lineHeight: 1.6 }}>{ai.usage}</div>
                            </div>
                        )}
                        {(ai.synonyms || []).filter(Boolean).length > 0 && (
                            <div style={{ marginBottom: 7, fontSize: 13 }}>
                                <span style={{ fontWeight: 700, color: T.textL }}>Đồng nghĩa: </span>
                                {ai.synonyms
                                    .filter(Boolean)
                                    .map((s, i) => (
                                        <span
                                            key={i}
                                            style={{ color: T.pink, fontWeight: 700, cursor: "pointer", marginRight: 6 }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                doLookup(s);
                                            }}
                                        >
                                            {s}
                                        </span>
                                    ))}
                            </div>
                        )}
                        {(ai.antonyms || []).filter(Boolean).length > 0 && (
                            <div style={{ marginBottom: 7, fontSize: 13 }}>
                                <span style={{ fontWeight: 700, color: T.textL }}>Trái nghĩa: </span>
                                {ai.antonyms.filter(Boolean).map((s, i) => (
                                    <span key={i} style={{ marginRight: 6 }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        )}
                        {(ai.collocations || []).filter(Boolean).length > 0 && (
                            <div style={{ marginBottom: 12, fontSize: 13 }}>
                                <span style={{ fontWeight: 700, color: T.textL }}>Kết hợp: </span>
                                {ai.collocations.filter(Boolean).join(" • ")}
                            </div>
                        )}
                        <button className={`btn ${saved ? "btn-ok" : "btn-s"}`} style={{ width: "100%" }} onClick={saveWord} disabled={saved}>
                            {saved ? "✅ Đã lưu vào sổ tay!" : "💾 Lưu vào sổ tay"}
                        </button>
                    </div>
                ) : (
                    <div className="card">
                        <div style={{ textAlign: "center", color: T.textL, padding: 20 }}>Không tìm thấy từ này. Thử từ khác nhé!</div>
                    </div>
                ))}
            {!loading && !result && !query && (
                <div className="empty">
                    <div className="e-ico">🔎</div>
                    <p>Gõ từ để tra cứu</p>
                </div>
            )}
        </div>
    );
}
