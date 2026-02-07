const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function mapErrorMessage(status: number, message: string): string {
  if (status === 400) return 'Gemini 요청 형식이 잘못되었어요. 모델명을 확인해 주세요.';
  if (status === 401 || status === 403) return 'API 키가 잘못되었거나 만료되었어요. 키를 확인해 주세요.';
  if (status === 429) return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.';
  if (status === 500 || status === 502 || status === 503) return 'Gemini 서버에 문제가 있어요. 잠시 후 다시 시도해 주세요.';
  return message || 'Gemini API 오류가 발생했어요.';
}

export async function generateTextWithGemini(
  prompt: string,
  apiKey: string,
  model: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(
    `${BASE_URL}/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
      signal,
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(mapErrorMessage(response.status, data.error?.message));
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}
