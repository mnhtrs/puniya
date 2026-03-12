import { useState, useRef, useEffect } from "react";
import { svAutocomplete, lookupWordFull } from "../services/api";
import { dbAdd, dbPut, dbDelete } from "../services/db";
import { T } from "../constants/theme";
import { SvFlag } from "./SvFlag";
import { VnFlag } from "./VnFlag";
// import { UkFlag } from "./UkFlag";
import { speakSv } from "../services/api";

function sanitize(str) {
    if (!str) return "";
    return str.replace(/[<>]/g, "").trim();
}

function TagSelector({ allTags, selectedNames, onAdd, onRemove }) {
    const [query, setQuery] = useState("");
    const [showSug, setShowSug] = useState(false);
    const inRef = useRef(null);

    const sugs = allTags.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) &&
        !selectedNames.includes(t.name)
    );

    return (
        <div className="tag-sel-wrap">
            <input
                className="inp"
                placeholder="Tìm hoặc thêm nhãn..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSug(true); }}
                onFocus={() => setShowSug(true)}
                onBlur={() => setTimeout(() => setShowSug(false), 200)}
                onKeyDown={async (e) => {
                    if (e.key === "Enter" && query.trim()) {
                        const existing = allTags.find(t => t.name.toLowerCase() === query.trim().toLowerCase());
                        if (existing) {
                            onAdd(existing.name);
                        } else {
                            // Tạo tag mới nếu chưa có
                            const newTag = { name: query.trim(), color: T.pink };
                            const id = await dbAdd("tags", newTag);
                            onAdd(newTag.name, { ...newTag, id });
                        }
                        setQuery("");
                    }
                }}
            />
            {showSug && sugs.length > 0 && (
                <div className="tag-sug-wrap">
                    {sugs.map(t => (
                        <div key={t.id} className="tag-sug-item" onMouseDown={() => { onAdd(t.name); setQuery(""); }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.color }} />
                            {t.name}
                        </div>
                    ))}
                </div>
            )}
            <div className="tag-badges">
                {selectedNames.map(name => {
                    const t = allTags.find(tag => tag.name === name);
                    const bg = t?.color || "#f1f5f9";
                    const isDark = (color) => {
                        const hex = color.replace('#', '');
                        const r = parseInt(hex.substr(0, 2), 16);
                        const g = parseInt(hex.substr(2, 2), 16);
                        const b = parseInt(hex.substr(4, 2), 16);
                        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                        return brightness < 155;
                    };
                    return (
                        <span key={name} className="tag-badge" style={{ background: bg, color: isDark(bg) ? "#fff" : "#475569", width: "fit-content" }}>
                            {name} <span className="rm" onClick={() => onRemove(name)} style={{ color: isDark(bg) ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.4)" }}>✕</span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export function TagManagerModal({ tags, setTags, onClose }) {
    const [editing, setEditing] = useState(null); // {id, name, color}

    async function handleSave() {
        if (!editing.name.trim()) return;
        if (editing.id) {
            await dbPut("tags", editing);
            setTags(prev => prev.map(t => t.id === editing.id ? editing : t));
        } else {
            const id = await dbAdd("tags", editing);
            setTags(prev => [...prev, { ...editing, id }]);
        }
        setEditing(null);
    }

    async function handleDelete(id) {
        if (!confirm("Xóa nhãn này? Các từ đang dùng nhãn này sẽ mất nhãn.")) return;
        await dbDelete("tags", id);
        setTags(prev => prev.filter(t => t.id !== id));
    }

    return (
        <div className="ov" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="sec-title" style={{ marginBottom: 20 }}>🏷️ Quản lý nhãn ({tags.length})</div>

                <div style={{ marginBottom: 20 }}>
                    <button className="btn btn-p" style={{ width: "100%" }} onClick={() => setEditing({ name: "", color: T.pink })}>+ Tạo nhãn mới</button>
                </div>

                <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
                    {tags.map(t => (
                        <div key={t.id} className="tag-mgr-item" style={{ padding: "8px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 22, height: 22, borderRadius: "50%", background: t.color, border: "2px solid white", boxShadow: "0 0 0 1px #eee" }} />
                                <span style={{ fontWeight: 800, color: T.text, fontSize: 14 }}>{t.name}</span>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                                <button className="btn btn-s" style={{ padding: "6px 12px", fontSize: 11, borderRadius: 8 }} onClick={() => setEditing(t)}>✏️ Sửa</button>
                                <button className="btn btn-s" style={{ padding: "6px 12px", fontSize: 11, borderRadius: 8, color: "#ef4444" }} onClick={() => handleDelete(t.id)}>🗑️ Xóa</button>
                            </div>
                        </div>
                    ))}
                    {tags.length === 0 && <div style={{ textAlign: "center", color: T.textL, padding: 20 }}>Chưa có nhãn nào.</div>}
                </div>

                {editing && (
                    <div className="ov" style={{ zIndex: 1001 }} onClick={() => setEditing(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="sec-title">{editing.id ? "Sửa nhãn" : "Thêm nhãn mới"}</div>
                            <input className="inp" placeholder="Tên nhãn..." value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} autoFocus />
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 15, marginBottom: 15 }}>
                                {["#FF6B9D", "#FF8B6A", "#FDE68A", "#6EE7B7", "#60A5FA", "#C084FC", "#9B6B8A", "#2D2D2D"].map(c => (
                                    <div key={c} className={`color-dot ${editing.color === c ? "active" : ""}`} style={{ background: c }} onClick={() => setEditing({ ...editing, color: c })} />
                                ))}
                                <div style={{ position: "relative", width: 28, height: 28 }}>
                                    <div className="color-dot" style={{ background: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)", display: "flex", alignItems: "center", justifyContent: "center" }}></div>
                                    <input
                                        type="color"
                                        value={editing.color || "#FF6B9D"}
                                        onChange={e => setEditing({ ...editing, color: e.target.value })}
                                        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button className="btn btn-s" style={{ flex: 1 }} onClick={() => setEditing(null)}>Hủy</button>
                                <button className="btn btn-p" style={{ flex: 1 }} onClick={handleSave}>Lưu</button>
                            </div>
                        </div>
                    </div>
                )}

                <button className="btn btn-s" style={{ width: "100%", marginTop: 20 }} onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
}

export function WordDetailModal({ word, tags, onClose, onDelete, onEdit, onStar }) {
    if (!word) return null;
    const ai = word.aiData;
    const vCats = word.categories || (word.category ? [word.category] : []);

    return (
        <div className="ov" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
                <div className="m-handle" />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ flex: 1 }}>
                        <div className="dict-word">{word.sv}</div>
                        {ai?.ipa && (
                            <div style={{ display: "inline-block", background: T.pinkP, color: T.pink, padding: "2px 8px", borderRadius: 6, fontSize: 13, fontWeight: 800, marginTop: 4 }}>
                                {ai.ipa}
                            </div>
                        )}
                        {ai?.partOfSpeech && (
                            <span style={{ display: "inline-block", marginLeft: 8, fontSize: 12, color: T.purple, fontWeight: 700, background: T.purpleL, padding: "2px 8px", borderRadius: 6, marginTop: 4 }}>
                                {ai.partOfSpeech}
                            </span>
                        )}
                        <div style={{ fontSize: 16, color: T.text, marginTop: 8, fontWeight: 700 }}>{word.vi}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ico btn-s" onClick={() => onStar(word.id, !word.starred)} style={{ borderRadius: 12, border: "none", background: word.starred ? "#FEF3C7" : "rgba(0,0,0,0.05)", color: word.starred ? "#F59E0B" : "#94a3b8" }}>
                            {word.starred ? "⭐" : "☆"}
                        </button>
                        <button className="btn btn-ico btn-p" onClick={() => speakSv(word.sv)} style={{ borderRadius: 12 }}>🔊</button>
                        <button className="btn btn-ico btn-s" onClick={onEdit} style={{ borderRadius: 12 }}>✏️</button>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
                    {vCats.map(cName => {
                        const t = tags.find(tag => tag.name === cName);
                        const bg = t?.color || T.pink;
                        const isDark = (color) => {
                            const hex = color.replace('#', '');
                            const r = parseInt(hex.substr(0, 2), 16);
                            const g = parseInt(hex.substr(2, 2), 16);
                            const b = parseInt(hex.substr(4, 2), 16);
                            const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                            return brightness < 155;
                        };
                        return <span key={cName} className="bdg" style={{ background: bg, color: isDark(bg) ? "#fff" : T.text, fontSize: 11, padding: "3px 10px" }}>{cName}</span>
                    })}
                </div>

                {ai?.definitions?.length > 0 && (
                    <div style={{ marginBottom: 13 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: T.textL, marginBottom: 7 }}>ĐỊNH NGHĨA</div>
                        {ai.definitions.map((d, i) => (
                            <div key={i} style={{ fontSize: 14, color: T.text, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${T.pinkL}`, lineHeight: 1.6 }}>{d.vi}</div>
                        ))}
                    </div>
                )}

                {ai?.examples?.length > 0 && (
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: T.textL, marginBottom: 7, textTransform: "uppercase" }}>💬 Ví dụ sử dụng</div>
                        {ai.examples.map((ex, ei) => (
                            <div key={ei} style={{ marginBottom: 8, background: "#f8fafc", padding: "10px 14px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                                <div style={{ fontWeight: 700, color: T.purple, fontSize: 14 }}><SvFlag size={14} /> {ex.sv}</div>
                                <div style={{ fontSize: 13, color: T.text, marginTop: 4 }}><VnFlag size={14} /> {ex.vi}</div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    className="btn btn-s"
                    style={{ width: "100%", marginBottom: 10, fontSize: 13, padding: "8px" }}
                    onClick={() => {
                        window.location.search = `?q=${encodeURIComponent(word.sv)}`;
                    }}>
                    📖 Tra cứu đầy đủ trên Từ Điển
                </button>

                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                    <button className="btn btn-s" style={{ flex: 1, color: "#ef4444", fontWeight: 700, borderRadius: 12, height: 46 }} onClick={() => onDelete(word.id)}>🗑️ Xóa từ</button>
                    <button className="btn btn-p" style={{ flex: 1.5, borderRadius: 12, height: 46 }} onClick={onClose}>Xong</button>
                </div>
            </div>
        </div>
    );
}

export function AddWordModal({ tags, onClose, onSave }) {
    const [sv, setSv] = useState("");
    const [sugs, setSugs] = useState([]);
    const [showSug, setShowSug] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ai, setAi] = useState(null);
    const [viVal, setViVal] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const debRef = useRef(null);

    function handleSvChange(val) {
        setSv(sanitize(val));
        setAi(null);
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
        const res = await lookupWordFull(word);
        if (res?.aiData) {
            setAi(res.aiData);
            setViVal(res.aiData.viMeaning || "");
            speakSv(res.aiData.word || word, true);
        }
        setLoading(false);
    }

    function doSave() {
        if (!sv.trim() || !viVal.trim()) return;
        onSave({
            sv: sanitize(sv),
            vi: sanitize(viVal),
            categories: selectedTags,
            category: selectedTags[0] || "",
            aiData: ai || null,
        });
    }

    return (
        <div className="ov" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="sec-title" style={{ marginBottom: 22 }}>✨ Thêm từ mới</div>
                <div style={{ position: "relative", marginBottom: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.textL, display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}><SvFlag size={14} /> Từ tiếng Thụy Điển</label>
                    <input className="inp" placeholder="Gõ từ..." value={sv} onChange={(e) => handleSvChange(e.target.value)} onFocus={() => sugs.length > 0 && setShowSug(true)} onBlur={() => setTimeout(() => setShowSug(false), 200)} />
                    {loading && <div style={{ fontSize: 11, color: T.pink, marginTop: 6, fontWeight: 700, fontStyle: "italic", animation: "fadeIn 0.3s" }}>⏳ Đang tra từ điển và phân tích ngữ pháp...</div>}
                    {showSug && (
                        <div className="sug-wrap">
                            {sugs.map((s, i) => <div key={i} className="sug-item" onMouseDown={() => pickWord(s)}>🔍 {s}</div>)}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.textL, display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}><VnFlag size={14} /> Nghĩa tiếng Việt</label>
                    <input className="inp" value={viVal} onChange={(e) => setViVal(sanitize(e.target.value))} />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.textL, display: "block", marginBottom: 5 }}>🏷️ Nhãn (Chọn nhiều)</label>
                    <TagSelector
                        allTags={tags}
                        selectedNames={selectedTags}
                        onAdd={(name) => setSelectedTags([...new Set([...selectedTags, name])])}
                        onRemove={(name) => setSelectedTags(selectedTags.filter(t => t !== name))}
                    />
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
                    <button className="btn btn-s" style={{ flex: 1, height: 48, borderRadius: 12 }} onClick={onClose}>Hủy</button>
                    <button className="btn btn-p" style={{ flex: 2, height: 48, borderRadius: 12 }} onClick={doSave} disabled={!sv.trim() || !viVal.trim() || loading}>Lưu từ vào sổ tay</button>
                </div>
            </div>
        </div>
    );
}

export function EditWordModal({ tags, word, isMulti, multiMode, onClose, onSave }) {
    const [sv, setSv] = useState(word?.sv || "");
    const [vi, setVi] = useState(word?.vi || "");
    const [selectedTags, setSelectedTags] = useState(isMulti ? [] : (word?.categories || (word?.category ? [word?.category] : [])));

    const title = isMulti ? (multiMode === "add" ? "Thêm nhãn cho các từ đã chọn" : "Gỡ nhãn khỏi các từ đã chọn") : "Sửa từ vựng";

    return (
        <div className="ov" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="sec-title">{title}</div>

                {!isMulti && (
                    <>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontSize: 12, fontWeight: 700, color: T.textL, display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}><SvFlag size={14} /> Tiếng Thụy Điển</label>
                            <input className="inp" value={sv} onChange={e => setSv(sanitize(e.target.value))} />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontSize: 12, fontWeight: 700, color: T.textL, display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}><VnFlag size={14} /> Tiếng Việt</label>
                            <input className="inp" value={vi} onChange={e => setVi(sanitize(e.target.value))} />
                        </div>
                    </>
                )}

                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.textL, display: "block", marginBottom: 5 }}>🏷️ {multiMode === "remove" ? "Chọn nhãn cần gỡ" : "Chọn nhãn"}</label>
                    <TagSelector
                        allTags={tags}
                        selectedNames={selectedTags}
                        onAdd={(name) => setSelectedTags([...new Set([...selectedTags, name])])}
                        onRemove={(name) => setSelectedTags(selectedTags.filter(t => t !== name))}
                    />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    <button className="btn btn-s" style={{ flex: 1 }} onClick={onClose}>Hủy</button>
                    {isMulti ? (
                        multiMode === "add" ? (
                            <button className="btn btn-p" style={{ flex: 2 }} onClick={() => onSave(selectedTags, "add")} disabled={selectedTags.length === 0}>Xác nhận Thêm</button>
                        ) : (
                            <button className="btn" style={{ flex: 2, background: "#fee2e2", color: "#ef4444", fontWeight: 700 }} onClick={() => onSave(selectedTags, "remove")} disabled={selectedTags.length === 0}>Xác nhận Gỡ</button>
                        )
                    ) : (
                        <button className="btn btn-p" style={{ flex: 2 }} onClick={() => onSave({ ...word, sv, vi, categories: selectedTags, category: selectedTags[0] || "Chung" })}>Lưu thay đổi</button>
                    )}
                </div>
            </div>
        </div>
    );
}
