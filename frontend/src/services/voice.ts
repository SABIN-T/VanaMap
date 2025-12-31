// Voice Input/Output Service using Web Speech API
import { useState, useEffect, useCallback } from 'react';

export interface VoiceRecognitionResult {
    transcript: string;
    confidence: number;
    isFinal: boolean;
}

export class VoiceService {
    private static recognition: any = null;
    private static synthesis: SpeechSynthesis | null = null;
    private static isListening: boolean = false;

    // Initialize speech recognition
    static initialize(): boolean {
        // Check browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error('Speech recognition not supported');
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }

        return true;
    }

    // Start listening
    static startListening(
        onResult: (result: VoiceRecognitionResult) => void,
        onError?: (error: string) => void,
        language: string = 'en-US'
    ): void {
        if (!this.recognition) {
            if (!this.initialize()) {
                onError?.('Speech recognition not supported in this browser');
                return;
            }
        }

        this.recognition.lang = language;

        this.recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const result = event.results[last];

            onResult({
                transcript: result[0].transcript,
                confidence: result[0].confidence,
                isFinal: result.isFinal
            });
        };

        this.recognition.onerror = (event: any) => {
            onError?.(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };

        try {
            this.recognition.start();
            this.isListening = true;
        } catch (error) {
            onError?.('Failed to start voice recognition');
        }
    }

    // Stop listening
    static stopListening(): void {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    // Check if currently listening
    static getIsListening(): boolean {
        return this.isListening;
    }

    // Speak text (Text-to-Speech)
    static speak(
        text: string,
        options?: {
            language?: string;
            rate?: number;
            pitch?: number;
            volume?: number;
            voice?: SpeechSynthesisVoice;
        }
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.synthesis) {
                reject('Speech synthesis not supported');
                return;
            }

            // Cancel any ongoing speech
            this.synthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Set options
            if (options?.language) utterance.lang = options.language;
            if (options?.rate) utterance.rate = options.rate;
            if (options?.pitch) utterance.pitch = options.pitch;
            if (options?.volume) utterance.volume = options.volume;
            if (options?.voice) utterance.voice = options.voice;

            utterance.onend = () => resolve();
            utterance.onerror = (error) => reject(error);

            this.synthesis.speak(utterance);
        });
    }

    // Stop speaking
    static stopSpeaking(): void {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }

    // Get available voices
    static getVoices(): SpeechSynthesisVoice[] {
        if (!this.synthesis) return [];
        return this.synthesis.getVoices();
    }

    // Get voices for specific language
    static getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
        return this.getVoices().filter(voice => voice.lang.startsWith(language));
    }

    // Get language code from language name
    static getLanguageCode(language: string): string {
        const languageCodes: { [key: string]: string } = {
            'english': 'en-US',
            'hindi': 'hi-IN',
            'bengali': 'bn-IN',
            'telugu': 'te-IN',
            'marathi': 'mr-IN',
            'tamil': 'ta-IN',
            'urdu': 'ur-IN',
            'gujarati': 'gu-IN',
            'kannada': 'kn-IN',
            'malayalam': 'ml-IN',
            'odia': 'or-IN',
            'punjabi': 'pa-IN',
            'spanish': 'es-ES',
            'french': 'fr-FR',
            'german': 'de-DE',
            'italian': 'it-IT',
            'portuguese': 'pt-PT',
            'russian': 'ru-RU',
            'japanese': 'ja-JP',
            'korean': 'ko-KR',
            'chinese': 'zh-CN',
            'arabic': 'ar-SA'
        };

        return languageCodes[language.toLowerCase()] || 'en-US';
    }

    // Check if browser supports speech recognition
    static isSupported(): boolean {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }

    // Check if browser supports speech synthesis
    static isSynthesisSupported(): boolean {
        return 'speechSynthesis' in window;
    }
}

// React Hook for Voice Input/Output
export function useVoice(language: string = 'en-US') {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsSupported(VoiceService.isSupported());
    }, []);

    const startListening = useCallback(() => {
        setError(null);
        setTranscript('');
        setInterimTranscript('');

        VoiceService.startListening(
            (result) => {
                if (result.isFinal) {
                    setTranscript(prev => prev + ' ' + result.transcript);
                    setInterimTranscript('');
                } else {
                    setInterimTranscript(result.transcript);
                }
            },
            (err) => {
                setError(err);
                setIsListening(false);
            },
            language
        );

        setIsListening(true);
    }, [language]);

    const stopListening = useCallback(() => {
        VoiceService.stopListening();
        setIsListening(false);
    }, []);

    const speak = useCallback(async (text: string, options?: any) => {
        setIsSpeaking(true);
        try {
            await VoiceService.speak(text, { ...options, language });
        } catch (err) {
            setError('Failed to speak text');
        } finally {
            setIsSpeaking(false);
        }
    }, [language]);

    const stopSpeaking = useCallback(() => {
        VoiceService.stopSpeaking();
        setIsSpeaking(false);
    }, []);

    return {
        isListening,
        isSpeaking,
        transcript: transcript.trim(),
        interimTranscript,
        error,
        isSupported,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        clearTranscript: () => setTranscript('')
    };
}
