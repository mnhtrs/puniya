import { useState } from "react";
import { T } from "../constants/theme";

export default function SettingsPage({ streak, vocab }) {
    const [dataStr, setDataStr] = useState("");
    const [showD, setShowD] = useState(false);

    function exportData() {
        const d = JSON.stringify({ vocab, streak, exportAt: Date.now() });
        setDataStr(btoa(unescape(encodeURIComponent(d))));
        setShowD(true);
    }

    function copy() {
        navigator.clipboard.writeText(dataStr);
        alert("Copied!");
    }

    return (
        <div className="main">
            <div className="sec-title">⚙️ Cài đặt & Thông tin</div>
            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>Chuỗi ngày học (Streak)</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: T.pink, display: "flex", alignItems: "center", gap: 8 }}>
                    🔥 {streak} ngày
                </div>
            </div>
            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>Thống kê</div>
                <div style={{ fontSize: 15, color: T.textL, lineHeight: 1.8 }}>
                    📚 Tổng số từ: <strong>{vocab.length}</strong>
                    <br />
                    ⭐ Yêu thích: <strong>{vocab.filter((v) => v.starred).length}</strong>
                    <br />
                    🎓 Thành thạo: <strong>{vocab.filter((v) => v.srsLevel === 4).length}</strong>
                </div>
            </div>
            <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Dữ liệu ứng dụng</div>
                <button className="btn btn-s" style={{ width: "100%", marginBottom: 10 }} onClick={exportData}>
                    📤 Xuất dữ liệu (Backup)
                </button>
                {showD && (
                    <div style={{ marginTop: 10 }}>
                        <textarea
                            className="warea"
                            style={{ fontSize: 10, height: 100 }}
                            readOnly
                            value={dataStr}
                            onClick={(e) => e.target.select()}
                        />
                        <button className="btn btn-p btn-sm" style={{ marginTop: 8, width: "100%" }} onClick={copy}>
                            📋 Sao chép mã
                        </button>
                        <div style={{ fontSize: 11, color: T.textL, marginTop: 8, fontStyle: "italic" }}>
                            * Lưu mã này lại để khôi phục dữ liệu khi chuyển trình duyệt hoặc thiết bị.
                        </div>
                    </div>
                )}
            </div>
            <div className="card card-g">
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 5 }}>✿ Puniya v2.0</div>
                <div style={{ fontSize: 13, color: T.textL, lineHeight: "1.7" }}>
                    Ứng dụng học tiếng Thụy Điển & Khoa học dành riêng cho con.
                    <br />
                    Made with ❤️ for Puniya
                </div>
            </div>
        </div>
    );
}
