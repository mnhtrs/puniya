import { useState, useRef, useEffect, useMemo } from "react";
import { T } from "../constants/theme";

// ============================================================
// CONSTANTS & MODELS
// ============================================================
const GROQ_MODELS = [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", context: "128k", desc: "Mạnh nhất, thông minh & đa năng" },
    { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill", context: "128k", desc: "Tối ưu suy luận & phân tích sâu" },
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", context: "128k", desc: "Tốc độ siêu nhanh, phản hồi tức thì" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", context: "32k", desc: "Chuyên gia đa nhiệm" },
    { id: "qwen-2.5-32b", name: "Qwen 2.5 32B", context: "32k", desc: "Mạnh mẽ về lập trình & toán học" },
    { id: "gemma2-9b-it", name: "Gemma2 9B", context: "8k", desc: "Gọn nhẹ, tối ưu từ Google" },
    { id: "llama-3.2-3b-preview", name: "Llama 3.2 3B", context: "8k", desc: "Thế hệ mới Lite" },
    { id: "llama-3.2-1b-preview", name: "Llama 3.2 1B", context: "8k", desc: "Siêu nhẹ & Nhanh" }
];

const DEFAULT_MODEL = GROQ_MODELS[0].id;
const BOT_AVATAR = "/hachiware.png";

const SYSTEM_PROMPT = `Bạn là Puniya AI — trợ lý học tiếng Thuỵ Điển cho người Việt.
QUY TẮC: Bạn là trợ lý ảo của Phương (Nước Sôi Ấm Áp). Luôn thân thiện, dùng emoji nhưng KHÔNG được dùng icon lá cờ hay biểu tượng quốc gia. Trả lời bằng tiếng Việt, giải thích từ vựng kỹ (Nghĩa, IPA, Ví dụ). KHÔNG trả lời lạc đề ngoài việc học tiếng hoặc trang web Puniya.`;

// ============================================================
// HELPERS
// ============================================================
function formatMessage(text) {
    if (!text) return "";
    let clean = text.replace(/v\ufffd\ufffd/g, 'về').replace(/\ufffd/g, ''); 
    let html = clean.replace(/\n/g, '<br/>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code class="p-inline-code">$1</code>');
    return html;
}

const RenameModal = ({ isOpen, onClose, currentName, onSave }) => {
    const [val, setVal] = useState(currentName);
    useEffect(() => { if (isOpen) setVal(currentName); }, [isOpen, currentName]);
    if (!isOpen) return null;
    return (
        <div className="p-ovl" onClick={onClose} style={{ zIndex: 100000 }}>
            <div className="p-modal-card" onClick={e => e.stopPropagation()}>
                <h3 className="pm-t">Đổi tên nha Phương ✏️</h3>
                <input className="pm-input" value={val} onChange={e => setVal(e.target.value)} autoFocus />
                <div className="pm-btns">
                    <button className="pm-btn-c" onClick={onClose}>Huỷ</button>
                    <button className="pm-btn-s" onClick={() => { onSave(val); onClose(); }}>Lưu luôn</button>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function AIChatPage({ vocab }) {
    const [threads, setThreads] = useState(() => {
        try {
            const saved = localStorage.getItem("puniya_chats_v9");
            if (saved) return JSON.parse(saved);
            return [{ id: Date.now(), title: "Nhật ký của Phương 🧸", model: DEFAULT_MODEL, messages: [] }];
        } catch { return [{ id: Date.now(), title: "Nhật ký của Phương 🧸", model: DEFAULT_MODEL, messages: [] }]; }
    });
    const [activeId, setActiveId] = useState(() => {
        const last = localStorage.getItem("puniya_active_v9");
        return last ? Number(last) : (threads[0]?.id || Date.now());
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModels, setShowModels] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [renameState, setRenameState] = useState({ open: false, id: null, name: "" });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState("");

    const scrollRef = useRef(null);
    const pickerRef = useRef(null);
    const textareaRef = useRef(null);

    const activeIdx = threads.findIndex(t => t.id === activeId);
    const thread = activeIdx !== -1 ? threads[activeIdx] : (threads[0] || { messages: [] });

    useEffect(() => { localStorage.setItem("puniya_chats_v9", JSON.stringify(threads)); }, [threads]);
    useEffect(() => { localStorage.setItem("puniya_active_v9", activeId.toString()); }, [activeId]);
    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [thread.messages, loading]);

    const dynamicSuggestions = useMemo(() => {
        const base = ["Dạy tớ cách chào hỏi tự nhiên 🌸", "Luyện nói một đoạn hội thoại cơ bản!"];
        if (vocab && vocab.length > 0) {
            const lastWords = vocab.slice(-3);
            lastWords.forEach(w => base.unshift(`Dạy tớ cách dùng từ '${w.word || w.sv}' nhé!`));
        }
        return base.slice(0, 4);
    }, [vocab]);

    useEffect(() => {
        const handleClickOutside = (e) => { if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowModels(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "inherit";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleNew = () => {
        const id = Date.now();
        const nt = { id, title: "Nhật ký của Phương 🧸", model: DEFAULT_MODEL, messages: [] };
        setThreads(ts => [nt, ...ts]);
        setActiveId(id);
        setSidebarOpen(false);
    };

    const handleDelete = (id) => {
        if (threads.length === 1) return;
        const filtered = threads.filter(t => t.id !== id);
        setThreads(filtered);
        if (activeId === id) setActiveId(filtered[0].id);
    };

    async function onSend(customText) {
        const msgText = (typeof customText === 'string' ? customText : input).trim();
        if (!msgText || loading) return;
        const nowMs = Date.now();
        const nextMsgs = [...thread.messages, { role: "user", content: msgText, timestamp: nowMs }];
        setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: nextMsgs } : t));
        setInput("");
        setLoading(true);

        try {
            const history = nextMsgs.slice(-10).map(m => ({ role: m.role || "user", content: m.content }));
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: thread.model, systemPrompt: SYSTEM_PROMPT, messages: history })
            });
            const data = await res.json();
            const reply = data.choices[0].message.content;
            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: [...nextMsgs, { role: "assistant", content: reply, model: thread.model, timestamp: Date.now() }] } : t));
        } catch {
            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: [...nextMsgs, { role: "assistant", content: "⚠️ Phương ơi, có lỗi gì đó rồi! Thử lại nha 🌸", timestamp: Date.now() }] } : t));
        } finally { setLoading(false); }
    }

    const saveEdit = async (i) => {
        const newText = editText.trim();
        if (!newText) {
            setEditingIndex(null);
            return;
        }
        setEditingIndex(null);
        
        const nowMs = Date.now();
        const nextMsgs = thread.messages.slice(0, i);
        nextMsgs.push({ role: "user", content: newText, timestamp: nowMs });

        setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: nextMsgs } : t));
        setLoading(true);

        try {
            const history = nextMsgs.slice(-10).map(m => ({ role: m.role || "user", content: m.content }));
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: thread.model, systemPrompt: SYSTEM_PROMPT, messages: history })
            });
            const data = await res.json();
            const reply = data.choices[0].message.content;
            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: [...nextMsgs, { role: "assistant", content: reply, model: thread.model, timestamp: Date.now() }] } : t));
        } catch {
            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: [...nextMsgs, { role: "assistant", content: "⚠️ Phương ơi, có lỗi gì đó rồi! Thử lại nha 🌸", timestamp: Date.now() }] } : t));
        } finally { setLoading(false); }
    };

    return (
        <div className="p-v9-root">
            {sidebarOpen && <div className="p-v9-side-ovl" onClick={() => setSidebarOpen(false)} />}
            
            <div className={`p-v9-side ${sidebarOpen ? "active" : ""}`}>
                <div className="ps9-head">
                    <button className="ps9-new" onClick={handleNew}>✨ Chat mới cho Phương</button>
                    <button className="ps9-close" onClick={() => setSidebarOpen(false)}>×</button>
                </div>
                <div className="ps9-body scrollable">
                    <p className="ps9-label">NHẬT KÝ CỦA PHƯƠNG</p>
                    {threads.map(t => (
                        <div key={t.id} className={`ps9-item ${t.id === activeId ? "active" : ""}`} onClick={() => { setActiveId(t.id); if (window.innerWidth <= 768) setSidebarOpen(false); }}>
                            <span className="ps9-t">🧸 {t.title}</span>
                            <div className="ps9-actions">
                                <button className="ps9-edit" onClick={(e) => { e.stopPropagation(); setRenameState({ open: true, id: t.id, name: t.title }); }}>✏️</button>
                                <button className="ps9-trash" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(t.id); }}>
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-v9-main">
                <div className="p-v9-header">
                    <button className="p-v9-burger" onClick={() => setSidebarOpen(true)}>☰</button>
                    <div className="ph9-info">
                        <span className="ph9-name">🧸 {thread.title}</span>
                        <div className="ph9-model-wrap" ref={pickerRef}>
                            <button className="ph9-pill" onClick={() => setShowModels(!showModels)}>
                                <strong>{GROQ_MODELS.find(m => m.id === thread.model)?.name}</strong>
                                <i>▼</i>
                            </button>
                            {showModels && (
                                <div className="ph9-drop-container">
                                    <div className="ph9-drop-ovl" onClick={() => setShowModels(false)} />
                                    <div className="ph9-drop">
                                        <div className="ph9-drop-head">Chọn Model AI ✨</div>
                                        <div className="ph9-drop-list scrollable">
                                            {GROQ_MODELS.map(m => (
                                                <button key={m.id} className={`ph9-opt ${thread.model === m.id ? "active" : ""}`} onClick={() => { setThreads(ts => ts.map(t => t.id === activeId ? { ...t, model: m.id } : t)); setShowModels(false); }}>
                                                    <div className="ph9o-t"><b>{m.name}</b><span>{m.context}</span></div>
                                                    <p className="ph9o-d">{m.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-v9-chat scrollable">
                    {thread.messages.length === 0 ? (
                        <div className="p-v9-welcome">
                            <img src={BOT_AVATAR} className="p-v9-bot-f" alt="bot" />
                            <h2 className="v9-hi">Chào Phương xinh đẹp! 🌸</h2>
                            <p className="v9-p">Tớ đã sẵn sàng cùng bạn học tiếng Thuỵ Điển rồi nè!</p>
                            <div className="p-v9-suggest">
                                {dynamicSuggestions.map((s, idx) => (
                                    <button key={idx} onClick={() => onSend(s)}>{s}</button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-v9-list">
                            {thread.messages.map((m, i) => (
                                <div key={i} className={`p-v9-row ${m.role === 'user' ? 'u' : 'b'}`}>
                                    {m.role === 'assistant' && <img src={BOT_AVATAR} className="p-v9-ava" alt="bot" />}
                                    <div className={`p-v9-msg-ctx ${editingIndex === i ? "editing" : ""}`}>
                                        <div className="p-v9-bub">
                                            {m.role === 'user' && editingIndex === i ? (
                                                <div className="p-v9-edit-box">
                                                    <textarea autoFocus value={editText} onChange={e => setEditText(e.target.value)} rows="3" />
                                                    <div className="p-v9-ebtns">
                                                        <button className="c" onClick={() => setEditingIndex(null)}>Hủy</button>
                                                        <button className="s" onClick={() => saveEdit(i)}>Lưu & Gửi</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
                                                    {m.role === 'user' && editingIndex !== i && (
                                                        <button className="p-v9-msg-edit" onClick={() => { setEditingIndex(i); setEditText(m.content); }}>
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="p-v9-footer-info">
                                            {m.timestamp && <span className="p-v9-time">{new Date(m.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - {new Date(m.timestamp).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>}
                                            {m.role === 'assistant' && m.model && <span className="p-v9-bot-tag">{GROQ_MODELS.find(gm => gm.id === m.model)?.name}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="p-v9-row b"><img src={BOT_AVATAR} className="p-v9-ava" alt="bot" /><div className="p-v9-bub wait">...</div></div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    )}
                </div>

                <div className="p-v9-input-zone">
                    <div className="p-v9-input-wrap">
                        <textarea ref={textareaRef} rows="1" placeholder="Hỏi tớ đi Phương ơi..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSend())} disabled={loading} />
                        <button className={`p-v9-send ${input.trim() ? "on" : ""}`} onClick={() => onSend()} disabled={!input.trim() || loading}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
            </div>

            <RenameModal isOpen={renameState.open} onClose={() => setRenameState({ open: false, id: null, name: "" })} currentName={renameState.name} onSave={(nn) => setThreads(ts => ts.map(t => t.id === renameState.id ? { ...t, title: nn } : t))} />

            {deleteConfirm && (
                <div className="p-ovl" onClick={() => setDeleteConfirm(null)}>
                    <div className="p-modal-card" onClick={e => e.stopPropagation()}>
                        <h3 className="pm-t">Xóa đoạn chat này? 🥺</h3>
                        <div style={{ fontSize: 16, color: "#9B6B8A", fontWeight: 800, marginBottom: 30 }}>Bạn có chắc muốn xóa lịch sử trò chuyện này không? Hành động này không thể hoàn tác.</div>
                        <div className="pm-btns">
                            <button className="pm-btn-c" onClick={() => setDeleteConfirm(null)}>Hủy bỏ</button>
                            <button className="pm-btn-s" style={{ background: "#FF4D4D", boxShadow: "0 8px 20px rgba(255,107,157,0.3)" }} onClick={() => { handleDelete(deleteConfirm); setDeleteConfirm(null); }}>Xóa ngay</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .p-v9-root { display: flex; height: calc(100vh - 105px - env(safe-area-inset-bottom, 0px)); background: #FFF8FC; font-family: 'Plus Jakarta Sans', sans-serif; position: relative; overflow: hidden; width: 100%; border-top: 2.5px solid #F9C0D9; border-bottom: 2.8px solid #F9C0D9; z-index: 50; }
                .scrollable::-webkit-scrollbar { width: 4px; }
                .scrollable::-webkit-scrollbar-thumb { background: #FFB3CE; border-radius: 10px; }

                .p-v9-side { width: 280px; background: #fff; border-right: 2.5px solid #F9C0D9; display: flex; flex-direction: column; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2000; box-shadow: 10px 0 35px rgba(255,107,157,0.02); height: 100%; }
                .ps9-head { padding: 25px 20px; border-bottom: 2.2px solid #F9C0D9; display: flex; gap: 10px; }
                .ps9-new { flex: 1; height: 50px; background: linear-gradient(135deg, #FF6B9D, #C084FC); border: none; border-radius: 15px; color: #fff; font-weight: 950; font-size: 14px; cursor: pointer; box-shadow: 0 4px 15px rgba(255,107,157,0.22); }
                .ps9-close { display: none; background: none; border: none; font-size: 26px; color: #FF6B9D; cursor: pointer; }
                .ps9-body { flex: 1; padding: 15px 12px; }
                .ps9-label { font-size: 10.5px; font-weight: 950; color: #FF6B9D; margin: 0 10px 20px; text-transform: uppercase; letter-spacing: 2px; }
                .ps9-item { padding: 13px 15px; border-radius: 15px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 7px; border: 2.5px solid transparent; transition: 0.2s; }
                .ps9-item:hover { background: #FFF0F6; }
                .ps9-item.active { background: #fff; border-color: #FF6B9D; box-shadow: 0 4px 15px rgba(255,107,157,0.06); }
                .ps9-t { font-size: 14px; font-weight: 900; color: #3D1A35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 160px; }
                .ps9-actions { display: flex; gap: 8px; }
                .ps9-actions button { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .ps9-trash { color: #FF4D4D !important; }

                .p-v9-main { flex: 1; display: flex; flex-direction: column; position: relative; width: 100%; height: 100%; border-left: 2.5px solid #F9C0D9; margin-left: -2.5px; overflow: hidden; }
                .p-v9-header { height: 72px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(15px); border-bottom: 2.5px solid #F9C0D9; display: flex; align-items: center; padding: 0 25px; z-index: 1500; }
                .p-v9-burger { display: none; font-size: 22px; color: #FF6B9D; background: none; border: none; margin-right: 20px; cursor: pointer; }
                .ph9-info { display: flex; align-items: center; gap: 20px; flex: 1; }
                .ph9-name { font-size: 17px; font-weight: 950; color: #FF6B9D; white-space: nowrap; max-width: 250px; }
                .ph9-model-wrap { position: relative; }
                .ph9-pill { background: #fff; border: 2.2px solid #F9C0D9; height: 42px; padding: 0 16px; border-radius: 13px; display: flex; align-items: center; gap: 8px; cursor: pointer; }
                .ph9-pill strong { font-size: 14.5px; color: #3D1A35; font-weight: 900; }
                
                .ph9-drop { width: 340px; background: #fff; border: 3.5px solid #F9C0D9; border-radius: 26px; box-shadow: 0 15px 50px rgba(255,107,157,0.35); padding: 12px; position: absolute; top: 55px; left: 0; z-index: 100000; }
                .ph9-drop-head { font-size: 11px; font-weight: 950; color: #FF6B9D; text-transform: uppercase; margin: 5px 12px 14px; letter-spacing: 1.5px; }
                .ph9-drop-list { max-height: 420px; overflow-y: auto; padding-right: 5px; }
                .ph9-opt { width: 100%; padding: 14px; border: 2.5px solid transparent; background: none; border-radius: 18px; text-align: left; cursor: pointer; margin-bottom: 6px; transition: 0.2s; }
                .ph9-opt:hover { background: #FFF0F6; }
                .ph9-opt.active { background: #FFF0F6; border-color: #FF6B9D; }
                .ph9o-t { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
                .ph9o-t b { font-size: 15px; color: #3D1A35; font-weight: 950; }
                .ph9o-t span { font-size: 11px; color: #FF6B9D; font-weight: 950; background: #fff; border: 1.5px solid #F9C0D9; padding: 2px 7px; border-radius: 8px; }
                .ph9o-d { font-size: 12.5px; color: #9B6B8A; font-weight: 850; line-height: 1.4; margin: 0; }

                .p-v9-chat { flex: 1; overflow-y: auto; padding-bottom: 25px; background: #FFF8FC; }
                .p-v9-welcome { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; }
                .p-v9-bot-f { width: 170px; margin-bottom: 25px; animation: pBF 3s ease-in-out infinite; }
                .v9-hi { font-size: 24px; font-weight: 950; color: #3D1A35; margin-bottom: 10px; }
                .v9-p { font-size: 16px; font-weight: 850; color: #9B6B8A; }
                .p-v9-suggest { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 35px; max-width: 650px; }
                .p-v9-suggest button { background: #fff; border: 2.5px solid #F9C0D9; padding: 12px 22px; border-radius: 14px; font-size: 14.5px; font-weight: 950; color: #3D1A35; cursor: pointer; }
                
                .p-v9-list { padding: 40px 25px; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
                .p-v9-row { display: flex; gap: 18px; }
                .p-v9-row.u { justify-content: flex-end; }
                .p-v9-ava { width: 48px; height: 48px; flex-shrink: 0; object-fit: contain; }
                .p-v9-msg-ctx { display: flex; flex-direction: column; max-width: 82%; position: relative; min-width: 250px; transition: max-width 0.3s ease; }
                .p-v9-msg-ctx.editing { max-width: 95%; flex: 1; min-width: 320px; }
                .p-v9-bub { padding: 16px 24px; border-radius: 22px; font-size: 16px; font-weight: 950; line-height: 1.75; position: relative; }
                
                .p-v9-footer-info { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; padding: 0 4px; gap: 8px; }
                .u .p-v9-footer-info { flex-direction: row-reverse; }
                .p-v9-time { font-size: 10.5px; color: #FFB3CE; font-weight: 800; }
                
                .b .p-v9-bub { background: #fff !important; border: 2.8px solid #F9C0D9 !important; color: #3D1A35 !important; border-radius: 22px !important; box-shadow: 0 5px 20px rgba(0,0,0,0.04); }
                .b .p-v9-bub::before { content: ''; position: absolute; left: -14px; top: 18px; border-top: 15px solid #F9C0D9; border-left: 14px solid transparent; }
                .b .p-v9-bub::after { content: ''; position: absolute; left: -10px; top: 20px; border-top: 12px solid #fff; border-left: 11px solid transparent; }
                
                .u .p-v9-bub { background: linear-gradient(135deg, #FF6B9D, #C084FC) !important; color: #fff !important; border-bottom-right-radius: 6px !important; }
                .p-v9-bot-tag { font-size: 11px; font-weight: 950; color: #FF6B9D; text-align: right; text-transform: uppercase; }

                .p-v9-msg-edit { position: absolute; left: -45px; bottom: 5px; width: 34px; height: 34px; background: #fff; border: 2.2px solid #F9C0D9; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #FF6B9D; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 12px rgba(255,107,157,0.12); }
                .p-v9-msg-edit:hover { background: #fff; border-color: #FF6B9D; transform: scale(1.1); box-shadow: 0 4px 15px rgba(255,107,157,0.25); }
                .p-v9-msg-edit svg { width: 16px; height: 16px; stroke-width: 3.2; }

                .p-v9-edit-box { display: flex; flex-direction: column; gap: 10px; width: 100%; }
                .p-v9-edit-box textarea { width: 100%; border: none !important; border-radius: 12px; padding: 10px; font-family: inherit; font-size: 15px; color: #fff; background: rgba(255,255,255,0.2); outline: none; resize: none; min-height: 80px; scrollbar-width: thin; overflow-y: auto; }
                .p-v9-edit-box textarea::-webkit-scrollbar { width: 5px; }
                .p-v9-edit-box textarea::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.4); border-radius: 4px; }
                .p-v9-edit-box textarea:focus { background: rgba(255,255,255,0.3); border-color: transparent !important; }
                .p-v9-ebtns { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
                .p-v9-ebtns button { padding: 8px 16px; border-radius: 10px; font-size: 13.5px; font-weight: 900; cursor: pointer; border: none; transition: 0.2s; }
                .p-v9-ebtns button.c { background: rgba(255,255,255,0.2); color: #fff; }
                .p-v9-ebtns button.s { background: #fff; color: #FF6B9D; }
                .p-v9-ebtns button:hover { transform: translateY(-2px); }

                .p-v9-input-zone { padding: 15px 25px; background: #fff; border-top: 2.5px solid #FF6B9D; z-index: 1000; min-height: 75px; display: flex; align-items: flex-end; flex-shrink: 0; }
                .p-v9-input-wrap { flex: 1; max-width: 860px; margin: 0 auto; background: #FFF0F6; border: 2.2px solid #F9C0D9; border-radius: 22px; padding: 2px 5px 2px 24px; display: flex; align-items: flex-end; gap: 14px; transition: 0.25s; box-shadow: 0 0 25px rgba(255,107,157,0.1); }
                textarea { flex: 1; border: none; outline: none; padding: 12px 0; font-family: inherit; font-size: 16px; font-weight: 950; color: #3D1A35; resize: none; background: transparent; max-height: 250px; min-height: 24px; }
                textarea::placeholder { color: #FF6B9D !important; opacity: 1; font-weight: 950; }
                
                .p-v9-send { width: 32px; height: 32px; border-radius: 10px; border: none; background: #F3F4F6; color: #9CA3AF; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; flex-shrink: 0; }
                .p-v9-send.on { background: #FF6B9D; color: #fff; }
                .p-v9-send svg { width: 16px; height: 16px; }

                .p-ovl { position: fixed; inset: 0; background: rgba(30, 20, 28, 0.65); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 100000; }
                .p-modal-card { background: #fff; border: 4.5px solid #F9C0D9; border-radius: 35px; width: 92%; max-width: 420px; padding: 45px; box-shadow: 0 30px 70px rgba(0,0,0,0.35); }
                .pm-t { font-size: 24px; font-weight: 950; color: #3D1A35; margin-bottom: 30px; letter-spacing: -0.5px; }
                .pm-input { width: 100%; height: 60px; border: 2.8px solid #FFB3CE; border-radius: 20px; padding: 0 22px; font-size: 17px; font-weight: 950; color: #3D1A35; margin-bottom: 40px; outline: none; background: #FFF8FC; }
                .pm-btns { display: flex; justify-content: flex-end; gap: 15px; }
                .pm-btns button { padding: 15px 35px; border-radius: 16px; font-size: 15.5px; font-weight: 950; cursor: pointer; border: none; }
                .pm-btn-c { background: #F3F4F6; color: #888; }
                .pm-btn-s { background: linear-gradient(135deg, #FF6B9D, #C084FC); color: #fff; box-shadow: 0 8px 20px rgba(255,107,157,0.35); }

                @media (max-width: 768px) {
                    .p-v9-side { position: fixed; left: -100%; height: 100vh; width: 85%; }
                    .p-v9-side.active { left: 0; }
                    .p-v9-burger { display: block; }
                    .ph9-name { display: none; }
                }
            `}</style>
        </div>
    );
}
