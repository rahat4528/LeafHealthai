import type { Lang } from "./i18n";

/**
 * Web Speech API utilities for multilingual voice input and text-to-speech output.
 * Specifically tuned for Bengali (bn-BD), Hindi (hi-IN), and English (en-US).
 */

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition,
  );
}

const BCP47_LANG_MAP: Record<Lang, string> = {
  en: "en-US",
  bn: "bn-BD",
  hi: "hi-IN",
};

/**
 * Speaks text in the specified language using SpeechSynthesis.
 * Returns a cancel function to stop playback.
 */
export function speakText(
  text: string,
  lang: Lang,
  onEnd?: () => void,
  onError?: (err: unknown) => void,
): () => void {
  if (!isSpeechSynthesisSupported()) {
    onEnd?.();
    return () => {};
  }

  try {
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[*_#`]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .trim();

    if (!cleanText) {
      onEnd?.();
      return () => {};
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = BCP47_LANG_MAP[lang] || "en-US";
    utterance.lang = targetLang;
    utterance.rate = 0.95; // Slightly slower for clarity in rural agronomy terms
    utterance.pitch = 1.0;

    // Pick best matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.startsWith(targetLang) || v.lang.startsWith(lang),
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => onEnd?.();
    utterance.onerror = (e) => {
      // In Chromium, 'canceled' error is normal when user hits stop
      if (e.error !== "canceled" && e.error !== "interrupted") {
        onError?.(e);
      }
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
      onEnd?.();
    };
  } catch (err) {
    onError?.(err);
    onEnd?.();
    return () => {};
  }
}

/**
 * Stops any active speech synthesis audio immediately.
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }
}

/**
 * Starts speech recognition for voice input.
 * Returns a cancel function.
 */
export function startVoiceRecognition(
  lang: Lang,
  onResult: (transcript: string) => void,
  onError?: (errorMsg: string) => void,
  onEnd?: () => void,
): () => void {
  if (!isSpeechRecognitionSupported()) {
    onError?.("Voice recognition not supported on this device/browser.");
    onEnd?.();
    return () => {};
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRec();

    recognition.lang = BCP47_LANG_MAP[lang] || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        onError?.(`Voice error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      onEnd?.();
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
    };
  } catch (err) {
    onError?.(`Unable to start voice input: ${String(err)}`);
    onEnd?.();
    return () => {};
  }
}
