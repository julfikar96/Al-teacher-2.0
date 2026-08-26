import React from 'react';
import {
  Calculator,
  Sigma,
  Atom,
  Zap,
  FlaskConical,
  Dna,
  BookOpenText,
  Languages,
  Cpu,
  Globe,
  Sparkles,
} from 'lucide-react';
import { ALL_CLASSES, SUBJECTS } from '../data/curriculum';
import { ClassLevel, SubjectId } from '../types';

interface ClassSubjectBarProps {
  selectedClass: ClassLevel;
  onSelectClass: (c: ClassLevel) => void;
  selectedSubject: SubjectId;
  onSelectSubject: (s: SubjectId) => void;
  onSelectTopicChip?: (topic: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="w-3.5 h-3.5 shrink-0" />,
  Sigma: <Sigma className="w-3.5 h-3.5 shrink-0" />,
  Atom: <Atom className="w-3.5 h-3.5 shrink-0" />,
  Zap: <Zap className="w-3.5 h-3.5 shrink-0" />,
  FlaskConical: <FlaskConical className="w-3.5 h-3.5 shrink-0" />,
  Dna: <Dna className="w-3.5 h-3.5 shrink-0" />,
  BookOpenText: <BookOpenText className="w-3.5 h-3.5 shrink-0" />,
  Languages: <Languages className="w-3.5 h-3.5 shrink-0" />,
  Cpu: <Cpu className="w-3.5 h-3.5 shrink-0" />,
  Globe: <Globe className="w-3.5 h-3.5 shrink-0" />,
};

export const ClassSubjectBar: React.FC<ClassSubjectBarProps> = ({
  selectedClass,
  onSelectClass,
  selectedSubject,
  onSelectSubject,
  onSelectTopicChip,
}) => {
  const classNum = parseInt(selectedClass.replace('Class ', ''), 10) || 8;

  // Filter subjects valid for this class
  const availableSubjects = SUBJECTS.filter((s) => s.classes.includes(classNum));

  // Current active subject info
  const activeSubjectInfo = SUBJECTS.find((s) => s.id === selectedSubject) || availableSubjects[0];

  return (
    <div
      id="class-subject-bar"
      className="bg-white/90 dark:bg-slate-900/80 border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 py-2 transition-colors shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* Top row: Class Selector Pills + Subject Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Class Select: Horizontal scrollable pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
              <span>Grade / Class:</span>
            </span>
            {ALL_CLASSES.map((c) => {
              const isSelected = selectedClass === c;
              return (
                <button
                  key={c}
                  id={`btn-class-${c.toLowerCase().replace(' ', '-')}`}
                  onClick={() => onSelectClass(c)}
                  className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all whitespace-nowrap active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/60'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Academic Year Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>NCTB Curriculum 2026</span>
          </div>
        </div>

        {/* Bottom row: Subjects for this grade */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
            Subject:
          </span>
          {availableSubjects.map((subj) => {
            const isSelected = selectedSubject === subj.id;
            return (
              <button
                key={subj.id}
                id={`btn-subject-${subj.id}`}
                onClick={() => onSelectSubject(subj.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/60'
                }`}
              >
                <span className={`inline-flex items-center justify-center shrink-0 ${isSelected ? 'text-indigo-400 dark:text-indigo-600' : 'text-slate-500'}`}>
                  {ICON_MAP[subj.icon] || <Sparkles className="w-3.5 h-3.5 shrink-0" />}
                </span>
                <span>{subj.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Quick topic suggestion tags */}
        {activeSubjectInfo && activeSubjectInfo.topics.length > 0 && onSelectTopicChip && (
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-400 dark:text-slate-500 mr-0.5">Quick Topics:</span>
            {activeSubjectInfo.topics.slice(0, 6).map((topic) => (
              <button
                key={topic}
                onClick={() => onSelectTopicChip(topic)}
                className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200/90 dark:border-slate-800 transition-colors whitespace-nowrap shadow-2xs"
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
