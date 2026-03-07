import { useState, useEffect } from "react";
import { T } from "../constants/theme";

export default function SettingsPage({ streak, vocab, tags, onImport }) {
    const [dataStr, setDataStr] = useState("");
    const [importStr, setImportStr] = useState("");
    const [showD, setShowD] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(localStorage.getItem("puniya_notif") === "true");
    const [notifInterval, setNotifInterval] = useState(localStorage.getItem("puniya_notif_min") || "30");

    useEffect(() => {
        localStorage.setItem("puniya_notif", notifEnabled);
        localStorage.setItem("puniya_notif_min", notifInterval);
        if (notifEnabled && "Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
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
                alert("🎉 Nhập dữ liệu thành công!");
                setImportStr("");
            } else {
                alert("❌ Dữ liệu không hợp lệ.");
            }
        } catch (e) {
            alert("❌ Lỗi giải mã dữ liệu. Vui lòng kiểm tra lại mã.");
        }
    }

    return (
        <div className="main">
            <div className="sec-title">⚙️ Cài đặt & Thông tin</div>

            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>🔔 Thông báo nhắc nhở</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontSize: 14 }}>Bật thông báo ôn tập</div>
                    <label className="sw">
                        <input type="checkbox" checked={notifEnabled} onChange={(e) => setNotifEnabled(e.target.checked)} />
                        <span className="sld" />
                    </label>
                </div>
                {notifEnabled && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ fontSize: 13, color: T.textL }}>Lặp lại mỗi (phút):</div>
                        <input type="number" className="inp btn-sm" style={{ width: 80, padding: "5px 10px" }} value={notifInterval} onChange={(e) => setNotifInterval(e.target.value)} />
                    </div>
                )}
            </div>

            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>Chuỗi ngày học (Streak)</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: T.pink, display: "flex", alignItems: "center", gap: 8 }}>
                    🔥 {streak} ngày
                </div>
            </div>

            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Dữ liệu ứng dụng</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button className="btn btn-s" onClick={exportData}>📤 Xuất dữ liệu</button>
                    <button className="btn btn-s" onClick={() => setShowD(true)}>📥 Nhập dữ liệu</button>
                </div>

                {showD && (
                    <div style={{ marginTop: 15, borderTop: `1px solid ${T.border}`, paddingTop: 15 }}>
                        {dataStr && (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.pink, marginBottom: 5 }}>MÃ DỮ LIỆU CỦA BẠN (XUẤT):</div>
                                <textarea className="warea" readOnly value={dataStr} onClick={(e) => e.target.select()} style={{ height: 80, fontSize: 11, background: "#f8fafc" }} />
                                <button className="btn btn-p btn-sm" style={{ width: "100%", marginTop: 6 }} onClick={() => { navigator.clipboard.writeText(dataStr); alert("Đã sao chép!"); }}>📋 Sao chép</button>
                            </div>
                        )}
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: T.textL, marginBottom: 5 }}>DÁN MÃ KHÔI PHỤC VÀO ĐÂY:</div>
                            <textarea className="warea" placeholder="Dán mã tại đây..." value={importStr} onChange={(e) => setImportStr(e.target.value)} style={{ height: 80, fontSize: 11 }} />
                            <button className="btn btn-ok btn-sm" style={{ width: "100%", marginTop: 6 }} onClick={handleImport}>🚀 Khôi phục ngay</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="card card-g">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: T.pink, textTransform: "uppercase" }}>Về dự án Puniya</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: "1.75", marginBottom: 15 }}>
                    <b>Puniya v2.2</b> - Ứng dụng học tiếng Thụy Điển & Khoa học dành riêng cho người Việt.
                    Tích hợp trí tuệ nhân tạo <b>GPT-4o</b> để dịch thuật chính xác và hệ thống lặp lại ngắt quãng <b>SRS</b> để ghi nhớ từ vựng hiệu quả nhất.
                </div>

                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 15 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: T.textL, marginBottom: 12, textTransform: "uppercase" }}>Tác giả & Liên hệ</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.pinkL}` }}>
                            <img src="https://img.favpng.com/22/6/14/chiikawa-cute-cat-doodle-i4gYkKuD_t.jpg" alt="avatar" style={{ width: "90%", height: "90%", borderRadius: "50%" }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 900, color: T.text }}>Made By LNMT</div>
                            <div style={{ fontSize: 12, color: T.textL }}>A small present for Dao Bich Phuong</div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                        <a href="https://facebook.com/picecreams.0e" target="_blank" rel="noreferrer" className="btn btn-s btn-sm" style={{ padding: "8px 0", gap: 5 }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" width="16" height="16" alt="fb" />
                            Facebook
                        </a>
                        <a href="https://instagram.com/_.tira.mis.u" target="_blank" rel="noreferrer" className="btn btn-s btn-sm" style={{ padding: "8px 0", gap: 5 }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" width="16" height="16" alt="ig" />
                            Instagram
                        </a>
                        <a href="https://tiktok.com/@trigonometry360" target="_blank" rel="noreferrer" className="btn" style={{ padding: "10px 0", gap: 8, background: "#000", color: "#fff", flex: 1, borderRadius: 14 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.897 2.897 0 0 1 3.103-4.488v-3.483a6.374 6.374 0 0 0-6.333 5.464c-.114.717-.114 1.448 0 2.165a6.349 6.349 0 0 0 10.822 3.968 6.341 6.341 0 0 0 2.108-4.711V8.627a8.263 8.263 0 0 0 5.555 2.235v-3.386a4.787 4.787 0 0 1-2.839-.79z" />
                            </svg>
                            TikTok
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}
