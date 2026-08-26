import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Camera,
  Image as ImageIcon,
  Mic,
  MicOff,
  X,
  Sparkles,
  HelpCircle,
  Binary,
} from 'lucide-react';
import { ClassLevel, SubjectId } from '../types';
import { createSpeechRecognizer } from '../utils/speech';

interface ChatInputProps {
  onSendMessage: (text: string, imageBase64?: string) => void;
  isLoading: boolean;
  currentClass: ClassLevel;
  currentSubject: SubjectId;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  currentClass,
  currentSubject,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRecognizerRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputText]);

  // Setup speech recognition
  const handleToggleMic = () => {
    if (isRecording) {
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      },
      (err) => {
        console.warn('Speech error:', err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (!recognizer.isSupported) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    speechRecognizerRef.current = recognizer;
    recognizer.start();
    setIsRecording(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPEG, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    onSendMessage(inputText.trim(), selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestions based on subject
  const getSubjectSuggestions = () => {
    switch (currentSubject) {
      case 'mathematics':
      case 'higher_mathematics':
        return [
          'Solve the equation 3x + 7 = 25 step-by-step',
          'Explain Pythagorean theorem with intuitive proof',
          'What are the rules for adding and subtracting fractions?',
        ];
      case 'physics':
        return [
          'Explain Newton\'s three laws of motion with examples',
          'Derive and solve a problem using v = u + at',
          'What is the fundamental difference between work and energy?',
        ];
      case 'chemistry':
        return [
          'How do I find valency on the periodic table?',
          'Explain chemical bonding (ionic vs covalent) simply',
          'What is the concept of mole and Avogadro\'s number?',
        ];
      case 'biology':
      case 'science':
        return [
          'Explain photosynthesis with chemical equation and steps',
          'What are the 3 main differences between plant and animal cells?',
          'How does the human circulatory system work?',
        ];
      case 'bangla':
        return [
          'What is the difference between Sandhi and Samas?',
          'Easy technique to determine Karak and Vibhakti',
          'Explain the 5 essential Bangla spelling rules',
        ];
      case 'english':
        return [
          'Explain the rules for Right form of verbs simply',
          'Voice Change: Rules to convert Active to Passive',
          'How to easily remember Appropriate Prepositions?',
        ];
      case 'ict':
        return [
          'How to convert binary numbers to decimal numbers?',
          'What is internet security and cyber awareness?',
          'What is the difference between computer hardware and software?',
        ];
      default:
        return [
          'Summarize the key concepts of this chapter',
          'Provide 1 important model question with full solution',
          'How can I prepare effectively for exams?',
        ];
    }
  };

  const suggestions = getSubjectSuggestions();

  return (
    <div
      id="chat-input-container"
      className="bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 backdrop-blur-md transition-colors"
    >
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-semibold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Quick Questions:</span>
          </span>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sug);
                if (textareaRef.current) textareaRef.current.focus();
              }}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200/80 dark:border-slate-700/60 whitespace-nowrap transition-colors shadow-2xs font-medium"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Uploaded Image Thumbnail Preview */}
        {selectedImage && (
          <div className="relative inline-flex items-center p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <img
              src={selectedImage}
              alt="Attached problem"
              className="h-14 w-14 object-cover rounded-lg border border-indigo-200 dark:border-indigo-800"
            />
            <div className="ml-2.5 pr-6 text-xs">
              <p className="font-bold text-indigo-800 dark:text-indigo-200">
                Image Attached
              </p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                AI Teacher will analyze and solve this image
              </p>
            </div>
            <button
              onClick={handleRemoveImage}
              className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-white/80 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Box Row */}
        <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-2 border border-slate-200/90 dark:border-slate-700/80 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all shadow-2xs">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            id="file-upload-input"
          />

          {/* Photo / Camera Button */}
          <button
            id="btn-upload-photo"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0"
            title="Upload textbook photo, math problem, or homework diagram"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Voice Input Button */}
          <button
            id="btn-voice-input"
            type="button"
            onClick={handleToggleMic}
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/80 dark:hover:bg-slate-700'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Voice input (Speak your question)'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            id="chat-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type your question (${currentClass} - English / Bangla / Math)...`}
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent border-0 resize-none py-2 px-1 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none max-h-36 leading-relaxed"
          />

          {/* Send Button */}
          <button
            id="btn-send-message"
            type="button"
            onClick={handleSend}
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className={`p-2.5 rounded-xl font-bold flex items-center justify-center shrink-0 transition-all ${
              (!inputText.trim() && !selectedImage) || isLoading
                ? 'bg-slate-200 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 active:scale-95'
            }`}
            title="Send Question (Enter to send, Shift+Enter for new line)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footer info tip */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-2">
          <span>
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono border border-slate-200 dark:border-slate-700">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono border border-slate-200 dark:border-slate-700">Shift+Enter</kbd> for a new line.
          </span>
          <span className="hidden sm:inline">Aligned with NCTB National Curriculum</span>
        </div>
      </div>
    </div>
  );
};
