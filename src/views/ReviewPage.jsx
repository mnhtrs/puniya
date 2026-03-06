import { useState, useRef } from "react";
import { T } from "../constants/theme";
import { dbPut } from "../services/db";

export default function ReviewPage({ vocab, setVocab, onBack }) {
    const [screen, setScreen] = useState("menu"); // menu | quiz | result
    const [cat, setCat] = useState("Tất cả");
    const [quizType, setQuizType] = useState("sv-vi");

    const questionsRef = useRef([]);
    const qIdxRef = useRef(0);
    const scoreRef = useRef(0);
    const heartsRef = useRef(3);
    const lockedRef = useRef(false);

    const [, forceUpdate] = useState(0);
    const tick = () => forceUpdate((n) => n + 1);

    const rvCats = ["Tất cả", ...new Set(vocab.map((v) => v.category).filter(Boolean))];
    const rvPool = cat === "Tất cả" ? vocab : vocab.filter((v) => v.category === cat);

    function buildQuestions(pool, qType) {
        if (!pool.length) return [];
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(10, pool.length));
        return shuffled.map((item) => {
            const others = pool.filter((v) => v.id !== item.id).sort(() => Math.random() - 0.5);
            const wrongPool = others.length >= 3 ? others.slice(0, 3) : [...others, ...Array(3 - others.length).fill(null)];
            const dVI = ["(không biết)", "(sai nghĩa)", "(không đúng)"];
            const dSV = ["(fel ord)", "(inte rätt)", "(fel svar)"];
            const opts =
                qType === "sv-vi"
                    ? [item.vi, ...wrongPool.map((w, i) => (w ? w.vi : dVI[i]))].sort(() => Math.random() - 0.5)
                    : [item.sv, ...wrongPool.map((w, i) => (w ? w.sv : dSV[i]))].sort(() => Math.random() - 0.5);
            return {
                item,
                options: opts,
                correct: qType === "sv-vi" ? item.vi : item.sv,
                question: qType === "sv-vi" ? item.sv : item.vi,
            };
        });
    }

    async function updateSRS(item, correct) {
        if (!item?.id) return;
        const cur = vocab.find((v) => v.id === item.id);
        if (!cur) return;
        const lvl = correct ? Math.min((cur.srsLevel || 0) + 1, 4) : Math.max((cur.srsLevel || 0) - 1, 0);
        const updated = { ...cur, srsLevel: lvl, srsNextReview: Date.now() + [0, 1, 3, 7, 14][lvl] * 86400000 };
        await dbPut("vocab", updated);
        setVocab((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    }

    function startQuiz() {
        const q = buildQuestions(rvPool, quizType);
        if (q.length === 0) return;
        questionsRef.current = q;
        qIdxRef.current = 0;
        scoreRef.current = 0;
        heartsRef.current = 3;
        lockedRef.current = false;
        setScreen("quiz");
    }

    function handleChoose(opt) {
        if (lockedRef.current) return;
        lockedRef.current = true;
        const curQ = questionsRef.current[qIdxRef.current];
        const isCorrect = opt === curQ.correct;

        if (isCorrect) {
            scoreRef.current++;
        } else {
            heartsRef.current--;
        }

        updateSRS(curQ.item, isCorrect);
        tick();

        setTimeout(() => {
            if (heartsRef.current <= 0 || qIdxRef.current >= questionsRef.current.length - 1) {
                setScreen("result");
            } else {
                qIdxRef.current++;
                lockedRef.current = false;
                tick();
            }
        }, 1200);
    }

    if (vocab.length < 4) {
        return (
            <div className="main">
                <button className="btn btn-s" style={{ marginBottom: 14, fontSize: 12, padding: "5px 12px" }} onClick={onBack}>← Trang chủ</button>
                <div className="empty"><div className="e-ico">🎯</div><p>Thêm ít nhất 4 từ để bắt đầu ôn tập!</p></div>
            </div>
        );
    }

    if (screen === "menu") {
        return (
            <div className="main">
                <button className="btn btn-s" style={{ marginBottom: 14, fontSize: 12, padding: "5px 12px" }} onClick={onBack}>← Trang chủ</button>
                <div className="sec-title">🎯 Ôn tập kiến thức</div>
                <div className="card">
                    <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Cài đặt ôn tập</div>
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 12, color: T.textL, marginBottom: 5 }}>Phân loại</div>
                        <div className="tabs">
                            {rvCats.map((c) => (
                                <div key={c} className={`tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c} ({c === "Tất cả" ? vocab.length : vocab.filter((v) => v.category === c).length})</div>
                            ))}
                        </div>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 12, color: T.textL, marginBottom: 5 }}>Hình thức</div>
                        <div className="tabs">
                            <div className={`tab ${quizType === "sv-vi" ? "active" : ""}`} onClick={() => setQuizType("sv-vi")}>SV → VI</div>
                            <div className={`tab ${quizType === "vi-sv" ? "active" : ""}`} onClick={() => setQuizType("vi-sv")}>VI → SV</div>
                        </div>
                    </div>
                    <button className="btn btn-p" style={{ width: "100%", padding: "14px" }} onClick={startQuiz} disabled={rvPool.length < 4}>Bắt đầu ôn tập</button>
                    {rvPool.length < 4 && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 8, textAlign: "center" }}>Cần ít nhất 4 từ trong nhóm này</div>}
                </div>
            </div>
        );
    }

    if (screen === "quiz") {
        const curQ = questionsRef.current[qIdxRef.current];
        const progress = ((qIdxRef.current) / questionsRef.current.length) * 100;
        return (
            <div className="main">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ flex: 1, height: 10, background: T.border, borderRadius: 5, overflow: "hidden", marginRight: 15 }}>
                        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${T.pink},${T.purple})`, transition: "width .3s" }} />
                    </div>
                    <div style={{ fontSize: 18 }}>{"❤️".repeat(heartsRef.current)}</div>
                </div>
                <div className="rev-q">
                    <div style={{ fontSize: 13, color: T.textL }}>{quizType === "sv-vi" ? "Nghĩa của từ này là gì?" : "Từ này trong tiếng Thụy Điển là gì?"}</div>
                    <div className="rev-word">{curQ.question}</div>
                </div>
                <div className="rev-opts" style={{ marginTop: 15 }}>
                    {curQ.options.map((opt, i) => (
                        <button key={i} className="rev-opt" onClick={() => handleChoose(opt)}>{opt}</button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="main" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 10 }}>{scoreRef.current >= 7 ? "🎉" : "💪"}</div>
            <div className="sec-title" style={{ justifyContent: "center" }}>Kết quả ôn tập</div>
            <div className="card">
                <div style={{ fontSize: 40, fontWeight: 900, color: T.pink }}>{scoreRef.current}/{questionsRef.current.length}</div>
                <div style={{ fontSize: 14, color: T.textL, marginTop: 5 }}>Bạn đã hoàn thành bài ôn tập</div>
            </div>
            <button className="btn btn-p" style={{ width: "100%", padding: 14 }} onClick={() => setScreen("menu")}>Về menu ôn tập</button>
        </div>
    );
}
