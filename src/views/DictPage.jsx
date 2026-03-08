import { useState, useRef, useEffect } from "react";
import { T } from "../constants/theme";
import { svAutocomplete, lookupWordDict, speakSv } from "../services/api";
import { dbAdd } from "../services/db";
import { SvFlag } from "../components/SvFlag";
import { VnFlag } from "../components/VnFlag";
import { UkFlag } from "../components/UkFlag";

export default function DictPage({ vocab, setVocab, onBack }) {
    const [query, setQuery] = useState("");
    const [sugs, setSugs] = useState([]);
    const [showSug, setShowSug] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [saved, setSaved] = useState(false);
    const [history, setHistory] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("puniya_dict_history") || "[]");
        } catch { return []; }
    });
    const debRef = useRef(null);

    function handleBack() {
        syncUrl(""); // Xóa q= trên URL trước khi thoát
        onBack();
    }

    const isAlreadyInNotebook = (word) => {
        if (!word || !vocab.length) return false;
        return vocab.some(v => v.sv.toLowerCase().trim() === word.toLowerCase().trim());
    };

    // Tự động tra từ khi mở URL có ?q= và lắng nghe phím Back/Forward
    useEffect(() => {
        const checkUrl = () => {
            const params = new URLSearchParams(window.location.search);
            const q = params.get("q");
            if (q) {
                setQuery(q);
                doLookup(q, false);
            } else {
                setQuery("");
                setResult(null);
            }
        };

        checkUrl();
        window.addEventListener("popstate", checkUrl);

        return () => {
            window.removeEventListener("popstate", checkUrl);
            // Chỉ xóa URL khi unmount hoàn toàn (không phải khi chuyển state nội bộ)
            // Tuy nhiên user muốn ra trang chủ là mất, nên để onBack lo
        };
    }, []);

    // Lưu history vào localStorage
    useEffect(() => {
        localStorage.setItem("puniya_dict_history", JSON.stringify(history));
    }, [history]);

    // Đồng bộ URL khi tra từ
    function syncUrl(word) {
        if (!word) {
            window.history.pushState({}, "", window.location.pathname);
        } else {
            window.history.pushState({ word }, "", `?q=${encodeURIComponent(word)}`);
        }
    }

    function handleChange(val) {
        setQuery(val);
        if (!val.trim()) {
            setSugs([]);
            // Khi xoá trắng, hiện lại lịch sử nếu có
            if (history.length > 0) {
                setSugs(history);
                setShowSug(true);
            } else {
                setShowSug(false);
            }
            // Removing syncUrl("") from here to avoid input focus/interruption issues
            return;
        }
        clearTimeout(debRef.current);
        debRef.current = setTimeout(async () => {
            const s = await svAutocomplete(val.trim());
            setSugs(s);
            setShowSug(s.length > 0);
        }, 200);
    }

    async function doLookup(word, updateUrl = true) {
        if (!word) return;
        setQuery(word);
        setSugs([]);
        setShowSug(false);
        setLoading(true);
        setResult(null);
        setSaved(false);

        if (updateUrl) syncUrl(word);

        // Cập nhật history (đưa lên đầu, xóa trùng)
        setHistory(prev => {
            const newHist = [word, ...prev.filter(h => h !== word)].slice(0, 10);
            return newHist;
        });

        const res = await lookupWordDict(word);
        setResult(res);
        setLoading(false);
    }

    function clearHistory() {
        if (confirm("Xóa toàn bộ lịch sử tra từ?")) {
            setHistory([]);
        }
    }

    function removeHistoryItem(e, item) {
        e.stopPropagation();
        setHistory(prev => prev.filter(h => h !== item));
    }

    async function saveWord() {
        if (!result || !query) return;
        const firstBlock = result.blocks?.[0];
        const entry = {
            sv: query,
            vi: result.viMeaning || query,
            category: "",
            aiData: {
                word: query,
                viMeaning: result.viMeaning,
                ipa: result.ipa,
                partOfSpeech: firstBlock?.posVi || "Từ vựng",
                definitions: (firstBlock?.defsVi || []).map(d => ({ vi: d.vi })),
                examples: (firstBlock?.examplesVi || []).map(e => ({ sv: e.sv, vi: e.vi })),
            },
            createdAt: Date.now(),
        };
        const id = await dbAdd("vocab", entry);
        setVocab((prev) => [...prev, { ...entry, id }]);
        setSaved(true);
    }

    const alreadyExists = isAlreadyInNotebook(query);

    return (
        <div className="main">
            {onBack && (
                <button className="btn btn-s" style={{ marginBottom: 14, fontSize: 13, padding: "6px 14px", display: "flex", alignItems: "center", gap: 5 }} onClick={handleBack}>
                    ← Trang chủ
                </button>
            )}
            <div className="sec-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                🔎 Từ điển <SvFlag size={20} /> <VnFlag size={20} />
            </div>

            {/* Search bar */}
            <div style={{ position: "relative", marginBottom: 13, display: "flex", gap: 8 }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 1, display: "flex" }}><SvFlag size={20} /></span>
                    <input className="inp" style={{ paddingLeft: 35 }} placeholder="Gõ từ..." value={query}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && query.trim()) doLookup(query.trim()); if (e.key === "Escape") setShowSug(false); }}
                        onBlur={() => setTimeout(() => setShowSug(false), 180)}
                        onFocus={() => {
                            if (!query.trim() && history.length > 0) {
                                setSugs(history);
                                setShowSug(true);
                            } else if (sugs.length > 0) {
                                setShowSug(true);
                            }
                        }}
                        autoComplete="off"
                    />
                    {showSug && (
                        <div className="sug-wrap">
                            {!query.trim() && history.length > 0 && (
                                <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: T.pink, display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.border}` }}>
                                    <span>🕒 LỊCH SỬ GẦN ĐÂY</span>
                                    <span onMouseDown={(e) => { e.preventDefault(); clearHistory(); }} style={{ cursor: "pointer", opacity: 0.8 }}>Xoá hết</span>
                                </div>
                            )}
                            {sugs.map((s, i) => (
                                <div key={i} className="sug-item" onMouseDown={(e) => { e.preventDefault(); doLookup(s); }}>
                                    <span style={{ marginRight: 10, color: T.textL }}>{query.trim() ? "🔍" : "🕒"}</span>
                                    {s}
                                    {!query.trim() && (
                                        <span onMouseDown={(e) => { e.preventDefault(); removeHistoryItem(e, s); }} style={{ float: "right", padding: "0 5px", color: T.pink, opacity: 0.5 }}>×</span>
                                    )}
                                    {query.trim() && <span style={{ float: "right", fontSize: 11, color: T.textL }}>↵</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button className="btn btn-p" style={{ flexShrink: 0, padding: "0 14px" }} onClick={() => query.trim() && doLookup(query.trim())} disabled={!query.trim() || loading}>
                    {loading ? "⌛" : "Tra"}
                </button>
            </div>



            {/* Loading */}
            {loading && (
                <div style={{ textAlign: "center", padding: 20 }}>
                    <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                    <div style={{ fontSize: 13, color: T.textL, marginTop: 6 }}>Đang tra từ Wiktionary...</div>
                </div>
            )}

            {/* Results */}
            {result && !loading && (
                <div className="card" style={{ padding: "20px 24px", marginTop: 10, animation: "fadeIn 0.3s" }}>
                    {/* Header: Word + IPA + Speaker */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ fontSize: 32, fontWeight: 900, color: T.pink, lineHeight: 1.1 }}>{result.word}</div>
                                {result.cefr && (
                                    <span className={`bdg ${result.cefr.startsWith('A') ? 'bdg-ok' : result.cefr.startsWith('B') ? 'bdg-yl' : 'bdg-er'}`}
                                        style={{ fontSize: 13, padding: "2px 8px", borderRadius: 6 }}>
                                        {result.cefr}
                                    </span>
                                )}
                            </div>
                            {result.ipa && (
                                <div style={{ display: "inline-block", background: T.pinkP, color: T.pink, padding: "3px 10px", borderRadius: 8, fontSize: 14, fontWeight: 800, marginTop: 6 }}>
                                    {result.ipa}
                                </div>
                            )}
                            <div style={{ fontSize: 22, fontWeight: 700, color: T.text, marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                <VnFlag size={18} /> {result.viMeaning}
                            </div>
                        </div>
                        <button className="btn btn-ico btn-p" onClick={() => speakSv(result.word)} style={{ width: 52, height: 52, borderRadius: 16, fontSize: 24 }}>🔊</button>
                    </div>

                    {/* POS Blocks */}
                    {result.blocks && result.blocks.map((block, bi) => (
                        <div key={bi} style={{ marginTop: bi > 0 ? 25 : 10, borderTop: bi > 0 ? `1px solid ${T.border}` : "none", paddingTop: bi > 0 ? 20 : 0 }}>
                            {/* POS badge */}
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                                <span className="bdg bdg-pk" style={{ fontSize: 12, fontWeight: 800 }}>{block.posVi}</span>
                                {block.nounInfo?.gender && <span className="bdg bdg-bl" style={{ fontSize: 12 }}>{block.nounInfo.gender}</span>}
                            </div>

                            {/* Definitions */}
                            {block.defsVi && block.defsVi.length > 0 && (
                                <div style={{ marginBottom: 15 }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: T.textL, marginBottom: 8, textTransform: "uppercase" }}>📖 Giải nghĩa</div>
                                    {block.defsVi.map((def, di) => (
                                        <div key={di} style={{ marginBottom: 8, paddingLeft: 12, borderLeft: `3px solid ${T.pinkL}` }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{di + 1}. {def.vi}</div>
                                            <div style={{ fontSize: 12, color: T.textL, fontStyle: "italic", display: "flex", alignItems: "center", gap: 6 }}>
                                                <UkFlag size={14} /> {def.en}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Verb conjugation */}
                            {block.verbForms && (
                                <div style={{ marginBottom: 15, background: "#f8fafc", padding: "12px 14px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: T.textL, marginBottom: 8, textTransform: "uppercase" }}>🔄 Chia động từ</div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                        {Object.entries(block.verbForms).map(([k, v]) => (
                                            <div key={k} style={{ fontSize: 13 }}>
                                                <span style={{ color: T.textL, fontWeight: 600 }}>{k}: </span>
                                                <span style={{ color: T.pink, fontWeight: 800 }}>{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Adjective forms */}
                            {block.adjForms && (
                                <div style={{ marginBottom: 15, background: "#f8fafc", padding: "12px 14px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: T.textL, marginBottom: 8, textTransform: "uppercase" }}>📏 So sánh tính từ</div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                        {Object.entries(block.adjForms).map(([k, v]) => (
                                            <div key={k} style={{ fontSize: 13 }}>
                                                <span style={{ color: T.textL, fontWeight: 600 }}>{k}: </span>
                                                <span style={{ color: T.purple, fontWeight: 800 }}>{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Noun info */}
                            {block.nounInfo?.declType && (
                                <div style={{ marginBottom: 15, background: "#f8fafc", padding: "10px 14px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: T.textL, textTransform: "uppercase" }}>📋 Biến cách</div>
                                    <div style={{ fontSize: 13, color: T.text, marginTop: 4 }}>Loại: {block.nounInfo.declType}</div>
                                </div>
                            )}

                            {/* Examples */}
                            {block.examplesVi && block.examplesVi.length > 0 && (
                                <div style={{ marginBottom: 15 }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: T.textL, marginBottom: 8, textTransform: "uppercase" }}>💬 Ví dụ sử dụng</div>
                                    {block.examplesVi.map((ex, ei) => (
                                        <div key={ei} style={{ marginBottom: 8, background: "#f1f5f9", padding: "10px 14px", borderRadius: 12 }}>
                                            <div style={{ fontWeight: 700, color: T.purple, fontSize: 14 }}><SvFlag size={14} /> {ex.sv}</div>
                                            <div style={{ fontSize: 13, color: T.text, marginTop: 3 }}><VnFlag size={14} /> {ex.vi}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Synonyms */}
                            {block.synonyms && block.synonyms.length > 0 && (
                                <div style={{ marginBottom: 10 }}>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: T.textL, textTransform: "uppercase" }}>🔗 Đồng nghĩa: </span>
                                    {block.synonyms.map((s, si) => (
                                        <span key={si} className="bdg bdg-mn" style={{ fontSize: 11, marginRight: 6, marginBottom: 4, cursor: "pointer" }} onClick={() => doLookup(s)}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Antonyms */}
                            {block.antonyms && block.antonyms.length > 0 && (
                                <div style={{ marginBottom: 10 }}>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: T.textL, textTransform: "uppercase" }}>⚡ Trái nghĩa: </span>
                                    {block.antonyms.map((a, ai) => (
                                        <span key={ai} className="bdg" style={{ fontSize: 11, marginRight: 6, background: "#fee2e2", color: "#b91c1c", cursor: "pointer" }} onClick={() => doLookup(a)}>
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Related terms */}
                            {block.related && block.related.length > 0 && (
                                <div style={{ marginBottom: 10 }}>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: T.textL, textTransform: "uppercase" }}>📌 Từ liên quan: </span>
                                    {block.related.map((r, ri) => (
                                        <span key={ri} className="bdg bdg-pu" style={{ fontSize: 11, marginRight: 6, cursor: "pointer" }} onClick={() => doLookup(r)}>
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Derived terms */}
                            {block.derived && block.derived.length > 0 && (
                                <div style={{ marginBottom: 10 }}>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: T.textL, textTransform: "uppercase" }}>🌱 Từ phái sinh: </span>
                                    {block.derived.slice(0, 8).map((d, di) => (
                                        <span key={di} className="bdg bdg-yl" style={{ fontSize: 11, marginRight: 6, cursor: "pointer" }} onClick={() => doLookup(d)}>
                                            {d}
                                        </span>
                                    ))}
                                    {block.derived.length > 8 && <span style={{ fontSize: 11, color: T.textL }}>+{block.derived.length - 8}</span>}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* No Wiki data fallback */}
                    {(!result.blocks || result.blocks.length === 0) && (
                        <div style={{ padding: 12, background: "#fffbeb", borderRadius: 12, border: "1px solid #fde68a", marginTop: 10 }}>
                            <div style={{ fontSize: 12, color: "#92400e", fontWeight: 700 }}>⚠️ Không tìm thấy dữ liệu chi tiết từ Wiktionary cho từ này.</div>
                            <div style={{ fontSize: 12, color: "#92400e", marginTop: 4 }}>Nghĩa cơ bản từ Google Translate: <strong>{result.viMeaning}</strong></div>
                        </div>
                    )}

                    {/* Source info */}
                    {result.hasWikiData && (
                        <div style={{ fontSize: 10, color: T.textL, textAlign: "center", marginTop: 15, opacity: 0.6 }}>
                            Nguồn: Wiktionary (en+sv) · Folkets Lexikon · Google Translate
                        </div>
                    )}

                    {/* Save button */}
                    <button
                        className={`btn ${saved || alreadyExists ? "btn-ok" : "btn-p"}`}
                        style={{ width: "100%", height: 50, fontSize: 16, fontWeight: 800, borderRadius: 15, marginTop: 15 }}
                        onClick={saveWord}
                        disabled={saved || alreadyExists}
                    >
                        {saved ? "✅ Đã lưu vào sổ tay" : alreadyExists ? "📚 Đã có trong sổ tay" : "💾 Lưu vào sổ tay"}
                    </button>
                </div>
            )}

            {!loading && !result && !query && (
                <div className="empty">
                    <div className="e-ico">🔎</div>
                    <p>Gõ từ để tra cứu</p>
                </div>
            )}
        </div>
    );
}
