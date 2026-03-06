import { useState, useEffect } from "react";
import { dbOpen, dbGetAll } from "./services/db";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { KaTeXLoader } from "./components/MathRender";
import HomePage from "./views/HomePage";
import VocabPage from "./views/VocabPage";
import SettingsPage from "./views/SettingsPage";

export default function App() {
    const [tab, setTab] = useState("home");
    const [vocab, setVocab] = useState([]);
    const [streak, setStreak] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            await dbOpen();
            const all = await dbGetAll("vocab");
            setVocab(all);

            // Simple streak logic
            const lastStudy = localStorage.getItem("puniya_last_study_2");
            const savedStreak = parseInt(localStorage.getItem("puniya_streak_2") || "1");
            const today = new Date().toDateString();

            if (lastStudy) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (lastStudy === yesterday.toDateString()) {
                    setStreak(savedStreak + 1);
                    localStorage.setItem("puniya_streak_2", (savedStreak + 1).toString());
                } else if (lastStudy !== today) {
                    setStreak(1);
                    localStorage.setItem("puniya_streak_2", "1");
                } else {
                    setStreak(savedStreak);
                }
            } else {
                setStreak(1);
                localStorage.setItem("puniya_streak_2", "1");
            }
            localStorage.setItem("puniya_last_study_2", today);
            setLoading(false);
        }
        init();
    }, []);

    if (loading) {
        return (
            <div className="loader-wrap">
                <div className="loader">✿</div>
                <div style={{ marginTop: 20, fontSize: 18, fontWeight: 900, color: "#ec4899" }}>Puniya is loading...</div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <KaTeXLoader />
            <Header streak={streak} vocab={vocab} />

            <main className="content">
                {tab === "home" && <HomePage vocab={vocab} setVocab={setVocab} streak={streak} />}
                {tab === "vocab" && <VocabPage vocab={vocab} setVocab={setVocab} />}
                {tab === "settings" && <SettingsPage streak={streak} vocab={vocab} />}
            </main>

            <BottomNav active={tab} onChange={setTab} />
        </div>
    );
}
