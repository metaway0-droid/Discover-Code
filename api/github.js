export default async function handler(req, res) {
  const { path, q, sort, order, per_page, page } = req.query;

  // 1. 보안: Vercel 환경 변수에서 토큰 가져오기 (없으면 익명 호출)
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  // 2. 요청 URL 구성
  let targetUrl = `https://api.github.com/${path || 'search/repositories'}?`;
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (sort) params.append('sort', sort);
  if (order) params.append('order', order);
  if (per_page) params.append('per_page', per_page);
  if (page) params.append('page', page);
  targetUrl += params.toString();

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` }),
        'User-Agent': 'Discover-Code-Proxy'
      }
    });

    const data = await response.json();

    // 3. 에지 캐싱 설정 (5분간 결과 유지)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=59');
    
    // 4. 할당량 정보 전달
    const limit = response.headers.get('x-ratelimit-limit');
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    
    res.status(response.status).json({
      ...data,
      ratelimit: { limit, remaining, reset }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from GitHub' });
  }
}
