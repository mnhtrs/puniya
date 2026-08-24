// ========================================================
// PUNIYA - UNIFIED API SERVICES GATEWAY
// Modules: ttsService (Audio/TTS), aiService (AI Chat/Quota), dictService (Cambridge Dictionary)
// ========================================================

export { speakSv, prefetchAllAudio } from "./ttsService";
export {
    sendChatMessage,
    getExpertFeedback,
    testAiConnection,
    getAiConfig,
    saveAiConfig,
    AI_PROVIDERS,
    DEFAULT_SYSTEM_PROMPT
} from "./aiService";
export {
    svAutocomplete,
    googleTranslate,
    googleTranslateBatch,
    lookupWordDict,
    lookupWordFull,
    POS_TRANSLATIONS
} from "./dictService";

import { googleTranslate } from "./dictService";
import { getExpertFeedback } from "./aiService";

// Quick AI lookup for simple translation
export async function aiLookup(word) {
    const vi = await googleTranslate(word);
    return { viMeaning: vi };
}

// AI writing feedback
export async function aiWritingFeedback(text, prompt) {
    const combinedPrompt = `Hãy sửa bài viết tiếng Thụy Điển sau đây:
"${text}"
Chủ đề bài viết: "${prompt || 'Tự do'}"
Hãy chỉ ra các lỗi ngữ pháp, dùng từ, và viết lại câu chuẩn xác bằng tiếng Thụy Điển kèm nhận xét tiếng Việt ngọt ngào và chi tiết.`;
    return await getExpertFeedback(combinedPrompt);
}

// AI quiz generation
export async function aiGenerateQuiz(vocab) {
    if (!vocab || !vocab.length) return [];
    return vocab.slice(0, 10).map(v => ({
        question: v.sv,
        correct: v.vi,
        options: [v.vi]
    }));
}
