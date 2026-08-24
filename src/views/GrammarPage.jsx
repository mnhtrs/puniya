import { useState } from "react";
import { T } from "../constants/theme";
import { GRAMMAR } from "../constants/grammar";
import { speakSv } from "../services/api";
import { SvFlag } from "../components/SvFlag";
import { VnFlag } from "../components/VnFlag";
import { SubHeader } from "../components/SubHeader";

export default function GrammarPage({ onBack }) {
    const [expanded, setExpanded] = useState(null);
    return (
        <div className="main">
            <SubHeader
                title="Ngữ pháp Thụy Điển"
                icon="fa-solid fa-book-open"
                iconColor={T.pink}
                iconBg="#FCE7F3"
                onBack={onBack}
            />
            <div className="card card-g" style={{ padding: "11px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: T.textL, lineHeight: 1.65, display: "flex", alignItems: "center", gap: 6 }}>
                    <SvFlag size={14} /> Tổng hợp ngữ pháp tiếng Thụy Điển từ cơ bản đến nâng cao ({GRAMMAR.length} chủ điểm).
                </div>
            </div>

            {GRAMMAR.map((g) => (
                <div key={g.id} className="gcard">
                    <div className="gtitle" onClick={() => setExpanded(expanded === g.id ? null : g.id)}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <i className="fa-solid fa-bookmark" style={{ color: T.pink, fontSize: 13 }}></i>
                            {g.title}
                        </span>
                        <span style={{ color: T.pinkL, fontSize: 14, flexShrink: 0 }}>
                            <i className={expanded === g.id ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}></i>
                        </span>
                    </div>
                    {expanded === g.id && (
                        <div className="gcontent">
                            <p style={{ marginBottom: 10, lineHeight: 1.6 }}>{g.content}</p>
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
                                        <div className="ex-sv" style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={() => speakSv(ex.sv)}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <SvFlag size={14} /> <span>{ex.sv}</span>
                                            </div>
                                            <i className="fa-solid fa-volume-high" style={{ fontSize: 12, color: T.purple }}></i>
                                        </div>
                                        <div className="ex-vi" style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.9, marginTop: 3 }}>
                                            <VnFlag size={14} /> {ex.vi}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
