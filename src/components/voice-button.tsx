import { useEffect, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakText,
  startVoiceRecognition,
  stopSpeaking,
} from "@/lib/speech";

interface VoiceSpeakButtonProps {
  text: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  label?: string;
}

/**
 * Read Aloud button using Web Speech API text-to-speech.
 * Automatically falls back gracefully when speech synthesis is unavailable.
 */
export function VoiceSpeakButton({
  text,
  className = "",
  size = "sm",
  variant = "outline",
  label,
}: VoiceSpeakButtonProps) {
  const { lang, t } = useLang();
  const [speaking, setSpeaking] = useState(false);
  const supported = isSpeechSynthesisSupported();

  useEffect(() => {
    return () => {
      if (speaking) stopSpeaking();
    };
  }, [speaking]);

  if (!supported) return null;

  const toggleSpeech = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakText(
        text,
        lang,
        () => setSpeaking(false),
        () => {
          setSpeaking(false);
          toast.error("Audio playback encountered an issue.");
        },
      );
    }
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={toggleSpeech}
      className={`inline-flex items-center gap-1.5 transition-all ${
        speaking
          ? "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 animate-pulse font-semibold"
          : ""
      } ${className}`}
      aria-label={speaking ? t("stopReading") : t("readAloud")}
      title={speaking ? t("stopReading") : t("readAloud")}
    >
      {speaking ? (
        <>
          <VolumeX className="size-4 shrink-0 text-emerald-600" />
          <span>{label || t("stopReading")}</span>
        </>
      ) : (
        <>
          <Volume2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{label || t("readAloud")}</span>
        </>
      )}
    </Button>
  );
}

interface VoiceMicButtonProps {
  onResult: (transcript: string) => void;
  className?: string;
}

/**
 * Microphone voice search button using SpeechRecognition.
 */
export function VoiceMicButton({ onResult, className = "" }: VoiceMicButtonProps) {
  const { lang, t } = useLang();
  const [listening, setListening] = useState(false);
  const supported = isSpeechRecognitionSupported();

  const toggleListen = () => {
    if (!supported) {
      toast.info("Voice search is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (listening) {
      setListening(false);
    } else {
      setListening(true);
      toast.info(t("voiceListening"));
      startVoiceRecognition(
        lang,
        (transcript) => {
          onResult(transcript);
          setListening(false);
          toast.success(`Voice query: "${transcript}"`);
        },
        (err) => {
          setListening(false);
          toast.error(err);
        },
        () => {
          setListening(false);
        },
      );
    }
  };

  return (
    <Button
      type="button"
      size="icon"
      variant={listening ? "default" : "outline"}
      onClick={toggleListen}
      className={`size-9 shrink-0 transition-colors ${
        listening ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : ""
      } ${className}`}
      title={listening ? t("voiceListening") : t("voiceSearch")}
      aria-label={listening ? t("voiceListening") : t("voiceSearch")}
    >
      {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
    </Button>
  );
}
