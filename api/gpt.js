export default async function handler(req, res) {
  try {
    const { prompt, maxTokens } = req.body;

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Bạn là một từ điển Thụy Điển - Việt chuyên nghiệp và chính xác." },
          { role: "user", content: prompt }
        ],
        max_tokens: maxTokens || 1024
      })
    });

    const data = await r.json();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: "AI error" });
  }
}