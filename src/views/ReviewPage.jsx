import { useState } from "react";
import { T } from "../constants/theme";
import { dbPut } from "../services/db";
import { speakSv } from "../services/api";
import { SubHeader } from "../components/SubHeader";

export default function ReviewPage({ vocab, setVocab, onBack }) {
    const [screen, setScreen] = useState("menu");
    const [cat, setCat] = useState("Tất cả");
    const [quizType, setQuizType] = useState("testing");

    const [qIdx, setQIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [selectedOpt, setSelectedOpt] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [isCorrect, setIsCorrect] = useState(null);
    const [locked, setLocked] = useState(false);

    const [failedItems, setFailedItems] = useState([]);
    const [isFailedPhase, setIsFailedPhase] = useState(false);

    const rvCats = ["Tất cả", ...new Set(vocab.flatMap((v) => v.categories || (v.category ? [v.category] : [])).filter(Boolean))];
    const rvPool = cat === "Tất cả" ? vocab : vocab.filter((v) => {
        const vCats = v.categories || (v.category ? [v.category] : []);
        return vCats.includes(cat);
    });

    function getSmartPool(pool, mode) {
        if (!pool.length) return [];
        const levels = pool.map(v => v.srsLevel || 0);
        const minLevel = Math.min(...levels);

        if (mode === "testing") {
            const allMastered = minLevel === 4;
            if (allMastered) return pool;
            const targetLevels = [minLevel, minLevel + 1].filter(l => l <= 4);
            const filtered = pool.filter(v => targetLevels.includes(v.srsLevel || 0));
            return filtered.length > 0 ? filtered : pool;
        } else {
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
            if (lastReviewDate !== today) {
                newStreak = curStreak + 1;
            }
            if (curLevel === 0) {
                newLevel = 1;
            } else if (curLevel === 1 && newStreak >= 2) {
                newLevel = 2;
                newStreak = 0;
            } else if (curLevel === 2 && newStreak >= 5) {
                newLevel = 3;
                newStreak = 0;
            } else if (curLevel === 3 && newStreak >= 7) {
                newLevel = 4;
                newStreak = 0;
            }
        } else if (!correct) {
            newLevel = Math.max(curLevel - 1, 0);
            newStreak = 0;
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
    }

    if (vocab.length < 1) {
        return (
            <div className="main">
                <SubHeader
                    title="Ôn tập & Kiểm tra"
                    icon="fa-solid fa-bullseye"
                    iconColor={T.pink}
                    iconBg="#FCE7F3"
                    onBack={onBack}
                />
                <div className="empty">
                    <div className="e-ico" style={{ color: T.pink, fontSize: 44 }}>
                        <i className="fa-solid fa-bullseye"></i>
                    </div>
                    <p>Thêm ít nhất 1 từ để bắt đầu ôn tập!</p>
                </div>
            </div>
        );
    }

    if (screen === "menu") {
        return (
            <div className="main">
                <SubHeader
                    title="Ôn tập & Kiểm tra"
                    icon="fa-solid fa-bullseye"
                    iconColor={T.pink}
                    iconBg="#FCE7F3"
                    onBack={onBack}
                />
                <div className="card">
                    <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fa-solid fa-tags" style={{ color: T.pink }}></i>
                        <span>Chủ đề ôn tập</span>
                    </div>
                    <div className="tabs" style={{ gap: 8 }}>
                        {rvCats.map((c) => (
                            <div key={c} className={`tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c} ({c === "Tất cả" ? vocab.length : vocab.filter((v) => {
                                const vCats = v.categories || (v.category ? [v.category] : []);
                                return vCats.includes(c);
                            }).length})</div>
                        ))}
                    </div>
                    <div style={{ marginTop: 15, fontSize: 12, color: T.textL, marginBottom: 8, fontWeight: 700 }}>Hình thức</div>
                    <div className="tabs" style={{ flexWrap: "wrap", gap: 8 }}>
                        <div className={`tab ${quizType === "testing" ? "active" : ""}`} onClick={() => setQuizType("testing")}>
                            <i className="fa-solid fa-star" style={{ color: "#F59E0B", marginRight: 4 }}></i> Kiểm tra
                        </div>
                        <div className={`tab ${quizType === "quiz" ? "active" : ""}`} onClick={() => setQuizType("quiz")}>
                            <i className="fa-solid fa-list-check" style={{ marginRight: 4 }}></i> Trắc nghiệm
                        </div>
                        <div className={`tab ${quizType === "typing" ? "active" : ""}`} onClick={() => setQuizType("typing")}>
                            <i className="fa-solid fa-keyboard" style={{ marginRight: 4 }}></i> Gõ từ
                        </div>
                    </div>
                    <button className="btn btn-p" style={{ width: "100%", marginTop: 20, padding: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={startQuiz} disabled={rvPool.length < 1}>
                        <i className="fa-solid fa-play"></i> Bắt đầu ôn tập
                    </button>
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
                    <button className="btn btn-s" style={{ fontSize: 11, padding: "4px 10px", marginRight: 10, display: "flex", alignItems: "center", gap: 4 }} onClick={() => setScreen("menu")}>
                        <i className="fa-solid fa-arrow-left"></i> Quay lại
                    </button>
                    <div style={{ flex: 1, height: 8, background: T.border, borderRadius: 4, overflow: "hidden", marginRight: 15 }}>
                        <div style={{ height: "100%", width: `${prog}%`, background: T.pink, transition: "width .3s" }} />
                    </div>
                    {isFailedPhase && <div className="bdg bdg-pk" style={{ fontSize: 10 }}>Sửa lỗi sai</div>}
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
                            <button className="btn btn-p" style={{ width: 80, height: 80, borderRadius: "50%", fontSize: 32 }} onClick={() => speakSv(curQ.item.sv)}>
                                <i className="fa-solid fa-volume-high"></i>
                            </button>
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
                            <div style={{ fontSize: 28, color: isCorrect ? "#15803d" : "#b91c1c" }}>
                                <i className={isCorrect ? "fa-solid fa-circle-check" : "fa-solid fa-circle-xmark"}></i>
                            </div>
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
            <div style={{ fontSize: 60, marginBottom: 15, color: score >= 7 ? "#F59E0B" : T.pink }}>
                <i className={score >= 7 ? "fa-solid fa-trophy" : "fa-solid fa-fire"}></i>
            </div>
            <div className="sec-title" style={{ justifyContent: "center" }}>Hoàn thành bài tập!</div>
            <div className="card" style={{ padding: 30 }}>
                <div style={{ fontSize: 44, fontWeight: 900, color: T.pink }}>{score}/{questions.length}</div>
                <div style={{ fontSize: 14, color: T.textL, marginTop: 8 }}>Bạn đã hoàn thành xuất sắc bài ôn tập.</div>
            </div>
            <button className="btn btn-p" style={{ width: "100%", padding: 15, borderRadius: 16 }} onClick={() => setScreen("menu")}>Về Menu</button>
        </div>
    );
}
