import React from 'react';
import {
  GraduationCap,
  PlusCircle,
  Settings,
  Sun,
  Moon,
  Trophy,
  BookMarked,
  Languages,
  Sparkles,
} from 'lucide-react';
import { ClassLevel, LanguageMode } from '../types';

interface HeaderProps {
  currentClass: ClassLevel;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenQuiz: () => void;
  onOpenFormula: () => void;
  studentName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentClass,
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  onNewChat,
  onOpenSettings,
  onOpenProfile,
  onOpenQuiz,
  onOpenFormula,
  studentName,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
            <GraduationCap className="w-5 h-5" />
            <div
              className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
              title="NCTB AI Tutor Active"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                Bangladesh AI Teacher
              </h1>
              <div className="hidden sm:flex items-center bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{currentClass} • NCTB</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">
              Smart AI Tutor for Classes 1–10 • Mathematics & Science Assistant
            </p>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* New Chat Button */}
          <button
            id="btn-new-chat"
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl border border-indigo-200/80 dark:border-indigo-800/70 transition-all active:scale-95 shadow-xs"
            title="Start New Topic / Conversation"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Quick Quiz Shortcut */}
          <button
            id="btn-quick-quiz"
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-xl border border-amber-200/80 dark:border-amber-800/70 transition-all active:scale-95 shadow-xs"
            title="Start Interactive Quiz"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">Quiz Mode</span>
          </button>

          {/* Formula & Revision Shortcut */}
          <button
            id="btn-quick-formula"
            onClick={onOpenFormula}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 rounded-xl border border-sky-200/80 dark:border-sky-800/70 transition-all active:scale-95 shadow-xs"
            title="Quick Formula & Revision Sheet"
          >
            <BookMarked className="w-4 h-4 text-sky-500" />
            <span>Formulas</span>
          </button>

          {/* Language Selector */}
          <div className="relative inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-800 p-0.5 text-xs font-medium">
            <button
              id="btn-lang-auto"
              onClick={() => onLanguageChange('auto')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                language === 'auto'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Auto Detect Language"
            >
              <Languages className="w-3.5 h-3.5 inline mr-1 sm:mr-0" />
              <span className="hidden sm:inline">Auto</span>
            </button>
            <button
              id="btn-lang-bn"
              onClick={() => onLanguageChange('bn')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                language === 'bn'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Bangla Language"
            >
              BN
            </button>
            <button
              id="btn-lang-en"
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="English Language"
            >
              EN
            </button>
          </div>

          {/* Student Profile Button */}
          <button
            id="btn-profile"
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
            title="Student Profile & Progress"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-xs font-bold">
              {studentName ? studentName.charAt(0).toUpperCase() : 'S'}
            </div>
            <span className="hidden xl:inline max-w-[80px] truncate">{studentName || 'Student'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Settings Button */}
          <button
            id="btn-settings"
            onClick={onOpenSettings}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
            title="Settings & API Configuration"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
