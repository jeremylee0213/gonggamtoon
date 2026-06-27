const BASE_URL = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const LOCAL_CODEX_ENDPOINT = `${BASE_URL}__local_codex`;

function mapErrorMessage(status: number, message: string): string {
  if (status === 404) return '로컬 Codex 연결 서버를 찾지 못했습니다. npm run dev로 실행해 주세요.';
  if (status === 413) return '요청 내용이 너무 큽니다.';
  if (status === 500) return message || '로컬 Codex 실행 중 오류가 발생했어요.';
  return message || '로컬 Codex 요청 중 오류가 발생했어요.';
}

export async function generateTextWithCodex(
  prompt: string,
  model: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(LOCAL_CODEX_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
    signal,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(mapErrorMessage(response.status, data.error));
  }

  return data.text ?? '';
}
