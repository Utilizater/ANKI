'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export default function AnswerInput({ onSubmit, disabled }: AnswerInputProps) {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAnswer(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !disabled) {
      onSubmit(answer.trim());
      setAnswer('');
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(
        'Speech recognition is not supported in your browser. Please use Chrome or Edge.'
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setAnswer('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleMicPress = () => {
    if (!isVoiceMode) {
      setIsVoiceMode(true);
    }
    toggleRecording();
  };

  const handleTextModeClick = () => {
    setIsVoiceMode(false);
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className='bg-white rounded-2xl shadow-xl p-6'>
      {/* Mode toggle */}
      <div className='flex gap-2 mb-4'>
        <button
          type='button'
          onClick={handleTextModeClick}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            !isVoiceMode
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={disabled}>
          Text Mode
        </button>
        <button
          type='button'
          onClick={() => setIsVoiceMode(true)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            isVoiceMode
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={disabled}>
          Voice Mode
        </button>
      </div>

      {/* Input area */}
      {isVoiceMode ? (
        <div className='flex flex-col items-center gap-4'>
          <button
            type='button'
            onClick={handleMicPress}
            disabled={disabled}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isRecording ? (
              <MicOff className='w-10 h-10 text-white' />
            ) : (
              <Mic className='w-10 h-10 text-white' />
            )}
          </button>
          <p className='text-sm text-gray-600 text-center'>
            {isRecording ? 'Listening... Tap to stop' : 'Tap to speak'}
          </p>
          {answer && (
            <div className='w-full'>
              <p className='text-sm text-gray-600 mb-2'>Recognized text:</p>
              <div className='p-3 bg-gray-50 rounded-lg mb-3'>
                <p className='text-gray-800'>{answer}</p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={disabled}
                className='w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                Submit Answer
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='flex gap-2'>
          <input
            type='text'
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder='Type your answer...'
            disabled={disabled}
            className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed'
          />
          <button
            type='submit'
            disabled={disabled || !answer.trim()}
            className='bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
            <Send className='w-6 h-6' />
          </button>
        </form>
      )}
    </div>
  );
}
