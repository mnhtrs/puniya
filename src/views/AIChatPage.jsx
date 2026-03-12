import { useState, useRef, useEffect, useMemo } from "react";
// import { T } from "../constants/theme";
import { marked } from "marked";

// ============================================================
// CONSTANTS & MODELS
// ============================================================
const GROQ_MODELS = [
    { id: "moonshotai/kimi-k2-instruct-0905", name: "Kimi K2 Instruct", context: "256k", ctx_val: 262144, desc: "Đỉnh cao context, nhớ cực lâu" },
    { id: "moonshotai/kimi-k2-instruct", name: "Kimi K2 Standard", context: "128k", ctx_val: 128000, desc: "Dòng Kimi cơ bản, ổn định" },
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", context: "128k", ctx_val: 131072, desc: "Mạnh nhất, thông minh & đa năng" },
    { id: "qwen/qwen3-32b", name: "Qwen 3 32B", context: "128k", ctx_val: 131072, desc: "Mạnh mẽ về lập trình & toán học" },
    { id: "openai/gpt-oss-120b", name: "GPT OSS 120B", context: "128k", ctx_val: 131072, desc: "Siêu trí tuệ mã nguồn mở" },
    { id: "meta-llama/llama-4-scout-17b-16e-instruct", name: "Llama 4 Scout", context: "128k", ctx_val: 131072, desc: "Bản Preview công nghệ Meta" },
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", context: "128k", ctx_val: 131072, desc: "Tốc độ siêu nhanh, phản hồi tức thì" },
    { id: "groq/compound", name: "Groq Compound", context: "128k", ctx_val: 131072, desc: "Sứ giả thông minh & linh hoạt" },
    { id: "groq/compound-mini", name: "Groq Mini", context: "128k", ctx_val: 131072, desc: "Gọn nhẹ, tối ưu cho hội thoại" },
    { id: "openai/gpt-oss-20b", name: "GPT OSS 20B", context: "128k", ctx_val: 131072, desc: "Mã nguồn mở cân bằng" },
    { id: "openai/gpt-oss-safeguard-20b", name: "GPT OSS Safeguard", context: "128k", ctx_val: 131072, desc: "Phiên bản bảo mật nâng cao" },
    { id: "meta-llama/llama-guard-4-12b", name: "Llama Guard 4", context: "128k", ctx_val: 131072, desc: "Model chuyên về an toàn nội dung" },
    { id: "canopylabs/orpheus-v1-english", name: "Orpheus English", context: "4k", ctx_val: 4000, desc: "Model chuyên dụng tiếng Anh" }
];

const DEFAULT_MODEL = GROQ_MODELS[0].id;
const BOT_AVATAR = "/hachiware.png";

const SYSTEM_PROMPT = `Bạn là Puniya AI — trợ lý học tiếng Thuỵ Điển cho người Việt.
QUY TẮC: Bạn là trợ lý ảo của Phương (Nước Sôi Ấm Áp). Luôn thân thiện, dùng emoji nhưng KHÔNG được dùng icon lá cờ hay biểu tượng quốc gia. 
BẮT BUỘC: Luôn luôn trả lời và giải thích bằng tiếng Việt 100%. Giải thích từ vựng kỹ (Nghĩa, IPA, Ví dụ). KHÔNG trả lời lạc đề ngoài việc học tiếng hoặc trang web Puniya.`;

// ============================================================
// HELPERS
// ============================================================
function formatMessage(text) {
    if (!text) return "";
    try {
        // Cấu hình marked để render bảng và xuống dòng chuẩn xác
        const html = marked.parse(text, {
            breaks: true,
            gfm: true
        });
        return html;
    } catch (e) {
        console.error("Markdown parse error:", e);
        return text.replace(/\n/g, '<br/>');
    }
}

const RenameModal = ({ isOpen, onClose, currentName, onSave }) => {
    const [val, setVal] = useState(currentName);
    useEffect(() => { if (isOpen) setVal(currentName); }, [isOpen, currentName]);
    if (!isOpen) return null;
    return (
        <div className="p-ovl" onClick={onClose} style={{ zIndex: 100000 }}>
            <div className="p-modal-card" onClick={e => e.stopPropagation()}>
                <h3 className="chat-modal-t">Đổi tên nha Phương ✏️</h3>
                <input className="chat-modal-input" value={val} onChange={e => setVal(e.target.value)} autoFocus />
                <div className="chat-modal-btns">
                    <button className="chat-modal-btn-c" onClick={onClose}>Huỷ</button>
                    <button className="chat-modal-btn-s" onClick={() => { onSave(val); onClose(); }}>Lưu luôn</button>
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
            const saved = localStorage.getItem("puniya_chats");
            if (saved) return JSON.parse(saved);
            return [{ id: Date.now(), title: "Nhật ký của Phương 🧸", model: DEFAULT_MODEL, messages: [] }];
        } catch { return [{ id: Date.now(), title: "Nhật ký của Phương 🧸", model: DEFAULT_MODEL, messages: [] }]; }
    });
    const [activeId, setActiveId] = useState(() => {
        const last = localStorage.getItem("puniya_active_chat");
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

    const [sidebarWidth, setSidebarWidth] = useState(280);
    const [isResizing, setIsResizing] = useState(false);

    const pressTimerRef = useRef(null);
    const [mobileOptions, setMobileOptions] = useState({ open: false, id: null, title: "" });

    const handleTouchStart = (id, title) => {
        if (window.innerWidth > 768) return;
        pressTimerRef.current = setTimeout(() => {
            setMobileOptions({ open: true, id, title });
        }, 500);
    };
    const handleTouchEnd = () => {
        if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    };

    const handlePointerMove = (e) => {
        if (!isResizing) return;
        let newWidth = e.clientX;
        const maxW = window.innerWidth * 0.25;
        if (newWidth < 220) newWidth = 220;
        if (newWidth > maxW) newWidth = maxW;
        setSidebarWidth(newWidth);
    };

    const handlePointerUp = (e) => {
        setIsResizing(false);
        try { e.target.releasePointerCapture(e.pointerId); } catch (err) { }
    };

    const scrollRef = useRef(null);
    const pickerRef = useRef(null);
    const textareaRef = useRef(null);

    const activeIdx = threads.findIndex(t => t.id === activeId);
    const thread = activeIdx !== -1 ? threads[activeIdx] : (threads[0] || { messages: [] });

    useEffect(() => { localStorage.setItem("puniya_chats", JSON.stringify(threads)); }, [threads]);
    useEffect(() => { localStorage.setItem("puniya_active_chat", activeId.toString()); }, [activeId]);
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

    // Model Migration Logic for decommissioned models
    useEffect(() => {
        const needsMigration = threads.some(t => !GROQ_MODELS.find(m => m.id === t.model));
        if (needsMigration) {
            setThreads(ts => ts.map(t => {
                const exists = GROQ_MODELS.find(m => m.id === t.model);
                if (!exists) return { ...t, model: DEFAULT_MODEL };
                return t;
            }));
        }
    }, [threads]);

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
            if (data.error) throw new Error(data.error.message || "API Error");
            const reply = data.choices[0].message.content;
            const usage = data.usage?.total_tokens || 0;
            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, lastUsage: usage, messages: [...nextMsgs, { role: "assistant", content: reply, model: thread.model, timestamp: Date.now() }] } : t));
        } catch (err) {
            console.error(err);
            const errMsg = err.message?.toLowerCase().includes("model") ? `⚠️ Model ${thread.model} không khả dụng rồi Phương ơi! Thử cái khác nha 🌸` : "⚠️ Phương ơi, có lỗi gì đó rồi! Thử lại nha 🌸";
            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: [...nextMsgs, { role: "assistant", content: errMsg, timestamp: Date.now() }] } : t));
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
            if (data.error) throw new Error(data.error.message || "API Error");
            const reply = data.choices[0].message.content;
            const usage = data.usage?.total_tokens || 0;
            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, lastUsage: usage, messages: [...nextMsgs, { role: "assistant", content: reply, model: thread.model, timestamp: Date.now() }] } : t));
        } catch (err) {
            console.error(err);
            const errMsg = err.message?.toLowerCase().includes("model") ? `⚠️ Model ${thread.model} không khả dụng rồi Phương ơi! Thử cái khác nha 🌸` : "⚠️ Phương ơi, có lỗi gì đó rồi! Thử lại nha 🌸";
            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: [...nextMsgs, { role: "assistant", content: errMsg, timestamp: Date.now() }] } : t));
        } finally { setLoading(false); }
    };

    const getUsedTokens = () => {
        if (thread?.lastUsage) return thread.lastUsage;
        if (!thread?.messages || thread.messages.length === 0) return 0;
        const history = thread.messages.slice(-10);
        const txt = history.map(m => m.content).join(" ");
        const chars = txt.length + SYSTEM_PROMPT.length;
        return Math.floor(chars / 3.5) || 1;
    };

    const renderQuota = (maxK) => {
        const t = getUsedTokens();
        let display = t;
        if (t >= 1000) display = (t / 1000).toFixed(1) + "k";
        return `${display}/${maxK}`;
    };

    return (
        <div className="chat-root" style={{ userSelect: isResizing ? "none" : "auto" }} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
            {sidebarOpen && <div className="chat-side-ovl" onPointerDown={() => setSidebarOpen(false)} onClick={() => setSidebarOpen(false)} />}

            <div className={`chat-side ${sidebarOpen ? "active" : ""}`} style={{ width: window.innerWidth > 768 ? sidebarWidth : undefined }}>
                <div className="chat-resizer" onPointerDown={(e) => { e.preventDefault(); e.target.setPointerCapture(e.pointerId); setIsResizing(true); }} />
                <div className="chat-side-head">
                    <button className="chat-side-new" onClick={handleNew}>✨ Chat mới cho Phương</button>
                    <button className="chat-side-close" onPointerDown={() => setSidebarOpen(false)} onClick={() => setSidebarOpen(false)}>×</button>
                </div>
                <div className="chat-side-body scrollable">
                    <p className="chat-side-label">NHẬT KÝ CỦA PHƯƠNG</p>
                    {threads.map(t => (
                        <div key={t.id} className={`chat-side-item ${t.id === activeId ? "active" : ""}`}
                            onClick={() => { setActiveId(t.id); if (window.innerWidth <= 768) setSidebarOpen(false); }}
                            onPointerDown={() => handleTouchStart(t.id, t.title)}
                            onPointerUp={handleTouchEnd} onPointerMove={handleTouchEnd} onPointerCancel={handleTouchEnd}
                            onContextMenu={(e) => { if (window.innerWidth <= 768) e.preventDefault(); }}
                        >
                            <span className="chat-side-t">🧸 {t.title}</span>
                            <div className="chat-side-actions">
                                <button className="chat-side-edit" title="Chỉnh sửa" onClick={(e) => { e.stopPropagation(); setRenameState({ open: true, id: t.id, name: t.title }); }}>✏️</button>
                                <button className="chat-side-trash" title="Xóa" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(t.id); }}>
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-main">
                <div className="chat-header">
                    <button className="chat-burger" onClick={() => setSidebarOpen(true)}>☰</button>
                    <div className="chat-head-info">
                        <span className="chat-head-name">🧸 {thread.title}</span>
                        <div className="chat-head-model-wrap" ref={pickerRef}>
                            <button className="chat-head-pill" onClick={() => setShowModels(!showModels)}>
                                <strong>{GROQ_MODELS.find(m => m.id === thread.model)?.name}</strong>
                                <i>▼</i>
                            </button>
                            {showModels && (
                                <div className="chat-head-drop-container">
                                    <div className="chat-head-drop-ovl" onClick={() => setShowModels(false)} />
                                    <div className="chat-head-drop">
                                        <div className="chat-head-drop-head">Chọn Model AI ✨</div>
                                        <div className="chat-head-drop-list scrollable">
                                            {GROQ_MODELS.map(m => {
                                                const currentTokens = getUsedTokens();
                                                const isExceeded = currentTokens >= (m.ctx_val || 0);
                                                if (isExceeded) return null;
                                                return (
                                                    <button key={m.id} className={`chat-head-opt ${thread.model === m.id ? "active" : ""}`} onClick={() => { setThreads(ts => ts.map(t => t.id === activeId ? { ...t, model: m.id } : t)); setShowModels(false); }}>
                                                        <div className="chat-opt-t"><b>{m.name}</b><span>{renderQuota(m.context)}</span></div>
                                                        <p className="chat-opt-d">{m.desc}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="chat-chat scrollable">
                    {thread.messages.length === 0 ? (
                        <div className="chat-welcome">
                            <img src={BOT_AVATAR} className="chat-bot-f" alt="bot" />
                            <h2 className="chat-hi">Chào Phương xinh đẹp! 🌸</h2>
                            <p className="chat-p">Tớ đã sẵn sàng cùng bạn học tiếng Thuỵ Điển rồi nè!</p>
                            <div className="chat-suggest">
                                {dynamicSuggestions.map((s, idx) => (
                                    <button key={idx} onClick={() => onSend(s)}>{s}</button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="chat-list">
                            {thread.messages.map((m, i) => (
                                <div key={i} className={`chat-row ${m.role === 'user' ? 'u' : 'b'}`}>
                                    {m.role === 'assistant' && <img src={BOT_AVATAR} className="chat-ava" alt="bot" />}
                                    <div className={`chat-msg-ctx ${editingIndex === i ? "editing" : ""}`}>
                                        <div className="chat-bub">
                                            {m.role === 'user' && editingIndex === i ? (
                                                <div className="chat-edit-box">
                                                    <textarea autoFocus value={editText} onChange={e => setEditText(e.target.value)} rows="3" />
                                                    <div className="chat-ebtns">
                                                        <button className="c" onClick={() => setEditingIndex(null)}>Hủy</button>
                                                        <button className="s" onClick={() => saveEdit(i)}>Lưu & Gửi</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
                                                    {m.role === 'user' && editingIndex !== i && (
                                                        <button className="chat-msg-edit" onClick={() => { setEditingIndex(i); setEditText(m.content); }}>
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="chat-footer-info">
                                            {m.timestamp && <span className="chat-time">{new Date(m.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - {new Date(m.timestamp).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>}
                                            {m.role === 'assistant' && m.model && <span className="chat-bot-tag">{GROQ_MODELS.find(gm => gm.id === m.model)?.name}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="chat-row b"><img src={BOT_AVATAR} className="chat-ava" alt="bot" /><div className="chat-bub wait">...</div></div>
                            )}
                        </div>
                    )}
                    <div ref={scrollRef} style={{ height: 1 }} />
                </div>

                <div className="chat-input-zone">
                    <div className="chat-input-wrap">
                        <textarea ref={textareaRef} rows="1" placeholder="Hỏi tớ đi Phương ơi..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSend())} disabled={loading} />
                        <button className={`chat-send ${input.trim() ? "on" : ""}`} onClick={() => onSend()} disabled={!input.trim() || loading}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
            </div>

            <RenameModal isOpen={renameState.open} onClose={() => setRenameState({ open: false, id: null, name: "" })} currentName={renameState.name} onSave={(nn) => setThreads(ts => ts.map(t => t.id === renameState.id ? { ...t, title: nn } : t))} />

            {mobileOptions.open && (
                <div className="chat-head-drop-container">
                    <div className="chat-head-drop-ovl" style={{ background: "rgba(30,20,28,0.65)", backdropFilter: "blur(5px)" }} onClick={() => setMobileOptions({ open: false, id: null, title: "" })} />
                    <div className="chat-head-drop" style={{ zIndex: 100001, padding: '25px 20px', display: 'flex', flexDirection: 'column' }}>
                        <div className="chat-head-drop-head" style={{ marginBottom: 15, fontSize: 13 }}>Tùy chọn: {mobileOptions.title}</div>
                        <button className="chat-opt-btn" onClick={() => { setRenameState({ open: true, id: mobileOptions.id, name: mobileOptions.title }); setMobileOptions({ ...mobileOptions, open: false }); }}>✏️ Đổi tên đoạn chat</button>
                        <button className="chat-opt-btn" style={{ color: "#FF4D4D" }} onClick={() => { setDeleteConfirm(mobileOptions.id); setMobileOptions({ ...mobileOptions, open: false }); }}>🗑 Xóa đoạn chat</button>
                        <button className="chat-opt-btn" style={{ justifyContent: "center", background: "#f3f4f6", color: "#888", marginTop: 5 }} onClick={() => setMobileOptions({ ...mobileOptions, open: false })}>Đóng</button>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="p-ovl" onClick={() => setDeleteConfirm(null)}>
                    <div className="p-modal-card" onClick={e => e.stopPropagation()}>
                        <h3 className="chat-modal-t">Xóa đoạn chat này? 🥺</h3>
                        <div style={{ fontSize: 16, color: "#9B6B8A", fontWeight: 800, marginBottom: 30 }}>Bạn có chắc muốn xóa lịch sử trò chuyện này không? Hành động này không thể hoàn tác.</div>
                        <div className="chat-modal-btns">
                            <button className="chat-modal-btn-c" onClick={() => setDeleteConfirm(null)}>Hủy bỏ</button>
                            <button className="chat-modal-btn-s" style={{ background: "#FF4D4D", boxShadow: "0 8px 20px rgba(255,107,157,0.3)" }} onClick={() => { handleDelete(deleteConfirm); setDeleteConfirm(null); }}>Xóa ngay</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .chat-root { display: flex; flex: 1; min-height: 0; background: #FFF8FC; font-family: 'Plus Jakarta Sans', sans-serif; position: relative; overflow: hidden; width: 100%; border-top: 2.5px solid #F9C0D9; border-bottom: none; z-index: 50; }
                .scrollable::-webkit-scrollbar { width: 14px; }
                .scrollable::-webkit-scrollbar-thumb { background: #FF6B9D; border-radius: 12px; border: 3.5px solid #fff; box-shadow: 0 0 3px rgba(255,107,157,0.5); }
                .scrollable::-webkit-scrollbar-track { background: transparent; }

                .chat-side-ovl { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); z-index: 1999; backdrop-filter: grayscale(1); }
                .chat-side { width: 280px; background: #fff; border-right: 2.5px solid #F9C0D9; display: flex; flex-direction: column; transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2000; box-shadow: 10px 0 35px rgba(255,107,157,0.02); height: 100%; position: relative; }
                .chat-side-head { padding: 25px 20px; border-bottom: 2.2px solid #F9C0D9; display: flex; gap: 10px; }
                .chat-side-new { flex: 1; height: 50px; background: linear-gradient(135deg, #FF6B9D, #C084FC); border: none; border-radius: 15px; color: #fff; font-weight: 950; font-size: 14px; cursor: pointer; box-shadow: 0 4px 15px rgba(255,107,157,0.22); }
                .chat-side-close { display: none; background: none; border: none; font-size: 26px; color: #FF6B9D; cursor: pointer; }
                .chat-side-body { flex: 1; padding: 15px 12px; }
                .chat-side-label { font-size: 10.5px; font-weight: 950; color: #FF6B9D; margin: 0 10px 20px; text-transform: uppercase; letter-spacing: 2px; }
                .chat-side-item { padding: 13px 15px; border-radius: 15px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 7px; border: 2.5px solid transparent; transition: 0.2s; }
                .chat-side-item:hover { background: #FFF0F6; }
                .chat-side-item.active { background: #fff; border-color: #FF6B9D; box-shadow: 0 4px 15px rgba(255,107,157,0.06); }
                .chat-side-t { flex: 1; min-width: 0; font-size: 14px; font-weight: 900; color: #3D1A35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 5px; }
                .chat-side-actions { display: flex; gap: 6px; flex-shrink: 0; }
                .chat-side-actions button { width: 32px; height: 32px; background: none; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .chat-side-actions button:hover { background: #FDE8F0; }
                .chat-side-trash:hover { background: #FFE5E5 !important; }
                .chat-side-trash { color: #FF4D4D !important; }

                .chat-main { flex: 1; display: flex; flex-direction: column; position: relative; width: 100%; height: 100%; border-left: 2.5px solid #F9C0D9; margin-left: -2.5px; overflow: hidden; }
                .chat-header { height: 72px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(15px); border-bottom: 2.5px solid #F9C0D9; display: flex; align-items: center; padding: 0 25px; z-index: 1500; }
                .chat-burger { display: none; font-size: 22px; color: #FF6B9D; background: none; border: none; margin-right: 20px; cursor: pointer; }
                .chat-head-info { display: flex; align-items: center; gap: 20px; flex: 1; }
                .chat-head-name { font-size: 17px; font-weight: 950; color: #FF6B9D; white-space: nowrap; max-width: 250px; }
                .chat-head-model-wrap { position: relative; }
                .chat-head-pill { background: #fff; border: 2.2px solid #F9C0D9; height: 42px; padding: 0 16px; border-radius: 13px; display: flex; align-items: center; gap: 8px; cursor: pointer; }
                .chat-head-pill strong { font-size: 14.5px; color: #3D1A35; font-weight: 900; }
                
                .chat-head-drop-ovl { position: fixed; inset: 0; z-index: 99999; }
                .chat-head-drop { width: 340px; background: #fff; border: 3.5px solid #F9C0D9; border-radius: 26px; box-shadow: 0 15px 50px rgba(255,107,157,0.35); padding: 12px; position: absolute; top: 55px; left: 0; z-index: 100000; }
                .chat-head-drop-head { font-size: 11px; font-weight: 950; color: #FF6B9D; text-transform: uppercase; margin: 5px 12px 14px; letter-spacing: 1.5px; }
                .chat-head-drop-list { max-height: 50vh; overflow-y: auto; padding-right: 5px; padding-bottom: 25px; }
                .chat-head-opt { width: 100%; padding: 14px; border: 2.5px solid transparent; background: none; border-radius: 18px; text-align: left; cursor: pointer; margin-bottom: 6px; transition: 0.2s; }
                .chat-head-opt:hover { background: #FFF0F6; }
                .chat-head-opt.active { background: #FFF0F6; border-color: #FF6B9D; }
                .chat-opt-t { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
                .chat-opt-t b { font-size: 15px; color: #3D1A35; font-weight: 950; }
                .chat-opt-t span { font-size: 11px; color: #FF6B9D; font-weight: 950; background: #fff; border: 1.5px solid #F9C0D9; padding: 2px 7px; border-radius: 8px; }
                .chat-opt-d { font-size: 12.5px; color: #9B6B8A; font-weight: 850; line-height: 1.4; margin: 0; }

                .chat-chat { flex: 1; overflow-y: auto; padding-bottom: 5px; background: #FFF8FC; }
                .chat-welcome { min-height: 100%; height: auto; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; text-align: center; padding: 40px; padding-bottom: 80px; }
                .chat-bot-f { width: 95px; margin-bottom: 15px; margin-top: 15px; animation: pBF 3s ease-in-out infinite; }
                .chat-hi { font-size: 24px; font-weight: 950; color: #3D1A35; margin-bottom: 10px; }
                .chat-p { font-size: 16px; font-weight: 850; color: #9B6B8A; margin-bottom: 15px; }
                .chat-suggest { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 15px; max-width: 650px; padding-bottom: 25px; }
                .chat-suggest button { background: #fff; border: 2.5px solid #F9C0D9; padding: 12px 22px; border-radius: 14px; font-size: 14.5px; font-weight: 950; color: #3D1A35; cursor: pointer; }
                
                .chat-list { padding: 20px 25px 5px; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }
                .chat-row { display: flex; gap: 18px; }
                .chat-row.u { justify-content: flex-end; }
                .chat-ava { width: 48px; height: 48px; flex-shrink: 0; object-fit: contain; }
                .chat-msg-ctx { display: flex; flex-direction: column; max-width: 82%; position: relative; min-width: 250px; transition: max-width 0.3s ease; }
                .chat-msg-ctx.editing { max-width: 95%; flex: 1; min-width: 320px; }
                .chat-bub { padding: 16px 24px; border-radius: 22px; font-size: 16px; font-weight: 950; line-height: 1.75; position: relative; }
                
                .chat-footer-info { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; padding: 0 4px; gap: 8px; }
                .u .chat-footer-info { flex-direction: row-reverse; }
                .chat-resizer { width: 6px; cursor: col-resize; position: absolute; right: -3px; top: 0; bottom: 0; z-index: 50; transition: 0.2s; }
                .chat-resizer:hover, .chat-resizer:active { background: rgba(255, 107, 157, 0.5); }
                .chat-opt-btn { width: 100%; padding: 15px; border: none; background: #FFF8FC; border-radius: 16px; font-size: 15px; font-weight: 900; color: #3D1A35; display: flex; align-items: center; gap: 10px; margin-bottom: 8px; cursor: pointer; transition: 0.2s; }
                .chat-opt-btn:active { transform: scale(0.96); }
                .chat-time { font-size: 10.5px; color: #e85888; font-weight: 850; }
                
                .b .chat-bub { background: #fff !important; border: 2.8px solid #F9C0D9 !important; color: #3D1A35 !important; border-radius: 22px !important; box-shadow: 0 5px 20px rgba(0,0,0,0.04); }
                .b .chat-bub::before { content: ''; position: absolute; left: -14px; top: 18px; border-top: 15px solid #F9C0D9; border-left: 14px solid transparent; }
                .b .chat-bub::after { content: ''; position: absolute; left: -10px; top: 20px; border-top: 12px solid #fff; border-left: 11px solid transparent; }
                
                .u .chat-bub { background: linear-gradient(135deg, #FF6B9D, #C084FC) !important; color: #fff !important; border-bottom-right-radius: 6px !important; }
                .chat-bot-tag { font-size: 11px; font-weight: 950; color: #FF6B9D; text-align: right; text-transform: uppercase; }

                /* Markdown Table Styles */
                .chat-bub table { width: 100%; border-collapse: collapse; margin: 15px 0; background: #fff; font-size: 14px; border-radius: 12px; overflow: hidden; border: 2.5px solid #F9C0D9; }
                .chat-bub th { background: #FFF0F6; color: #FF6B9D; padding: 12px 15px; text-align: left; font-weight: 950; border-bottom: 2.5px solid #F9C0D9; border-right: 1.5px solid #F9C0D9; }
                .chat-bub td { padding: 12px 15px; border-bottom: 1px solid #FFE5F0; border-right: 1.5px solid #FFE5F0; color: #3D1A35; font-weight: 800; }
                .chat-bub th:last-child, .chat-bub td:last-child { border-right: none; }
                .chat-bub tr:last-child td { border-bottom: none; }
                .chat-bub tr:hover { background: #FFF8FC; }
                
                .p-inline-code { background: #FDE8F0; color: #FF6B9D; padding: 2px 6px; border-radius: 6px; font-size: 0.9em; font-family: monospace; }
                .chat-bub blockquote { border-left: 4px solid #F9C0D9; padding-left: 15px; margin-left: 0; color: #9B6B8A; font-style: italic; }
                .chat-bub pre { background: #2D1B27; color: #fff; padding: 15px; border-radius: 12px; overflow-x: auto; font-family: monospace; font-size: 13.5px; }
                .chat-bub ul, .chat-bub ol { padding-left: 20px; }
                .chat-bub li { margin-bottom: 5px; }

                .chat-msg-edit { position: absolute; left: -45px; bottom: 5px; width: 34px; height: 34px; background: #fff; border: 2.2px solid #F9C0D9; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #FF6B9D; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 12px rgba(255,107,157,0.12); }
                .chat-msg-edit:hover { background: #fff; border-color: #FF6B9D; transform: scale(1.1); box-shadow: 0 4px 15px rgba(255,107,157,0.25); }
                .chat-msg-edit svg { width: 16px; height: 16px; stroke-width: 3.2; }

                .chat-edit-box { display: flex; flex-direction: column; gap: 10px; width: 100%; }
                .chat-edit-box textarea { width: 100%; border: none !important; border-radius: 12px; padding: 10px; font-family: inherit; font-size: 15px; color: #fff; background: rgba(255,255,255,0.2); outline: none; resize: none; min-height: 80px; scrollbar-width: thin; overflow-y: auto; }
                .chat-edit-box textarea::-webkit-scrollbar { width: 5px; }
                .chat-edit-box textarea::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.4); border-radius: 4px; }
                .chat-edit-box textarea:focus { background: rgba(255,255,255,0.3); border-color: transparent !important; }
                .chat-ebtns { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
                .chat-ebtns button { padding: 8px 16px; border-radius: 10px; font-size: 13.5px; font-weight: 900; cursor: pointer; border: none; transition: 0.2s; }
                .chat-ebtns button.c { background: rgba(255,255,255,0.2); color: #fff; }
                .chat-ebtns button.s { background: #fff; color: #FF6B9D; }
                .chat-ebtns button:hover { transform: translateY(-2px); }

                .chat-input-zone { padding: 12px 25px calc(15px + 62px + env(safe-area-inset-bottom, 0px)); background: #fff; border-top: 2.5px solid #FF6B9D; z-index: 1000; display: flex; align-items: flex-end; flex-shrink: 0; position: relative; }
                .chat-input-wrap { flex: 1; max-width: 860px; margin: 0 auto; background: #FFF0F6; border: 2.2px solid #F9C0D9; border-radius: 22px; padding: 2px 5px 2px 24px; display: flex; align-items: flex-end; gap: 14px; transition: 0.25s; box-shadow: 0 0 25px rgba(255,107,157,0.1); }
                textarea { flex: 1; border: none; outline: none; padding: 12px 0 12px 0; font-family: inherit; font-size: 16px; font-weight: 950; color: #3D1A35; resize: none; background: transparent; max-height: 250px; min-height: 24px; }
                textarea::placeholder { color: #FF6B9D !important; opacity: 1; font-weight: 950; }
                
                .chat-send { width: 32px; height: 32px; border-radius: 10px; border: none; background: #F3F4F6; color: #9CA3AF; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; flex-shrink: 0; }
                .chat-send.on { background: #FF6B9D; color: #fff; }
                .chat-send svg { width: 16px; height: 16px; }

                .p-ovl { position: fixed; inset: 0; background: rgba(30, 20, 28, 0.65); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 100000; }
                .p-modal-card { background: #fff; border: 4.5px solid #F9C0D9; border-radius: 35px; width: 92%; max-width: 420px; padding: 45px; box-shadow: 0 30px 70px rgba(0,0,0,0.35); }
                .chat-modal-t { font-size: 24px; font-weight: 950; color: #3D1A35; margin-bottom: 30px; letter-spacing: -0.5px; }
                .chat-modal-input { width: 100%; height: 60px; border: 2.8px solid #FFB3CE; border-radius: 20px; padding: 0 22px; font-size: 17px; font-weight: 950; color: #3D1A35; margin-bottom: 40px; outline: none; background: #FFF8FC; }
                .chat-modal-btns { display: flex; justify-content: flex-end; gap: 15px; }
                .chat-modal-btns button { padding: 15px 35px; border-radius: 16px; font-size: 15.5px; font-weight: 950; cursor: pointer; border: none; }
                .chat-modal-btn-c { background: #F3F4F6; color: #888; }
                .chat-modal-btn-s { background: linear-gradient(135deg, #FF6B9D, #C084FC); color: #fff; box-shadow: 0 8px 20px rgba(255,107,157,0.35); }

                @media (max-width: 768px) {
                    .chat-header { backdrop-filter: none; background: #fff; }
                    .chat-side-actions { display: none; }
                    .chat-side { position: fixed; left: -260px; height: 100dvh; width: 260px; }
                    .chat-side.active { left: 0; box-shadow: 10px 0 35px rgba(0,0,0,0.1); }
                    .chat-burger { display: block; }
                    .chat-head-name { display: none; }
                    .chat-head-drop { max-height: 65vh; position: fixed; top: auto; bottom: 0; left: 0; width: 100%; border-radius: 35px 35px 0 0; padding-bottom: env(safe-area-inset-bottom, 25px); border: none; border-top: 4px solid #F9C0D9; box-shadow: 0 -10px 40px rgba(0,0,0,0.15); animation: slideUpChat 0.3s cubic-bezier(0.4, 0, 0.2, 1); min-height: 40vh; display: flex; flex-direction: column; }
                    .chat-head-drop-list { padding-bottom: calc(85px + env(safe-area-inset-bottom, 0px)); }
                    .chat-head-drop-ovl { background: rgba(30,20,28,0.65); backdrop-filter: blur(5px); }
                }
                @keyframes slideUpChat { from { transform: translateY(100%); } to { transform: translateY(0); } }
            `}</style>
        </div>
    );
}
