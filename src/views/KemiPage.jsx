import { useState } from "react";
import { T } from "../constants/theme";
import { KEMI } from "../constants/kemi";
import { SvFlag } from "../components/SvFlag";
import { VnFlag } from "../components/VnFlag";
import { SubHeader } from "../components/SubHeader";

export default function KemiPage({ onBack }) {
    const [cat, setCat] = useState("Tất cả");
    const [expanded, setExpanded] = useState(null);
    const [showA, setShowA] = useState({});

    const cats = ["Tất cả", ...new Set(KEMI.map((m) => m.klass))];
    const filtered = cat === "Tất cả" ? KEMI : KEMI.filter((m) => m.klass === cat);

    return (
        <div className="main">
            <SubHeader
                title="Hóa học (Kemi)"
                icon="fa-solid fa-flask"
                iconColor="#10B981"
                iconBg="#ECFDF5"
                onBack={onBack}
            />

            <div className="tabs">
                {cats.map((c) => (
                    <div key={c} className={`tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
                        {c}
                    </div>
                ))}
            </div>

            {filtered.map((k) => (
                <div key={k.id} className="card" style={{ padding: "14px 16px" }}>
                    <div
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                        onClick={() => setExpanded(expanded === k.id ? null : k.id)}
                    >
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F0FFF4", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                                <i className="fa-solid fa-atom"></i>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 800, color: T.textL, textTransform: "uppercase", letterSpacing: 0.5 }}>{k.area} · {k.klass}</div>
                                <div style={{ fontSize: 16, fontWeight: 900, color: T.text }}>{k.title}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: 13, color: T.pink, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>{expanded === k.id ? "Thu gọn" : "Chi tiết"}</span>
                            <i className={expanded === k.id ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}></i>
                        </div>
                    </div>

                    {expanded === k.id && (
                        <div style={{ marginTop: 14, borderTop: `1.5px solid ${T.border}`, paddingTop: 14 }}>
                            <div style={{ fontSize: 14, lineHeight: 1.7, color: T.text, marginBottom: 14 }}>{k.content}</div>

                            {k.keyPoints && k.keyPoints.length > 0 && (
                                <div style={{ marginBottom: 14 }}>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: T.pink, marginBottom: 7, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                                        <i className="fa-solid fa-list-check"></i> Tóm tắt lý thuyết
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                                        {k.keyPoints.map((p, i) => (
                                            <li key={i} style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {k.examples && k.examples.length > 0 && (
                                <div style={{ marginBottom: 14 }}>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: "#3b82f6", marginBottom: 7, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                                        <i className="fa-solid fa-comments"></i> Ví dụ tiếng Thụy Điển
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {k.examples.map((ex, i) => (
                                            <div key={i} style={{ padding: "10px 14px", background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe" }}>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", marginBottom: 4, display: "flex", alignItems: "flex-start", gap: 6 }}>
                                                    <SvFlag size={14} style={{ marginTop: 2, flexShrink: 0 }} /> <span>{ex.sv}</span>
                                                </div>
                                                <div style={{ fontSize: 12, color: "#2563eb", display: "flex", alignItems: "flex-start", gap: 6 }}>
                                                    <VnFlag size={14} style={{ marginTop: 2, flexShrink: 0 }} /> <span>{ex.vi}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {k.exercises && k.exercises.length > 0 && (
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: "#059669", marginBottom: 7, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                                        <i className="fa-solid fa-pencil"></i> Bài tập vận dụng
                                    </div>
                                    {k.exercises.map((ex, i) => {
                                        const key = `${k.id}-${i}`;
                                        return (
                                            <div key={i} className="card-mint" style={{ padding: "12px 14px", marginBottom: 8 }}>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: "#065f46" }}>Q: {ex.q}</div>
                                                {showA[key] ? (
                                                    <div style={{ marginTop: 6, fontSize: 13, fontWeight: 800, color: "#059669", padding: "6px 10px", background: "white", borderRadius: 8 }}>
                                                        A: {ex.a}
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn btn-ok btn-sm"
                                                        style={{ marginTop: 8, padding: "4px 10px", fontSize: 11 }}
                                                        onClick={() => setShowA((p) => ({ ...p, [key]: true }))}
                                                    >
                                                        Xem đáp án
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
