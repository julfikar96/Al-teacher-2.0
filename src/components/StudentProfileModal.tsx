import React, { useState } from 'react';
import {
  User,
  X,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Save,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { StudentProfile, ClassLevel, LanguageMode, SubjectId } from '../types';
import { ALL_CLASSES, SUBJECTS } from '../data/curriculum';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (updated: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name || 'Student');
  const [classLevel, setClassLevel] = useState<ClassLevel>(profile.classLevel || 'Class 8');
  const [preferredLang, setPreferredLang] = useState<LanguageMode>(profile.preferredLanguage || 'auto');
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      ...profile,
      name,
      classLevel,
      preferredLanguage: preferredLang,
    });
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2000);
  };

  return (
    <div
      id="student-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="student-profile-modal-container"
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20">
              {name ? name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Student Profile & Progress
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Student Profile & Learning Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {isSavedAlert && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Profile information successfully saved!</span>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 text-center shadow-2xs">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Questions Solved</div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {profile.totalQuestionsAsked}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 text-center shadow-2xs">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Quizzes Completed</div>
              <div className="text-xl font-extrabold text-amber-500 mt-0.5">
                {profile.quizzesCompleted}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 text-center shadow-2xs">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Average Score</div>
              <div className="text-xl font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">
                {profile.averageQuizScore > 0 ? `${profile.averageQuizScore}%` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Edit Information Form */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class Level:
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {ALL_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c} (NCTB)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Language:
                </label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as LanguageMode)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="auto">Auto (Automatic Detection)</option>
                  <option value="bn">Bangla</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subject Mastery Progress Bars */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Subject Mastery</span>
            </h4>
            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-2xs">
              {[
                { name: 'Mathematics', score: profile.subjectProgress.mathematics || 70, color: 'bg-indigo-500' },
                { name: 'Science / Physics', score: profile.subjectProgress.science || 75, color: 'bg-teal-500' },
                { name: 'English', score: profile.subjectProgress.english || 65, color: 'bg-sky-500' },
                { name: 'Bangla', score: profile.subjectProgress.bangla || 80, color: 'bg-rose-500' },
                { name: 'ICT', score: profile.subjectProgress.ict || 85, color: 'bg-amber-500' },
              ].map((subj) => (
                <div key={subj.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span>{subj.name}</span>
                    <span className="font-bold">{subj.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className={`h-full ${subj.color} rounded-full transition-all duration-500`} style={{ width: `${subj.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strong and Weak Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Strong Areas</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {profile.strongTopics.map((t, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Needs Practice</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {profile.weakTopics.map((t, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-500/25 flex items-center gap-1.5 transition-colors active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
