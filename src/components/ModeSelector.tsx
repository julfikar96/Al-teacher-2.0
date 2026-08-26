import React from 'react';
import {
  GraduationCap,
  Lightbulb,
  Binary,
  Microscope,
  HelpCircle,
  Award,
  Trophy,
} from 'lucide-react';
import { TeachingMode } from '../types';

interface ModeSelectorProps {
  currentMode: TeachingMode;
  onSelectMode: (mode: TeachingMode) => void;
  onStartQuizModal?: () => void;
}

interface ModeItem {
  id: TeachingMode;
  nameBn: string;
  nameEn: string;
  icon: React.ReactNode;
  color: string;
  desc: string;
}

const MODES: ModeItem[] = [
  {
    id: 'teacher',
    nameBn: 'Teacher Mode',
    nameEn: 'Teacher',
    icon: <GraduationCap className="w-4 h-4 shrink-0" />,
    color: 'text-indigo-600 dark:text-indigo-400',
    desc: 'Understand → Explain → Demonstrate → Practice',
  },
  {
    id: 'easy',
    nameBn: 'Easy Mode',
    nameEn: 'Easy Mode',
    icon: <Lightbulb className="w-4 h-4 shrink-0" />,
    color: 'text-amber-500',
    desc: 'Simple language, real-world analogies, and bite-sized steps',
  },
  {
    id: 'math_step',
    nameBn: 'Math Solver',
    nameEn: 'Math Solver',
    icon: <Binary className="w-4 h-4 shrink-0" />,
    color: 'text-indigo-600 dark:text-indigo-400',
    desc: 'Given → Required → Formula → Solution → Check',
  },
  {
    id: 'science',
    nameBn: 'Science Lab',
    nameEn: 'Science Lab',
    icon: <Microscope className="w-4 h-4 shrink-0" />,
    color: 'text-teal-600 dark:text-teal-400',
    desc: 'Definition, cause, process, and practical examples',
  },
  {
    id: 'homework',
    nameBn: 'Homework Guide',
    nameEn: 'Homework',
    icon: <HelpCircle className="w-4 h-4 shrink-0" />,
    color: 'text-sky-600 dark:text-sky-400',
    desc: 'Socratic guidance with formulas and hints instead of direct answers',
  },
  {
    id: 'exam_prep',
    nameBn: 'Exam Prep',
    nameEn: 'Exam Prep',
    icon: <Award className="w-4 h-4 shrink-0" />,
    color: 'text-rose-600 dark:text-rose-400',
    desc: 'High-yield chapters, creative questions, and revisions',
  },
  {
    id: 'quiz',
    nameBn: 'Quiz Mode',
    nameEn: 'Quiz Mode',
    icon: <Trophy className="w-4 h-4 shrink-0" />,
    color: 'text-amber-600 dark:text-amber-400',
    desc: 'Interactive multiple choice test and score analysis',
  },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  onStartQuizModal,
}) => {
  return (
    <div
      id="teaching-mode-selector"
      className="bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 py-2 transition-colors shadow-2xs"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
          Mode:
        </span>
        {MODES.map((mode) => {
          const isSelected = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              id={`btn-mode-${mode.id}`}
              onClick={() => {
                onSelectMode(mode.id);
                if (mode.id === 'quiz' && onStartQuizModal) {
                  onStartQuizModal();
                }
              }}
              title={mode.desc}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap active:scale-95 ${
                isSelected
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 shadow-xs ring-1 ring-indigo-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60'
              }`}
            >
              <span className={`inline-flex items-center justify-center shrink-0 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : mode.color}`}>
                {mode.icon}
              </span>
              <span>{mode.nameEn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
