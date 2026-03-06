// Swedish autocomplete - Cambridge Dictionary style (suggestions from 1st character)
export async function svAutocomplete(query) {
    if (!query || query.length < 1) return [];
    try {
        const url = `https://sv.wiktionary.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=10&namespace=0&format=json&origin=*`;
        const r = await fetch(url);
        const d = await r.json();
        return (d[1] || []).slice(0, 8);
    } catch { return []; }
}

// Cambridge-style full lookup: AI gives rich info, Wiktionary as backup
export async function lookupWordFull(word) {
    if (!word) return null;
    const prompt = `Du är en professionell svensk-vietnamesisk ordbok som Cambridge Dictionary.
Ord: "${word}"
Svara med EXAKT JSON, ingen markdown:
{"word":"${word}","ipa":"IPA-uttal","pronunciation":"vietnamesiskt uttal t.ex. /ye-g/","partOfSpeech":"substantiv/verb/adjektiv/adverb/preposition/konjunktion","gender":"utrum(en)/neutrum(ett)/ej tillämpligt","inflection":"böjningsformer t.ex. en bil-bilen-bilar-bilarna ELLER infinitiv-presens-preteritum-supinum","viMeaning":"vietnamesisk huvudbetydelse","definitions":[{"vi":"definition 1 på vietnamesiska","en":"english gloss","examples":[{"sv":"exempelmening på svenska","vi":"vietnamesisk översättning"}]}],"usage":"användningsnot på vietnamesiska - register, kontext","synonyms":["synonym1","synonym2"],"antonyms":["antonym1"],"collocations":["vanlig kollokation 1","vanlig kollokation 2"],"level":"A1/A2/B1/B2/C1","isSwedish":true}`;
    let aiData = null, wkData = null;
    try {
        const [aiRes, wkRes] = await Promise.all([
            fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
                body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, messages: [{ role: "user", content: prompt }] })
            }),
            fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word.toLowerCase())}`).catch(() => null)
        ]);
        const aiJson = await aiRes.json();
        const txt = (aiJson.content?.[0]?.text || "").replace(/```json[\s\S]*?```/g, m => m.slice(7, -3)).replace(/```json|```/g, "").trim();
        aiData = JSON.parse(txt);
        if (wkRes && wkRes.ok) {
            const d = await wkRes.json();
            const sec = d["sv"] || d["en"] || null;
            if (sec) {
                wkData = { definitions: [], partOfSpeech: "" };
                sec.forEach(e => {
                    if (!wkData.partOfSpeech) wkData.partOfSpeech = e.partOfSpeech || "";
                    (e.definitions || []).slice(0, 3).forEach(def => {
                        if (def.definition) { const t = document.createElement("div"); t.innerHTML = def.definition; wkData.definitions.push(t.textContent); }
                    });
                });
            }
        }
    } catch (err) { console.error("lookupWordFull error:", err); }
    return { aiData, wkData };
}

// AI via Claude - full Swedish word info + Vietnamese translation
export async function aiLookup(word, existingDefs = []) {
    try {
        const prompt = `Bạn là từ điển tiếng Thụy Điển-Việt chuyên nghiệp chuẩn mực nhất.
Cho từ tiếng Thụy Điển: "${word}"
${existingDefs.length ? `Định nghĩa tham khảo: ${existingDefs.slice(0, 3).join("; ")}` : ""}

Trả lời ĐÚNG JSON, không thêm gì khác:
{
  "viMeaning": "nghĩa tiếng Việt chính xác, tự nhiên nhất",
  "pronunciation": "phiên âm cách đọc theo kiểu Việt hóa, VD: /yek/ hay [ye-g]",
  "ipa": "phiên âm IPA nếu có",
  "partOfSpeech": "danh từ/động từ/tính từ/trạng từ/...",
  "gender": "utrum(en)/neutrum(ett)/không áp dụng",
  "pluralForm": "dạng số nhiều nếu là danh từ",
  "verbForms": "chia động từ: nguyên thể - hiện tại - quá khứ - supinum (nếu là động từ)",
  "viDefinitions": ["định nghĩa 1 tiếng Việt chi tiết", "định nghĩa 2 nếu có"],
  "viExamples": [
    {"sv": "câu ví dụ tiếng Thuỵ Điển", "vi": "dịch tiếng Việt sát nghĩa"},
    {"sv": "câu ví dụ 2", "vi": "dịch 2"}
  ],
  "usage": "ghi chú cách dùng bằng tiếng Việt, văn phong, ngữ cảnh",
  "synonyms": ["từ đồng nghĩa 1", "từ đồng nghĩa 2"],
  "antonyms": ["từ trái nghĩa 1"],
  "relatedForms": ["các dạng liên quan"],
  "isSwedish": true
}`;
        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                messages: [{ role: "user", content: prompt }]
            })
        });
        if (!res.ok) return null;
        const data = await res.json();
        const text = (data.content?.[0]?.text || "").replace(/```json|```/g, "").trim();
        return JSON.parse(text);
    } catch { return null; }
}

// AI writing feedback
export async function aiWritingFeedback(text, prompt) {
    try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                messages: [{
                    role: "user",
                    content: `Bạn là giáo viên tiếng Thụy Điển chuyên nghiệp. Học viên viết:\n"${text}"\nNhiệm vụ: "${prompt}"\nNhận xét ngắn gọn (dưới 120 từ) bằng tiếng Việt: điểm tốt, lỗi cần sửa, gợi ý cải thiện.`
                }]
            })
        });
        const d = await res.json();
        return d.content?.[0]?.text || "Không thể kết nối AI.";
    } catch { return "Lỗi kết nối."; }
}

// AI quiz generation
export async function aiGenerateQuiz(vocab) {
    try {
        const sample = vocab.slice(0, 10).map(v => `${v.sv}=${v.vi}`).join(", ");
        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                messages: [{
                    role: "user",
                    content: `Tạo 5 câu hỏi quiz tiếng Thụy Điển từ từ vựng sau: ${sample}\nTrả lời JSON không có gì khác:\n[{"question":"câu hỏi tiếng Việt","options":["A","B","C","D"],"answer":0,"explanation":"giải thích ngắn"}]`
                }]
            })
        });
        const d = await res.json();
        const text = (d.content?.[0]?.text || "").replace(/```json|```/g, "").trim();
        return JSON.parse(text);
    } catch { return []; }
}

export function speakSv(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "sv-SE"; u.rate = 0.82;
    window.speechSynthesis.speak(u);
}
