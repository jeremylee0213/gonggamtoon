const BASE_URL = 'https://api.anthropic.com/v1';

export async function generateTextWithClaude(
  prompt: string,
  apiKey: string,
  model: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: '당신은 공감 웹툰 스토리 전문 작가입니다. 한국어로 답변하세요. JSON 배열 형식으로 응답할 때는 순수 JSON만 출력하세요.',
      messages: [{ role: 'user', content: prompt }],
    }),
    signal,
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Claude API 오류');
  }

  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
  return textBlock?.text ?? '';
}
