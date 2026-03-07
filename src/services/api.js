// ========================================================
// PUNIYA - SWEDISH-VIETNAMESE DICTIONARY ENGINE
// Audio: Google TTS (same voice as Google Translate)
// Dictionary: Wiktionary IPA + Google Translate + GPT-4o
// ========================================================

// Global helper to call GPT-4o AI
async function callGPT(prompt, maxTokens = 1500) {
    const key = import.meta.env.VITE_OPENAI_API_KEY;
    if (!key || key.includes("your_openai_key")) {
        console.warn("OpenAI API key not set.");
        return null;
    }
    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "Bạn là từ điển Thụy Điển - Việt CHUYÊN NGHIỆP. Chỉ trả về JSON hợp lệ. TUYỆT ĐỐI không dùng tiếng Anh hay giữ nguyên từ gốc Thuỵ Điển trong trường viMeaning."
                    },
                    { role: "user", content: prompt }
                ],
                max_tokens: maxTokens,
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
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

// Google Translate text translation (sv → vi)
async function googleTranslate(text, sl = "sv", tl = "vi") {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const json = await res.json();
        return json?.[0]?.[0]?.[0] || text;
    } catch { return text; }
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
        return { 'Nguyên mẫu': stem + 'a', 'Hiện tại': stem + 'ar', 'Quá khứ': stem + 'ade', 'Supine': stem + 'at', 'Mệnh lệnh': stem + 'a' };
    }
    // sv-verb-irreg|gå|gick|gått
    const irregMatch = template.match(/sv-verb-irreg\|([^|}]+)\|([^|}]+)\|([^|}]+)/);
    if (irregMatch) {
        return { 'Nguyên mẫu': irregMatch[1], 'Quá khứ': irregMatch[2], 'Supine': irregMatch[3] };
    }
    // sv-conj-wk|stopp  (weak verb)
    const conjWkMatch = template.match(/sv-conj-wk\|([^|}]+)/);
    if (conjWkMatch) {
        const stem = conjWkMatch[1];
        return { 'Nguyên mẫu': stem + 'a', 'Hiện tại': stem + 'ar', 'Quá khứ': stem + 'ade', 'Supine': stem + 'at' };
    }
    // sv-conj-st (strong verb) — complex pattern, just note it
    if (template.includes('sv-conj-st')) {
        return { 'Ghi chú': 'Động từ mạnh (bất quy tắc)' };
    }
    return null;
}

function parseNounForms(template) {
    const genderMatch = template.match(/g=([cn])/);
    const gender = genderMatch ? (genderMatch[1] === 'c' ? 'en (thông giống)' : 'ett (trung giống)') : null;
    // sv-noun-reg-er, sv-noun-reg-or, sv-noun-reg-ar
    const regMatch = template.match(/sv-noun-(reg-[a-z]+|unc|irreg)/);
    const declType = regMatch ? regMatch[1] : null;
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
        const uxIter = block.matchAll(/\{\{ux[i]?\|sv\|([^|]+)\|([^}]+)\}\}/g);
        for (const mx of uxIter) {
            const svText = cleanWiki(mx[1].trim());
            const enText = cleanWiki(mx[2].replace(/\|[^|]*$/, '').trim());
            examples.push({ sv: svText, en: enText });
        }
        // Also #: lines
        for (const line of lines) {
            if (/^#:\s/.test(line)) {
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

export async function lookupWordDict(word) {
    if (!word) return null;
    try {
        // Step 1: Fetch wikitext from English Wiktionary
        const url = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word.toLowerCase())}&prop=wikitext&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        const wikitext = data?.parse?.wikitext?.["*"] || "";

        // Step 2: Extract Swedish section
        const svSection = extractSvSection(wikitext);

        // Step 3: Get Vietnamese translation (always from Google - free, no AI)
        const viMeaning = await googleTranslate(word);

        if (!svSection) {
            // No Swedish section — return basic translation only
            return {
                word,
                viMeaning,
                ipa: null,
                blocks: [],
                hasWikiData: false,
            };
        }

        // Step 4: Parse all structured data
        let ipa = parseWikiIPA(svSection);
        // Fallback: use the dedicated IPA fetcher if inline parsing failed
        if (!ipa) {
            ipa = await fetchSwedishIPA(word).catch(() => null);
        }
        const blocks = parsePOSBlocks(svSection);

        // Step 5: Translate English definitions to Vietnamese (batch, free Google Translate)
        for (const block of blocks) {
            const translated = [];
            for (const def of block.defs) {
                try {
                    const vi = await googleTranslate(def, "en", "vi");
                    translated.push({ en: def, vi: vi || def });
                } catch { translated.push({ en: def, vi: def }); }
            }
            block.defsVi = translated;

            // Translate examples: ALWAYS sv→vi for best quality
            const trEx = [];
            for (const ex of block.examples) {
                let viTrans = "";
                try { viTrans = await googleTranslate(ex.sv, "sv", "vi"); } catch { }
                trEx.push({ sv: ex.sv, en: ex.en || "", vi: viTrans || ex.sv });
            }
            block.examplesVi = trEx;
        }

        // Step 6: Get CEFR levels and IPA from rendered HTML (SUPER ROBUST)
        let cefr = null;
        try {
            const extraUrl = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word.toLowerCase())}&prop=text|categories&format=json&origin=*`;
            const extraRes = await fetch(extraUrl);
            const extraData = await extraRes.json();

            const cats = extraData?.parse?.categories || [];
            for (const c of cats) {
                const title = c["*"] || "";
                const match = title.match(/Swedish_([A-C][1-2])_words/i);
                if (match) { cefr = match[1].toUpperCase(); break; }
            }

            if (!ipa) {
                const html = extraData?.parse?.text?.["*"] || "";
                const svStart = html.indexOf('id="Swedish"');
                let searchSpace = html;
                if (svStart > -1) {
                    // Look for the next language header or end of page
                    const nextLang = html.indexOf('class="mw-heading', svStart + 20);
                    searchSpace = nextLang > -1 ? html.slice(svStart, nextLang) : html.slice(svStart);
                }

                // Match all IPA spans and pick the first one that looks like Swedish
                const ipaMatches = Array.from(searchSpace.matchAll(/<span class="IPA"[^>]*>([^<]+)<\/span>/g));
                for (const m of ipaMatches) {
                    let val = m[1].replace(/<[^>]+>/g, '').trim();
                    if (val && val !== "—") {
                        if (!val.startsWith('/') && !val.startsWith('[')) val = `/${val}/`;
                        ipa = val;
                        break;
                    }
                }
            }
        } catch { }

        // Step 7: Final Fallback for tricky words (like 'stygg', 'hälsa')
        if (!ipa || ipa === "—") {
            try {
                // Fetch from a dedicated Swedish pronunciation source (Lexin/etc)
                const fallbackRes = await fetch(`https://lexin.nada.kth.se/lexin/service?disp=1&trad=swe-swe&word=${encodeURIComponent(word.toLowerCase())}`);
                const fallbackHtml = await fallbackRes.text();
                const m = fallbackHtml.match(/phonetic="([^"]+)"/);
                if (m) ipa = `/${m[1].trim()}/`;
            } catch { }
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

// =====================================================
// MAIN: Full dictionary lookup — Swedish → Vietnamese
// =====================================================
export async function lookupWordFull(word) {
    if (!word) return null;

    // Tier 1: Instant hardcoded data for high-frequency words
    const instant = {
        "hej": { viMeaning: "Xin chào", ipa: "/hɛj/", pronunciation: "hây", partOfSpeech: "Thán từ", inflection: "không đổi", definitions: [{ vi: "Lời chào thân thiện." }], examples: [{ sv: "Hej, hur mår du?", vi: "Chào, bạn khoẻ không?" }] },
        "hejdå": { viMeaning: "Tạm biệt", ipa: "/ˈhɛjˌdoː/", pronunciation: "hây-đoo", partOfSpeech: "Thán từ", inflection: "không đổi", definitions: [{ vi: "Lời chào khi chia tay." }], examples: [{ sv: "Hejdå, vi ses!", vi: "Tạm biệt, gặp lại nhé!" }] },
        "tack": { viMeaning: "Cảm ơn", ipa: "/takː/", pronunciation: "tắc", partOfSpeech: "Từ cảm ơn", inflection: "không đổi", definitions: [{ vi: "Bày tỏ lòng biết ơn." }], examples: [{ sv: "Tack så mycket!", vi: "Cảm ơn rất nhiều!" }] },
        "ja": { viMeaning: "Có / Vâng", ipa: "/jɑː/", pronunciation: "yaa", partOfSpeech: "Phó từ", inflection: "không đổi", definitions: [{ vi: "Đồng ý, xác nhận." }], examples: [{ sv: "Ja, det stämmer.", vi: "Vâng, đúng rồi." }] },
        "nej": { viMeaning: "Không", ipa: "/nɛj/", pronunciation: "nây", partOfSpeech: "Phó từ", inflection: "không đổi", definitions: [{ vi: "Phủ định, từ chối." }], examples: [{ sv: "Nej, tack.", vi: "Không, cảm ơn." }] },
        "katt": { viMeaning: "Con mèo", ipa: "/katː/", pronunciation: "cắt", partOfSpeech: "Danh từ (en)", inflection: "en katt, katten, katter, katterna", definitions: [{ vi: "Động vật nhỏ có lông, nuôi làm thú cưng." }], examples: [{ sv: "Min katt sover.", vi: "Con mèo tôi đang ngủ." }] },
        "hund": { viMeaning: "Con chó", ipa: "/hɵnd/", pronunciation: "hụnd", partOfSpeech: "Danh từ (en)", inflection: "en hund, hunden, hundar, hundarna", definitions: [{ vi: "Động vật trung thành, nuôi để trông nhà." }], examples: [{ sv: "Hunden skäller.", vi: "Con chó đang sủa." }] },
        "bok": { viMeaning: "Quyển sách", ipa: "/buːk/", pronunciation: "buuk", partOfSpeech: "Danh từ (en)", inflection: "en bok, boken, böcker, böckerna", definitions: [{ vi: "Tập hợp các trang giấy có in chữ." }], examples: [{ sv: "Jag läser en bok.", vi: "Tôi đang đọc một quyển sách." }] },
        "stygg": { viMeaning: "Hư / Nghịch", ipa: "/stʏɡː/", pronunciation: "xtứg", partOfSpeech: "Tính từ", inflection: "stygg, styggt, styggare, styggas", definitions: [{ vi: "Không ngoan, khó bảo (thường nói về trẻ em)." }], examples: [{ sv: "Han är stygg.", vi: "Nó hư lắm." }] },
        "stor": { viMeaning: "To lớn", ipa: "/stuːr/", pronunciation: "xtuu", partOfSpeech: "Tính từ", inflection: "stor, stort, stora", definitions: [{ vi: "Có kích thước lớn." }], examples: [{ sv: "Det är ett stort hus.", vi: "Đó là một ngôi nhà to lớn." }] },
        "liten": { viMeaning: "Nhỏ bé", ipa: "/ˈliːtɛn/", pronunciation: "lii-ten", partOfSpeech: "Tính từ", inflection: "liten, litet, lilla/lille, små", definitions: [{ vi: "Có kích thước nhỏ." }], examples: [{ sv: "En liten katt.", vi: "Một con mèo nhỏ." }] },
        "god": { viMeaning: "Ngon / Tốt", ipa: "/guːd/", pronunciation: "guud", partOfSpeech: "Tính từ", inflection: "god, gott, goda", definitions: [{ vi: "Có chất lượng tốt, thức ăn ngon." }], examples: [{ sv: "Det smakar gott!", vi: "Trông ngon lắm!" }] },
    };

    const lower = word.toLowerCase().trim();
    if (instant[lower]) {
        return { aiData: { word, ...instant[lower] }, wkData: null };
    }

    // Tier 2: Parallel fetch — Google Translate + Wiktionary IPA simultaneously
    const [viMeaning, ipa] = await Promise.all([
        googleTranslate(word),
        fetchSwedishIPA(word)
    ]);

    // Tier 3: GPT-4o enrichment with known Vietnamese meaning
    const prompt = `Từ tiếng Thuỵ Điển: "${word}"
Nghĩa tiếng Việt đã xác định: "${viMeaning}"
IPA phonetic: "${ipa || 'chưa rõ'}"

Hãy trả về JSON đầy đủ kiểu từ điển Cambridge (hoàn toàn bằng tiếng Việt):
{
  "word": "${word}",
  "viMeaning": "${viMeaning}",
  "ipa": "${ipa || ''}",
  "pronunciation": "phiên âm đọc theo kiểu Việt dễ hiểu, ví dụ: 'xtứg' cho stygg, 'tắc' cho tack",
  "partOfSpeech": "loại từ (Danh từ/Động từ/Tính từ/Phó từ/Giới từ...)",
  "gender": "giống (en hoặc ett nếu là danh từ, 'không có' nếu không phải danh từ)",
  "level": "trình độ CEFR ước tính (A1/A2/B1/B2/C1/C2)",
  "definitions": [{"vi": "định nghĩa tiếng Việt 1"}, {"vi": "định nghĩa tiếng Việt 2 nếu có"}],
  "examples": [
    {"sv": "ví dụ tiếng Thuỵ 1", "vi": "bản dịch tiếng Việt 1"},
    {"sv": "ví dụ tiếng Thuỵ 2", "vi": "bản dịch tiếng Việt 2"},
    {"sv": "ví dụ tiếng Thuỵ 3", "vi": "bản dịch tiếng Việt 3"}
  ],
  "inflection": "biến cách đầy đủ (en/ett, chia động từ theo các thì, so sánh tính từ...)",
  "usage": "lưu ý cách dùng, ngữ cảnh, hoặc lỗi thường gặp nếu có"
}`;

    const raw = await callGPT(prompt, 1200);
    if (raw) {
        try {
            const aiData = JSON.parse(raw);
            if (!aiData.ipa && ipa) aiData.ipa = ipa;
            return { aiData, wkData: null };
        } catch (e) { console.error("Parse error:", e); }
    }

    return {
        aiData: {
            word,
            viMeaning,
            ipa: ipa || null,
            pronunciation: null,
            partOfSpeech: "Từ vựng",
            definitions: [{ vi: `Nghĩa: ${viMeaning}` }],
            inflection: "Chưa có dữ liệu"
        },
        wkData: null
    };
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

const _ttsCache = {}; // Lưu Blob URLs tại local

export async function speakSv(text, prefetchOnly = false) {
    if (!text) return;
    const key = text.toLowerCase().trim();

    // 1. Nếu đã tải xong, phát ngay lập tức (độ trễ 0ms)
    if (_ttsCache[key]) {
        if (!prefetchOnly) {
            const audio = new Audio(_ttsCache[key]);
            audio.play().catch(e => console.warn(e));
        }
        return;
    }

    const enc = encodeURIComponent(text);
    const googleUrl = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=sv&q=${enc}`;

    try {
        // 2. Chạy đua (Racing) các Proxy tốc độ cao nhất (Cái nào phản hồi trước lấy luôn)
        const fetchBlob = (url) => fetch(url).then(r => { if (!r.ok) throw new Error("Proxy failed"); return r.blob(); });

        const blob = await Promise.any([
            fetchBlob(`https://api.allorigins.win/raw?url=${encodeURIComponent(googleUrl)}`),
            fetchBlob(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(googleUrl)}`)
        ]);

        // 3. Chuyển Blob thành Local URL
        const localUrl = URL.createObjectURL(blob);
        _ttsCache[key] = localUrl;

        // 4. Phát âm thanh nếu không phải là chế độ tải ngầm (prefetch)
        if (!prefetchOnly) {
            const audio = new Audio(localUrl);
            await audio.play();
        }

    } catch (err) {
        console.warn("[TTS Sync Failed] Dùng hệ thống Text-to-Speech dự phòng của máy...", err);
        if (!prefetchOnly && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            const svVoice = voices.find(v => v.lang.toLowerCase().includes("sv"));
            if (svVoice) {
                u.voice = svVoice;
                u.lang = "sv-SE";
                u.rate = 0.85;
                window.speechSynthesis.speak(u);
            }
        }
    }
}

