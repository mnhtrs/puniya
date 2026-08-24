export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: { message: "Method not allowed" } });
        }

        const { messages, systemPrompt, model, apiKey: clientApiKey } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: { message: "Messages are required and must be an array" } });
        }

        const defaultPrompt = `Bạn là Puniya AI — trợ lý học tiếng Thụy Điển thông minh, ngọt ngào dành cho người Việt Nam.
Bạn hỗ trợ giải thích từ vựng (Nghĩa, IPA, Böjning, Ví dụ), ngữ pháp, luyện 4 kỹ năng và toán hóa Thụy Điển.
Luôn luôn trả lời thân thiện, ngọt ngào bằng tiếng Việt.`;

        const apiKey = clientApiKey || process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(401).json({
                error: {
                    message: "Chưa có GROQ_API_KEY. Vui lòng nhập API Key miễn phí trong mục Cài đặt AI của trang web."
                }
            });
        }

        const targetModel = model || "llama-3.3-70b-versatile";

        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: targetModel,
                messages: [
                    { role: "system", content: systemPrompt || defaultPrompt },
                    ...messages
                ],
                max_tokens: 2048,
                temperature: 0.7
            })
        });

        const data = await r.json();
        
        if (!r.ok) {
            return res.status(r.status).json(data);
        }

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        return res.status(200).json(data);

    } catch (e) {
        console.error("API Error:", e);
        return res.status(500).json({ error: { message: `Server error: ${e.message}` } });
    }
}
