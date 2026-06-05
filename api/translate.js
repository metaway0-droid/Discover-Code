/**
 * Google Translate API Proxy Serverless Function
 * 2026-06-05 CORS 에러 우회를 위해 설계됨.
 * 클라이언트에서 직접 호출 시 CORS 헤더 제한으로 차단되는 문제를 해결합니다.
 * 백엔드 측에서 Google API를 대리 호출하고 결과를 반환합니다.
 */
export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const targetUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Discover-Code-Translation-Proxy'
      }
    });

    if (!response.ok) {
      throw new Error(`Google API responded with status ${response.status}`);
    }

    const data = await response.json();

    // 에지 캐싱 설정 (5분간 결과 유지)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=59');
    
    // 원본 배열 데이터를 그대로 리턴하여 프론트엔드의 기존 파싱 코드 호환성 유지
    res.status(200).json(data);
  } catch (error) {
    console.error('Translation Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch translation', message: error.message });
  }
}
