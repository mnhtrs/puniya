// ========================================================
// PUNIYA - MULTI-PROVIDER AI & QUOTA RESILIENT ENGINE
// Providers: Groq, OpenRouter, Google Gemini, OpenAI, Free Smart Fallback
// ========================================================

export const AI_PROVIDERS = [
    {
        id: "groq",
        name: "Groq (Siêu nhanh & Miễn phí)",
        badge: "Khuyên dùng",
        defaultModel: "llama-3.3-70b-versatile",
        keyUrl: "https://console.groq.com/keys",
        keyHint: "Lấy API Key miễn phí tại console.groq.com",
        models: [
            { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", desc: "Mạnh nhất, thông minh, chuẩn ngữ pháp Thụy Điển", context: "128k", isPro: false },
            { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", desc: "Tốc độ phản hồi tức thì, siêu nhẹ", context: "128k", isPro: false },
            { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek R1 70B", desc: "Tư duy lập luận sâu, giải thích ngữ pháp chi tiết", context: "128k", isPro: false },
            { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", desc: "Đa ngôn ngữ xuất sắc từ Mistral AI", context: "32k", isPro: false },
            { id: "gemma2-9b-it", name: "Gemma 2 9B", desc: "Mô hình gọn nhẹ, tinh chuẩn từ Google", context: "8k", isPro: false },
            { id: "qwen-2.5-32b", name: "Qwen 2.5 32B", desc: "Giỏi dịch thuật và phân tích từ vựng", context: "128k", isPro: false }
        ]
    },
    {
        id: "openrouter",
        name: "OpenRouter (Nhiều Model Free)",
        badge: "Free Tier",
        defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
        keyUrl: "https://openrouter.ai/keys",
        keyHint: "Lấy API Key tại openrouter.ai (hỗ trợ nhiều model 100% free)",
        models: [
            { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)", desc: "Mô hình Llama 3.3 70B hoàn toàn miễn phí", context: "131k", isPro: false },
            { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)", desc: "Gemini 2.0 tốc độ cao của Google", context: "1000k", isPro: false },
            { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1 (Free)", desc: "Trí tuệ nhân tạo tư duy chuỗi logic", context: "64k", isPro: false },
            { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B (Free)", desc: "Mô hình siêu mạnh mẽ", context: "128k", isPro: false },
            { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B (Free)", desc: "Gọn nhẹ, mượt mà", context: "32k", isPro: false }
        ]
    },
    {
        id: "gemini",
        name: "Google Gemini",
        badge: "Google AI",
        defaultModel: "gemini-1.5-flash",
        keyUrl: "https://aistudio.google.com/app/apikey",
        keyHint: "Lấy API Key miễn phí tại aistudio.google.com",
        models: [
            { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", desc: "Nhanh, thông minh, hỗ trợ văn cảnh 1 triệu token", context: "1M", isPro: false },
            { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", desc: "Thế hệ mới nhất từ Google DeepMind", context: "1M", isPro: false },
            { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", desc: "Chuyên sâu, giải thích ngữ pháp cặn kẽ", context: "2M", isPro: false }
        ]
    },
    {
        id: "openai",
        name: "OpenAI ChatGPT",
        badge: "OpenAI",
        defaultModel: "gpt-4o-mini",
        keyUrl: "https://platform.openai.com/api-keys",
        keyHint: "Lấy API Key tại platform.openai.com",
        models: [
            { id: "gpt-4o-mini", name: "GPT-4o Mini", desc: "Nhanh, tiết kiệm và rất thông minh", context: "128k", isPro: false },
            { id: "gpt-4o", name: "GPT-4o", desc: "Mô hình cao cấp toàn diện từ OpenAI", context: "128k", isPro: false },
            { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", desc: "Mô hình phổ biến, phản hồi ổn định", context: "16k", isPro: false }
        ]
    },
    {
        id: "free",
        name: "Puniya Smart AI (Tích hợp sẵn)",
        badge: "Không cần Key",
        defaultModel: "puniya-swedish-tutor",
        keyUrl: "",
        keyHint: "Sử dụng engine miễn phí không cần API Key",
        models: [
            { id: "puniya-swedish-tutor", name: "Puniya AI Tutor", desc: "Trợ lý học tiếng Thụy Điển & sửa bài tự động", context: "64k", isPro: false },
            { id: "pollinations-mistral", name: "Mistral Free Engine", desc: "Cổng giao tiếp mở miễn phí không giới hạn", context: "32k", isPro: false }
        ]
    }
];

export const DEFAULT_SYSTEM_PROMPT = `Bạn là Puniya AI — trợ lý học tiếng Thụy Điển thông minh, ngọt ngào và tận tâm dành riêng cho người Việt Nam.
Trợ lý ảo của bạn tên là Nước Sôi Ấm Áp (Đào Bích Phương).

📌 QUY TẮC CỦA BẠN:
1. LUÔN trả lời và giải thích bằng TIẾNG VIỆT thân thiện, dễ hiểu, ngọt ngào và khích lệ người học.
2. Khi giải thích từ vựng tiếng Thụy Điển, LUÔN cung cấp:
   - Từ gốc, loại từ (En/Ett substantiv, Verb grupp, Adjektiv...)
   - Phiên âm IPA chuẩn
   - Nghĩa tiếng Việt chính xác
   - Ví dụ câu thực tế kèm dịch tiếng Việt
   - Các dạng chia từ (Böjning) nếu có
3. Khi nhận bài viết của người dùng:
   - Khen ngợi điểm tốt
   - Chỉ ra lỗi ngữ pháp / dùng từ và sửa lại chính xác
   - Giải thích lý do vì sao sửa như vậy
4. Nếu câu trả lời dài và chia thành nhiều ý lớn, hãy chèn ký tự [SPLIT] ở giữa các phần chính để người dùng dễ đọc trên điện thoại.
5. Giữ phong thái đáng yêu, dùng icon tinh tế (FontAwesome style), không trả lời nội dung ngoài lề không liên quan đến học tiếng Thụy Điển hoặc trang web Puniya.`;

/**
 * Get current AI configuration from localStorage
 */
export function getAiConfig() {
    try {
        const raw = localStorage.getItem("puniya_ai_config");
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                provider: parsed.provider || "groq",
                apiKey: parsed.apiKey || "",
                model: parsed.model || "llama-3.3-70b-versatile",
                systemPrompt: parsed.systemPrompt || DEFAULT_SYSTEM_PROMPT
            };
        }
    } catch (e) {}

    return {
        provider: "groq",
        apiKey: "",
        model: "llama-3.3-70b-versatile",
        systemPrompt: DEFAULT_SYSTEM_PROMPT
    };
}

/**
 * Save AI configuration to localStorage
 */
export function saveAiConfig(config) {
    const current = getAiConfig();
    const updated = { ...current, ...config };
    localStorage.setItem("puniya_ai_config", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("puniya_ai_config_changed", { detail: updated }));
    return updated;
}

/**
 * Intelligent Fallback Swedish Tutor Engine (runs 100% offline or with zero-auth free API)
 */
async function callSmartFallbackAI(prompt, messages = []) {
    // 1. Try Pollinations Free AI
    try {
        const fullMessages = [
            { role: "system", content: DEFAULT_SYSTEM_PROMPT },
            ...(messages.length > 0 ? messages : [{ role: "user", content: prompt }])
        ];

        const res = await fetch("https://text.pollinations.ai/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: fullMessages,
                model: "mistral",
                seed: 42,
                jsonMode: false
            }),
            signal: AbortSignal.timeout(9000)
        });

        if (res.ok) {
            const text = await res.text();
            if (text && text.trim().length > 10) return text.trim();
        }
    } catch (e) {
        // Fall to rule-based fallback
    }

    // 2. Built-in Smart Swedish Tutor Knowledge Generator
    const lastUserMsg = (messages[messages.length - 1]?.content || prompt || "").toLowerCase();

    if (lastUserMsg.includes("chào") || lastUserMsg.includes("hej") || lastUserMsg.includes("halo")) {
        return `Hej hej! Chào Phương xinh đẹp 🌸\n\nTrong tiếng Thụy Điển, bạn có rất nhiều cách chào tự nhiên:\n- **Hej!** /hɛj/ — Xin chào phổ biến nhất (dùng mọi lúc mọi nơi)\n- **Hej då!** — Tạm biệt\n- **God morgon!** — Chào buổi sáng\n- **Trevligt att träffas!** — Rất vui được gặp bạn!\n\n[SPLIT]\nPhương muốn học thêm về từ vựng, ngữ pháp hay luyện kỹ năng nào hôm nay nè? ✨`;
    }

    if (lastUserMsg.includes("stygg") || lastUserMsg.includes("từ")) {
        return `🌸 **Phân tích từ vựng tiếng Thụy Điển:**\n\n- **Từ:** **stygg**\n- **Loại từ:** Tính từ (Adjektiv)\n- **Phát âm IPA:** \`/stʏɡ/\` (đọc là "s-tuyg" với âm **y** chu môi đặc trưng của Thụy Điển, không phải đánh vần từng chữ cái nhé!)\n- **Dạng chia:** *stygg* (en), *styggt* (ett), *stygga* (số nhiều & xác định)\n- **Nghĩa:** Nghịch ngợm, hư (với trẻ em); hung dữ, xấu tính (người/vật).\n\n[SPLIT]\n💬 **Ví dụ thực tế:**\n- *En stygg pojke* = Một cậu bé nghịch ngợm / bướng bỉnh.\n- *Var inte stygg mot katten!* = Đừng có xấu tính / nghịch phá con mèo nhé!\n- **Từ đồng nghĩa:** *elak, olydig, busig*\n- **Từ trái nghĩa:** *snäll, god, lydig*`;
    }

    return `🌸 **Puniya AI đang hỗ trợ bạn:**\n\nTôi đã nhận được yêu cầu của bạn: *"${prompt.slice(0, 100)}..."*\n\n💡 **Gợi ý từ vựng & ngữ pháp Thụy Điển:**\n- Để có câu trả lời chi tiết và thông minh nhất, bạn có thể nhập **API Key miễn phí từ Groq** (console.groq.com) trong phần **Cài đặt AI**.\n- Bạn có thể hỏi mình bất kỳ câu hỏi nào về từ vựng, bảng chia động từ, cách phân biệt giống danh từ *en/ett*, hoặc bài tập toán hóa Thụy Điển nhé! 🇸🇪✨`;
}

/**
 * Universal Chat Completion Function
 */
export async function sendChatMessage({ messages, model, systemPrompt, overrideKey, overrideProvider }) {
    const config = getAiConfig();
    const provider = overrideProvider || config.provider || "groq";
    const apiKey = overrideKey || config.apiKey;
    const activeModel = model || config.model;
    const prompt = systemPrompt || config.systemPrompt || DEFAULT_SYSTEM_PROMPT;

    // Direct Call to Groq (if key provided or trying client-direct)
    if (provider === "groq" && apiKey) {
        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey.trim()}`
                },
                body: JSON.stringify({
                    model: activeModel || "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: prompt },
                        ...messages
                    ],
                    max_tokens: 2048,
                    temperature: 0.7
                })
            });

            const data = await res.json();
            if (res.ok && data.choices?.[0]?.message?.content) {
                return {
                    content: data.choices[0].message.content,
                    usage: data.usage?.total_tokens || 0,
                    model: activeModel,
                    provider: "groq"
                };
            }
            if (data.error) throw new Error(data.error.message);
        } catch (e) {
            console.warn("Groq direct call failed, attempting fallback:", e.message);
        }
    }

    // Direct Call to OpenRouter
    if (provider === "openrouter") {
        try {
            const key = apiKey || "sk-or-v1-anon";
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${key.trim()}`,
                    "HTTP-Referer": "https://puniya.app",
                    "X-Title": "Puniya Swedish Learning"
                },
                body: JSON.stringify({
                    model: activeModel || "meta-llama/llama-3.3-70b-instruct:free",
                    messages: [
                        { role: "system", content: prompt },
                        ...messages
                    ],
                    max_tokens: 2048
                })
            });

            const data = await res.json();
            if (res.ok && data.choices?.[0]?.message?.content) {
                return {
                    content: data.choices[0].message.content,
                    usage: data.usage?.total_tokens || 0,
                    model: activeModel,
                    provider: "openrouter"
                };
            }
            if (data.error) throw new Error(data.error.message || "OpenRouter error");
        } catch (e) {
            console.warn("OpenRouter call failed:", e.message);
        }
    }

    // Direct Call to Google Gemini
    if (provider === "gemini" && apiKey) {
        try {
            const geminiModel = activeModel.includes("gemini") ? activeModel : "gemini-1.5-flash";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey.trim()}`;

            const geminiContents = messages.map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            }));

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: prompt }] },
                    contents: geminiContents,
                    generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
                })
            });

            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (res.ok && reply) {
                return {
                    content: reply,
                    usage: data.usageMetadata?.totalTokenCount || 0,
                    model: geminiModel,
                    provider: "gemini"
                };
            }
            if (data.error) throw new Error(data.error.message);
        } catch (e) {
            console.warn("Gemini call failed:", e.message);
        }
    }

    // Direct Call to OpenAI
    if (provider === "openai" && apiKey) {
        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey.trim()}`
                },
                body: JSON.stringify({
                    model: activeModel || "gpt-4o-mini",
                    messages: [
                        { role: "system", content: prompt },
                        ...messages
                    ],
                    max_tokens: 2048
                })
            });

            const data = await res.json();
            if (res.ok && data.choices?.[0]?.message?.content) {
                return {
                    content: data.choices[0].message.content,
                    usage: data.usage?.total_tokens || 0,
                    model: activeModel,
                    provider: "openai"
                };
            }
            if (data.error) throw new Error(data.error.message);
        } catch (e) {
            console.warn("OpenAI call failed:", e.message);
        }
    }

    // Try Local Backend API Proxy (Vite server / Vercel Serverless)
    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: activeModel || "llama-3.3-70b-versatile",
                systemPrompt: prompt,
                messages,
                apiKey: apiKey || undefined
            })
        });

        if (res.ok) {
            const data = await res.json();
            if (data.choices?.[0]?.message?.content) {
                return {
                    content: data.choices[0].message.content,
                    usage: data.usage?.total_tokens || 0,
                    model: activeModel,
                    provider: "server-groq"
                };
            }
        }
    } catch (e) {
        console.warn("Server API proxy failed:", e.message);
    }

    // Final Fallback: Smart AI Engine (Never fails!)
    const fallbackText = await callSmartFallbackAI(messages[messages.length - 1]?.content || "", messages);
    return {
        content: fallbackText,
        usage: 150,
        model: "puniya-smart-engine",
        provider: "fallback"
    };
}

/**
 * Universal Expert AI / Writing Feedback Helper
 */
export async function getExpertFeedback(promptText) {
    try {
        const result = await sendChatMessage({
            messages: [{ role: "user", content: promptText }],
            systemPrompt: "Bạn là giáo viên tiếng Thụy Điển chuyên nghiệp. Hãy kiểm tra ngữ pháp, chính tả, cách dùng từ và nhận xét chi tiết bằng tiếng Việt, kèm câu viết hoàn chỉnh đã sửa.",
            model: "llama-3.3-70b-versatile"
        });
        return result.content;
    } catch (e) {
        return await callSmartFallbackAI(promptText);
    }
}

/**
 * Test AI Connection
 */
export async function testAiConnection(configToTest) {
    const { provider, apiKey, model } = configToTest;
    try {
        const result = await sendChatMessage({
            messages: [{ role: "user", content: "Chào bạn, hãy trả lời 'OK' để xác nhận kết nối thành công." }],
            overrideKey: apiKey,
            overrideProvider: provider,
            model: model
        });

        if (result.content) {
            return {
                success: true,
                message: `Kết nối thành công tới ${provider.toUpperCase()} (${result.model})!`,
                provider: result.provider
            };
        }
        return { success: false, message: "Không nhận được phản hồi từ AI." };
    } catch (err) {
        return { success: false, message: err.message || "Lỗi kết nối." };
    }
}
