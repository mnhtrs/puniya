import { useState, useRef } from "react";
import { T, getCatColor } from "../constants/theme";
import { speakSv } from "../services/api";
import { dbAdd, dbPut, dbDelete } from "../services/db";
import { WordDetailModal, AddWordModal, EditWordModal, TagManagerModal } from "../components/Modals";
import { SvFlag } from "../components/SvFlag";
import { VnFlag } from "../components/VnFlag";
import { UkFlag } from "../components/UkFlag";

export default function VocabPage({ vocab, setVocab, tags, setTags }) {
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("Tất cả");
    const [showAdd, setShowAdd] = useState(false);
    const [showTagMgr, setShowTagMgr] = useState(false);
    const [detail, setDetail] = useState(null);
    const [editWord, setEditWord] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const [selMode, setSelMode] = useState(false);
    const pressRef = useRef(null);

    const vpCats = ["Tất cả", ...new Set(vocab.flatMap((v) => v.categories || (v.category ? [v.category] : [])))];

    const vpFiltered = vocab.filter((v) => {
        const ms = !search || v.sv.toLowerCase().includes(search.toLowerCase()) || v.vi.includes(search);
        const vCats = v.categories || (v.category ? [v.category] : []);
        const mc = cat === "Tất cả" || vCats.includes(cat);
        return ms && mc;
    });

    function startPress(id) {
        pressRef.current = setTimeout(() => {
            setSelMode(true);
            toggleSel(id);
        }, 500);
    }
    function cancelPress() {
        if (pressRef.current) clearTimeout(pressRef.current);
    }

    function toggleSel(id) {
        setSelected((prev) => {
            const s = new Set(prev);
            if (s.has(id)) s.delete(id);
            else s.add(id);
            return s;
        });
    }

    function handleTap(word) {
        if (selMode) {
            toggleSel(word.id);
            if (selected.size === 0) setSelMode(false);
        } else {
            setDetail(word);
        }
    }

    async function deleteSelected() {
        if (!confirm(`Xóa ${selected.size} từ đã chọn?`)) return;
        for (const id of selected) await dbDelete("vocab", id);
        setVocab((prev) => prev.filter((v) => !selected.has(v.id)));
        setSelected(new Set());
        setSelMode(false);
    }

    async function addTagsToSelected(newTags) {
        const updatedVocab = [...vocab];
        for (const id of selected) {
            const idx = updatedVocab.findIndex(v => v.id === id);
            if (idx !== -1) {
                const item = updatedVocab[idx];
                const currentCats = item.categories || (item.category ? [item.category] : []);
                const merged = [...new Set([...currentCats, ...newTags.map(t => t.name)])];
                const updatedItem = { ...item, categories: merged, category: merged[0] || "" };
                await dbPut("vocab", updatedItem);
                updatedVocab[idx] = updatedItem;
            }
        }
        setVocab(updatedVocab);
        setSelected(new Set());
        setSelMode(false);
    }

    async function handleSaveNew(data) {
        const entry = { ...data, createdAt: Date.now() };
        const id = await dbAdd("vocab", entry);
        setVocab((prev) => [...prev, { ...entry, id }]);
        setShowAdd(false);
    }

    async function handleEdit(updated) {
        await dbPut("vocab", updated);
        setVocab((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
        setEditWord(null);
        setDetail(null);
    }

    async function handleDelete(id) {
        await dbDelete("vocab", id);
        setVocab((prev) => prev.filter((v) => v.id !== id));
        setDetail(null);
    }

    async function handleStar(id, starred) {
        const item = vocab.find(v => v.id === id);
        if (!item) return;
        const updated = { ...item, starred };
        await dbPut("vocab", updated);
        setVocab(prev => prev.map(v => v.id === id ? updated : v));
        if (detail && detail.id === id) setDetail(updated);
    }

    async function toggleStar(word) {
        const updated = { ...word, starred: !word.starred };
        await dbPut("vocab", updated);
        setVocab((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    }

    return (
        <div className="main">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
                <div className="sec-title" style={{ marginBottom: 0 }}>📚 Sổ tay từ vựng ({vpFiltered.length})</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button className="btn btn-s" style={{ height: 42, padding: "0 14px", display: "flex", gap: 6, fontSize: 13 }} onClick={() => setShowTagMgr(true)}>
                        🏷️ <span style={{ fontWeight: 800 }}>Quản lý nhãn</span>
                    </button>
                    {!selMode && <button className="btn btn-p" style={{ padding: "0 16px", borderRadius: 12, height: 42, fontSize: 13 }} onClick={() => setShowAdd(true)}>+ Thêm từ</button>}
                </div>
            </div>

            <div className="s-wrap">
                <span className="s-ico">🔍</span>
                <input className="inp inp-ico" placeholder="Tìm từ, nghĩa hoặc nhãn..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="tabs" style={{ marginBottom: 18 }}>
                {vpCats.map((c) => (
                    <div key={c} className={`tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c || "Chung"}</div>
                ))}
            </div>

            <div className="vocab-list">
                {vpFiltered.length > 0 ? (
                    vpFiltered.map((v) => {
                        const isS = selected.has(v.id);
                        const vCats = v.categories || (v.category ? [v.category] : []);
                        return (
                            <div
                                key={v.id}
                                className={`vi-item ${isS ? "selected" : ""}`}
                                onMouseDown={() => startPress(v.id)}
                                onMouseUp={cancelPress}
                                onMouseLeave={cancelPress}
                                onTouchStart={() => startPress(v.id)}
                                onTouchEnd={cancelPress}
                                onClick={() => handleTap(v)}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 18, fontWeight: 900, color: T.pink, display: "flex", alignItems: "baseline", gap: 8, lineHeight: 1.2 }}>
                                        {v.sv}
                                        {v.aiData?.ipa && <span style={{ fontSize: 12, color: T.textL, fontWeight: 500, opacity: 0.8 }}>{v.aiData.ipa}</span>}
                                    </div>
                                    <div style={{ fontSize: 13, color: T.textL, marginTop: 4, fontWeight: 600 }}>{v.vi}</div>
                                    {v.aiData?.partOfSpeech && (
                                        <div style={{
                                            fontSize: 10, background: T.purpleP, color: T.purple,
                                            padding: "2px 6px", borderRadius: 4, width: "fit-content",
                                            fontWeight: 800, marginTop: 6, textTransform: "uppercase"
                                        }}>
                                            {v.aiData.partOfSpeech}
                                        </div>
                                    )}
                                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
                                        {vCats.map(cName => {
                                            const t = tags.find(tag => tag.name === cName);
                                            const bg = t?.color || T.pink;
                                            // Hàm tính độ sáng để chọn màu chữ (Contrast)
                                            const isDark = (color) => {
                                                const hex = color.replace('#', '');
                                                const r = parseInt(hex.substr(0, 2), 16);
                                                const g = parseInt(hex.substr(2, 2), 16);
                                                const b = parseInt(hex.substr(4, 2), 16);
                                                const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                                                return brightness < 155;
                                            };
                                            if (cName === "Chung" || !cName || cName === "Từ điển") return null;
                                            return (
                                                <span key={cName} className="bdg" style={{
                                                    background: bg,
                                                    color: isDark(bg) ? "#fff" : T.text,
                                                    fontSize: 9,
                                                    padding: "2px 8px"
                                                }}>
                                                    {cName}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <button
                                        className="btn btn-ico"
                                        style={{ width: 34, height: 34, background: v.starred ? "#FEF3C7" : "rgba(0,0,0,0.05)", color: v.starred ? "#F59E0B" : "#94a3b8", fontSize: 14, border: "none" }}
                                        onClick={(e) => { e.stopPropagation(); handleStar(v.id, !v.starred); }}
                                    >
                                        {v.starred ? "⭐" : "☆"}
                                    </button>
                                    <button className="btn btn-ico" style={{ width: 34, height: 34, background: "rgba(255, 107, 157, 0.1)", color: T.pink, border: "none" }} onClick={(e) => { e.stopPropagation(); speakSv(v.sv); }}>
                                        🔊
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty" style={{ gridColumn: "1/-1", padding: 40, textAlign: "center" }}>
                        <div className="e-ico" style={{ fontSize: 50, marginBottom: 10 }}>📔</div>
                        <p style={{ color: T.textL, fontWeight: 700 }}>{search ? "Không tìm thấy từ nào..." : "Sổ tay của bạn đang trống."}</p>
                    </div>
                )}
            </div>

            {selMode && (
                <div className="sel-actions">
                    <button className="btn btn-s" style={{ flex: 1, height: 46 }} onClick={() => { setSelMode(false); setSelected(new Set()); }}>Đóng</button>
                    <button className="btn" style={{ flex: 1.2, background: "#f1f5f9", height: 46 }} onClick={() => setEditWord({ multiTag: true })}>🏷️ Nhãn</button>
                    <button className="btn" style={{ flex: 1, background: "#fee2e2", color: "#ef4444", height: 46 }} onClick={deleteSelected}>🗑️ Xóa</button>
                </div>
            )}

            {showAdd && <AddWordModal tags={tags} onClose={() => setShowAdd(false)} onSave={handleSaveNew} />}
            {detail && <WordDetailModal tags={tags} word={detail} onClose={() => setDetail(null)} onDelete={handleDelete} onEdit={() => setEditWord(detail)} onStar={handleStar} />}
            {editWord && !editWord.multiTag && <EditWordModal tags={tags} word={editWord} onClose={() => setEditWord(null)} onSave={handleEdit} />}
            {editWord && editWord.multiTag && <EditWordModal tags={tags} isMulti onClose={() => setEditWord(null)} onSave={addTagsToSelected} />}
            {showTagMgr && <TagManagerModal tags={tags} setTags={setTags} onClose={() => setShowTagMgr(false)} />}
        </div>
    );
}
