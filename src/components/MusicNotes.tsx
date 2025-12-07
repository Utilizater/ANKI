'use client';

import { useState, useEffect, useRef } from 'react';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export default function MusicNotes() {
  const [currentNote, setCurrentNote] = useState('C');
  const [frequency, setFrequency] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomNote = () => {
    const randomIndex = Math.floor(Math.random() * NOTES.length);
    return NOTES[randomIndex];
  };

  const startPlaying = () => {
    setIsPlaying(true);
    setCurrentNote(getRandomNote());

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentNote(getRandomNote());
    }, frequency * 1000);
  };

  const stopPlaying = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value > 0 && value <= 10) {
      setFrequency(value);
      if (isPlaying) {
        stopPlaying();
        setTimeout(() => startPlaying(), 100);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className='flex flex-col h-screen bg-gradient-to-br from-purple-50 to-pink-100'>
      {/* Control Panel */}
      <div className='bg-white shadow-md p-4'>
        <div className='max-w-md mx-auto flex items-center gap-4'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Frequency (seconds)
            </label>
            <input
              type='number'
              min='0.5'
              max='10'
              step='0.5'
              value={frequency}
              onChange={handleFrequencyChange}
              className='w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500'
            />
          </div>
          <button
            onClick={isPlaying ? stopPlaying : startPlaying}
            className={`px-6 py-2 rounded-lg font-medium transition-colors mt-6 ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}>
            {isPlaying ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      {/* Note Display */}
      <div className='flex-1 flex items-center justify-center'>
        <div
          className={`text-[20rem] font-bold transition-all duration-300 ${
            isPlaying ? 'text-purple-600 animate-pulse' : 'text-gray-400'
          }`}>
          {currentNote}
        </div>
      </div>

      {/* Instructions */}
      {!isPlaying && (
        <div className='text-center pb-8 px-4'>
          <p className='text-gray-600 text-lg'>
            Set your frequency and click Start to begin learning music notes
          </p>
        </div>
      )}
    </div>
  );
}
