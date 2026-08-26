import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  GraduationCap,
  User,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Lightbulb,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Binary,
} from 'lucide-react';
import { ChatMessage, ClassLevel, SubjectId } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onAskSimpler: (msg: string) => void;
  onAskMathStep: (msg: string) => void;
  onAskPracticeQuestion: (msg: string) => void;
  currentClass: ClassLevel;
  currentSubject: SubjectId;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  onAskSimpler,
  onAskMathStep,
  onAskPracticeQuestion,
  currentClass,
  currentSubject,
}) => {
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggleSpeech = (msg: ChatMessage) => {
    if (playingMessageId === msg.id) {
      stopSpeech();
      setPlayingMessageId(null);
    } else {
      setPlayingMessageId(msg.id);
      const success = speakText(msg.content, () => {
        setPlayingMessageId(null);
      });
      if (!success) {
        setPlayingMessageId(null);
      }
    }
  };

  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="chat-messages-scroll-area"
      className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6"
    >
      {messages.length === 0 ? (
        /* Empty State / Welcome Screen */
        <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center py-8 px-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome to Bangladesh AI Teacher
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md">
            I am your 24/7 smart tutor for <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentClass}</span>. Ask any question in Mathematics, Science, English, or Bangla based on the NCTB curriculum.
          </p>

          {/* Quick Starter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-6 text-left">
            <button
              onClick={() => onAskSimpler('Please explain fractions with intuitive real-life examples and visual analogies.')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all text-xs group shadow-2xs"
            >
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Explain Fractions Simply</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Understand fractions with everyday examples and step-by-step breakdown.
              </p>
            </button>

            <button
              onClick={() => onAskMathStep('Solve the linear equation 3x + 7 = 25 step-by-step with verification.')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all text-xs group shadow-2xs"
            >
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <Binary className="w-4 h-4 text-indigo-500" />
                <span>Solve Algebraic Equations</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Given, formula, step-by-step solution, and check verification.
              </p>
            </button>

            <button
              onClick={() => onAskSimpler('How does photosynthesis work and what is its balanced chemical equation?')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all text-xs group shadow-2xs"
            >
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span>Photosynthesis & Science</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Definition, balanced chemical reaction, and environmental significance.
              </p>
            </button>

            <button
              onClick={() => onAskSimpler('Explain the 3 most important rules of Right Form of Verbs with examples.')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all text-xs group shadow-2xs"
            >
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <HelpCircle className="w-4 h-4 text-sky-500" />
                <span>English Grammar Rules</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Tense, Subject-Verb Agreement, and common exam error avoidance.
              </p>
            </button>
          </div>
        </div>
      ) : (
        /* Message Feed */
        messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isPlaying = playingMessageId === msg.id;
          const isCopied = copiedId === msg.id;

          return (
            <div
              key={msg.id}
              id={`msg-${msg.id}`}
              className={`flex gap-3 sm:gap-4 max-w-4xl mx-auto ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                    : 'bg-indigo-600 text-white shadow-indigo-500/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`flex flex-col gap-1.5 max-w-[88%] sm:max-w-[84%] ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                {/* Meta details: Sender name & Mode badge */}
                <div className="flex items-center gap-2 px-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">
                    {isUser ? 'You (Student)' : 'Bangladesh AI Teacher'}
                  </span>
                  {msg.isDemo && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800 text-[10px]">
                      Demo Mode
                    </span>
                  )}
                  {msg.classLevel && (
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                      • {msg.classLevel}
                    </span>
                  )}
                </div>

                {/* Bubble Body */}
                <div
                  className={`rounded-2xl px-4 py-3.5 text-sm shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : msg.error
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800/80 rounded-tl-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 rounded-tl-xs'
                  }`}
                >
                  {/* Uploaded Image preview if user attached an image */}
                  {msg.imageUrl && (
                    <div className="mb-2.5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-sm shadow-xs">
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded problem"
                        className="w-full max-h-60 object-contain bg-slate-950/10"
                      />
                    </div>
                  )}

                  {/* Markdown formatted content with Math Latex */}
                  <div className="markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Assistant Toolbar for Voice & Smart Follow-ups */}
                {!isUser && !msg.error && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 px-1 text-xs">
                    {/* Read Aloud Button */}
                    <button
                      onClick={() => handleToggleSpeech(msg)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                        isPlaying
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isPlaying ? 'Stop Reading' : 'Listen to this explanation'}
                    >
                      {isPlaying ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{isPlaying ? 'Stop' : 'Read Aloud'}</span>
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(msg)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Copy explanation"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    {/* Quick Smart Follow-up Chips */}
                    <button
                      onClick={() => onAskSimpler(`Could you explain this part in simpler terms with intuitive real-world examples:\n\n${msg.content.slice(0, 150)}...`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/80 transition-colors"
                      title="Explain in simpler terms"
                    >
                      <Lightbulb className="w-3 h-3 text-amber-500" />
                      <span>Explain Simpler</span>
                    </button>

                    <button
                      onClick={() => onAskPracticeQuestion(`Please provide 1 practice question based on this topic for me to test my understanding.`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 transition-colors"
                      title="Give a practice question to test understanding"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>Give Practice Question</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Realistic Typing / Processing Indicator */}
      {isLoading && (
        <div className="flex gap-3 sm:gap-4 max-w-4xl mx-auto items-start">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl rounded-tl-xs px-4 py-3.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>AI Teacher is preparing a step-by-step explanation...</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
