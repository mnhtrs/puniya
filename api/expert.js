export default async function handler(req, res) {
  try {
    const { prompt, maxTokens, apiKey: clientApiKey } = req.body;

    const apiKey = clientApiKey || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(401).json({
        error: { message: "Chưa cấu hình API Key. Hãy nhập API Key trong phần Cài đặt của trang web." }
      });
    }

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Bạn là một giáo viên tiếng Thụy Điển chuyên nghiệp. Hãy kiểm tra ngữ pháp và từ vựng trong bài viết của người dùng và nhận xét chi tiết bằng tiếng Việt." },
          { role: "user", content: prompt }
        ],
        max_tokens: maxTokens || 2048
      })
    });

    const data = await r.json();
    if (!r.ok) {
        return res.status(r.status).json(data);
    }
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(data);

} catch (e) {
    console.error("Expert API Error:", e);
    return res.status(500).json({ error: { message: `Expert AI error: ${e.message}` } });
}
}
