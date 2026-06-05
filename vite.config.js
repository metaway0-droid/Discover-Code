import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import url from 'url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // .env 파일에서 환경 변수 로드 후 process.env에 주입
  const env = loadEnv(mode, process.cwd(), '');
  process.env.GITHUB_TOKEN = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const parsedUrl = url.parse(req.url, true);
            if (parsedUrl.pathname === '/api/github') {
              try {
                // api/github.js 파일 경로 확인
                const apiPath = path.resolve(process.cwd(), 'api/github.js');
                // ESM 동적 임포트 실행 (캐싱 방지를 위해 파일 URL 형식으로 로드)
                const { default: handler } = await import(url.pathToFileURL(apiPath).href);

                // Vercel Serverless Function의 req, res 명세 모킹
                req.query = parsedUrl.query;
                
                res.status = (statusCode) => {
                  res.statusCode = statusCode;
                  return res;
                };
                
                res.json = (data) => {
                  if (!res.headersSent) {
                    res.setHeader('Content-Type', 'application/json');
                  }
                  res.end(JSON.stringify(data));
                };

                await handler(req, res);
              } catch (error) {
                console.error('Local API Proxy Error:', error);
                res.statusCode = 500;
                if (!res.headersSent) {
                  res.setHeader('Content-Type', 'application/json');
                }
                res.end(JSON.stringify({ error: 'Local API proxy failed', message: error.message }));
              }
            } else {
              next();
            }
          });
        }
      }
    ],
  }
})

