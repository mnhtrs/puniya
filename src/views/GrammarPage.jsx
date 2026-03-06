import { useState } from "react";
import { T } from "../constants/theme";
import { GRAMMAR } from "../constants/grammar";
import { speakSv } from "../services/api";

export default function GrammarPage({ onBack }) {
    const [expanded, setExpanded] = useState(null);
    return (
        <div className="main">
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
                <button className="btn btn-s" style={{ fontSize: 12, padding: "5px 12px" }} onClick={onBack}>
                    ← Trang chủ
                </button>
                <div className="sec-title" style={{ marginBottom: 0 }}>✏️ Ngữ pháp</div>
            </div>
            <div className="card card-g" style={{ padding: "11px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: T.textL, lineHeight: 1.65 }}>
                    Tiếng Thụy Điển thuộc nhóm North Germanic, gần với Na Uy và Đan Mạch. {GRAMMAR.length} chủ điểm ngữ pháp từ cơ bản đến nâng cao. 🌟
                </div>
            </div>

            {GRAMMAR.map((g) => (
                <div key={g.id} className="gcard">
                    <div className="gtitle" onClick={() => setExpanded(expanded === g.id ? null : g.id)}>
                        <span>
                            {g.emoji} {g.title}
                        </span>
                        <span style={{ color: T.pinkL, fontSize: 16, flexShrink: 0 }}>{expanded === g.id ? "▲" : "▼"}</span>
                    </div>
                    {expanded === g.id && (
                        <div className="gcontent">
                            <p style={{ marginBottom: 10 }}>{g.content}</p>
                            {g.table && (
                                <div style={{ overflowX: "auto" }}>
                                    <table className="gt">
                                        <thead>
                                            <tr>
                                                {g.table.headers.map((h, i) => (
                                                    <th key={i}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {g.table.rows.map((row, i) => (
                                                <tr key={i}>
                                                    {row.map((cell, j) => (
                                                        <td key={j}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {g.examples &&
                                g.examples.map((ex, i) => (
                                    <div key={i} className="ex-item">
                                        <div className="ex-sv" style={{ cursor: "pointer" }} onClick={() => speakSv(ex.sv)}>
                                            {ex.sv} <span style={{ fontSize: 12 }}>🔊</span>
                                        </div>
                                        <div className="ex-vi">{ex.vi}</div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
