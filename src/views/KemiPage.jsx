import { useState } from "react";
import { T } from "../constants/theme";
import { KEMI } from "../constants/kemi";

export default function KemiPage({ onBack }) {
    const [expanded, setExpanded] = useState(null);
    return (
        <div className="main">
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
                <button className="btn btn-s" style={{ fontSize: 12, padding: "5px 12px" }} onClick={onBack}>
                    ← Trang chủ
                </button>
                <div className="sec-title" style={{ marginBottom: 0 }}>⚗️ Hóa học (Kemi)</div>
            </div>
            {KEMI.map((k) => (
                <div key={k.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div
                        style={{ padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        onClick={() => setExpanded(expanded === k.id ? null : k.id)}
                    >
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: T.textL }}>{k.klass}</div>
                            <div style={{ fontSize: 16, fontWeight: 900 }}>{k.title}</div>
                        </div>
                        <div style={{ fontSize: 13, color: T.pink }}>{expanded === k.id ? "▲" : "▼"}</div>
                    </div>
                    {expanded === k.id && (
                        <div style={{ padding: "0 16px 16px 16px", borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                            <div style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{k.content}</div>
                            {k.concepts && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {k.concepts.map((c, i) => (
                                        <div key={i} style={{ padding: 12, background: "#f0fdf4", borderRadius: 10, border: "1px solid #dcfce7" }}>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: "#166534", marginBottom: 3 }}>{c.name}</div>
                                            <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>{c.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
