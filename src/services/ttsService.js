// ========================================================
// PUNIYA - ULTRA-RELIABLE SWEDISH TTS & AUDIO ENGINE
// Solves:
// 1. "stygg" spelled out letter-by-letter (es-tee-wai-jee-jee)
// 2. Slow proxy lag / timeouts
// 3. Native Swedish audio caching & instant playback
// ========================================================

const _ttsCache = new Map();
let _currentAudio = null;

/**
 * Get Swedish TTS audio URL from high-reliability endpoints
 */
function getSwedishAudioUrls(text) {
    const enc = encodeURIComponent(text.trim());
    return [
        // Primary: Google Translate tw-ob client (direct MP3 audio, standard Swedish voice)
        `https://translate.google.com/translate_tts?ie=UTF-8&tl=sv&client=tw-ob&q=${enc}`,
        // Secondary: Google Translate gtx client
        `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=sv&q=${enc}`,
        // Tertiary: DictVoice Swedish engine
        `https://dict.youdao.com/dictvoice?audio=${enc}&le=sv`
    ];
}

/**
 * Check if the browser has a genuine Swedish voice installed
 */
function getBrowserSwedishVoice() {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => {
        const lang = (v.lang || "").toLowerCase();
        return lang === "sv-se" || lang === "sv" || lang.startsWith("sv_") || lang.startsWith("sv-");
    }) || null;
}

// Make sure voices are initialized in browser
if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        getBrowserSwedishVoice();
    };
}

/**
 * Main speak function for Swedish text
 * @param {string} text - Swedish word or phrase
 * @param {boolean} prefetchOnly - Only prefetch and cache, don't play
 * @param {function} onStateChange - Optional callback (isPlaying: boolean)
 */
export async function speakSv(text, prefetchOnly = false, onStateChange = null) {
    if (!text || typeof text !== "string") return;
    const cleanText = text.trim();
    if (!cleanText) return;

    const cacheKey = cleanText.toLowerCase();

    // 1. If cached audio object exists, play immediately (<10ms)
    if (_ttsCache.has(cacheKey)) {
        if (!prefetchOnly) {
            try {
                if (_currentAudio) {
                    _currentAudio.pause();
                    _currentAudio.currentTime = 0;
                }
                const cachedAudio = _ttsCache.get(cacheKey);
                _currentAudio = cachedAudio;
                if (onStateChange) onStateChange(true);
                cachedAudio.currentTime = 0;
                cachedAudio.onended = () => onStateChange && onStateChange(false);
                cachedAudio.onerror = () => onStateChange && onStateChange(false);
                await cachedAudio.play();
                return;
            } catch (err) {
                // If cached audio playback fails (e.g. autoplay restriction), fallback
            }
        } else {
            return;
        }
    }

    // 2. Play via direct HTML5 Audio (Bypasses CORS restrictions on media playback)
    const urls = getSwedishAudioUrls(cleanText);

    for (const url of urls) {
        try {
            const audio = new Audio();
            audio.preload = "auto";
            audio.src = url;

            if (prefetchOnly) {
                // Preload and store
                audio.load();
                _ttsCache.set(cacheKey, audio);
                return;
            }

            if (_currentAudio) {
                _currentAudio.pause();
                _currentAudio.currentTime = 0;
            }
            _currentAudio = audio;

            if (onStateChange) onStateChange(true);
            audio.onended = () => onStateChange && onStateChange(false);
            audio.onerror = () => onStateChange && onStateChange(false);

            await audio.play();
            _ttsCache.set(cacheKey, audio);
            return;
        } catch (e) {
            // Try next URL endpoint
            continue;
        }
    }

    // 3. Fallback: Browser Web Speech API ONLY IF TRUE SWEDISH VOICE EXISTS
    // CRITICAL: We NEVER let English or default voice speak Swedish words,
    // because English synthesizers spell out Swedish words letter-by-letter!
    if (!prefetchOnly && typeof window !== "undefined" && window.speechSynthesis) {
        const svVoice = getBrowserSwedishVoice();
        if (svVoice) {
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(cleanText);
                utter.voice = svVoice;
                utter.lang = "sv-SE";
                utter.rate = 0.88;
                utter.pitch = 1.0;
                if (onStateChange) {
                    utter.onstart = () => onStateChange(true);
                    utter.onend = () => onStateChange(false);
                    utter.onerror = () => onStateChange(false);
                }
                window.speechSynthesis.speak(utter);
                return;
            } catch (err) {
                console.warn("SpeechSynthesis error:", err);
            }
        }
    }

    if (onStateChange) onStateChange(false);
}

/**
 * Prefetch a batch of words
 */
export async function prefetchAllAudio(vocabList) {
    if (!vocabList || !vocabList.length) return;
    const items = vocabList.slice(0, 30);
    for (const item of items) {
        const word = item.sv || item.word;
        if (word) {
            speakSv(word, true).catch(() => {});
        }
    }
}
