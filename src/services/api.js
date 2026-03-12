// ========================================================
// PUNIYA - SWEDISH-VIETNAMESE DICTIONARY ENGINE
// Audio: Google TTS (same voice as Google Translate)
// Dictionary: Wiktionary IPA + Google Translate + GPT-4o
// ========================================================

// Global helper to call GPT-4o AI
async function callGPT(prompt, maxTokens = 1500) {
    try {
        const res = await fetch("/api/expert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt, maxTokens })
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.choices?.[0]?.message?.content || null;

    } catch (e) {
        console.error("GPT Error:", e);
        return null;
    }
}

// Swedish autocomplete via Wiktionary
export async function svAutocomplete(query) {
    if (!query) return [];
    try {
        const url = `https://sv.wiktionary.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=8&namespace=0&format=json&origin=*`;
        const r = await fetch(url);
        const d = await r.json();
        return d[1] || [];
    } catch { return []; }
}

async function googleTranslate(text, sl = "sv", tl = "vi") {
    if (!text) return "";
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const json = await res.json();
        return json?.[0]?.map(x => x[0]).join("") || text;
    } catch { return text; }
}

/**
 * Dịch hàng loạt để tăng tốc độ. Nối các câu bằng dấu phân cách đặc biệt.
 */
async function googleTranslateBatch(texts, sl = "sv", tl = "vi") {
    if (!texts.length) return [];
    const DELIM = " ||| ";
    const combined = texts.join(DELIM);
    const result = await googleTranslate(combined, sl, tl);
    return result.split(DELIM).map((val, i) => val.trim() || texts[i]);
}

// Fetch Swedish IPA phonetics from English Wiktionary (most complete source)
async function fetchSwedishIPA(word) {
    try {
        const url = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=wikitext&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        const wikitext = data?.parse?.wikitext?.["*"] || "";

        // Extract Swedish section IPA: looks for {{IPA|sv|/.../ }} or {{sv-IPA}}
        const ipaMatch = wikitext.match(/\{\{IPA\|sv\|([^}]+)\}\}/i);
        if (ipaMatch) {
            // Clean up: extract the actual /.../ pattern
            const raw = ipaMatch[1];
            const phoneme = raw.match(/\/[^/]+\//);
            if (phoneme) return phoneme[0]; // e.g. /stʏɡ/
        }

        // Fallback: look for inline IPA in Swedish section
        const svSection = wikitext.indexOf("==Swedish==");
        if (svSection !== -1) {
            const svPart = wikitext.slice(svSection, svSection + 2000);
            const inlineIPA = svPart.match(/\{\{IPA\|[^}]*\/([^/}]+)\/[^}]*\}\}/);
            if (inlineIPA) return `/${inlineIPA[1]}/`;
        }
        return null;
    } catch { return null; }
}

// =====================================================
// WIKTIONARY DICTIONARY (NO AI — 100% FREE DATA)
// Parses en.wiktionary.org wikitext for Swedish entries
// =====================================================

const POS_MAP = {
    'Noun': 'Danh từ', 'Verb': 'Động từ', 'Adjective': 'Tính từ',
    'Adverb': 'Phó từ', 'Pronoun': 'Đại từ', 'Preposition': 'Giới từ',
    'Conjunction': 'Liên từ', 'Interjection': 'Thán từ', 'Numeral': 'Số từ',
    'Determiner': 'Mạo từ', 'Particle': 'Tiểu từ', 'Phrase': 'Cụm từ',
    'Suffix': 'Hậu tố', 'Prefix': 'Tiền tố',
};

function cleanWiki(text) {
    if (!text) return "";
    return text
        .replace(/\{\{l\|[a-z-]+\|([^}|]+)(\|[^}]*)?\}\}/g, '$1')
        .replace(/\{\{m\|[a-z-]+\|([^}|]+)(\|[^}]*)?\}\}/g, '$1')
        .replace(/\{\{sense\|([^}]+)\}\}/g, '($1)')
        .replace(/\{\{gloss\|([^}]+)\}\}/g, '($1)')
        .replace(/\{\{qualifier\|([^}]+)\}\}/g, '[$1]')
        .replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, '$2')
        .replace(/'{2,3}/g, '')
        .replace(/\{\{[^}]*\}\}/g, '')
        .replace(/<[^>]+>/g, '')
        .trim();
}

function extractSvSection(wikitext) {
    const start = wikitext.indexOf("==Swedish==");
    if (start === -1) return null;
    const after = wikitext.slice(start + "==Swedish==".length);
    const lines = after.split('\n');
    const result = [];
    for (const line of lines) {
        if (/^==[A-Z]/.test(line) && !/^===/.test(line)) break;
        result.push(line);
    }
    return result.join('\n');
}

function parseWikiIPA(section) {
    // Pattern 1: {{IPA|sv|/phonetic/}}
    const ipaMatch = section.match(/\{\{IPA\|sv\|([^}]+)\}\}/);
    if (ipaMatch) {
        const phonemes = ipaMatch[1].match(/\/[^/]+\//g);
        if (phonemes) return phonemes[0];
    }
    // Pattern 2: {{sv-IPA}}
    if (section.includes('{{sv-IPA}}') || section.includes('{{sv-IPA|')) {
        // sv-IPA generates IPA from spelling rules, we can't expand it but note it
        return null; // Will rely on Wiktionary IPA fetch
    }
    return null;
}

function parseVerbForms(template, word) {
    // sv-verb-reg|stopp  OR  sv-verb-reg|stopp|end=a
    const regMatch = template.match(/sv-verb-reg\|([^|}]+)/);
    if (regMatch) {
        const stem = regMatch[1];
        return { 'Nguyên mẫu': stem + 'a', 'Hiện tại': stem + 'ar', 'Quá khứ': stem + 'ade', 'Phân từ 2 (Supine)': stem + 'at', 'Mệnh lệnh': stem + 'a', 'Quá khứ phân từ': stem + 'ad' };
    }
    // sv-verb-irreg|gå|gick|gått
    const irregMatch = template.match(/sv-verb-irreg\|([^|}]+)\|([^|}]+)\|([^|}]+)/);
    if (irregMatch) {
        return { 'Nguyên mẫu': irregMatch[1], 'Quá khứ': irregMatch[2], 'Phân từ 2 (Supine)': irregMatch[3] };
    }
    // sv-conj-wk|stopp  (weak verb)
    const conjWkMatch = template.match(/sv-conj-wk\|([^|}]+)/);
    if (conjWkMatch) {
        const stem = conjWkMatch[1];
        return { 'Nguyên mẫu': stem + 'a', 'Hiện tại': stem + 'ar', 'Quá khứ': stem + 'ade', 'Phân từ 2 (Supine)': stem + 'at', 'Quá khứ phân từ': stem + 'ad' };
    }
    // sv-conj-st (strong verb) — complex pattern, just note it
    if (template.includes('sv-conj-st')) {
        return { 'Ghi chú': 'Động từ mạnh (bất quy tắc, thường biến đổi nguyên âm)' };
    }
    return null;
}

function parseNounForms(template) {
    const genderMatch = template.match(/g=([cn])/);
    const gender = genderMatch ? (genderMatch[1] === 'c' ? 'en (thông giống)' : 'ett (trung giống)') : null;
    const regMatch = template.match(/sv-noun-([^|}]+)/);
    const declType = regMatch ? 'Nhóm biến cách: ' + regMatch[1] : null;
    return { gender, declType };
}

function parseAdjForms(template, word) {
    if (template.includes('sv-adj-reg')) {
        return { 'Grundform': word, 'Neutrum': word + 't', 'Bestämd/Plural': word + 'a' };
    }
    return null;
}

function parsePOSBlocks(section) {
    const blocks = [];
    const posRegex = /===\s*(Noun|Verb|Adjective|Adverb|Pronoun|Preposition|Conjunction|Interjection|Numeral|Determiner|Particle|Phrase|Suffix|Prefix)\s*===/gi;
    const positions = [];
    let m;
    while ((m = posRegex.exec(section)) !== null) {
        positions.push({ pos: m[1], index: m.index });
    }
    for (let i = 0; i < positions.length; i++) {
        const start = positions[i].index;
        const end = i + 1 < positions.length ? positions[i + 1].index : section.length;
        const block = section.slice(start, end);
        const posEn = positions[i].pos;
        const posVi = POS_MAP[posEn] || posEn;

        // Head template (inflection data)
        const headMatch = block.match(/\{\{(sv-[^}]+)\}\}/);
        const headTemplate = headMatch ? headMatch[1] : "";

        // Verb forms — scan the ENTIRE block, not just the first sv- template
        let verbForms = null;
        if (posEn === 'Verb') {
            // First try the head template
            verbForms = parseVerbForms(headTemplate, '');
            // If not found, scan all sv-conj/sv-verb templates in the block
            if (!verbForms) {
                const allTemplates = block.match(/\{\{(sv-(?:verb|conj)[^}]*)\}\}/g) || [];
                for (const tmpl of allTemplates) {
                    const inner = tmpl.replace(/^\{\{|\}\}$/g, '');
                    verbForms = parseVerbForms(inner, '');
                    if (verbForms) break;
                }
            }
        }

        // Noun gender/declension
        let nounInfo = null;
        if (posEn === 'Noun') nounInfo = parseNounForms(headTemplate);

        // Adjective forms
        let adjForms = null;
        if (posEn === 'Adjective') adjForms = parseAdjForms(headTemplate, '');

        // Definitions (lines starting with # but not ## #: #*)
        const defs = [];
        const lines = block.split('\n');
        for (const line of lines) {
            if (/^#[^#:*]/.test(line) || /^# /.test(line)) {
                const cleaned = cleanWiki(line.replace(/^#\s*/, ''));
                if (cleaned && cleaned.length > 1) defs.push(cleaned);
            }
        }

        // Examples: {{ux|sv|text|translation}} or {{uxi|sv|...}}
        const examples = [];
        const uxIter = block.matchAll(/\{\{ux[i]?\|\s*sv\s*\|((?:\{\{[^}]*\}\}|[^{|}])+)\|((?:\{\{[^}]*\}\}|[^{}])+)\}\}/gi);
        for (const mx of uxIter) {
            const svText = cleanWiki(mx[1].trim());
            let enText = mx[2].split('|')[0].trim();
            enText = cleanWiki(enText);
            examples.push({ sv: svText, en: enText });
        }
        // Also #: lines
        for (const line of lines) {
            if (/^#:\s/.test(line)) {
                if (line.includes('{{ux|') || line.includes('{{uxi|')) continue;
                const txt = cleanWiki(line.replace(/^#:\s*/, ''));
                if (txt && !examples.find(e => e.sv === txt)) examples.push({ sv: txt, en: "" });
            }
        }

        // Synonyms
        const synBlock = block.match(/====\s*Synonyms\s*====([\s\S]*?)(?=====|$)/i);
        const synonyms = [];
        if (synBlock) {
            for (const sm of synBlock[1].matchAll(/\{\{l\|sv\|([^}|]+)/g)) synonyms.push(sm[1].trim());
        }

        // Antonyms
        const antBlock = block.match(/====\s*Antonyms\s*====([\s\S]*?)(?=====|$)/i);
        const antonyms = [];
        if (antBlock) {
            for (const am of antBlock[1].matchAll(/\{\{l\|sv\|([^}|]+)/g)) antonyms.push(am[1].trim());
        }

        // Related terms
        const relBlock = block.match(/====\s*Related terms\s*====([\s\S]*?)(?=====|$)/i);
        const related = [];
        if (relBlock) {
            for (const rm of relBlock[1].matchAll(/\{\{l\|sv\|([^}|]+)/g)) related.push(rm[1].trim());
        }

        // Derived terms
        const derBlock = block.match(/====\s*Derived terms\s*====([\s\S]*?)(?=====|$)/i);
        const derived = [];
        if (derBlock) {
            for (const dm of derBlock[1].matchAll(/\{\{l\|sv\|([^}|]+)/g)) derived.push(dm[1].trim());
        }

        blocks.push({ posVi, posEn, defs, examples, verbForms, nounInfo, adjForms, synonyms, antonyms, related, derived });
    }
    return blocks;
}

async function fetchFolketsData(word) {
    try {
        const url = `https://folkets-lexikon.csc.kth.se/folkets/service?word=${encodeURIComponent(word)}`;
        const res = await fetch(url);
        const html = await res.text();

        let ipa = null;
        let synonyms = [];
        let antonyms = [];

        const ipaMatch = html.match(/Uttal:\s*\[([^\]]+)\]/);
        if (ipaMatch) ipa = `/${ipaMatch[1].replace(/:/g, 'ː')}/`;

        const synMatch = html.match(/Synonymer:\s*([^<]+)/);
        if (synMatch) synonyms = synMatch[1].split(',').map(s => s.trim()).filter(Boolean);

        const relMatch = html.match(/Relaterade ord:\s*([^<]+)/);
        if (relMatch) {
            const parts = relMatch[1].split(',');
            for (let part of parts) {
                if (part.includes('(antonym)')) {
                    const clean = part.replace(/\(.*?\)/g, '').trim();
                    if (clean) antonyms.push(clean);
                }
            }
        }
        return { ipa, synonyms, antonyms };
    } catch { return { ipa: null, synonyms: [], antonyms: [] }; }
}

async function fetchSvWiktionaryData(word) {
    try {
        const url = `https://sv.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=wikitext&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        const wikitext = data?.parse?.wikitext?.["*"] || "";

        const synonyms = [];
        const antonyms = [];

        const synMatch = wikitext.match(/\{\{synonymer\|([^}]+)\}\}/);
        if (synMatch) {
            const raw = synMatch[1];
            const words = Array.from(raw.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g));
            words.forEach(w => synonyms.push(w[1]));
        }

        const antMatch = wikitext.match(/\{\{antonymer\|([^}]+)\}\}/);
        if (antMatch) {
            const raw = antMatch[1];
            const words = Array.from(raw.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g));
            words.forEach(w => antonyms.push(w[1]));
        }
        return { synonyms, antonyms };
    } catch { return { synonyms: [], antonyms: [] }; }
}

export async function lookupWordDict(word) {
    if (!word) return null;
    try {
        const lowerWord = word.toLowerCase();
        const url = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(lowerWord)}&prop=wikitext&format=json&origin=*`;

        // Execute fetches in parallel to keep it fast
        const [enWikiData, viMeaning, folkets, svWiki] = await Promise.all([
            fetch(url).then(r => r.json()).catch(() => ({})),
            googleTranslate(word),
            fetchFolketsData(lowerWord),
            fetchSvWiktionaryData(lowerWord)
        ]);

        const wikitext = enWikiData?.parse?.wikitext?.["*"] || "";
        const svSection = extractSvSection(wikitext);

        let ipa = null;
        let blocks = [];
        let cefr = null;

        if (svSection) {
            ipa = parseWikiIPA(svSection);
            if (!ipa) ipa = await fetchSwedishIPA(word).catch(() => null);
            blocks = parsePOSBlocks(svSection);

            // TỐI ƯU: Dịch định nghĩa và ví dụ hàng loạt theo từng Block
            for (const block of blocks) {
                // 1. Dịch Definitions
                if (block.defs.length > 0) {
                    const translatedDefs = await googleTranslateBatch(block.defs, "en", "vi");
                    block.defsVi = block.defs.map((en, idx) => ({ en, vi: translatedDefs[idx] }));
                }

                // 2. Dịch Examples
                if (block.examples.length > 0) {
                    const svTexts = block.examples.map(ex => ex.sv);
                    const translatedEx = await googleTranslateBatch(svTexts, "sv", "vi");
                    block.examplesVi = block.examples.map((ex, idx) => ({
                        sv: ex.sv,
                        en: ex.en || "",
                        vi: translatedEx[idx]
                    }));
                }
            }

            // CEFR & IPA Fallback
            try {
                const extraUrl = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(lowerWord)}&prop=text|categories&format=json&origin=*`;
                const extraRes = await fetch(extraUrl);
                const extraData = await extraRes.json();

                const cats = extraData?.parse?.categories || [];
                for (const c of cats) {
                    const title = c["*"] || "";
                    const match = title.match(/Swedish_([A-C][1-2])_words/i);
                    if (match) { cefr = match[1].toUpperCase(); break; }
                }

                // Trình độ cơ bản nếu thuộc danh mục phổ biến
                if (!cefr) {
                    const catString = cats.map(c => c["*"]).join(" ");
                    if (catString.includes("common_words")) cefr = "A1";
                    else if (catString.includes("basic_words")) cefr = "A2";
                }

                if (!ipa) {
                    const html = extraData?.parse?.text?.["*"] || "";
                    const ipaMatches = Array.from(html.matchAll(/<span class="IPA"[^>]*>([^<]+)<\/span>/g));
                    for (const m of ipaMatches) {
                        let val = m[1].replace(/<[^>]+>/g, '').trim();
                        if (val && val !== "—" && (val.includes('/') || val.includes('['))) {
                            ipa = val;
                            break;
                        }
                    }
                }
            } catch { }

        } else if (folkets.synonyms.length || svWiki.synonyms.length || folkets.ipa) {
            // Create a pseudo block if English Wiktionary missed it but we have synonym/IPA data
            blocks = [{
                posVi: "Từ vựng", posEn: "Word",
                defs: [], defsVi: [{ en: "", vi: viMeaning }], examples: [], examplesVi: [],
                verbForms: null, nounInfo: null, adjForms: null,
                synonyms: [], antonyms: [], related: [], derived: []
            }];
        }

        // Final IPA Fallback (Folkets Lexikon takes precedence if previous failed)
        if (!ipa || ipa === "—") {
            if (folkets.ipa) {
                ipa = folkets.ipa;
            } else {
                try {
                    const fallbackRes = await fetch(`https://lexin.nada.kth.se/lexin/service?disp=1&trad=swe-swe&word=${encodeURIComponent(lowerWord)}`);
                    const fallbackHtml = await fallbackRes.text();
                    const m = fallbackHtml.match(/phonetic="([^"]+)"/);
                    if (m) ipa = `/${m[1].trim()}/`;
                } catch { }
            }
        }

        // Merge synonyms & antonyms from Folkets & Swedish Wiktionary
        if (blocks.length > 0) {
            const allSyns = new Set(blocks[0].synonyms || []);
            folkets.synonyms.forEach(s => allSyns.add(s));
            svWiki.synonyms.forEach(s => allSyns.add(s));
            blocks[0].synonyms = Array.from(allSyns).filter(s => s.toLowerCase() !== lowerWord);

            const allAnts = new Set(blocks[0].antonyms || []);
            folkets.antonyms.forEach(s => allAnts.add(s));
            svWiki.antonyms.forEach(s => allAnts.add(s));
            blocks[0].antonyms = Array.from(allAnts).filter(a => a.toLowerCase() !== lowerWord);
        }

        return {
            word,
            viMeaning,
            ipa,
            cefr,
            blocks,
            hasWikiData: true,
        };
    } catch (err) {
        console.error("Dict lookup error:", err);
        const viMeaning = await googleTranslate(word).catch(() => word);
        return { word, viMeaning, ipa: null, blocks: [], hasWikiData: false };
    }
}

export async function lookupWordFull(word) {
    if (!word) return null;
    const lower = word.toLowerCase().trim();

    // 1. Instant Cache: Truy xuất ngay lập tức từ bộ nhớ đệm
    if (_lookupCache[lower]) return _lookupCache[lower];

    // 2. Parallel Deep Fetching (Wiktionary + Folkets + Google)
    // Sử dụng sức mạnh của các từ điển chuyên dụng thay vì AI đa năng
    const [wikiFull, viMeaning] = await Promise.all([
        lookupWordDict(word).catch(() => null),
        googleTranslate(word)
    ]);

    // 3. Unify Data - Tất cả các từ đều được hưởng trọn bộ dữ liệu chuẩn
    const aiData = {
        word: word,
        viMeaning: viMeaning,
        ipa: wikiFull?.ipa || null,
        pronunciation: wikiFull?.ipa ? `Đọc: ${wikiFull.ipa}` : null,
        partOfSpeech: wikiFull?.blocks?.[0]?.posVi || "Từ vựng",
        gender: wikiFull?.blocks?.[0]?.nounInfo?.gender || "n/a",
        level: wikiFull?.cefr || "A1-C2", // Mọi từ đều có trình độ dựa trên Wiktionary
        definitions: wikiFull?.blocks?.[0]?.defsVi || [{ vi: viMeaning }],
        examples: wikiFull?.blocks?.[0]?.examplesVi || [],
        inflection: wikiFull?.blocks?.[0]?.verbForms || wikiFull?.blocks?.[0]?.nounInfo?.declType || "Dữ liệu đang cập nhật",
        synonyms: wikiFull?.blocks?.[0]?.synonyms || [],
        antonyms: wikiFull?.blocks?.[0]?.antonyms || [],
        related: wikiFull?.blocks?.[0]?.related || [],
        usage: "Dữ liệu từ điển chuẩn Wiktionary & Folkets Lexikon"
    };

    const finalResult = { aiData, wkData: wikiFull };

    // Lưu vào cache để lần sau nhanh như chớp
    _lookupCache[lower] = finalResult;
    return finalResult;
}

// Prefetch all vocabulary audio URLs for instant playback
export async function prefetchAllAudio(vocab) {
    if (!vocab || !vocab.length) return;
    // Batch process to avoid flooding the network
    const sliceSize = 10;
    for (let i = 0; i < vocab.length; i += sliceSize) {
        const slice = vocab.slice(i, i + sliceSize);
        await Promise.allSettled(slice.map(v => speakSv(v.sv, true)));
    }
}

// Quick AI lookup for simple translation
export async function aiLookup(word) {
    const vi = await googleTranslate(word);
    return { viMeaning: vi };
}

export async function aiWritingFeedback(text, task) {
    const raw = await callGPT(`Sửa lỗi bài viết tiếng Thuỵ Điển: "${text}". Giải thích lỗi bằng tiếng Việt.`, 1000);
    return raw || "Lỗi AI.";
}

export async function aiGenerateQuiz(vocab) {
    const s = vocab.slice(0, 10).map(v => v.sv).join(", ");
    const raw = await callGPT(`Tạo bài tập từ: ${s}. Trả về JSON list.`, 1200);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
}

// =====================================================
// SPEAK: Swedish TTS (Google Translate API + Cache + Proxy Race)
// Sử dụng bộ nhớ đệm (Cache) và nạp Blob tốc độ cao.
// Khắc phục triệt để lỗi chậm & ORB Blocking.
// =====================================================

const _ttsCache = {};
const _lookupCache = {}; // Lưu trữ kết quả tra từ để truy xuất tức thì

export async function speakSv(text, prefetchOnly = false) {
    if (!text) return;
    const key = text.toLowerCase().trim();
    const enc = encodeURIComponent(text);
    const googleUrl = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=sv&q=${enc}`;

    // 1. Instant Cache Playback
    if (_ttsCache[key]) {
        if (!prefetchOnly) {
            const a = new Audio(_ttsCache[key]);
            a.play().catch(() => { });
        }
        return;
    }

    const playFallback = () => {
        if (prefetchOnly) return;
        // Last resort: Browser Speech Synthesis with Swedish Voice
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = "sv-SE";
            u.rate = 0.85;
            const voices = window.speechSynthesis.getVoices();
            const svVoice = voices.find(v => v.lang.includes("sv") || v.lang.includes("SE"));
            if (svVoice) u.voice = svVoice;
            window.speechSynthesis.speak(u);
        }
    };

    try {
        // 2. Racing Proxies for maximum reliability and speed
        const fetchBlob = (url) => fetch(url).then(r => {
            if (!r.ok) throw new Error();
            return r.blob();
        });

        const blob = await Promise.any([
            fetchBlob(`https://api.allorigins.win/raw?url=${encodeURIComponent(googleUrl)}`),
            fetchBlob(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(googleUrl)}`),
            fetchBlob(`https://corsproxy.io/?${encodeURIComponent(googleUrl)}`),
            // Short timeout as a last resort to jump to HTML5 Audio if proxies are slow
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
        ]);

        const url = URL.createObjectURL(blob);
        _ttsCache[key] = url;

        if (!prefetchOnly) {
            const a = new Audio(url);
            await a.play();
        }
    } catch (err) {
        // 3. Middle Fallback: Direct HTML5 Audio (No CORS needed for direct playback)
        if (!prefetchOnly) {
            const directAudio = new Audio(googleUrl);
            directAudio.play().catch(playFallback);
        }
    }
}
