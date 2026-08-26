import React, { useState } from 'react';
import { BookMarked, X, Search, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { SAMPLE_CHAPTERS } from '../data/curriculum';
import { ClassLevel, SubjectId } from '../types';

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass: ClassLevel;
  currentSubject: SubjectId;
  onAskTopic: (topic: string) => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({
  isOpen,
  onClose,
  currentClass,
  currentSubject,
  onAskTopic,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const relevantChapters = SAMPLE_CHAPTERS.filter(
    (ch) =>
      ch.titleBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.keyConcepts.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      id="formula-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="formula-modal-container"
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                NCTB Formula Sheet & Revision Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key Formulas & Core Concepts ({currentClass})
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

        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search formula or chapter (e.g. Motion, Trigonometry, Photosynthesis)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {relevantChapters.length > 0 ? (
            relevantChapters.map((ch) => (
              <div
                key={ch.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {ch.titleEn}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {ch.classLevel} • {ch.subject}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onAskTopic(`Explain the core rules, definitions, and formulas for chapter: ${ch.titleEn}.`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold hover:bg-sky-100 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask AI Teacher</span>
                  </button>
                </div>

                {/* Formulas */}
                {ch.formulas && ch.formulas.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Formulas:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ch.formulas.map((f, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        >
                          <div className="markdown-body">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {`$$${f}$$`}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Concepts */}
                <div className="space-y-1 pt-1">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Key Concepts:
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5 list-disc pl-4">
                    {ch.keyConcepts.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400">
              No formulas or chapters found matching your search.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white dark:bg-slate-700 hover:bg-slate-700 font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
