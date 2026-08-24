import { useState, useEffect } from "react";
import { T } from "../constants/theme";

export default function SettingsPage({ streak, vocab, tags, onImport }) {
    const [dataStr, setDataStr] = useState("");
    const [importStr, setImportStr] = useState("");
    const [showD, setShowD] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(localStorage.getItem("puniya_notif") === "true");
    const [notifInterval, setNotifInterval] = useState(localStorage.getItem("puniya_notif_min") || "30");

    // API Key settings
    const [groqKey, setGroqKey] = useState(localStorage.getItem("puniya_custom_groq_key") || "");
    const [openaiKey, setOpenaiKey] = useState(localStorage.getItem("puniya_custom_openai_key") || "");
    const [savedKeyNotice, setSavedKeyNotice] = useState(false);

    useEffect(() => {
        const wasEnabled = localStorage.getItem("puniya_notif") === "true";
        localStorage.setItem("puniya_notif", notifEnabled);
        localStorage.setItem("puniya_notif_min", notifInterval);

        if (notifEnabled && "Notification" in window) {
            Notification.requestPermission().then(perm => {
                if (perm === "granted" && !wasEnabled) {
                    new Notification("Puniya", { body: "Đã bật thông báo ôn tập thành công! 🎉", icon: "/hachiware.png" });
                }
            });
        }
        window.dispatchEvent(new Event("notifSettingsChanged"));
    }, [notifEnabled, notifInterval]);

    function exportData() {
        const d = JSON.stringify({ vocab, streak, tags, exportAt: Date.now() });
        const b = btoa(unescape(encodeURIComponent(d)));
        setDataStr(b);
        setShowD(true);
    }

    function handleImport() {
        if (!importStr) return;
        try {
            const d = JSON.parse(decodeURIComponent(escape(atob(importStr))));
            if (d.vocab && onImport) {
                onImport(d.vocab, d.streak || 1, d.tags || []);
                alert("Nhập dữ liệu thành công!");
                setImportStr("");
            } else {
                alert("Dữ liệu không hợp lệ.");
            }
        } catch (e) {
            alert("Lỗi giải mã dữ liệu. Vui lòng kiểm tra lại mã.");
        }
    }

    function saveApiKeys() {
        if (groqKey.trim()) {
            localStorage.setItem("puniya_custom_groq_key", groqKey.trim());
        } else {
            localStorage.removeItem("puniya_custom_groq_key");
        }

        if (openaiKey.trim()) {
            localStorage.setItem("puniya_custom_openai_key", openaiKey.trim());
        } else {
            localStorage.removeItem("puniya_custom_openai_key");
        }

        setSavedKeyNotice(true);
        setTimeout(() => setSavedKeyNotice(false), 3000);
    }

    return (
        <div className="main">
            <div className="sec-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-solid fa-gear" style={{ color: T.pink }}></i>
                <span>Cài đặt & Thông tin</span>
            </div>

            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fa-solid fa-bell" style={{ color: T.pink }}></i>
                    <span>Thông báo nhắc nhở</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontSize: 14 }}>Bật thông báo ôn tập</div>
                    <label className="sw">
                        <input type="checkbox" checked={notifEnabled} onChange={(e) => setNotifEnabled(e.target.checked)} />
                        <span className="sld" />
                    </label>
                </div>
                {notifEnabled && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ fontSize: 13, color: T.textL }}>Lặp lại mỗi (phút):</div>
                            <input type="number" step="0.1" min="0.1" className="inp btn-sm" style={{ width: 80, padding: "5px 10px" }} value={notifInterval} onChange={(e) => setNotifInterval(e.target.value)} />
                        </div>
                    </div>
                )}
            </div>

            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fa-solid fa-fire" style={{ color: "#FF6B6B" }}></i>
                    <span>Chuỗi ngày học (Streak)</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: T.pink, display: "flex", alignItems: "center", gap: 8 }}>
                    <i className="fa-solid fa-fire" style={{ color: "#FFD166" }}></i>
                    <span>{streak} ngày liên tiếp</span>
                </div>
            </div>

            {/* Custom AI API Key Configuration */}
            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fa-solid fa-key" style={{ color: T.purple }}></i>
                    <span>Cấu hình Khóa API AI (Tùy chọn)</span>
                </div>
                <div style={{ fontSize: 12, color: T.textL, marginBottom: 12, lineHeight: 1.5 }}>
                    Mặc định Puniya dùng hệ thống dự phòng Groq/OpenAI tự động. Nếu muốn dùng hạn mức không giới hạn riêng của bạn, hãy nhập API Key cá nhân:
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>
                        Groq API Key (Miễn phí tốc độ cao, khuyến nghị):
                    </label>
                    <input
                        className="inp"
                        type="password"
                        placeholder="gsk_..."
                        value={groqKey}
                        onChange={(e) => setGroqKey(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: T.text, display: "block", marginBottom: 4 }}>
                        OpenAI API Key (Tùy chọn):
                    </label>
                    <input
                        className="inp"
                        type="password"
                        placeholder="sk-..."
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                    />
                </div>
                <button className="btn btn-p" style={{ width: "100%", height: 38, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={saveApiKeys}>
                    <i className="fa-solid fa-floppy-disk"></i> Lưu khóa API
                </button>
                {savedKeyNotice && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#10B981", fontWeight: 700, textAlign: "center" }}>
                        <i className="fa-solid fa-circle-check" style={{ marginRight: 4 }}></i> Đã lưu cấu hình API thành công!
                    </div>
                )}
            </div>

            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fa-solid fa-database" style={{ color: T.pink }}></i>
                    <span>Dữ liệu ứng dụng</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button className="btn btn-s" onClick={exportData} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <i className="fa-solid fa-arrow-up-from-bracket"></i> Xuất dữ liệu
                    </button>
                    <button className="btn btn-s" onClick={() => setShowD(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <i className="fa-solid fa-arrow-down-to-bracket"></i> Nhập dữ liệu
                    </button>
                </div>

                {showD && (
                    <div style={{ marginTop: 15, borderTop: `1px solid ${T.border}`, paddingTop: 15 }}>
                        {dataStr && (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.pink, marginBottom: 5 }}>MÃ DỮ LIỆU CỦA BẠN (XUẤT):</div>
                                <textarea className="warea" readOnly value={dataStr} onClick={(e) => e.target.select()} style={{ height: 80, fontSize: 11, background: "#f8fafc" }} />
                                <button className="btn btn-p btn-sm" style={{ width: "100%", marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => { navigator.clipboard.writeText(dataStr); alert("Đã sao chép!"); }}>
                                    <i className="fa-solid fa-copy"></i> Sao chép
                                </button>
                            </div>
                        )}
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: T.textL, marginBottom: 5 }}>DÁN MÃ KHÔI PHỤC VÀO ĐÂY:</div>
                            <textarea className="warea" placeholder="Dán mã tại đây..." value={importStr} onChange={(e) => setImportStr(e.target.value)} style={{ height: 80, fontSize: 11 }} />
                            <button className="btn btn-ok btn-sm" style={{ width: "100%", marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={handleImport}>
                                <i className="fa-solid fa-rotate-left"></i> Khôi phục ngay
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="card card-g">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: T.pink, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fa-solid fa-heart" style={{ color: T.pink }}></i>
                    <span>Về dự án Puniya</span>
                </div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: "1.75", marginBottom: 15 }}>
                    <b>Puniya</b> - Trang web học tiếng Thụy Điển & Khoa học dành riêng cho người Việt (Cụ thể là dành riêng cho em Đào Bích Phương / Nước Sôi Ấm Áp 🌸).
                    Tích hợp trí tuệ nhân tạo thông minh, từ điển Svenska Wiktionary kiểu Cambridge và hệ thống lặp lại ngắt quãng <b>SRS</b> để ghi nhớ từ vựng hiệu quả nhất.
                </div>

                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 15 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.textL, marginBottom: 12, textTransform: "uppercase" }}>Tác giả & Liên hệ</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
                        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.pinkL}` }}>
                            <img src="/tho_hong_mat_ngu.png" alt="avatar" style={{ width: "65%", height: "100%", borderRadius: "36%" }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 900, color: T.text }}>Made By LNMT</div>
                            <div style={{ fontSize: 15, color: T.textL }}>"This website is a small gift for Dao Bich Phuong"</div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                        <a href="https://facebook.com/picecreams.0e" target="_blank" rel="noreferrer" className="btn btn-s btn-sm" style={{ padding: "8px 0", gap: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="fa-brands fa-facebook" style={{ color: "#1877F2", fontSize: 16 }}></i>
                            <span>Facebook</span>
                        </a>
                        <a href="https://instagram.com/_.tira.mis.u" target="_blank" rel="noreferrer" className="btn btn-s btn-sm" style={{ padding: "8px 0", gap: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="fa-brands fa-instagram" style={{ color: "#E4405F", fontSize: 16 }}></i>
                            <span>Instagram</span>
                        </a>
                        <a href="https://tiktok.com/@trigonometry360" target="_blank" rel="noreferrer" className="btn btn-sm" style={{ padding: "8px 0", gap: 6, background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14 }}>
                            <i className="fa-brands fa-tiktok" style={{ fontSize: 16 }}></i>
                            <span>TikTok</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
