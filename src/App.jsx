import { useState, useEffect, useRef } from "react";
import { dbOpen, dbGetAll, dbAdd, dbDelete } from "./services/db";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { KaTeXLoader } from "./components/MathRender";
import { prefetchAllAudio } from "./services/api";
import HomePage from "./views/HomePage";
import VocabPage from "./views/VocabPage";
import SettingsPage from "./views/SettingsPage";
import AIChatPage from "./views/AIChatPage";

export default function App() {
    const [tab, setTab] = useState("home");
    const [vocab, setVocab] = useState([]);
    const [tags, setTags] = useState([]);
    const [streak, setStreak] = useState(1);
    const [loading, setLoading] = useState(true);
    const mainRef = useRef(null);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    useEffect(() => {
        async function init() {
            await dbOpen();
            const allVocab = await dbGetAll("vocab");
            const allTags = await dbGetAll("tags");
            setVocab(allVocab);
            setTags(allTags);

            // Audio prefetch
            if (allVocab.length > 0) {
                prefetchAllAudio(allVocab);
            }

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

    // Setup Push Notifications
    useEffect(() => {
        let intervalId;
        const checkNotif = async () => {
            const enabled = localStorage.getItem("puniya_notif") === "true";
            const mins = parseFloat(localStorage.getItem("puniya_notif_min")) || 30;
            if (intervalId) clearInterval(intervalId);

            if (enabled && mins > 0 && "Notification" in window && Notification.permission === "granted") {
                intervalId = setInterval(async () => {
                    const allVocab = await dbGetAll("vocab");
                    if (allVocab.length > 0) {
                        const word = allVocab[Math.floor(Math.random() * allVocab.length)];
                        new Notification("Puniya - Ôn bài nào! 🌟", {
                            body: `Bạn còn nhớ từ "${word.sv}" nghĩa là "${word.vi}" không?`,
                            icon: "/hachiware.png"
                        });
                    }
                }, mins * 60 * 1000);
            }
        };

        checkNotif();
        window.addEventListener("notifSettingsChanged", checkNotif);
        return () => {
            if (intervalId) clearInterval(intervalId);
            window.removeEventListener("notifSettingsChanged", checkNotif);
        };
    }, []);

    const goHomeAndReset = () => {
        setTab("home");
        window.dispatchEvent(new CustomEvent("goHomeSignal"));
    };

    const handleTabChange = (t) => {
        if (t === "home") window.dispatchEvent(new CustomEvent("goHomeSignal"));
        setTab(t);
    };

    async function handleImport(newVocab, newStreak, newTags = []) {
        setLoading(true);
        // Clean old DB
        const oldV = await dbGetAll("vocab");
        for (const v of oldV) await dbDelete("vocab", v.id);
        const oldT = await dbGetAll("tags");
        for (const t of oldT) await dbDelete("tags", t.id);

        // Add new vocab
        const importedV = [];
        for (const v of newVocab) {
            const { id: _, ...rest } = v;
            const newId = await dbAdd("vocab", rest);
            importedV.push({ ...rest, id: newId });
        }

        // Add new tags
        const importedT = [];
        for (const t of newTags) {
            const { id: _, ...rest } = t;
            const newId = await dbAdd("tags", rest);
            importedT.push({ ...rest, id: newId });
        }

        setVocab(importedV);
        setTags(importedT);
        setStreak(newStreak);
        localStorage.setItem("puniya_streak_2", newStreak.toString());
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="loader-wrap">
                <div className="loader">✿</div>
                <div style={{ marginTop: 20, fontSize: 18, fontWeight: 900, color: "#ec4899" }}>Puniya is loading...</div>
            </div>
        );
    }

    return (
        <div className="app-container" style={{ height: tab === 'chat' ? '100dvh' : 'auto', overflow: tab === 'chat' ? 'hidden' : 'visible' }}>
            <KaTeXLoader />
            <Header streak={streak} vocab={vocab} onScrollToTop={scrollToTop} onGoHome={goHomeAndReset} />

            <main ref={mainRef} className="content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: tab === 'chat' ? 0 : undefined }}>
                {tab === "home" && <HomePage vocab={vocab} setVocab={setVocab} streak={streak} />}
                {tab === "vocab" && <VocabPage vocab={vocab} setVocab={setVocab} tags={tags} setTags={setTags} />}
                {tab === "chat" && <AIChatPage vocab={vocab} />}
                {tab === "settings" && <SettingsPage streak={streak} vocab={vocab} tags={tags} onImport={handleImport} />}
            </main>

            <BottomNav active={tab} onChange={handleTabChange} />
        </div>
    );
}
