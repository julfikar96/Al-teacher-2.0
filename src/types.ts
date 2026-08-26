export type ClassLevel =
  | 'Class 1'
  | 'Class 2'
  | 'Class 3'
  | 'Class 4'
  | 'Class 5'
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10';

export type SubjectId =
  | 'mathematics'
  | 'higher_mathematics'
  | 'science'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'bangla'
  | 'english'
  | 'ict'
  | 'bangladesh_global_studies'
  | 'general';

export interface SubjectInfo {
  id: SubjectId;
  nameEn: string;
  nameBn: string;
  classes: number[]; // e.g. [1,2,3,4,5,6,7,8,9,10]
  icon: string;
  color: string;
  topics: string[];
}

export type TeachingMode =
  | 'teacher'    // Standard Teacher: Understand -> Explain -> Demonstrate -> Practice -> Check
  | 'easy'       // Easy Mode: Simplified words, real life examples, smaller steps
  | 'math_step'  // Math Engine: Given -> Required -> Formula -> Solution -> Answer -> Check
  | 'science'    // Science Engine: Definition, Concept, Cause, Example, Real-life application
  | 'homework'   // Homework Mode: Hint -> Step 1 -> Guided solution (Full only when asked)
  | 'exam_prep'  // Exam Prep: Important topics, revision notes, model questions, traps
  | 'quiz';      // Interactive Quiz

export type LanguageMode = 'auto' | 'bn' | 'en';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  classLevel?: ClassLevel;
  subject?: SubjectId;
  mode?: TeachingMode;
  imageUrl?: string;
  isDemo?: boolean;
  error?: boolean;
  status?: 'sending' | 'complete' | 'error';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'challenge';
}

export interface QuizResult {
  totalQuestions: number;
  score: number;
  percentage: number;
  subject: SubjectId;
  classLevel: ClassLevel;
  timestamp: number;
  strongAreas: string[];
  weakAreas: string[];
}

export interface StudentProfile {
  name: string;
  classLevel: ClassLevel;
  preferredLanguage: LanguageMode;
  favoriteSubjects: SubjectId[];
  totalQuestionsAsked: number;
  quizzesCompleted: number;
  averageQuizScore: number;
  subjectProgress: Record<SubjectId, number>; // 0 to 100%
  weakTopics: string[];
  strongTopics: string[];
  recentQuizHistory: QuizResult[];
}

export type ApiProvider = 'gemini' | 'openai' | 'custom';

export interface ApiSettings {
  useCustomApi: boolean;
  provider: ApiProvider;
  apiKey: string;
  apiEndpoint: string;
  model: string;
  temperature: number;
  maxTokens: number;
  demoMode: boolean;
  thinkingBudget?: number;
}

export interface CurriculumChapter {
  id: string;
  titleBn: string;
  titleEn: string;
  classLevel: ClassLevel;
  subject: SubjectId;
  keyConcepts: string[];
  formulas?: string[];
  sampleQuestions: string[];
}
