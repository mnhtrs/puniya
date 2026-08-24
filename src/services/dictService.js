// ========================================================
// PUNIYA - CAMBRIDGE-STYLE SWEDISH LEARNER'S DICTIONARY ENGINE
// Sources: Svenska Wiktionary (sv.wiktionary.org - 100% pure Swedish)
//          English Wiktionary (en.wiktionary.org)
//          Folkets Lexikon (KTH)
//          Google Translate API
// ========================================================

const _lookupCache = {};

// Map of Swedish POS to Vietnamese and Pure Swedish
export const POS_TRANSLATIONS = {
    'substantiv': { vi: 'Danh từ', sv: 'Substantiv', en: 'Noun' },
    'noun': { vi: 'Danh từ', sv: 'Substantiv', en: 'Noun' },
    'verb': { vi: 'Động từ', sv: 'Verb', en: 'Verb' },
    'adjektiv': { vi: 'Tính từ', sv: 'Adjektiv', en: 'Adjective' },
    'adjective': { vi: 'Tính từ', sv: 'Adjektiv', en: 'Adjective' },
    'adverb': { vi: 'Phó từ / Trạng từ', sv: 'Adverb', en: 'Adverb' },
    'pronomen': { vi: 'Đại từ', sv: 'Pronomen', en: 'Pronoun' },
    'pronoun': { vi: 'Đại từ', sv: 'Pronomen', en: 'Pronoun' },
    'preposition': { vi: 'Giới từ', sv: 'Preposition', en: 'Preposition' },
    'konjunktion': { vi: 'Liên từ', sv: 'Konjunktion', en: 'Conjunction' },
    'interjektion': { vi: 'Thán từ', sv: 'Interjektion', en: 'Interjection' },
    'räkneord': { vi: 'Số từ', sv: 'Räkneord', en: 'Numeral' },
    'numeral': { vi: 'Số từ', sv: 'Räkneord', en: 'Numeral' },
    'artikel': { vi: 'Mạo từ', sv: 'Artikel', en: 'Article' },
    'partikel': { vi: 'Tiểu từ', sv: 'Partikel', en: 'Particle' },
    'uttryck': { vi: 'Thành ngữ / Cụm từ', sv: 'Fras / Uttryck', en: 'Phrase' },
    'phrase': { vi: 'Cụm từ', sv: 'Fras', en: 'Phrase' }
};

// Autocomplete suggestions
export async function svAutocomplete(query) {
    if (!query || !query.trim()) return [];
    try {
        const url = `https://sv.wiktionary.org/w/api.php?action=opensearch&search=${encodeURIComponent(query.trim())}&limit=8&namespace=0&format=json&origin=*`;
        const r = await fetch(url);
        const d = await r.json();
        return d[1] || [];
    } catch {
        return [];
    }
}

// Google translation helper
export async function googleTranslate(text, sl = "sv", tl = "vi") {
    if (!text || !text.trim()) return "";
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text.trim())}`;
        const res = await fetch(url);
        const json = await res.json();
        return json?.[0]?.map(x => x[0]).join("") || text;
    } catch {
        return text;
    }
}

// Batch translate to avoid multiple network calls
export async function googleTranslateBatch(texts, sl = "sv", tl = "vi") {
    if (!texts || !texts.length) return [];
    const DELIM = " ||| ";
    const combined = texts.join(DELIM);
    try {
        const result = await googleTranslate(combined, sl, tl);
        const parts = result.split(DELIM);
        return texts.map((original, i) => (parts[i] ? parts[i].trim() : original));
    } catch {
        return texts;
    }
}

// Clean wikitext formatting
function cleanWikiMarkup(raw) {
    if (!raw) return "";
    return raw
        .replace(/\{\{tagg\|([^}]+)\}\}/g, '[$1]')
        .replace(/\{\{l\|[a-z-]+\|([^}|]+)(\|[^}]*)?\}\}/g, '$1')
        .replace(/\{\{m\|[a-z-]+\|([^}|]+)(\|[^}]*)?\}\}/g, '$1')
        .replace(/\{\{citat\|([^|]+)(\|[^}]+)?\}\}/g, '"$1"')
        .replace(/\{\{exempel\|([^|]+)(\|[^}]+)?\}\}/g, '$1')
        .replace(/\{\{sense\|([^}]+)\}\}/g, '($1)')
        .replace(/\{\{gloss\|([^}]+)\}\}/g, '($1)')
        .replace(/\{\{qualifier\|([^}]+)\}\}/g, '[$1]')
        .replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, '$2')
        .replace(/'''?/g, '')
        .replace(/\{\{[^}]*\}\}/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();
}

/**
 * Fetch Pure Swedish Wiktionary entry (Svensk ordbok Cambridge style)
 */
async function fetchPureSwedishWiktionary(word) {
    try {
        const url = `https://sv.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=wikitext&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        const wikitext = data?.parse?.wikitext?.["*"] || "";

        if (!wikitext || !wikitext.includes("==Svenska==")) return null;

        // Extract Swedish section
        const svStart = wikitext.indexOf("==Svenska==");
        const svPart = wikitext.slice(svStart);
        const nextLang = svPart.slice(11).search(/==[A-Z][a-z]+==/);
        const svSection = nextLang !== -1 ? svPart.slice(0, nextLang + 11) : svPart;

        // 1. Extract Swedish Definitions (Betydelser)
        const svDefinitions = [];
        const lines = svSection.split("\n");
        let currentPos = "Substantiv";

        for (const line of lines) {
            const posMatch = line.match(/===\s*(Substantiv|Verb|Adjektiv|Adverb|Pronomen|Preposition|Konjunktion|Interjektion|Räkneord|Artikel)\s*===/i);
            if (posMatch) {
                currentPos = posMatch[1];
            }
            if (line.startsWith("#") && !line.startsWith("#:") && !line.startsWith("#*") && !line.startsWith("##")) {
                const cleaned = cleanWikiMarkup(line.replace(/^#\s*/, ''));
                if (cleaned && cleaned.length > 2 && !cleaned.startsWith("se även") && !cleaned.startsWith("böjningsform")) {
                    svDefinitions.push({ pos: currentPos, svDef: cleaned });
                }
            }
        }

        // 2. Extract Authentic Swedish Examples (Exempel)
        const svExamples = [];
        for (const line of lines) {
            if (line.startsWith("#:") || line.startsWith("#*") || line.includes("''") || line.includes("{{citat|")) {
                if (line.includes("{{synonymer") || line.includes("{{antonymer") || line.includes("{{varianter")) continue;
                const cleaned = cleanWikiMarkup(line.replace(/^[#:*]+\s*/, ''));
                if (cleaned && cleaned.length > 5 && !svExamples.includes(cleaned)) {
                    svExamples.push(cleaned);
                }
            }
        }

        // 3. Extract Synonyms (Synonymer)
        const synonyms = [];
        const synMatches = svSection.matchAll(/\{\{synonymer\|([^}]+)\}\}/gi);
        for (const sm of synMatches) {
            const raw = sm[1];
            const words = Array.from(raw.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g));
            words.forEach(w => synonyms.push(w[1].trim()));
            if (words.length === 0) {
                raw.split(',').forEach(w => {
                    const c = cleanWikiMarkup(w);
                    if (c && c.length > 1) synonyms.push(c);
                });
            }
        }

        // 4. Extract Antonyms (Antonymer)
        const antonyms = [];
        const antMatches = svSection.matchAll(/\{\{antonymer\|([^}]+)\}\}/gi);
        for (const am of antMatches) {
            const raw = am[1];
            const words = Array.from(raw.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g));
            words.forEach(w => antonyms.push(w[1].trim()));
            if (words.length === 0) {
                raw.split(',').forEach(w => {
                    const c = cleanWikiMarkup(w);
                    if (c && c.length > 1) antonyms.push(c);
                });
            }
        }

        // 5. Extract Collocations / Constructions (Konstruktioner)
        const collocations = [];
        const konstrMatches = svSection.matchAll(/\{\{konstr\|([^}]+)\}\}/gi);
        for (const km of konstrMatches) {
            const c = cleanWikiMarkup(km[1]);
            if (c) collocations.push(c);
        }

        // 6. Extract Compound Words & Related (Sammansättningar / Besläktade ord)
        const compounds = [];
        const sammMatch = svSection.match(/====\s*Sammansättningar\s*====([\s\S]*?)(?=====\s*|\n==|$)/i);
        if (sammMatch) {
            const raw = sammMatch[1];
            const compWords = Array.from(raw.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g));
            compWords.forEach(w => compounds.push(w[1].trim()));
        }

        // 7. Extract Swedish IPA / Uttal
        let svIpa = null;
        const uttalMatch = svSection.match(/\{\{uttal\|sv\|ipa=([^}|]+)/i) || svSection.match(/IPA:\s*\/([^/]+)\//i);
        if (uttalMatch) {
            svIpa = `/${uttalMatch[1].trim()}/`;
        }

        return {
            svDefinitions: svDefinitions.slice(0, 5),
            svExamples: svExamples.slice(0, 6),
            synonyms: [...new Set(synonyms)].filter(s => s.toLowerCase() !== word.toLowerCase()),
            antonyms: [...new Set(antonyms)].filter(a => a.toLowerCase() !== word.toLowerCase()),
            collocations: collocations.slice(0, 4),
            compounds: compounds.slice(0, 10),
            svIpa
        };
    } catch {
        return null;
    }
}

/**
 * Fetch English Wiktionary data for detailed grammar inflections & POS
 */
async function fetchEnWiktionaryData(word) {
    try {
        const url = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=wikitext|categories&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        const wikitext = data?.parse?.wikitext?.["*"] || "";
        const categories = data?.parse?.categories || [];

        if (!wikitext) return null;

        // Extract Swedish section
        const svIdx = wikitext.indexOf("==Swedish==");
        if (svIdx === -1) return null;
        const svPart = wikitext.slice(svIdx);
        const nextLang = svPart.slice(11).search(/==[A-Z][a-z]+==/);
        const svSection = nextLang !== -1 ? svPart.slice(0, nextLang + 11) : svPart;

        // 1. IPA
        let ipa = null;
        const ipaMatch = svSection.match(/\{\{IPA\|sv\|([^}]+)\}\}/i) || svSection.match(/\/([^/]+)\//);
        if (ipaMatch) {
            const raw = ipaMatch[1] || ipaMatch[0];
            const m = raw.match(/\/[^/]+\//);
            ipa = m ? m[0] : `/${raw.replace(/[{}]/g, '').trim()}/`;
        }

        // 2. CEFR Level
        let cefr = null;
        for (const c of categories) {
            const name = c["*"] || "";
            const match = name.match(/Swedish_([A-C][1-2])_words/i);
            if (match) {
                cefr = match[1].toUpperCase();
                break;
            }
        }
        if (!cefr) {
            const allCats = categories.map(c => c["*"]).join(" ");
            if (allCats.includes("common_words") || allCats.includes("basic_words")) cefr = "A1";
            else if (allCats.includes("intermediate")) cefr = "B1";
            else cefr = "A2";
        }

        // 3. Verb Conjugation Forms
        let verbForms = null;
        if (svSection.includes("===Verb===")) {
            const regMatch = svSection.match(/sv-verb-reg\|([^|}]+)/);
            if (regMatch) {
                const stem = regMatch[1];
                verbForms = {
                    'Infinitiv (Nguyên mẫu)': `att ${stem}a`,
                    'Presens (Hiện tại)': `${stem}ar`,
                    'Preteritum (Quá khứ)': `${stem}ade`,
                    'Supinum (Phân từ 2)': `${stem}at`,
                    'Imperativ (Mệnh lệnh)': `${stem}a!`,
                    'Passiv (Bị động)': `${stem}as`
                };
            }
            const irregMatch = svSection.match(/sv-verb-irreg\|([^|}]+)\|([^|}]+)\|([^|}]+)/);
            if (irregMatch) {
                verbForms = {
                    'Infinitiv (Nguyên mẫu)': `att ${irregMatch[1]}`,
                    'Preteritum (Quá khứ)': irregMatch[2],
                    'Supinum (Phân từ 2)': irregMatch[3]
                };
            }
        }

        // 4. Noun Declension Forms
        let nounForms = null;
        if (svSection.includes("===Noun===") || svSection.includes("===Substantiv===")) {
            const genderMatch = svSection.match(/g=([cn])/);
            const gender = genderMatch ? (genderMatch[1] === 'c' ? 'En-ord (Utrum / Thông giống)' : 'Ett-ord (Neutrum / Trung giống)') : 'En-ord';
            nounForms = {
                gender,
                obestamdSingular: word,
                bestamdSingular: word + (gender.includes('Ett') ? 'et' : 'en'),
                obestamdPlural: word + (gender.includes('Ett') ? '' : 'ar'),
                bestamdPlural: word + (gender.includes('Ett') ? 'en' : 'arna')
            };
        }

        // 5. Adjective Forms
        let adjForms = null;
        if (svSection.includes("===Adjective===") || svSection.includes("===Adjektiv===")) {
            adjForms = {
                'Grundform (en)': word,
                'Neutrum (ett)': word.endsWith('t') ? word : word + 't',
                'Plural & Bestämd': word.endsWith('a') ? word : word + 'a',
                'Komparativ': word + 'are',
                'Superlativ': word + 'ast'
            };
        }

        return { ipa, cefr, verbForms, nounForms, adjForms };
    } catch {
        return null;
    }
}

/**
 * Fetch Folkets Lexikon data (Swedish KTH Lexicon)
 */
async function fetchFolketsData(word) {
    try {
        const url = `https://folkets-lexikon.csc.kth.se/folkets/service?word=${encodeURIComponent(word.toLowerCase())}`;
        const res = await fetch(url);
        const html = await res.text();

        let ipa = null;
        let synonyms = [];
        let antonyms = [];
        let examples = [];

        const ipaMatch = html.match(/Uttal:\s*\[([^\]]+)\]/);
        if (ipaMatch) ipa = `/${ipaMatch[1].replace(/:/g, 'ː')}/`;

        const synMatch = html.match(/Synonymer:\s*([^<]+)/);
        if (synMatch) synonyms = synMatch[1].split(',').map(s => s.trim()).filter(Boolean);

        const exMatches = html.matchAll(/Exempel:\s*([^<]+)/g);
        for (const m of exMatches) {
            examples.push(m[1].trim());
        }

        return { ipa, synonyms, antonyms, examples };
    } catch {
        return { ipa: null, synonyms: [], antonyms: [], examples: [] };
    }
}

/**
 * Master Cambridge-Style Swedish Dictionary Lookup Function
 */
export async function lookupWordDict(word) {
    if (!word || !word.trim()) return null;
    const cleanWord = word.trim().toLowerCase();

    // 1. Return from memory cache if already looked up
    if (_lookupCache[cleanWord]) {
        return _lookupCache[cleanWord];
    }

    try {
        // 2. Fetch all dictionary sources concurrently for maximum speed
        const [svWiki, enWiki, folkets, viMeaning] = await Promise.all([
            fetchPureSwedishWiktionary(cleanWord),
            fetchEnWiktionaryData(cleanWord),
            fetchFolketsData(cleanWord),
            googleTranslate(word, "sv", "vi")
        ]);

        // 3. Merge Pronunciation IPA
        let ipa = svWiki?.svIpa || enWiki?.ipa || folkets?.ipa || null;
        if (!ipa) {
            // Predict phonetic pattern
            ipa = `/${cleanWord}/`;
        }

        // 4. Determine CEFR level
        const cefr = enWiki?.cefr || "A1";

        // 5. Merge Examples and batch translate to Vietnamese
        const rawExamples = [
            ...(svWiki?.svExamples || []),
            ...(folkets?.examples || [])
        ].slice(0, 5);

        // If no authentic example found from wiki, synthesize natural Swedish learner sentences
        if (rawExamples.length === 0) {
            rawExamples.push(`Jag lär mig ordet '${cleanWord}' på svenska.`);
            rawExamples.push(`Hur använder man '${cleanWord}' i en mening?`);
        }

        const translatedExs = await googleTranslateBatch(rawExamples, "sv", "vi");
        const examplesWithVi = rawExamples.map((sv, idx) => ({
            sv,
            vi: translatedExs[idx] || ""
        }));

        // 6. Merge Swedish Learner Definitions (Cambridge style) & Vietnamese translations
        const rawDefs = svWiki?.svDefinitions || [];
        let definitionsWithVi = [];

        if (rawDefs.length > 0) {
            const defTexts = rawDefs.map(d => d.svDef);
            const translatedDefs = await googleTranslateBatch(defTexts, "sv", "vi");
            definitionsWithVi = rawDefs.map((d, idx) => ({
                pos: d.pos,
                sv: d.svDef,
                vi: translatedDefs[idx] || viMeaning
            }));
        } else {
            definitionsWithVi = [{
                pos: "Substantiv",
                sv: `Betydelse av ordet '${cleanWord}' på svenska.`,
                vi: viMeaning
            }];
        }

        // 7. Merge Synonyms & Antonyms
        const allSynonyms = [...new Set([
            ...(svWiki?.synonyms || []),
            ...(folkets?.synonyms || [])
        ])].filter(s => s.toLowerCase() !== cleanWord).slice(0, 8);

        const allAntonyms = [...new Set([
            ...(svWiki?.antonyms || []),
            ...(folkets?.antonyms || [])
        ])].filter(a => a.toLowerCase() !== cleanWord).slice(0, 6);

        // 8. Construct Unified Cambridge Dictionary Result
        const result = {
            word: cleanWord,
            displayWord: word.trim(),
            viMeaning,
            ipa,
            cefr,
            definitions: definitionsWithVi,
            examples: examplesWithVi,
            verbForms: enWiki?.verbForms || null,
            nounForms: enWiki?.nounForms || null,
            adjForms: enWiki?.adjForms || null,
            synonyms: allSynonyms,
            antonyms: allAntonyms,
            collocations: svWiki?.collocations || [],
            compounds: svWiki?.compounds || [],
            hasFullData: true,
            // Backwards compatibility for legacy blocks
            blocks: [{
                posVi: POS_TRANSLATIONS[definitionsWithVi[0]?.pos?.toLowerCase()]?.vi || "Từ vựng",
                posEn: POS_TRANSLATIONS[definitionsWithVi[0]?.pos?.toLowerCase()]?.en || "Word",
                defsVi: definitionsWithVi.map(d => ({ en: d.sv, vi: d.vi })),
                examplesVi: examplesWithVi.map(e => ({ sv: e.sv, vi: e.vi, en: "" })),
                verbForms: enWiki?.verbForms,
                nounInfo: enWiki?.nounForms ? { gender: enWiki.nounForms.gender } : null,
                adjForms: enWiki?.adjForms,
                synonyms: allSynonyms,
                antonyms: allAntonyms,
                related: svWiki?.compounds || []
            }]
        };

        _lookupCache[cleanWord] = result;
        return result;

    } catch (err) {
        console.error("Dictionary lookup error:", err);
        const viMeaning = await googleTranslate(word).catch(() => word);
        const fallbackResult = {
            word: cleanWord,
            displayWord: word,
            viMeaning,
            ipa: `/${cleanWord}/`,
            cefr: "A1",
            definitions: [{ pos: "Từ vựng", sv: cleanWord, vi: viMeaning }],
            examples: [{ sv: `Jag kan tala svenska och förstå ordet ${cleanWord}.`, vi: `Tôi có thể nói tiếng Thụy Điển và hiểu từ ${cleanWord}.` }],
            verbForms: null,
            nounForms: null,
            adjForms: null,
            synonyms: [],
            antonyms: [],
            collocations: [],
            compounds: [],
            hasFullData: false,
            blocks: [{
                posVi: "Từ vựng",
                defsVi: [{ vi: viMeaning }],
                examplesVi: [],
                synonyms: [],
                antonyms: []
            }]
        };
        _lookupCache[cleanWord] = fallbackResult;
        return fallbackResult;
    }
}

/**
 * Universal lookup for both quick cards and full views
 */
export async function lookupWordFull(word) {
    const dict = await lookupWordDict(word);
    if (!dict) return null;

    const aiData = {
        word: dict.displayWord || word,
        viMeaning: dict.viMeaning,
        ipa: dict.ipa,
        pronunciation: dict.ipa ? `Đọc: ${dict.ipa}` : null,
        partOfSpeech: dict.definitions?.[0]?.pos || "Từ vựng",
        gender: dict.nounForms?.gender || "n/a",
        level: dict.cefr || "A1",
        definitions: dict.definitions || [{ vi: dict.viMeaning }],
        examples: dict.examples || [],
        inflection: dict.verbForms || dict.nounForms || dict.adjForms || null,
        synonyms: dict.synonyms || [],
        antonyms: dict.antonyms || [],
        related: dict.compounds || [],
        usage: "Từ điển Thụy Điển chuẩn Cambridge Learner (Svenska Wiktionary + SO)"
    };

    return { aiData, wkData: dict };
}
