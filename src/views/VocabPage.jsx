import { useState, useRef } from "react";
import { T, getCatColor } from "../constants/theme";
import { speakSv } from "../services/api";
import { dbAdd, dbPut, dbDelete } from "../services/db";
import { WordDetailModal, AddWordModal, EditWordModal } from "../components/Modals";

export default function VocabPage({ vocab, setVocab }) {
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("Tất cả");
    const [showAdd, setShowAdd] = useState(false);
    const [detail, setDetail] = useState(null);
    const [editWord, setEditWord] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const [selMode, setSelMode] = useState(false);
    const pressRef = useRef(null);

    const vpCats = ["Tất cả", ...new Set(vocab.map((v) => v.category).filter(Boolean))];
    const vpFiltered = vocab.filter((v) => {
        const ms = !search || v.sv.toLowerCase().includes(search.toLowerCase()) || v.vi.includes(search);
        const mc = cat === "Tất cả" || v.category === cat;
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
            if (selected.size === 1 && selected.has(word.id)) setSelMode(false);
        } else {
            setDetail(word);
        }
    }

    async function deleteSelected() {
        for (const id of selected) await dbDelete("vocab", id);
        setVocab((prev) => prev.filter((v) => !selected.has(v.id)));
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

    async function toggleStar(word) {
        const updated = { ...word, starred: !word.starred };
        await dbPut("vocab", updated);
        setVocab((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    }

    return (
        <div className="main">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
                <div className="sec-title" style={{ marginBottom: 0 }}>📚 Sổ tay từ vựng</div>
                <div style={{ display: "flex", gap: 8 }}>
                    {selMode && (
                        <>
                            <button
                                className="btn btn-sm"
                                style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 10 }}
                                onClick={deleteSelected}
                            >
                                🗑️ {selected.size}
                            </button>
                            <button
                                className="btn btn-s btn-sm"
                                onClick={() => {
                                    setSelMode(false);
                                    setSelected(new Set());
                                }}
                            >
                                ✕
                            </button>
                        </>
                    )}
                    <button className="btn btn-p btn-sm" onClick={() => setShowAdd(true)}>+ Thêm từ</button>
                </div>
            </div>

            <div className="s-wrap">
                <span className="s-ico">🔍</span>
                <input
                    className="inp inp-ico"
                    placeholder="Tìm từ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="tabs">
                {vpCats.map((c) => (
                    <div key={c} className={`tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
                        {c}
                    </div>
                ))}
            </div>

            {vpFiltered.length === 0 ? (
                <div className="empty">
                    <div className="e-ico">📭</div>
                    <p>Chưa có từ nào. Thêm từ mới nhé!</p>
                </div>
            ) : (
                vpFiltered.map((v) => {
                    const col = getCatColor(v.category);
                    const isSel = selected.has(v.id);
                    return (
                        <div
                            key={v.id}
                            className={`vi-item ${isSel ? "selected" : ""}`}
                            onClick={() => handleTap(v)}
                            onMouseDown={() => startPress(v.id)}
                            onMouseUp={cancelPress}
                            onTouchStart={() => startPress(v.id)}
                            onTouchEnd={cancelPress}
                        >
                            {selMode && <div className={`check-ico ${isSel ? "checked" : ""}`}>{isSel ? "✓" : ""}</div>}
                            <button
                                className="btn btn-ico"
                                style={{ background: "transparent", flexShrink: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    speakSv(v.sv);
                                }}
                            >
                                🔊
                            </button>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 16, fontWeight: 800, color: T.pink }}>{v.sv}</div>
                                {v.aiData?.pronunciation && <div style={{ fontSize: 11, color: T.purple, fontWeight: 600 }}>{v.aiData.pronunciation}</div>}
                                <div style={{ fontSize: 13, color: T.textL }}>{v.vi}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                                {v.category && (
                                    <span className="bdg" style={{ background: col.bg, color: col.text, border: `1px solid ${col.border}` }}>
                                        {v.category}
                                    </span>
                                )}
                                <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                                    {[1, 2, 3, 4].map((lvl) => (
                                        <div
                                            key={lvl}
                                            style={{
                                                width: 12,
                                                height: 4,
                                                borderRadius: 2,
                                                background: lvl <= (v.srsLevel || 0) ? (v.srsLevel >= 4 ? "#22c55e" : v.srsLevel >= 3 ? "#3b82f6" : v.srsLevel >= 2 ? "#f59e0b" : "#ec4899") : "#e5e7eb",
                                            }}
                                        />
                                    ))}
                                </div>
                                <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
                                    <button
                                        className="btn btn-sm"
                                        style={{ fontSize: 13, padding: "2px 6px", background: "transparent", border: "none" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleStar(v);
                                        }}
                                    >
                                        {v.starred ? "⭐" : "☆"}
                                    </button>
                                    {!selMode && (
                                        <button
                                            className="btn btn-sm btn-s"
                                            style={{ fontSize: 11, padding: "4px 8px" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditWord(v);
                                            }}
                                        >
                                            ✏️
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}

            {showAdd && <AddWordModal onClose={() => setShowAdd(false)} onSave={handleSaveNew} />}
            {detail && <WordDetailModal word={detail} onClose={() => setDetail(null)} onDelete={handleDelete} />}
            {editWord && <EditWordModal word={editWord} onClose={() => setEditWord(null)} onSave={handleEdit} />}
        </div>
    );
}
