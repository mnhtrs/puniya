import { useState, useRef, useEffect } from "react";
import { T } from "../constants/theme";
import { speakSv } from "../services/api";
import { dbAdd, dbPut, dbDelete } from "../services/db";
import { WordDetailModal, AddWordModal, EditWordModal, TagManagerModal } from "../components/Modals";

export default function VocabPage({ vocab, setVocab, tags, setTags }) {
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("Tất cả");
    const [showAdd, setShowAdd] = useState(false);
    const [showTagMgr, setShowTagMgr] = useState(false);
    const [showMultiDelete, setShowMultiDelete] = useState(false);
    const [detail, setDetail] = useState(null);
    const [editWord, setEditWord] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const [selMode, setSelMode] = useState(false);
    const [vHistory, setVHistory] = useState(() => {
        try { return JSON.parse(localStorage.getItem("puniya_vocab_history") || "[]"); }
        catch { return []; }
    });
    const [showVSug, setShowVSug] = useState(false);
    const [vSugs, setVSugs] = useState([]);
    const isLP = useRef(false);

    useEffect(() => {
        localStorage.setItem("puniya_vocab_history", JSON.stringify(vHistory));
    }, [vHistory]);

    function handleVocabSearchChange(val) {
        setSearch(val);
        if (!val.trim()) {
            if (vHistory.length > 0) {
                setVSugs(vHistory);
                setShowVSug(true);
            } else {
                setShowVSug(false);
            }
        } else {
            setShowVSug(false);
        }
    }

    function doVocabSearch(term) {
        setSearch(term);
        setShowVSug(false);
        if (!term.trim()) return;
        setVHistory(prev => {
            const newH = [term, ...prev.filter(h => h.toLowerCase() !== term.toLowerCase())].slice(0, 10);
            return newH;
        });
    }

    function removeVHistoryItem(e, item) {
        e.stopPropagation();
        setVHistory(prev => prev.filter(h => h !== item));
    }

    const pressRef = useRef(null);

    const vpCats = ["Tất cả", ...new Set(vocab.flatMap((v) => v.categories || (v.category ? [v.category] : [])))];

    const vpFiltered = vocab.filter((v) => {
        const ms = !search || v.sv.toLowerCase().includes(search.toLowerCase()) || v.vi.toLowerCase().includes(search.toLowerCase());
        const vCats = v.categories || (v.category ? [v.category] : []);
        const mc = cat === "Tất cả" || vCats.includes(cat);
        return ms && mc;
    });

    function startPress(id) {
        isLP.current = false;
        pressRef.current = setTimeout(() => {
            isLP.current = true;
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
        if (isLP.current) {
            isLP.current = false;
            return;
        }
        if (selMode) {
            toggleSel(word.id);
        } else {
            setDetail(word);
        }
    }

    useEffect(() => {
        if (selected.size === 0) setSelMode(false);
    }, [selected]);

    async function deleteSelected() {
        for (const id of selected) await dbDelete("vocab", id);
        setVocab((prev) => prev.filter((v) => !selected.has(v.id)));
        setSelected(new Set());
        setSelMode(false);
        setShowMultiDelete(false);
    }

    async function bulkUpdateTags(tagNames, action = "add") {
        const updatedVocab = [...vocab];
        for (const id of selected) {
            const idx = updatedVocab.findIndex(v => v.id === id);
            if (idx !== -1) {
                const item = updatedVocab[idx];
                const currentCats = item.categories || (item.category ? [item.category] : []);
                let nextCats;
                if (action === "add") {
                    nextCats = [...new Set([...currentCats, ...tagNames])];
                } else {
                    nextCats = currentCats.filter(c => !tagNames.includes(c));
                }
                const updatedItem = { ...item, categories: nextCats, category: nextCats[0] || "" };
                await dbPut("vocab", updatedItem);
                updatedVocab[idx] = updatedItem;
            }
        }
        setVocab(updatedVocab);
        setSelected(new Set());
        setSelMode(false);
        setEditWord(null);
    }

    async function handleSaveNew(data) {
        const newSv = data.sv.trim().toLowerCase();
        const exists = vocab.some(v => v.sv.trim().toLowerCase() === newSv);

        if (exists) {
            alert(`⚠️ Từ "${data.sv}" đã có trong sổ tay của bạn rồi!`);
            return;
        }

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

    return (
        <div className="main">
            <div style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 13, display: selMode ? "none" : "flex" }}>
                <div className="sec-title" style={{ marginBottom: 0, flex: "1 1 auto", minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <i className="fa-solid fa-book" style={{ color: T.pink }}></i>
                    <span>Sổ tay từ vựng ({vpFiltered.length})</span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <button className="btn btn-s vocab-header-btn" onClick={() => setShowTagMgr(true)} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <i className="fa-solid fa-tags"></i>
                        <span>Nhãn</span>
                    </button>
                    <button className="btn btn-p vocab-header-btn" onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <i className="fa-solid fa-plus"></i>
                        <span>Thêm</span>
                    </button>
                </div>
            </div>

            <div className="s-wrap" style={{ position: "relative" }}>
                <span className="s-ico">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                    className="inp inp-ico"
                    placeholder="Tìm từ Thuỵ Điển hoặc nghĩa tiếng Việt..."
                    value={search}
                    onChange={(e) => handleVocabSearchChange(e.target.value)}
                    onFocus={() => {
                        if (!search.trim() && vHistory.length > 0) {
                            setVSugs(vHistory);
                            setShowVSug(true);
                        }
                    }}
                    onBlur={() => setTimeout(() => setShowVSug(false), 200)}
                    onKeyDown={(e) => e.key === "Enter" && doVocabSearch(search)}
                    autoComplete="off"
                />
                {showVSug && (
                    <div className="sug-wrap" style={{ top: "100%", zIndex: 100 }}>
                        <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: T.pink, display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.border}` }}>
                            <span>
                                <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: 6 }}></i>
                                TÌM KIẾM GẦN ĐÂY
                            </span>
                            <span onMouseDown={(e) => { e.preventDefault(); setVHistory([]); }} style={{ cursor: "pointer", opacity: 0.8 }}>Xoá hết</span>
                        </div>
                        {vSugs.map((v, i) => (
                            <div key={i} className="sug-item" onMouseDown={(e) => { e.preventDefault(); doVocabSearch(v); }}>
                                <span style={{ marginRight: 10, opacity: 0.5 }}>
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                </span>
                                {v}
                                <span onMouseDown={(e) => { e.preventDefault(); removeVHistoryItem(e, v); }} style={{ float: "right", padding: "0 5px", color: T.pink, opacity: 0.5 }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selMode && (
                <div style={{ marginBottom: 15, padding: "10px 15px", background: T.pinkP, borderRadius: 14, border: `2px solid ${T.pinkL}`, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, fontWeight: 800, color: T.pink, display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fa-solid fa-check-double"></i>
                        <span>Đã chọn {selected.size} từ</span>
                    </div>
                    <button className="btn btn-p" style={{ height: 32, padding: "0 12px", fontSize: 13 }} onClick={() => {
                        if (selected.size === vpFiltered.length) setSelected(new Set());
                        else setSelected(new Set(vpFiltered.map(v => v.id)));
                    }}>
                        {selected.size === vpFiltered.length ? "Bỏ chọn" : "Chọn tất cả"}
                    </button>
                </div>
            )}

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
                                style={{ position: "relative" }}
                            >
                                {selMode && (
                                    <div style={{
                                        width: 22, height: 22, borderRadius: "50%",
                                        border: `2px solid ${isS ? T.pink : "#cbd5e1"}`,
                                        background: isS ? T.pink : "transparent",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "white", fontSize: 11, flexShrink: 0
                                    }}>
                                        {isS && <i className="fa-solid fa-check"></i>}
                                    </div>
                                )}
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
                                        title={v.starred ? "Bỏ yêu thích" : "Đánh dấu yêu thích"}
                                    >
                                        <i className={v.starred ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                                    </button>
                                    <button className="btn btn-ico" style={{ width: 34, height: 34, background: "rgba(255, 107, 157, 0.1)", color: T.pink, border: "none" }} onClick={(e) => { e.stopPropagation(); speakSv(v.sv); }} title="Nghe phát âm">
                                        <i className="fa-solid fa-volume-high"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty" style={{ gridColumn: "1/-1", padding: 40, textAlign: "center" }}>
                        <div className="e-ico" style={{ fontSize: 44, marginBottom: 10, color: T.pink }}>
                            <i className="fa-solid fa-book-bookmark"></i>
                        </div>
                        <p style={{ color: T.textL, fontWeight: 700 }}>{search ? "Không tìm thấy từ nào..." : "Sổ tay của bạn đang trống."}</p>
                    </div>
                )}
            </div>

            {selMode && (
                <div className="sel-actions" style={{ bottom: 80, padding: "10px 15px", gap: 8, maxWidth: "450px", width: "94%" }}>
                    <button className="btn" style={{ flex: 1, background: "#f1f5f9", height: 40, fontSize: 11, fontWeight: 700, color: T.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }} onClick={() => setEditWord({ multiTag: true, mode: "remove" })}>
                        <i className="fa-solid fa-tag fa-slash"></i> Gỡ nhãn
                    </button>
                    <button className="btn" style={{ flex: 1, background: T.pinkP, height: 40, fontSize: 11, fontWeight: 700, color: T.pink, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }} onClick={() => setEditWord({ multiTag: true, mode: "add" })}>
                        <i className="fa-solid fa-tag"></i> Thêm nhãn
                    </button>
                    <button className="btn" style={{ padding: "0 14px", background: "#fee2e2", color: "#ef4444", height: 40, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }} onClick={() => setShowMultiDelete(true)}>
                        <i className="fa-solid fa-trash-can"></i> Xóa
                    </button>
                </div>
            )}

            {showMultiDelete && (
                <div className="ov" onClick={() => setShowMultiDelete(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: "30px 25px", textAlign: "center" }}>
                        <div style={{ fontSize: 44, color: "#ef4444", marginBottom: 15 }}>
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <div className="sec-title" style={{ fontSize: 20, marginBottom: 8, textAlign: "center" }}>Xác nhận xóa</div>
                        <div style={{ color: T.textL, marginBottom: 25, fontSize: 15 }}>Bạn có chắc chắn muốn xóa vĩnh viễn {selected.size} từ vựng đã chọn không?</div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button className="btn btn-s" style={{ flex: 1 }} onClick={() => setShowMultiDelete(false)}>Hủy</button>
                            <button className="btn" style={{ flex: 1, background: "#ef4444", color: "#fff", fontWeight: 800 }} onClick={deleteSelected}>Xóa ngay</button>
                        </div>
                    </div>
                </div>
            )}

            {showAdd && <AddWordModal tags={tags} onClose={() => setShowAdd(false)} onSave={handleSaveNew} />}
            {detail && <WordDetailModal tags={tags} word={detail} onClose={() => setDetail(null)} onDelete={handleDelete} onEdit={() => setEditWord(detail)} onStar={handleStar} />}
            {editWord && !editWord.multiTag && <EditWordModal tags={tags} word={editWord} onClose={() => setEditWord(null)} onSave={handleEdit} />}
            {editWord && editWord.multiTag && <EditWordModal tags={tags} isMulti multiMode={editWord.mode} onClose={() => setEditWord(null)} onSave={bulkUpdateTags} />}
            {showTagMgr && <TagManagerModal tags={tags} setTags={setTags} onClose={() => setShowTagMgr(false)} />}
        </div>
    );
}
