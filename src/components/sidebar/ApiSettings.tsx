import { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Trash2, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { providerModels } from '../../data/models';
import { clearAllApiKeys } from '../../utils/storage';
import { showToast } from '../common/Toast';
import type { ProviderType } from '../../types';

const PROVIDERS: { type: ProviderType; label: string; icon: string }[] = [
  { type: 'gemini', label: 'Gemini', icon: '🔮' },
  { type: 'openai', label: 'OpenAI', icon: '🤖' },
  { type: 'claude', label: 'Claude', icon: '🧠' },
];

export default function ApiSettings() {
  const [collapsed, setCollapsed] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { activeProvider, apiKeys, selectedModels, setActiveProvider, setApiKey, setSelectedModel } = useAppStore();

  const handleClearAll = () => {
    clearAllApiKeys();
    PROVIDERS.forEach((p) => setApiKey(p.type, ''));
    showToast('모든 API 키가 삭제되었습니다', 'info');
  };

  const models = providerModels[activeProvider];
  const currentKey = apiKeys[activeProvider];

  return (
    <div className="bg-primary-light/50 border border-primary/20 rounded-xl p-3 mb-4">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between text-sm font-bold text-primary-dark cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Zap className="w-4 h-4" />
          API 설정
        </span>
        {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {!collapsed && (
        <div className="mt-3 space-y-3">
          {/* Provider Tabs */}
          <div className="flex gap-1" role="radiogroup" aria-label="API Provider">
            {PROVIDERS.map((p) => (
              <button
                key={p.type}
                type="button"
                onClick={() => setActiveProvider(p.type)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  activeProvider === p.type
                    ? 'bg-primary text-white'
                    : 'bg-white/60 text-muted hover:bg-white'
                }`}
                role="radio"
                aria-checked={activeProvider === p.type}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          {/* Model Select */}
          <select
            value={selectedModels[activeProvider]}
            onChange={(e) => setSelectedModel(activeProvider, e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm"
            aria-label="모델 선택"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* API Key Input */}
          <div className="flex gap-1.5">
            <input
              type={showKey ? 'text' : 'password'}
              value={currentKey}
              onChange={(e) => setApiKey(activeProvider, e.target.value.trim())}
              placeholder={`${PROVIDERS.find((p) => p.type === activeProvider)?.label} API 키`}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                currentKey ? 'border-success bg-green-50' : 'border-border bg-white'
              }`}
              aria-label="API 키 입력"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="px-2.5 border border-border rounded-lg cursor-pointer hover:bg-white"
              aria-label={showKey ? 'API 키 숨기기' : 'API 키 보기'}
            >
              {showKey ? <EyeOff className="w-4 h-4 text-muted" /> : <Eye className="w-4 h-4 text-muted" />}
            </button>
          </div>

          {/* Warning + Clear */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted">API 키는 이 탭에서만 유효합니다</p>
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1 text-[10px] text-error cursor-pointer hover:underline"
            >
              <Trash2 className="w-3 h-3" />
              전체 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
