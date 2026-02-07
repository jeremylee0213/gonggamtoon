const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

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

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Gemini API 오류');
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}
