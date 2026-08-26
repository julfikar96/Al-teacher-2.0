import { StudentProfile, ApiSettings, ChatMessage, ClassLevel, SubjectId, LanguageMode, TeachingMode } from '../types';

const PROFILE_KEY = 'bd_ai_teacher_profile';
const SETTINGS_KEY = 'bd_ai_teacher_settings';
const CHAT_KEY = 'bd_ai_teacher_chats';
const THEME_KEY = 'bd_ai_teacher_theme';
const LAST_STATE_KEY = 'bd_ai_teacher_last_state';

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Student',
  classLevel: 'Class 8',
  preferredLanguage: 'auto',
  favoriteSubjects: ['mathematics', 'science', 'english'],
  totalQuestionsAsked: 0,
  quizzesCompleted: 0,
  averageQuizScore: 0,
  subjectProgress: {
    mathematics: 65,
    higher_mathematics: 40,
    science: 70,
    physics: 60,
    chemistry: 55,
    biology: 65,
    bangla: 80,
    english: 75,
    ict: 85,
    bangladesh_global_studies: 70,
    general: 60,
  },
  weakTopics: ['Algebraic Equations', 'Voice Change'],
  strongTopics: ['Fractions', 'Photosynthesis', 'Tenses'],
  recentQuizHistory: [],
};

export const DEFAULT_SETTINGS: ApiSettings = {
  useCustomApi: false,
  provider: 'gemini',
  apiKey: '',
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gemini-3.7-flash',
  temperature: 0.7,
  maxTokens: 2048,
  demoMode: false,
  thinkingBudget: 0,
};

export interface LastAppState {
  classLevel: ClassLevel;
  subject: SubjectId;
  mode: TeachingMode;
  language: LanguageMode;
}

export const DEFAULT_APP_STATE: LastAppState = {
  classLevel: 'Class 8',
  subject: 'mathematics',
  mode: 'teacher',
  language: 'auto',
};

export function loadProfile(): StudentProfile {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
  } catch (e) {
    console.error('Error loading profile:', e);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function loadSettings(): ApiSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_SETTINGS;
    const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    if (!parsed.model || parsed.model.includes('3.6') || parsed.model.includes('2.0') || parsed.model.includes('1.5')) {
      parsed.model = 'gemini-3.7-flash';
    }
    return parsed;
  } catch (e) {
    console.error('Error loading settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ApiSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

export function loadChatHistory(): ChatMessage[] {
  try {
    const data = localStorage.getItem(CHAT_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading chat history:', e);
    return [];
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    // Only store recent 50 messages to keep local storage clean
    const trimmed = messages.slice(-50);
    localStorage.setItem(CHAT_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Error saving chat history:', e);
  }
}

export function clearChatHistory(): void {
  try {
    localStorage.removeItem(CHAT_KEY);
  } catch (e) {
    console.error('Error clearing chat history:', e);
  }
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'dark' || theme === 'light') return theme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Error saving theme:', e);
  }
}

export function loadLastState(): LastAppState {
  try {
    const data = localStorage.getItem(LAST_STATE_KEY);
    if (!data) return DEFAULT_APP_STATE;
    return { ...DEFAULT_APP_STATE, ...JSON.parse(data) };
  } catch {
    return DEFAULT_APP_STATE;
  }
}

export function saveLastState(state: LastAppState): void {
  try {
    localStorage.setItem(LAST_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving last state:', e);
  }
}
