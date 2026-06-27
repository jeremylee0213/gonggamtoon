import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig } from 'vite';
import type { Connect, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const LOCAL_CODEX_PATHS = new Set(['/__local_codex', '/gonggamtoon/__local_codex']);
const LOCAL_CODEX_DEFAULT_MODEL = 'gpt-5.5';
const LOCAL_CODEX_DEFAULT_REASONING_EFFORT = 'xhigh';
const LOCAL_CODEX_MODELS = new Set(['gpt-5.5', 'gpt-5.4', 'gpt-5.4-mini', 'gpt-5.3-codex-spark']);
const LOCAL_CODEX_REASONING_EFFORTS = new Set(['low', 'medium', 'high', 'xhigh']);
const LOCAL_CODEX_TIMEOUT_MS = 300_000;
const MAX_LOCAL_CODEX_BODY_BYTES = 1_500_000;

interface LocalCodexPayload {
  prompt: string;
  model?: string;
  reasoningEffort?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLocalCodexPayload(value: unknown): value is LocalCodexPayload {
  return isRecord(value) && typeof value.prompt === 'string';
}

async function readRequestBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk);
    totalBytes += buffer.byteLength;

    if (totalBytes > MAX_LOCAL_CODEX_BODY_BYTES) {
      throw new Error('REQUEST_TOO_LARGE');
    }

    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString('utf8');
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function runCodexExec(
  prompt: string,
  model: string,
  reasoningEffort: string,
  signal: AbortSignal,
): Promise<string> {
  const tempDir = await mkdtemp(join(tmpdir(), 'gonggamtoon-codex-'));
  const outputPath = join(tempDir, 'last-message.txt');

  try {
    return await new Promise<string>((resolve, reject) => {
      let settled = false;
      let stdout = '';
      let stderr = '';

      const child = spawn('codex', [
        'exec',
        '-m',
        model,
        '-c',
        `model_reasoning_effort="${reasoningEffort}"`,
        '--ignore-user-config',
        '--skip-git-repo-check',
        '--sandbox',
        'read-only',
        '--ephemeral',
        '--color',
        'never',
        '--output-last-message',
        outputPath,
        '-C',
        process.cwd(),
        '-',
      ], {
        cwd: process.cwd(),
        env: { ...process.env, NO_COLOR: '1' },
      });

      const timeoutId = setTimeout(() => {
        if (!child.killed) child.kill('SIGTERM');
        rejectOnce(new Error('로컬 Codex 응답 시간이 초과되었습니다. 다시 시도해 주세요.'));
      }, LOCAL_CODEX_TIMEOUT_MS);

      const cleanup = () => {
        clearTimeout(timeoutId);
        signal.removeEventListener('abort', handleAbort);
      };

      const rejectOnce = (error: Error) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(error);
      };

      const resolveOnce = (value: string) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(value);
      };

      const handleAbort = () => {
        if (!child.killed) child.kill('SIGTERM');
        rejectOnce(new Error('생성이 취소되었습니다.'));
      };

      signal.addEventListener('abort', handleAbort, { once: true });

      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');
      child.stdout.on('data', (chunk: string) => {
        stdout += chunk;
      });
      child.stderr.on('data', (chunk: string) => {
        stderr += chunk;
      });

      child.on('error', (error) => {
        rejectOnce(new Error(`로컬 Codex 실행 파일을 찾지 못했거나 실행하지 못했습니다: ${error.message}`));
      });

      child.on('close', (code, termSignal) => {
        if (settled) return;
        if (code !== 0) {
          const detail = (stderr || stdout).trim();
          rejectOnce(new Error(detail || `로컬 Codex가 실패했습니다. 종료 코드: ${code ?? termSignal ?? 'unknown'}`));
          return;
        }

        readFile(outputPath, 'utf8')
          .then((text) => {
            const finalText = text.trim();
            if (!finalText) {
              rejectOnce(new Error('로컬 Codex 응답이 비어 있습니다.'));
              return;
            }
            resolveOnce(finalText);
          })
          .catch((error: unknown) => {
            rejectOnce(new Error(`로컬 Codex 응답 파일을 읽지 못했습니다: ${getErrorMessage(error)}`));
          });
      });

      child.stdin.on('error', () => undefined);
      child.stdin.end(prompt);
    });
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function localCodexPlugin(): Plugin {
  return {
    name: 'gonggamtoon-local-codex',
    configureServer(server) {
      server.middlewares.use(localCodexMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(localCodexMiddleware());
    },
  };
}

function localCodexMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;

    if (!LOCAL_CODEX_PATHS.has(pathname)) {
      next();
      return;
    }

    void handleLocalCodexRequest(req, res, next);
  };
}

async function handleLocalCodexRequest(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction,
): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'POST 요청만 지원합니다.' });
    return;
  }

  try {
    const body = await readRequestBody(req);
    const payload: unknown = JSON.parse(body);

    if (!isLocalCodexPayload(payload) || !payload.prompt.trim()) {
      sendJson(res, 400, { error: '프롬프트가 비어 있습니다.' });
      return;
    }

    const model = payload.model || LOCAL_CODEX_DEFAULT_MODEL;
    if (!LOCAL_CODEX_MODELS.has(model)) {
      sendJson(res, 400, { error: '지원하지 않는 로컬 Codex 모델입니다.' });
      return;
    }

    const reasoningEffort = payload.reasoningEffort || LOCAL_CODEX_DEFAULT_REASONING_EFFORT;
    if (!LOCAL_CODEX_REASONING_EFFORTS.has(reasoningEffort)) {
      sendJson(res, 400, { error: '지원하지 않는 추론강도입니다.' });
      return;
    }

    const abortController = new AbortController();
    let responseFinished = false;

    res.on('finish', () => {
      responseFinished = true;
    });
    res.on('close', () => {
      if (!responseFinished) abortController.abort();
    });

    const text = await runCodexExec(payload.prompt, model, reasoningEffort, abortController.signal);
    sendJson(res, 200, {
      text,
      model,
      reasoningEffort,
    });
  } catch (error) {
    if (getErrorMessage(error) === 'REQUEST_TOO_LARGE') {
      sendJson(res, 413, { error: '요청 내용이 너무 큽니다.' });
      return;
    }

    if (error instanceof SyntaxError) {
      sendJson(res, 400, { error: '요청 형식이 올바르지 않습니다.' });
      return;
    }

    if (res.headersSent) {
      next(error);
      return;
    }

    sendJson(res, 500, { error: getErrorMessage(error) });
  }
}

export default defineConfig({
  plugins: [localCodexPlugin(), react(), tailwindcss()],
  base: '/gonggamtoon/',
});
