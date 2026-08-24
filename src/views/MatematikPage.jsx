import { useState } from "react";
import { T } from "../constants/theme";
import { MATEMATIK } from "../constants/matematik";
import { LatexBlock } from "../components/MathRender";
import { SubHeader } from "../components/SubHeader";

export default function MatematikPage({ onBack }) {
    const [cat, setCat] = useState("Tất cả");
    const [expanded, setExpanded] = useState(null);
    const [showA, setShowA] = useState({});

    const cats = ["Tất cả", ...new Set(MATEMATIK.map((m) => m.klass))];
    const filtered = cat === "Tất cả" ? MATEMATIK : MATEMATIK.filter((m) => m.klass === cat);

    return (
        <div className="main">
            <SubHeader
                title="Toán học (Matematik)"
                icon="fa-solid fa-calculator"
                iconColor="#3B82F6"
                iconBg="#EFF6FF"
                onBack={onBack}
            />

            <div className="tabs">
                {cats.map((c) => (
                    <div key={c} className={`tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
                        {c}
                    </div>
                ))}
            </div>

            {filtered.map((m) => (
                <div key={m.id} className="card" style={{ padding: "14px 16px" }}>
                    <div
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                        onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                    >
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EEF2FF", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                                <i className="fa-solid fa-square-root-variable"></i>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 800, color: T.textL, textTransform: "uppercase", letterSpacing: 0.5 }}>{m.area} · {m.klass}</div>
                                <div style={{ fontSize: 16, fontWeight: 900, color: T.text }}>{m.title}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: 13, color: T.pink, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>{expanded === m.id ? "Thu gọn" : "Chi tiết"}</span>
                            <i className={expanded === m.id ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}></i>
                        </div>
                    </div>

                    {expanded === m.id && (
                        <div style={{ marginTop: 14, borderTop: `1.5px solid ${T.border}`, paddingTop: 14 }}>
                            <div style={{ fontSize: 14, lineHeight: 1.7, color: T.text, marginBottom: 14 }}>{m.content}</div>

                            {m.formulas && m.formulas.length > 0 && (
                                <div style={{ marginBottom: 14 }}>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: T.pink, marginBottom: 7, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                                        <i className="fa-solid fa-square-root-variable"></i> Công thức & Khái niệm
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        {m.formulas.map((f, i) => (
                                            <div key={i}><LatexBlock src={f} /></div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {m.examples && m.examples.length > 0 && (
                                <div style={{ marginBottom: 14 }}>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: "#3b82f6", marginBottom: 7, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                                        <i className="fa-solid fa-lightbulb"></i> Ví dụ mẫu
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {m.examples.map((ex, i) => (
                                            <div key={i} style={{ padding: "10px 14px", background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe" }}>
                                                <div style={{ marginBottom: 6 }}>
                                                    <LatexBlock src={ex.problem} />
                                                </div>
                                                <div style={{ fontSize: 13, color: "#9333ea", fontWeight: 700, background: "rgba(255,255,255,0.6)", padding: "4px 8px", borderRadius: 6 }}>
                                                    <LatexBlock src={ex.solution} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {m.exercises && (
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: "#059669", marginBottom: 7, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                                        <i className="fa-solid fa-pencil"></i> Bài tập vận dụng
                                    </div>
                                    {m.exercises.map((ex, i) => {
                                        const key = `${m.id}-${i}`;
                                        return (
                                            <div key={i} className="card-mint" style={{ padding: "12px 14px", marginBottom: 8 }}>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: "#065f46" }}>Q: {ex.q}</div>
                                                {showA[key] ? (
                                                    <div style={{ marginTop: 6, fontSize: 14, fontWeight: 800, color: "#059669", padding: "6px 10px", background: "white", borderRadius: 8 }}>
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
