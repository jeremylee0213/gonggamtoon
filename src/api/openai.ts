const BASE_URL = 'https://api.openai.com/v1';

export async function generateTextWithOpenAI(
  prompt: string,
  apiKey: string,
  model: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: '당신은 공감 웹툰 스토리 전문 작가입니다. 한국어로 답변하세요. JSON 배열 형식으로 응답할 때는 순수 JSON만 출력하세요.',
        },
        { role: 'user', content: prompt },
      ],
    }),
    signal,
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'OpenAI API 오류');
  }

  return data.choices?.[0]?.message?.content ?? '';
}
