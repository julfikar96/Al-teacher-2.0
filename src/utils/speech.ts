// Web Speech API Integration for Text-to-Speech and Speech-to-Text

export function speakText(text: string, onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown symbols and LaTeX math tags for cleaner spoken audio
  const cleanedText = text
    .replace(/\$\$(.*?)\$\$/gs, ' equation ')
    .replace(/\$(.*?)\$/g, ' equation ')
    .replace(/[#*_`~>]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim();

  if (!cleanedText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanedText);

  // Detect Bengali characters in text
  const hasBengali = /[\u0980-\u09FF]/.test(cleanedText);

  const voices = window.speechSynthesis.getVoices();
  if (hasBengali) {
    utterance.lang = 'bn-BD';
    const bnVoice = voices.find((v) => v.lang.includes('bn') || v.lang.includes('BD'));
    if (bnVoice) utterance.voice = bnVoice;
  } else {
    utterance.lang = 'en-US';
    const enVoice = voices.find((v) => v.lang.startsWith('en') && !v.name.includes('Bad'));
    if (enVoice) utterance.voice = enVoice;
  }

  utterance.rate = 0.95; // slightly slower for educational clarity
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function createSpeechRecognizer(
  onResult: (transcript: string) => void,
  onError: (err: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void; isSupported: boolean } {
  if (typeof window === 'undefined') {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'bn-BD'; // Default to Bangla or English auto

  recognition.onresult = (event: any) => {
    const transcript = event.results?.[0]?.[0]?.transcript || '';
    if (transcript) {
      onResult(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    onError(event.error || 'Speech recognition error');
  };

  recognition.onend = () => {
    onEnd();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e: any) {
        console.warn('Recognition start error:', e);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e: any) {
        console.warn('Recognition stop error:', e);
      }
    },
    isSupported: true,
  };
}
