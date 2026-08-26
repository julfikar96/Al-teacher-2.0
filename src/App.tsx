/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ClassSubjectBar } from './components/ClassSubjectBar';
import { ModeSelector } from './components/ModeSelector';
import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { InteractiveQuizModal } from './components/InteractiveQuizModal';
import { FormulaSheetModal } from './components/FormulaSheetModal';
import {
  ChatMessage,
  ClassLevel,
  SubjectId,
  TeachingMode,
  LanguageMode,
  StudentProfile,
  ApiSettings,
  QuizResult,
} from './types';
import {
  loadProfile,
  saveProfile,
  loadSettings,
  saveSettings,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
  loadTheme,
  saveTheme,
  loadLastState,
  saveLastState,
} from './utils/storage';
import { DEMO_RESPONSES } from './data/curriculum';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);
  const [settings, setSettings] = useState<ApiSettings>(loadSettings);
  const [lastState, setLastState] = useState(loadLastState);

  const [currentClass, setCurrentClass] = useState<ClassLevel>(lastState.classLevel || 'Class 8');
  const [currentSubject, setCurrentSubject] = useState<SubjectId>(lastState.subject || 'mathematics');
  const [currentMode, setCurrentMode] = useState<TeachingMode>(lastState.mode || 'teacher');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageMode>(lastState.language || 'auto');

  const [messages, setMessages] = useState<ChatMessage[]>(loadChatHistory);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isFormulaOpen, setIsFormulaOpen] = useState<boolean>(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = loadTheme();
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save chat history
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  // Save profile
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Save settings
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Save last app state
  useEffect(() => {
    saveLastState({
      classLevel: currentClass,
      subject: currentSubject,
      mode: currentMode,
      language: currentLanguage,
    });
  }, [currentClass, currentSubject, currentMode, currentLanguage]);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
  };

  const handleNewChat = () => {
    setMessages([]);
    clearChatHistory();
  };

  const handleClearChatHistory = () => {
    setMessages([]);
    clearChatHistory();
  };

  const handleSendMessage = async (text: string, imageBase64?: string) => {
    if (!text && !imageBase64) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      classLevel: currentClass,
      subject: currentSubject,
      mode: currentMode,
      imageUrl: imageBase64,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Update profile stats
    setProfile((prev) => ({
      ...prev,
      totalQuestionsAsked: prev.totalQuestionsAsked + 1,
    }));

    // Check if Demo Mode is explicitly active
    if (settings.demoMode) {
      setTimeout(() => {
        let demoText = DEMO_RESPONSES.algebra;
        const lower = text.toLowerCase();
        if (lower.includes('fraction') || lower.includes('ভগ্নাংশ')) {
          demoText = DEMO_RESPONSES.fraction;
        } else if (lower.includes('photo') || lower.includes('সালোকসংশ্লেষণ') || lower.includes('science')) {
          demoText = DEMO_RESPONSES.photosynthesis;
        } else if (lower.includes('grammar') || lower.includes('verb') || lower.includes('tense')) {
          demoText = DEMO_RESPONSES.grammar;
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: demoText,
          timestamp: Date.now(),
          classLevel: currentClass,
          subject: currentSubject,
          mode: currentMode,
          isDemo: true,
        };

        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
      }, 700);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          classLevel: currentClass,
          subject: currentSubject,
          mode: currentMode,
          language: currentLanguage,
          academicYear: '2026',
          history: messages.slice(-4),
          image: imageBase64,
          apiSettings: settings,
        }),
      });

      const data = await response.json();

      if (data.noKey) {
        // Friendly No-Key explanation message
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: `### ⚠️ AI API Key Not Connected

${data.message}

---

#### 💡 What you can do:
1. Click **Settings (⚙️)** in the top right.
2. Go to the **API Provider & Keys** tab and add your Gemini or OpenAI API key, or click **Test Connection**.
3. Or enable **Demo Mode** to immediately explore sample curriculum explanations, math steps, and quizzes offline.`,
          timestamp: Date.now(),
          classLevel: currentClass,
          subject: currentSubject,
          mode: currentMode,
          error: true,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else if (data.success && data.text) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.text,
          timestamp: Date.now(),
          classLevel: currentClass,
          subject: currentSubject,
          mode: currentMode,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.message || 'Server returned an invalid response.');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      // Fallback demo response if network/server failed, so user never gets a broken UI
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `### ⚠️ Temporary issue generating response\n\n${err?.message || 'Please check your internet connection or API settings and try again.'}`,
        timestamp: Date.now(),
        classLevel: currentClass,
        subject: currentSubject,
        mode: currentMode,
        error: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizCompleted = (result: QuizResult) => {
    setProfile((prev) => {
      const newCount = prev.quizzesCompleted + 1;
      const newAverage = Math.round(
        (prev.averageQuizScore * prev.quizzesCompleted + result.percentage) / newCount
      );

      const currentSubjScore = prev.subjectProgress[result.subject] || 60;
      const updatedSubjScore = Math.min(100, Math.round((currentSubjScore + result.percentage) / 2));

      return {
        ...prev,
        quizzesCompleted: newCount,
        averageQuizScore: newAverage,
        subjectProgress: {
          ...prev.subjectProgress,
          [result.subject]: updatedSubjScore,
        },
        recentQuizHistory: [result, ...prev.recentQuizHistory.slice(0, 9)],
      };
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors overflow-hidden">
      {/* 1. Header */}
      <Header
        currentClass={currentClass}
        language={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenFormula={() => setIsFormulaOpen(true)}
        studentName={profile.name}
      />

      {/* 2. Class & Subject Bar */}
      <ClassSubjectBar
        selectedClass={currentClass}
        onSelectClass={setCurrentClass}
        selectedSubject={currentSubject}
        onSelectSubject={setCurrentSubject}
        onSelectTopicChip={(topic) => {
          handleSendMessage(`Please explain ${topic} in clear, simple terms and provide a real-world example.`);
        }}
      />

      {/* 3. Teaching Mode Selector */}
      <ModeSelector
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onStartQuizModal={() => setIsQuizOpen(true)}
      />

      {/* 4. Chat Messages Scroll Area */}
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        onAskSimpler={(prompt) => {
          setCurrentMode('easy');
          handleSendMessage(prompt);
        }}
        onAskMathStep={(prompt) => {
          setCurrentMode('math_step');
          handleSendMessage(prompt);
        }}
        onAskPracticeQuestion={(prompt) => {
          handleSendMessage(prompt);
        }}
        currentClass={currentClass}
        currentSubject={currentSubject}
      />

      {/* 5. Chat Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        currentClass={currentClass}
        currentSubject={currentSubject}
      />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onClearChatHistory={handleClearChatHistory}
        currentClass={currentClass}
        onClassChange={setCurrentClass}
        currentSubject={currentSubject}
        onSubjectChange={setCurrentSubject}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
      />

      <InteractiveQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        currentClass={currentClass}
        currentSubject={currentSubject}
        apiSettings={settings}
        onQuizCompleted={handleQuizCompleted}
        onAskTeacherForHelp={(prompt) => {
          handleSendMessage(prompt);
        }}
      />

      <FormulaSheetModal
        isOpen={isFormulaOpen}
        onClose={() => setIsFormulaOpen(false)}
        currentClass={currentClass}
        currentSubject={currentSubject}
        onAskTopic={(prompt) => {
          handleSendMessage(prompt);
        }}
      />
    </div>
  );
}
