import React, { useState } from 'react';
import {
  Settings,
  X,
  Key,
  Cpu,
  Sliders,
  Database,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';
import { ApiSettings, ApiProvider, ClassLevel, LanguageMode, SubjectId } from '../types';
import { ALL_CLASSES, SUBJECTS } from '../data/curriculum';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSaveSettings: (updated: ApiSettings) => void;
  onClearChatHistory: () => void;
  currentClass: ClassLevel;
  onClassChange: (c: ClassLevel) => void;
  currentSubject: SubjectId;
  onSubjectChange: (s: SubjectId) => void;
  currentLanguage: LanguageMode;
  onLanguageChange: (l: LanguageMode) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onClearChatHistory,
  currentClass,
  onClassChange,
  currentSubject,
  onSubjectChange,
  currentLanguage,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'api' | 'ai' | 'data'>('general');
  const [localSettings, setLocalSettings] = useState<ApiSettings>({ ...settings });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testStatus, setTestStatus] = useState<{
    testing: boolean;
    success?: boolean;
    message?: string;
  }>({ testing: false });

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus({ testing: true });
    try {
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: localSettings.provider,
          apiKey: localSettings.apiKey,
          apiEndpoint: localSettings.apiEndpoint,
          model: localSettings.model,
        }),
      });

      const data = await response.json();
      setTestStatus({
        testing: false,
        success: data.success,
        message: data.message || (data.success ? 'API Connection Successful!' : 'Connection Failed.'),
      });
    } catch (err: any) {
      setTestStatus({
        testing: false,
        success: false,
        message: err?.message || 'Network error during connection test.',
      });
    }
  };

  const handleSaveAndClose = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="settings-modal-container"
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                App Settings & AI Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Settings & API Integration Hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200/90 dark:border-slate-800 px-5 bg-slate-50/70 dark:bg-slate-800/40 text-xs font-semibold overflow-x-auto scrollbar-none gap-1 pt-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2.5 px-3.5 border-b-2 transition-colors whitespace-nowrap rounded-t-lg ${
              activeTab === 'general'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold bg-white dark:bg-slate-900 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-2.5 px-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 rounded-t-lg ${
              activeTab === 'api'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold bg-white dark:bg-slate-900 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>API Provider & Keys</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-2.5 px-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 rounded-t-lg ${
              activeTab === 'ai'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold bg-white dark:bg-slate-900 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>AI Parameters</span>
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-2.5 px-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 rounded-t-lg ${
              activeTab === 'data'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold bg-white dark:bg-slate-900 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data & Reset</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default Class Level:
                </label>
                <select
                  value={currentClass}
                  onChange={(e) => onClassChange(e.target.value as ClassLevel)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {ALL_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c} (Bangladesh NCTB)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default Subject:
                </label>
                <select
                  value={currentSubject}
                  onChange={(e) => onSubjectChange(e.target.value as SubjectId)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year:
                </label>
                <input
                  type="text"
                  value="2026 (NCTB Aligned)"
                  disabled
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Language:
                </label>
                <select
                  value={currentLanguage}
                  onChange={(e) => onLanguageChange(e.target.value as LanguageMode)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="auto">Auto (Bangla / English Automatic Detection)</option>
                  <option value="bn">Bangla</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              {/* Notice regarding server vs custom key */}
              <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Server & Custom API Setup:</p>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
                    The app supports the default server Gemini API key or your own custom API key (Gemini / OpenAI / Custom). If you do not have an API key, you can enable Demo Mode.
                  </p>
                </div>
              </div>

              {/* Custom API Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Use Custom API Key
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Enable to provide your own Gemini or OpenAI API key
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.useCustomApi}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, useCustomApi: e.target.checked }))
                  }
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              {/* Demo Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>Demo Mode</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                      Offline Ready
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Uses curated preset answers and offline quizzes
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.demoMode}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, demoMode: e.target.checked }))
                  }
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {localSettings.useCustomApi && (
                <div className="space-y-3 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Provider:
                    </label>
                    <select
                      value={localSettings.provider}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          provider: e.target.value as ApiProvider,
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="gemini">Google Gemini API</option>
                      <option value="openai">OpenAI Compatible API</option>
                      <option value="custom">Custom API Endpoint</option>
                    </select>
                  </div>

                  {localSettings.provider !== 'gemini' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        API Endpoint URL:
                      </label>
                      <input
                        type="text"
                        value={localSettings.apiEndpoint}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, apiEndpoint: e.target.value }))
                        }
                        placeholder="https://api.openai.com/v1/chat/completions"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      API Key:
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={localSettings.apiKey}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, apiKey: e.target.value }))
                        }
                        placeholder="Paste your API key here (e.g. AIzaSy...)"
                        className="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Model Name:
                    </label>
                    <input
                      type="text"
                      value={localSettings.model}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({ ...prev, model: e.target.value }))
                      }
                      placeholder="gemini-3.7-flash"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Test Connection Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testStatus.testing}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-95"
                >
                  {testStatus.testing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing API connection...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Test API Connection</span>
                    </>
                  )}
                </button>

                {testStatus.message && (
                  <div
                    className={`mt-2.5 p-3 rounded-xl text-xs flex items-start gap-2 ${
                      testStatus.success
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    {testStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <span className="flex-1">{testStatus.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Parameters Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Temperature (Creativity vs Accuracy):</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {localSettings.temperature}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={localSettings.temperature}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      temperature: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.1 (Precise & Mathematical)</span>
                  <span>0.7 (Standard Teacher)</span>
                  <span>1.0 (Creative Explanations)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reasoning / Thinking Speed (Gemini):
                </label>
                <select
                  value={localSettings.thinkingBudget !== undefined ? localSettings.thinkingBudget : 0}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, thinkingBudget: parseInt(e.target.value, 10) }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="0">⚡ Ultra Fast (0 Thinking Budget - Instant Response)</option>
                  <option value="512">⚖️ Balanced (512 Thinking Budget - Fast with Light Reasoning)</option>
                  <option value="-1">🧠 Automatic (Dynamic Model Reasoning)</option>
                </select>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Setting to Ultra Fast disables internal thinking tokens for instant answer generation.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Max Output Tokens:
                </label>
                <select
                  value={localSettings.maxTokens}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, maxTokens: parseInt(e.target.value, 10) }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1024">1,024 Tokens (Concise Explanations)</option>
                  <option value="2048">2,048 Tokens (Standard Solutions)</option>
                  <option value="4096">4,096 Tokens (Full Chapter Notes & Practice Sets)</option>
                </select>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 shadow-2xs">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Clear Chat History
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Erase all messages from the current conversation and start fresh.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all chat history?')) {
                      onClearChatHistory();
                    }
                  }}
                  className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/60 dark:hover:bg-red-900/60 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Chat History</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 shadow-2xs">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Reset All Settings
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Restore all API configurations and preferences to their default states.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Do you want to reset all settings to defaults?')) {
                      setLocalSettings({
                        useCustomApi: false,
                        provider: 'gemini',
                        apiKey: '',
                        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
                        model: 'gemini-3.7-flash',
                        temperature: 0.7,
                        maxTokens: 2048,
                        demoMode: false,
                        thinkingBudget: 0,
                      });
                    }
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAndClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-500/25 transition-colors active:scale-95"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
