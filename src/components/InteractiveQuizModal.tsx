import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  X,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { QuizQuestion, QuizResult, ClassLevel, SubjectId, ApiSettings } from '../types';
import { PRESET_QUIZZES } from '../data/curriculum';

interface InteractiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass: ClassLevel;
  currentSubject: SubjectId;
  apiSettings: ApiSettings;
  onQuizCompleted: (result: QuizResult) => void;
  onAskTeacherForHelp: (prompt: string) => void;
}

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({
  isOpen,
  onClose,
  currentClass,
  currentSubject,
  apiSettings,
  onQuizCompleted,
  onAskTeacherForHelp,
}) => {
  const [stage, setStage] = useState<'config' | 'quiz' | 'result'>('config');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'challenge'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(4);
  const [customTopic, setCustomTopic] = useState<string>('All Chapters (Overall Revision)');
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ questionIndex: number; selected: number; isCorrect: boolean }[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setStage('config');
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setUserAnswers([]);
    }
  }, [isOpen, currentSubject, currentClass]);

  if (!isOpen) return null;

  const handleStartQuiz = async () => {
    setIsGenerating(true);
    let quizList: QuizQuestion[] = [];

    // Try generating dynamic quiz if not in demo mode
    if (!apiSettings.demoMode) {
      try {
        const response = await fetch('/api/quiz-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classLevel: currentClass,
            subject: currentSubject,
            topic: customTopic,
            difficulty,
            count: questionCount,
            apiSettings,
          }),
        });
        const text = await response.text();
        const data = JSON.parse(text);
        if (data.success && data.questions && data.questions.length > 0) {
          quizList = data.questions;
        }
      } catch (err) {
        console.warn('Dynamic quiz generation error, using fallback:', err);
      }
    }

    // Fallback to presets if dynamic generation didn't return questions
    if (quizList.length === 0) {
      const subjectPresets = PRESET_QUIZZES[currentSubject] || PRESET_QUIZZES['mathematics'];
      quizList = subjectPresets.slice(0, questionCount);
    }

    setQuestions(quizList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setIsGenerating(false);
    setStage('quiz');
  };

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctIndex;

    setIsSubmitted(true);
    setUserAnswers((prev) => [
      ...prev,
      { questionIndex: currentIndex, selected: selectedOption, isCorrect },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Finished Quiz!
      const correctCount = userAnswers.filter((a) => a.isCorrect).length;
      const percentage = Math.round((correctCount / questions.length) * 100);

      // Trigger celebration confetti
      if (percentage >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      const strongAreas = [customTopic];
      const weakAreas = userAnswers.filter((a) => !a.isCorrect).map((a) => questions[a.questionIndex].topic || 'Topic');

      const result: QuizResult = {
        totalQuestions: questions.length,
        score: correctCount,
        percentage,
        subject: currentSubject,
        classLevel: currentClass,
        timestamp: Date.now(),
        strongAreas,
        weakAreas: Array.from(new Set(weakAreas)),
      };

      onQuizCompleted(result);
      setStage('result');
    }
  };

  const currentQ = questions[currentIndex];
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;

  return (
    <div
      id="quiz-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="quiz-modal-container"
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>NCTB Interactive Quiz & Assessment</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                  {currentClass}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Subject: <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{currentSubject.replace('_', ' ')}</span>
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {stage === 'config' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Topic / Chapter:
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Fractions, Photosynthesis, or Algebraic Equations"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Difficulty Level:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['easy', 'medium', 'hard', 'challenge'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        difficulty === diff
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {diff === 'easy' && 'Easy'}
                      {diff === 'medium' && 'Medium'}
                      {diff === 'hard' && 'Hard'}
                      {diff === 'challenge' && 'Challenge'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Number of Questions:
                </label>
                <div className="flex gap-2">
                  {[3, 4, 5, 8].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        questionCount === count
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleStartQuiz}
                  disabled={isGenerating}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Generating AI Questions...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Start Quiz</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {stage === 'quiz' && currentQ && (
            <div className="space-y-4">
              {/* Progress Bar & Counter */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Score: {correctCount}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                <div className="markdown-body font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {currentQ.question}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let optionStyle =
                    'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-800 dark:text-slate-200';

                  if (isSelected && !isSubmitted) {
                    optionStyle =
                      'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 dark:border-indigo-500 text-indigo-900 dark:text-indigo-200 font-semibold ring-2 ring-indigo-500/20';
                  }

                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle =
                        'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-500 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 border-red-500 font-bold';
                    } else {
                      optionStyle = 'opacity-50 border-slate-200 dark:border-slate-700';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs sm:text-sm transition-all active:scale-98 ${optionStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="markdown-body">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {opt}
                          </ReactMarkdown>
                        </span>
                      </div>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box on Submit */}
              {isSubmitted && (
                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
                    <HelpCircle className="w-4 h-4" />
                    <span>Explanation:</span>
                  </div>
                  <div className="markdown-body text-xs text-slate-700 dark:text-slate-300">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {currentQ.explanation}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Action Button: Submit or Next */}
              <div className="pt-2">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      selectedOption === null
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-98'
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 active:scale-98 shadow-xs"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {stage === 'result' && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center shadow-inner">
                <Award className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Quiz Completed!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentClass} • {currentSubject} • {customTopic}
                </p>
              </div>

              {/* Score Metric */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 max-w-sm mx-auto shadow-2xs">
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {correctCount} / {questions.length}
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                  Accuracy Rate: {Math.round((correctCount / questions.length) * 100)}%
                </p>
              </div>

              {/* Wrong Questions Action */}
              {userAnswers.some((a) => !a.isCorrect) && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-left text-xs max-w-md mx-auto shadow-2xs">
                  <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>Review Incorrect Questions</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mb-2">
                    Let the AI Teacher provide intuitive, step-by-step explanations for the questions you missed.
                  </p>
                  <button
                    onClick={() => {
                      const wrongQs = userAnswers
                        .filter((a) => !a.isCorrect)
                        .map((a) => `Question: ${questions[a.questionIndex].question}\nCorrect Answer: ${questions[a.questionIndex].options[questions[a.questionIndex].correctIndex]}`)
                        .join('\n\n');
                      onClose();
                      onAskTeacherForHelp(`I missed some questions on this quiz. Please explain the concepts and solutions step-by-step:\n\n${wrongQs}`);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors"
                  >
                    Explain Missed Questions with AI Teacher
                  </button>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 max-w-sm mx-auto pt-2">
                <button
                  onClick={() => setStage('config')}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try New Quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-500/20"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
