const BASE_URL = 'https://api.anthropic.com/v1';

function mapErrorMessage(status: number, message: string): string {
  if (status === 401 || status === 403) return 'API 키가 잘못되었거나 만료되었어요. 키를 확인해 주세요.';
  if (status === 429) return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.';
  if (status === 500 || status === 502 || status === 503) return 'Claude 서버에 문제가 있어요. 잠시 후 다시 시도해 주세요.';
  return message || 'Claude API 오류가 발생했어요.';
}

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

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(mapErrorMessage(response.status, data.error?.message));
  }

  const data = await response.json();
  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
  return textBlock?.text ?? '';
}
