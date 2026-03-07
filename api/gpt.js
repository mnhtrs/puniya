export default async function handler(req, res) {
  try {
    const { prompt, maxTokens } = req.body;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Bạn là từ điển Thụy Điển - Việt." },
          { role: "user", content: prompt }
        ],
        max_tokens: maxTokens || 1000
      })
    });

    const data = await r.json();
    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: "AI error" });
  }
}