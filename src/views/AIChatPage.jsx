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
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", context: "128k", ctx_val: 131072, desc: "Mạnh nhất, thông minh & đa năng" },
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", context: "128k", ctx_val: 131072, desc: "Tốc độ siêu nhanh, phản hồi tức thì" },
    { id: "moonshotai/kimi-k2-instruct-0905", name: "Kimi K2 Instruct", context: "256k", ctx_val: 262144, desc: "Đỉnh cao context, nhớ cực lâu" },
    { id: "moonshotai/kimi-k2-instruct", name: "Kimi K2 Standard", context: "128k", ctx_val: 128000, desc: "Dòng Kimi cơ bản, ổn định" },
    { id: "qwen/qwen3-32b", name: "Qwen 3 32B", context: "128k", ctx_val: 131072, desc: "Mạnh mẽ về lập trình & từ vựng" },
    { id: "openai/gpt-oss-120b", name: "GPT OSS 120B", context: "128k", ctx_val: 131072, desc: "Siêu trí tuệ mã nguồn mở" },
    { id: "groq/compound", name: "Groq Compound", context: "128k", ctx_val: 131072, desc: "Sứ giả thông minh & linh hoạt" },
    { id: "groq/compound-mini", name: "Groq Mini", context: "128k", ctx_val: 131072, desc: "Gọn nhẹ, tối ưu cho hội thoại" },
    { id: "meta-llama/llama-4-scout-17b-16e-instruct", name: "Llama 4 Scout", context: "128k", ctx_val: 131072, desc: "Bản Preview công nghệ Meta" },
];

const DEFAULT_MODEL = GROQ_MODELS[0].id;
const BOT_AVATAR = "/hachiware.png";

const SYSTEM_PROMPT = `Bạn là Puniya AI — trợ lý học tiếng Thuỵ Điển cho người Việt.
QUY TẮC: Bạn là trợ lý ảo của Phương (Nước Sôi Ấm Áp). Luôn thân thiện, ngọt ngào, đáng yêu.
BẮT BUỘC: Luôn luôn trả lời và giải thích bằng tiếng Việt 100%. Giải thích từ vựng kỹ (Nghĩa, IPA, Ngữ pháp, Ví dụ thực tế). Giúp luyện phản xạ tiếng Thụy Điển tự nhiên.

GIAO DIỆN HỘI THOẠI:
- Nếu câu trả lời quá dài (nhiều phần kiến thức khác nhau), hãy chèn ký tự [SPLIT] ở giữa các phần để hệ thống tự động tách thành nhiều tin nhắn cho Phương dễ đọc.
- Đừng lạm dụng [SPLIT], chỉ dùng khi cần tách ý rõ ràng.`;

function formatMessage(text) {
    if (!text) return "";
    try {
        let processedText = text.replace(/__(.*?)__/g, '<u>$1</u>');
        return markedInstance.parse(processedText, { breaks: true, gfm: true });
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
                <h3 className="chat-modal-t">
                    <i className="fa-solid fa-pen-to-square" style={{ color: "#FF6B9D", marginRight: 8 }}></i>
                    Đổi tên đoạn chat
                </h3>
                <input
                    className="chat-modal-input"
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && val.trim()) { onSave(val); onClose(); } }}
                    autoFocus
                />
                <div className="chat-modal-btns">
                    <button className="chat-modal-btn-c" onClick={onClose}>Huỷ</button>
                    <button className="chat-modal-btn-s" onClick={() => { onSave(val); onClose(); }}>Lưu</button>
                </div>
            </div>
        </div>
    );
};

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
        const maxW = window.innerWidth * 0.35;
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
        const base = ["Dạy tớ cách chào hỏi tự nhiên 🌸", "Luyện nói một đoạn hội thoại cơ bản!", "Giải thích ngữ pháp En và Ett", "10 từ vựng Thụy Điển thông dụng nhất"];
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
                    systemPrompt: "Bạn là trợ lý giúp đặt tiêu đề cho đoạn hội thoại. Đặt một tiêu đề cực kỳ ngắn gọn (tối đa 5 từ), súc tích. Không dùng dấu ngoặc kép. Trả về tiếng Việt.",
                    messages: [{ role: "user", content: `Đặt tiêu đề: ${firstMsg}` }]
                })
            });
            const data = await res.json();
            let title = data.choices?.[0]?.message?.content?.replace(/["'✨🧸]/g, "")?.trim();
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
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    const handleCreateThread = () => {
        const newT = {
            id: Date.now(),
            title: "Đoạn chat mới",
            model: thread.model || DEFAULT_MODEL,
            messages: []
        };
        setThreads(ts => [newT, ...ts]);
        setActiveId(newT.id);
        if (window.innerWidth <= 768) setSidebarOpen(false);
    };

    const handleDelete = (id) => {
        setThreads(ts => {
            const rest = ts.filter(t => t.id !== id);
            if (rest.length === 0) {
                const init = [{ id: Date.now(), title: "Đoạn chat mới", model: DEFAULT_MODEL, messages: [] }];
                setActiveId(init[0].id);
                return init;
            }
            if (activeId === id) setActiveId(rest[0].id);
            return rest;
        });
    };

    const handleSendApi = async (messagesToSend, modelId) => {
        const customGroqKey = localStorage.getItem("puniya_custom_groq_key") || "";
        const customOpenaiKey = localStorage.getItem("puniya_custom_openai_key") || "";

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: modelId || DEFAULT_MODEL,
                    systemPrompt: SYSTEM_PROMPT,
                    messages: messagesToSend.map(m => ({ role: m.role, content: m.content })),
                    apiKey: customGroqKey || customOpenaiKey || undefined
                })
            });

            if (res.ok) {
                const data = await res.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) return content;
            }
        } catch (err) {
            console.warn("Backend API error, trying client fallback...", err);
        }

        if (customGroqKey) {
            try {
                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${customGroqKey}`
                    },
                    body: JSON.stringify({
                        model: modelId || "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: SYSTEM_PROMPT },
                            ...messagesToSend.map(m => ({ role: m.role, content: m.content }))
                        ]
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    return data.choices?.[0]?.message?.content;
                }
            } catch (e) {
                console.error("Direct Groq error:", e);
            }
        }

        return "Xin chào Phương! Hệ thống AI đang tạm thời được bảo trì đường truyền. Bạn có thể thêm API Key riêng trong phần **Cài đặt** để chat không giới hạn nhé! 🌸";
    };

    const onSend = async (customText) => {
        const text = customText || input;
        if (!text.trim() || loading) return;

        const userMsg = { role: "user", content: text.trim(), timestamp: Date.now() };
        const updatedMsgs = [...thread.messages, userMsg];

        setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: updatedMsgs } : t));
        if (!customText) setInput("");
        setLoading(true);

        if (thread.messages.length === 0) {
            generateAutoTitle(activeId, text.trim());
        }

        try {
            const rawResponse = await handleSendApi(updatedMsgs, thread.model);
            const parts = rawResponse.split("[SPLIT]").map(p => p.trim()).filter(Boolean);

            if (parts.length > 1) {
                let currentList = [...updatedMsgs];
                for (let i = 0; i < parts.length; i++) {
                    const botMsg = { role: "assistant", content: parts[i], timestamp: Date.now(), model: thread.model };
                    currentList = [...currentList, botMsg];
                    setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: currentList } : t));
                    if (i < parts.length - 1) {
                        await new Promise(r => setTimeout(r, 600));
                    }
                }
            } else {
                const botMsg = { role: "assistant", content: rawResponse, timestamp: Date.now(), model: thread.model };
                setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: [...updatedMsgs, botMsg] } : t));
            }
        } catch (err) {
            console.error(err);
            const errorMsg = { role: "assistant", content: "Ôi có chút lỗi kết nối rồi nè Phương ơi. Bạn thử lại nhé! 🌸", timestamp: Date.now() };
            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: [...updatedMsgs, errorMsg] } : t));
        } finally {
            setLoading(false);
        }
    };

    const saveEdit = async (idx) => {
        if (!editText.trim()) return;
        const newMsgs = thread.messages.slice(0, idx);
        newMsgs.push({ role: "user", content: editText.trim(), timestamp: Date.now() });

        setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: newMsgs } : t));
        setEditingIndex(null);
        setLoading(true);

        try {
            const rawResponse = await handleSendApi(newMsgs, thread.model);
            const botMsg = { role: "assistant", content: rawResponse, timestamp: Date.now(), model: thread.model };
            setThreads(ts => ts.map(t => t.id === activeId ? { ...t, messages: [...newMsgs, botMsg] } : t));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-root" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
            {sidebarOpen && <div className="chat-side-ovl" onClick={() => setSidebarOpen(false)} />}
            
            {/* Sidebar */}
            <div className={`chat-side ${sidebarOpen ? "active" : ""}`} style={{ width: window.innerWidth > 768 ? sidebarWidth : undefined }}>
                <div className="chat-side-head">
                    <button className="chat-side-new" onClick={handleCreateThread}>
                        <i className="fa-solid fa-plus"></i>
                        <span>Đoạn chat mới</span>
                    </button>
                </div>
                <div className="chat-side-body scrollable">
                    <div className="chat-side-label">Lịch sử chat</div>
                    {threads.map(t => (
                        <div
                            key={t.id}
                            className={`chat-side-item ${t.id === activeId ? "active" : ""}`}
                            onClick={() => { setActiveId(t.id); if (window.innerWidth <= 768) setSidebarOpen(false); }}
                            onDoubleClick={() => setRenameState({ open: true, id: t.id, name: t.title })}
                            onTouchStart={() => handleTouchStart(t.id, t.title)}
                            onTouchEnd={handleTouchEnd}
                            title="Nhấp đúp chuột để đổi tên"
                        >
                            <span className="chat-side-t">{t.title}</span>
                            <div className="chat-side-actions">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setRenameState({ open: true, id: t.id, name: t.title }); }}
                                    title="Đổi tên đoạn chat"
                                >
                                    <i className="fa-solid fa-pen-to-square" style={{ fontSize: 13, color: "#855C75" }}></i>
                                </button>
                                <button
                                    className="chat-side-trash"
                                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(t.id); }}
                                    title="Xóa đoạn chat"
                                >
                                    <i className="fa-solid fa-trash-can" style={{ fontSize: 13 }}></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {window.innerWidth > 768 && (
                    <div
                        className="chat-resizer"
                        onPointerDown={(e) => {
                            setIsResizing(true);
                            e.target.setPointerCapture(e.pointerId);
                        }}
                    />
                )}
            </div>

            {/* Chat Area */}
            <div className="chat-main">
                <div className="chat-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button className="chat-burger" onClick={() => setSidebarOpen(!sidebarOpen)} title="Mở danh sách đoạn chat">
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <span
                            className="chat-head-name"
                            onDoubleClick={() => setRenameState({ open: true, id: thread.id, name: thread.title })}
                            style={{ cursor: "pointer" }}
                            title="Nhấp đúp chuột để đổi tên"
                        >
                            {thread.title}
                        </span>
                    </div>

                    <div className="chat-head-model-wrap" ref={pickerRef}>
                        <button className="chat-head-pill" onClick={() => setShowModels(!showModels)}>
                            <i className="fa-solid fa-robot" style={{ color: "#FF6B9D", fontSize: 13 }}></i>
                            <strong>{GROQ_MODELS.find(m => m.id === thread.model)?.name || "Llama 3.3 70B"}</strong>
                            <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, color: "#FF6B9D" }}></i>
                        </button>
                        {showModels && (
                            <>
                                <div className="chat-head-drop-ovl" onClick={() => setShowModels(false)} />
                                <div className="chat-head-drop">
                                    <div className="chat-head-drop-head">Chọn Model AI 🌸</div>
                                    <div className="chat-head-drop-list scrollable">
                                        {GROQ_MODELS.map(m => (
                                            <button
                                                key={m.id}
                                                className={`chat-head-opt ${thread.model === m.id ? "active" : ""}`}
                                                onClick={() => {
                                                    setThreads(ts => ts.map(t => t.id === activeId ? { ...t, model: m.id } : t));
                                                    setShowModels(false);
                                                }}
                                            >
                                                <div className="chat-opt-t">
                                                    <b>{m.name}</b>
                                                    <span>{m.context}</span>
                                                </div>
                                                <p className="chat-opt-d">{m.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
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
                                        {m.role === 'user' && editingIndex === i ? (
                                            <div className="chat-edit-card">
                                                <div style={{ fontSize: 12, fontWeight: 800, color: "#FF6B9D", marginBottom: 6 }}>
                                                    <i className="fa-solid fa-pen-to-square" style={{ marginRight: 5 }}></i>
                                                    Chỉnh sửa tin nhắn
                                                </div>
                                                <textarea
                                                    autoFocus
                                                    value={editText}
                                                    onChange={e => setEditText(e.target.value)}
                                                    rows="3"
                                                />
                                                <div className="chat-ebtns">
                                                    <button className="c" onClick={() => setEditingIndex(null)}>Hủy</button>
                                                    <button className="s" onClick={() => saveEdit(i)}>
                                                        <i className="fa-solid fa-paper-plane" style={{ marginRight: 4 }}></i>
                                                        Lưu & Gửi lại
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="chat-bub">
                                                    {m.role === 'assistant' ? (
                                                        <div dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
                                                    ) : (
                                                        <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                                                    )}
                                                    {m.role === 'user' && editingIndex !== i && (
                                                        <button
                                                            className="chat-msg-edit"
                                                            onClick={() => { setEditingIndex(i); setEditText(m.content); }}
                                                            title="Chỉnh sửa câu hỏi này"
                                                        >
                                                            <i className="fa-solid fa-pen"></i>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="chat-footer-info">
                                                    {m.timestamp && <span className="chat-time">{new Date(m.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>}
                                                    {m.role === 'assistant' && m.model && <span className="chat-bot-tag">{GROQ_MODELS.find(gm => gm.id === m.model)?.name || "AI"}</span>}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="chat-row b">
                                    <img src={BOT_AVATAR} className="chat-ava" alt="bot" />
                                    <div className="chat-bub wait">
                                        <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div ref={scrollRef} style={{ height: 1 }} />
                </div>

                <div className="chat-input-zone">
                    <div className="chat-input-wrap">
                        <textarea
                            ref={textareaRef}
                            rows="1"
                            placeholder="Nhắn tin với AI..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSend())}
                            disabled={loading}
                        />
                        <button className={`chat-send ${input.trim() ? "on" : ""}`} onClick={() => onSend()} disabled={!input.trim() || loading} title="Gửi tin nhắn">
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>

            <RenameModal
                isOpen={renameState.open}
                onClose={() => setRenameState({ open: false, id: null, name: "" })}
                currentName={renameState.name}
                onSave={(nn) => setThreads(ts => ts.map(t => t.id === renameState.id ? { ...t, title: nn } : t))}
            />

            {mobileOptions.open && (
                <div className="chat-head-drop-container">
                    <div className="chat-head-drop-ovl" style={{ background: "rgba(45,27,45,0.6)", backdropFilter: "blur(6px)" }} onClick={() => setMobileOptions({ open: false, id: null, title: "" })} />
                    <div className="chat-head-drop" style={{ zIndex: 100001, padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
                        <div className="chat-head-drop-head" style={{ marginBottom: 14, fontSize: 13 }}>Tùy chọn: {mobileOptions.title}</div>
                        <button className="chat-opt-btn" onClick={() => { setRenameState({ open: true, id: mobileOptions.id, name: mobileOptions.title }); setMobileOptions({ ...mobileOptions, open: false }); }}>
                            <i className="fa-solid fa-pen-to-square" style={{ marginRight: 8 }}></i> Đổi tên đoạn chat
                        </button>
                        <button className="chat-opt-btn" style={{ color: "#EF4444" }} onClick={() => { setDeleteConfirm(mobileOptions.id); setMobileOptions({ ...mobileOptions, open: false }); }}>
                            <i className="fa-solid fa-trash-can" style={{ marginRight: 8 }}></i> Xóa đoạn chat
                        </button>
                        <button className="chat-opt-btn" style={{ justifyContent: "center", background: "#F1F5F9", color: "#64748B", marginTop: 6 }} onClick={() => setMobileOptions({ ...mobileOptions, open: false })}>Đóng</button>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="p-ovl" onClick={() => setDeleteConfirm(null)}>
                    <div className="p-modal-card" onClick={e => e.stopPropagation()}>
                        <h3 className="chat-modal-t">
                            <i className="fa-solid fa-trash-can" style={{ color: "#EF4444", marginRight: 8 }}></i>
                            Xóa đoạn chat này?
                        </h3>
                        <div style={{ fontSize: 14, color: "#855C75", fontWeight: 600, marginBottom: 24, lineHeight: 1.5 }}>
                            Bạn có chắc muốn xóa lịch sử trò chuyện này không? Hành động này không thể hoàn tác.
                        </div>
                        <div className="chat-modal-btns">
                            <button className="chat-modal-btn-c" onClick={() => setDeleteConfirm(null)}>Hủy bỏ</button>
                            <button className="chat-modal-btn-s" style={{ background: "#EF4444", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }} onClick={() => { handleDelete(deleteConfirm); setDeleteConfirm(null); }}>
                                Xóa ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
