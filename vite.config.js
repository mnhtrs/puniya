import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'node:https'

// =================================================================
// Vite Plugin: API Middleware
// Xử lý /api/chat và /api/expert trong development mode
// Trong production (Vercel), các serverless functions sẽ xử lý
// =================================================================
function apiMiddleware() {
    let apiKey = '';

    return {
        name: 'puniya-api-middleware',
        config(_, { mode }) {
            // Đọc GROQ_API_KEY từ .env
            const env = loadEnv(mode, process.cwd(), '');
            apiKey = env.GROQ_API_KEY;
        },
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.method !== 'POST') return next();
                if (req.url !== '/api/chat' && req.url !== '/api/expert') return next();

                let bodyData = [];
                req.on('data', (chunk) => bodyData.push(chunk));
                req.on('end', () => {
                    try {
                        const body = Buffer.concat(bodyData).toString();
                        const parsed = JSON.parse(body);
                        let groqBody;

                        if (req.url === '/api/chat') {
                            groqBody = {
                                model: parsed.model || 'llama-3.3-70b-versatile',
                                messages: [
                                    ...(parsed.systemPrompt
                                        ? [{ role: 'system', content: parsed.systemPrompt }]
                                        : []),
                                    ...(parsed.messages || []),
                                ],
                                max_tokens: parsed.maxTokens || 4096,
                                temperature: 0.7,
                            };
                        } else if (req.url === '/api/expert') {
                            groqBody = {
                                model: 'llama-3.3-70b-versatile',
                                messages: [
                                    { role: 'system', content: 'Bạn là chuyên gia ngôn ngữ Thụy Điển - Việt.' },
                                    { role: 'user', content: parsed.prompt },
                                ],
                                max_tokens: 4096,
                            };
                        }

                        const data = JSON.stringify(groqBody);
                        const options = {
                            hostname: 'api.groq.com',
                            path: '/openai/v1/chat/completions',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`,
                                'Content-Length': Buffer.byteLength(data),
                            },
                        };

                        const apiReq = https.request(options, (apiRes) => {
                            let responseChunks = [];
                            apiRes.on('data', (chunk) => responseChunks.push(chunk));
                            apiRes.on('end', () => {
                                const responseData = Buffer.concat(responseChunks);
                                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                                res.statusCode = apiRes.statusCode;
                                res.end(responseData);
                            });
                        });

                        apiReq.on('error', (e) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: { message: e.message } }));
                        });

                        apiReq.write(data);
                        apiReq.end();
                    } catch (e) {
                        res.setHeader('Content-Type', 'application/json');
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: { message: e.message } }));
                    }
                });
            });
        },
    };
}

export default defineConfig({
    plugins: [react(), apiMiddleware()],
})
