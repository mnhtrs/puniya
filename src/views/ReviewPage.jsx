import { useState, useRef, useEffect } from "react";
import { T } from "../constants/theme";
import { dbPut } from "../services/db";
import { SvFlag } from "../components/SvFlag";
import { VnFlag } from "../components/VnFlag";
import { speakSv } from "../services/api";

export default function ReviewPage({ vocab, setVocab, onBack }) {
    const [screen, setScreen] = useState("menu"); // menu | quiz | result
    const [cat, setCat] = useState("Tất cả");
    const [quizType, setQuizType] = useState("testing"); // quiz | testing | typing

    const [qIdx, setQIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [selectedOpt, setSelectedOpt] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [isCorrect, setIsCorrect] = useState(null);
    const [locked, setLocked] = useState(false);

    // Lưu các từ làm sai để làm lại ở cuối
    const [failedItems, setFailedItems] = useState([]);
    const [isFailedPhase, setIsFailedPhase] = useState(false);

    const rvCats = ["Tất cả", ...new Set(vocab.map((v) => v.category).filter(Boolean))];
    const rvPool = cat === "Tất cả" ? vocab : vocab.filter((v) => v.category === cat);

    // SRS_LEVELS: 0=Chưa học, 1=Đang học, 2=Đang thuộc, 3=Đã thuộc, 4=Thành thạo
    // Streak thresholds: 0→1: đúng 1 lần (kiểm tra), 1→2: streak 2 ngày, 2→3: streak 5 ngày, 3→4: streak 7 ngày

    function getSmartPool(pool, mode) {
        if (!pool.length) return [];
        const levels = pool.map(v => v.srsLevel || 0);
        const minLevel = Math.min(...levels);

        if (mode === "testing") {
            // Kiểm tra: ưu tiên 2 mức độ thấp nhất
            const allMastered = minLevel === 4;
            if (allMastered) return pool; // tất cả thành thạo → ôn hết
            const targetLevels = [minLevel, minLevel + 1].filter(l => l <= 4);
            const filtered = pool.filter(v => targetLevels.includes(v.srsLevel || 0));
            return filtered.length > 0 ? filtered : pool;
        } else {
            // Ôn tập (quiz/typing): ưu tiên mức thấp nhất
            const filtered = pool.filter(v => (v.srsLevel || 0) === minLevel);
            return filtered.length > 0 ? filtered : pool;
        }
    }

    function buildQuestions(pool, qType) {
        if (!pool.length) return [];
        const smartPool = getSmartPool(pool, qType);
        const shuffled = [...smartPool].sort(() => Math.random() - 0.5).slice(0, Math.min(10, smartPool.length));

        return shuffled.map((item) => {
            let currentType = "";
            const isReverse = Math.random() > 0.5;

            if (qType === "testing") {
                const isType = Math.random() > 0.5;
                if (isType) {
                    currentType = isReverse ? "sv-vi-type" : "see-type";
                } else {
                    currentType = isReverse ? "vi-sv" : "sv-vi";
                }
            } else if (qType === "quiz") {
                currentType = isReverse ? "vi-sv" : "sv-vi";
            } else if (qType === "typing") {
                currentType = isReverse ? "sv-vi-type" : "see-type";
            }

            // Also mix in some listening for testing
            if (qType === "testing" && Math.random() < 0.2) {
                currentType = "listen-sv";
            }

            const others = pool.filter((v) => v.id !== item.id).sort(() => Math.random() - 0.5);
            const wrongPool = others.slice(0, 3);

            let qData = {
                item,
                type: currentType,
                question: "",
                correct: "",
                options: []
            };

            if (currentType === "sv-vi") {
                qData.question = item.sv;
                qData.correct = item.vi;
                qData.options = [item.vi, ...wrongPool.map(w => w.vi)].sort(() => Math.random() - 0.5);
            } else if (currentType === "vi-sv") {
                qData.question = item.vi;
                qData.correct = item.sv;
                qData.options = [item.sv, ...wrongPool.map(w => w.sv)].sort(() => Math.random() - 0.5);
            } else if (currentType === "see-type") {
                qData.question = item.vi;
                qData.correct = item.sv;
            } else if (currentType === "sv-vi-type") {
                qData.question = item.sv;
                qData.correct = item.vi;
            } else if (currentType === "listen-sv") {
                qData.question = "AUDIO_SV";
                qData.correct = item.sv;
            }

            return qData;
        });
    }

    async function updateSRS(item, correct) {
        if (!item?.id) return;
        const cur = vocab.find((v) => v.id === item.id);
        if (!cur) return;

        const today = new Date().toDateString();
        const curLevel = cur.srsLevel || 0;
        const curStreak = cur.srsStreak || 0;
        const lastReviewDate = cur.srsLastReview || "";

        let newLevel = curLevel;
        let newStreak = curStreak;

        if (correct && quizType === "testing") {
            // Chỉ kiểm tra mới tính lên level
            if (lastReviewDate !== today) {
                newStreak = curStreak + 1; // Streak tăng 1 ngày
            }
            // else: đã ôn hôm nay rồi, streak giữ nguyên

            // Lên cấp theo streak threshold
            if (curLevel === 0) {
                newLevel = 1; // Chưa học → Đang học: đúng 1 lần kiểm tra
            } else if (curLevel === 1 && newStreak >= 2) {
                newLevel = 2; // Đang học → Đang thuộc: streak 2 ngày
                newStreak = 0; // Reset streak cho level mới
            } else if (curLevel === 2 && newStreak >= 5) {
                newLevel = 3; // Đang thuộc → Đã thuộc: streak 5 ngày
                newStreak = 0;
            } else if (curLevel === 3 && newStreak >= 7) {
                newLevel = 4; // Đã thuộc → Thành thạo: streak 7 ngày
                newStreak = 0;
            }
        } else if (!correct) {
            // Sai → hạ 1 cấp (trừ chưa học thì giữ nguyên)
            newLevel = Math.max(curLevel - 1, 0);
            newStreak = 0; // Reset streak khi sai
        }

        const updated = {
            ...cur,
            srsLevel: newLevel,
            srsStreak: newStreak,
            srsLastReview: today
        };
        await dbPut("vocab", updated);
        setVocab((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    }

    function startQuiz() {
        const q = buildQuestions(rvPool, quizType);
        if (q.length === 0) return;
        setQuestions(q);
        setQIdx(0);
        setScore(0);
        setLocked(false);
        setSelectedOpt(null);
        setUserInput("");
        setIsCorrect(null);
        setFailedItems([]);
        setIsFailedPhase(false);
        setScreen("quiz");
    }

    function handleCheck() {
        if (locked) return;
        const curQ = questions[qIdx];
        let correct = false;

        const uVal = userInput.trim().toLowerCase();
        const cVal = curQ.correct.toLowerCase();

        if (curQ.type === "sv-vi" || curQ.type === "vi-sv") {
            correct = selectedOpt === curQ.correct;
        } else {
            correct = uVal === cVal;
        }

        setIsCorrect(correct);
        setLocked(true);

        if (correct) {
            setScore(s => s + 1);
        } else {
            setFailedItems(prev => [...prev, curQ]);
        }

        speakSv(curQ.item.sv);
        if (!isFailedPhase) updateSRS(curQ.item, correct);
    }

    function nextQuestion() {
        if (!isFailedPhase) {
            if (qIdx >= questions.length - 1) {
                if (failedItems.length > 0) {
                    setQuestions([...failedItems]);
                    setFailedItems([]);
                    setQIdx(0);
                    setIsFailedPhase(true);
                    setLocked(false);
                    setSelectedOpt(null);
                    setUserInput("");
                    setIsCorrect(null);
                } else {
                    setScreen("result");
                }
            } else {
                setQIdx(i => i + 1);
                setLocked(false);
                setSelectedOpt(null);
                setUserInput("");
                setIsCorrect(null);
            }
        } else {
            // Đang phase làm lại
            if (qIdx >= questions.length - 1) {
                if (failedItems.length > 0) {
                    setQuestions([...failedItems]);
                    setFailedItems([]);
                    setQIdx(0);
                    setLocked(false);
                    setSelectedOpt(null);
                    setUserInput("");
                    setIsCorrect(null);
                } else {
                    setScreen("result");
                }
            } else {
                setQIdx(i => i + 1);
                setLocked(false);
                setSelectedOpt(null);
                setUserInput("");
                setIsCorrect(null);
            }
        }
    }

    if (vocab.length < 1) {
        return (
            <div className="main">
                <button className="btn btn-s" style={{ marginBottom: 14, fontSize: 12, padding: "5px 12px" }} onClick={onBack}>← Trang chủ</button>
                <div className="empty"><div className="e-ico">🎯</div><p>Thêm ít nhất 1 từ để bắt đầu ôn tập!</p></div>
            </div>
        );
    }

    if (screen === "menu") {
        return (
            <div className="main">
                <button className="btn btn-s" style={{ marginBottom: 14, fontSize: 12, padding: "5px 12px" }} onClick={onBack}>← Trang chủ</button>
                <div className="sec-title">🎯 Ôn tập & Kiểm tra</div>
                <div className="card">
                    <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Chủ đề ôn tập</div>
                    <div className="tabs" style={{ gap: 8 }}>
                        {rvCats.map((c) => (
                            <div key={c} className={`tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c} ({c === "Tất cả" ? vocab.length : vocab.filter((v) => v.category === c).length})</div>
                        ))}
                    </div>
                    <div style={{ marginTop: 15, fontSize: 12, color: T.textL, marginBottom: 8 }}>Hình thức</div>
                    <div className="tabs" style={{ flexWrap: "wrap", gap: 8 }}>
                        <div className={`tab ${quizType === "testing" ? "active" : ""}`} onClick={() => setQuizType("testing")}>Kiểm tra ⭐</div>
                        <div className={`tab ${quizType === "quiz" ? "active" : ""}`} onClick={() => setQuizType("quiz")}>Trắc nghiệm</div>
                        <div className={`tab ${quizType === "typing" ? "active" : ""}`} onClick={() => setQuizType("typing")}>Gõ từ</div>
                    </div>
                    <button className="btn btn-p" style={{ width: "100%", marginTop: 20, padding: 14 }} onClick={startQuiz} disabled={rvPool.length < 1}>Bắt đầu ôn tập</button>
                    {rvPool.length < 1 && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 8, textAlign: "center" }}>Cần ít nhất 1 từ trong nhóm này</div>}
                </div>
            </div>
        );
    }

    if (screen === "quiz") {
        const curQ = questions[qIdx];
        const prog = isFailedPhase ? 95 : ((qIdx) / questions.length) * 100;

        return (
            <div className="main">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <button className="btn btn-s" style={{ fontSize: 11, padding: "4px 10px", marginRight: 10 }} onClick={() => setScreen("menu")}>← Quay lại</button>
                    <div style={{ flex: 1, height: 8, background: T.border, borderRadius: 4, overflow: "hidden", marginRight: 15 }}>
                        <div style={{ height: "100%", width: `${prog}%`, background: T.pink, transition: "width .3s" }} />
                    </div>
                    {isFailedPhase && <div className="bdg bdg-p" style={{ fontSize: 10 }}>Sửa lỗi sai</div>}
                </div>

                <div className="rev-q">
                    <div style={{ fontSize: 12, color: T.textL, marginBottom: 8 }}>
                        {curQ.type === "sv-vi" && "Chọn nghĩa tiếng Việt đúng"}
                        {curQ.type === "vi-sv" && "Chọn từ tiếng Thụy Điển đúng"}
                        {curQ.type === "see-type" && "Gõ từ này bằng tiếng Thụy Điển"}
                        {curQ.type === "sv-vi-type" && "Nghĩa của từ này là gì?"}
                        {curQ.type === "listen-sv" && "Nghe và gõ lại bằng tiếng Thụy Điển"}
                    </div>
                    {curQ.question === "AUDIO_SV" ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                            <button className="btn btn-p" style={{ width: 80, height: 80, borderRadius: "50%", fontSize: 32 }} onClick={() => speakSv(curQ.item.sv)}>🔊</button>
                            <div style={{ fontSize: 14, color: T.pink, fontWeight: 700 }}>Bấm để nghe lại</div>
                        </div>
                    ) : (
                        <div className="rev-word" style={{ fontSize: 28 }}>{curQ.question}</div>
                    )}
                </div>

                {(curQ.type === "see-type" || curQ.type === "sv-vi-type" || curQ.type === "listen-sv") ? (
                    <div style={{ marginTop: 20 }}>
                        <input
                            className="inp"
                            style={{ textAlign: "center", fontSize: 18, fontWeight: 700 }}
                            placeholder="Gõ đáp án..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            disabled={locked}
                            onKeyDown={(e) => e.key === "Enter" && !locked && userInput.trim() && handleCheck()}
                            autoFocus
                        />
                    </div>
                ) : (
                    <div className="rev-opts" style={{ marginTop: 20 }}>
                        {curQ.options.map((opt, i) => (
                            <button
                                key={i}
                                className={`rev-opt ${locked ? (opt === curQ.correct ? "correct" : (opt === selectedOpt ? "wrong" : "disabled")) : (selectedOpt === opt ? "selected" : "")}`}
                                onClick={() => !locked && setSelectedOpt(opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                {!locked ? (
                    <button
                        className="btn btn-p"
                        style={{ width: "100%", marginTop: 25, height: 50, borderRadius: 15 }}
                        onClick={handleCheck}
                        disabled={["see-type", "sv-vi-type", "listen-sv"].includes(curQ.type) ? !userInput.trim() : !selectedOpt}
                    >
                        KIỂM TRA
                    </button>
                ) : (
                    <div style={{ marginTop: 25, padding: 20, borderRadius: 20, background: isCorrect ? "#dcfce7" : "#fee2e2", animation: "slideUp 0.3s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 15 }}>
                            <div style={{ fontSize: 30 }}>{isCorrect ? "✨" : "🚫"}</div>
                            <div>
                                <div style={{ fontWeight: 900, fontSize: 16, color: isCorrect ? "#15803d" : "#b91c1c" }}>{isCorrect ? "Tuyệt vời!" : "Chưa chính xác"}</div>
                                {!isCorrect && <div style={{ fontSize: 14, color: "#b91c1c" }}>Đáp án đúng: <b>{curQ.correct}</b></div>}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button className="btn" style={{ flex: 1, background: "white", color: T.text, borderRadius: 12 }} onClick={() => setScreen("menu")}>Thoát</button>
                            <button className="btn btn-p" style={{ flex: 2, borderRadius: 12 }} onClick={nextQuestion}>Tiếp tục</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="main" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 72, marginBottom: 15 }}>{score >= 7 ? "🏆" : "🔥"}</div>
            <div className="sec-title" style={{ justifyContent: "center" }}>Hoàn thành bài tập!</div>
            <div className="card" style={{ padding: 30 }}>
                <div style={{ fontSize: 44, fontWeight: 900, color: T.pink }}>{score}/{questions.length}</div>
                <div style={{ fontSize: 14, color: T.textL, marginTop: 8 }}>Mày đã hoàn thành xuất sắc bài ôn tập.</div>
            </div>
            <button className="btn btn-p" style={{ width: "100%", padding: 15, borderRadius: 16 }} onClick={() => setScreen("menu")}>Về Menu</button>
        </div>
    );
}
