import { useState, useRef, useEffect, useMemo } from "react";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; 
import "../styles/AIChatPage.css";

const markedInstance = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

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
BẮT BUỘC: Luôn luôn trả lời và giải thích bằng tiếng Việt 100%. Giải thích từ vựng kỹ (Nghĩa, IPA, Ví dụ). KHÔNG trả lời lạc đề ngoài việc học tiếng hoặc trang web Puniya.

GIAO DIỆN HỘI THOẠI:
- Nếu câu trả lời của bạn quá dài (nhiều phần kiến thức khác nhau), hãy chèn ký tự [SPLIT] ở giữa các phần để hệ thống tự động tách thành nhiều tin nhắn cho Phương dễ đọc.
- Đừng dùng [SPLIT] quá lạm dụng, chỉ dùng khi nội dung thực sự dài hoặc chuyển sang một chủ đề kiến thức mới.`;

// ============================================================
// HELPERS
// ============================================================
function formatMessage(text) {
    if (!text) return "";
    try {
        // Hỗ trợ Discord-style Underline: __text__ -> <u>text</u>
        let processedText = text.replace(/__(.*?)__/g, '<u>$1</u>');
        
        const html = markedInstance.parse(processedText, {
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
            return [{ id: Date.now(), title: "Đoạn chat mới", model: DEFAULT_MODEL, messages: [] }];
        } catch { return [{ id: Date.now(), title: "Đoạn chat mới", model: DEFAULT_MODEL, messages: [] }]; }
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

    const generateAutoTitle = async (id, firstMsg) => {
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    systemPrompt: "Bạn là trợ lý giúp đặt tiêu đề cho đoạn hội thoại. Hãy dựa vào nội dung người dùng hỏi để đặt một tiêu đề cực kỳ ngắn gọn (tối đa 5 từ), súc tích, phản ánh đúng chủ đề. Không dùng dấu ngoặc kép, không dùng 'Tiêu đề:', chỉ trả về mỗi tiêu đề thôi. Trả về tiếng Việt.",
                    messages: [{ role: "user", content: `Đặt tiêu đề cho câu hỏi này: ${firstMsg}` }]
                })
            });
            const data = await res.json();
            let title = data.choices[0].message.content.replace(/["'✨🧸]/g, "").trim();
            if (title && title.length < 50) {
                setThreads(ts => ts.map(t => t.id === id ? { ...t, title } : t));
            }
        } catch (e) {
            console.error("Auto title failed:", e);
        }
    };

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
        const nt = { id, title: "Đoạn chat mới", model: DEFAULT_MODEL, messages: [] };
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

            // Xử lý tách tin nhắn (Split)
            const parts = reply.split("[SPLIT]").map(p => p.trim()).filter(Boolean);
            const newAssistantMsgs = parts.map((content, idx) => ({
                role: "assistant",
                content,
                model: thread.model,
                timestamp: Date.now() + idx
            }));

            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, lastUsage: usage, messages: [...nextMsgs, ...newAssistantMsgs] } : t));

            // Tự động cập nhật tiêu đề nếu là tin nhắn đầu tiên
            if (nextMsgs.length === 1 && (thread.title === "Đoạn chat mới" || thread.title.includes("Nhật ký"))) {
                generateAutoTitle(activeId, msgText);
            }
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

            const parts = reply.split("[SPLIT]").map(p => p.trim()).filter(Boolean);
            const newAssistantMsgs = parts.map((content, idx) => ({
                role: "assistant",
                content,
                model: thread.model,
                timestamp: Date.now() + idx
            }));

            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, lastUsage: usage, messages: [...nextMsgs, ...newAssistantMsgs] } : t));
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
                    <button className="chat-side-new" onClick={handleNew}>➕ Thêm đoạn chat mới</button>
                    <button className="chat-side-close" onPointerDown={() => setSidebarOpen(false)} onClick={() => setSidebarOpen(false)}>×</button>
                </div>
                <div className="chat-side-body scrollable">
                    <p className="chat-side-label">LỊCH SỬ CHAT</p>
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
                                                    {m.role === 'assistant' ? (
                                                        <div dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
                                                    ) : (
                                                        <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                                                    )}
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
                        <textarea ref={textareaRef} rows="1" placeholder="Hãy hỏi gì đó ở đây nì" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSend())} disabled={loading} />
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
        </div>
    );
}
