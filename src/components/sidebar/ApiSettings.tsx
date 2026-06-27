import { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Trash2, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { providerModels } from '../../data/models';
import { clearAllApiKeys } from '../../utils/storage';
import { showToast } from '../common/toastBus';
import type { ProviderType } from '../../types';

const PROVIDERS: { type: ProviderType; label: string; icon: string }[] = [
  { type: 'codex', label: 'Codex 로컬', icon: '⌘' },
  { type: 'gemini', label: 'Gemini', icon: '🔮' },
  { type: 'openai', label: 'OpenAI', icon: '🤖' },
  { type: 'claude', label: 'Claude', icon: '🧠' },
];

export default function ApiSettings() {
  const [collapsed, setCollapsed] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const { activeProvider, apiKeys, selectedModels, setActiveProvider, setApiKey, setSelectedModel } = useAppStore();

  const handleClearAll = () => {
    clearAllApiKeys();
    PROVIDERS.forEach((p) => setApiKey(p.type, ''));
    showToast('모든 API 키가 삭제되었습니다', 'info');
  };

  const models = providerModels[activeProvider];
  const currentKey = apiKeys[activeProvider];
  const currentProvider = PROVIDERS.find((p) => p.type === activeProvider);
  const isLocalCodex = activeProvider === 'codex';

  const keyFormatWarning = !isLocalCodex && currentKey && (
    (activeProvider === 'openai' && !currentKey.startsWith('sk-'))
    || (activeProvider === 'claude' && !currentKey.startsWith('sk-ant-'))
    || (activeProvider === 'gemini' && !currentKey.startsWith('AI'))
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between text-base font-bold text-text cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          AI 설정
          {collapsed && (currentKey || isLocalCodex) && (
            <span className="text-sm font-normal text-muted ml-2">
              {currentProvider?.icon} {currentProvider?.label} · {selectedModels[activeProvider]}
            </span>
          )}
        </span>
        {collapsed ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronUp className="w-5 h-5 text-muted" />}
      </button>

      {!collapsed && (
        <div className="mt-4 space-y-4">
          <div className="flex gap-2" role="radiogroup" aria-label="AI Provider">
            {PROVIDERS.map((p) => (
              <button
                key={p.type}
                type="button"
                onClick={() => setActiveProvider(p.type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all ${
                  activeProvider === p.type
                    ? 'bg-primary text-white shadow-[0_2px_8px_rgba(0,122,255,0.3)]'
                    : 'bg-surface text-muted hover:bg-surface/80'
                }`}
                role="radio"
                aria-checked={activeProvider === p.type}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          <select
            value={selectedModels[activeProvider]}
            onChange={(e) => setSelectedModel(activeProvider, e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-base shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:bg-card"
            aria-label="모델 선택"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {isLocalCodex ? (
            <div className="rounded-xl border border-success bg-green-50 px-4 py-3 text-sm text-text dark:bg-green-900/20">
              API 키 없이 이 PC의 Codex CLI를 사용합니다. 모델은 GPT-5.4, 추론 강도는 xhigh로 고정됩니다.
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={currentKey}
                onChange={(e) => setApiKey(activeProvider, e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentKey.trim()) setCollapsed(true);
                }}
                onBlur={() => {
                  if (currentKey.trim()) setCollapsed(true);
                }}
                placeholder={`${currentProvider?.label} API 키`}
                className={`flex-1 px-4 py-2.5 rounded-xl border text-base shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] ${
                  currentKey
                    ? keyFormatWarning
                      ? 'border-warning bg-orange-50 dark:bg-orange-900/20'
                      : 'border-success bg-green-50 dark:bg-green-900/20'
                    : 'border-border bg-white dark:bg-card'
                }`}
                aria-label="API 키 입력"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="px-3 border border-border rounded-xl cursor-pointer hover:bg-surface transition-colors"
                aria-label={showKey ? 'API 키 숨기기' : 'API 키 보기'}
              >
                {showKey ? <EyeOff className="w-5 h-5 text-muted" /> : <Eye className="w-5 h-5 text-muted" />}
              </button>
            </div>
          )}

          {keyFormatWarning && (
            <p className="text-xs text-warning">
              {activeProvider === 'openai' && '키가 sk-로 시작해야 합니다'}
              {activeProvider === 'claude' && '키가 sk-ant-로 시작해야 합니다'}
              {activeProvider === 'gemini' && '키가 AI로 시작해야 합니다'}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {isLocalCodex ? '로컬 Codex는 이 PC의 로그인 상태를 사용합니다' : 'API 키는 이 탭에서만 유효합니다'}
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1 text-sm text-error cursor-pointer hover:underline"
            >
              <Trash2 className="w-4 h-4" />
              API 키 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
