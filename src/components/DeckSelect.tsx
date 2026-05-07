'use client';

import { CARD_SETS } from '@/data/cards';
import { BookOpen } from 'lucide-react';

interface DeckSelectProps {
  onSelect: (key: string) => void;
}

export default function DeckSelect({ onSelect }: DeckSelectProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <div className='bg-indigo-100 rounded-full p-4'>
              <BookOpen className='w-10 h-10 text-indigo-600' />
            </div>
          </div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Spanish Flashcards</h1>
          <p className='text-gray-500'>Choose a card set to practice</p>
        </div>

        <div className='flex flex-col gap-3'>
          {Object.entries(CARD_SETS).map(([key, cards]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className='bg-white rounded-2xl shadow-md p-5 flex items-center justify-between hover:shadow-lg hover:bg-indigo-50 transition-all text-left'>
              <span className='text-lg font-semibold text-gray-800'>{key}</span>
              <span className='text-sm text-gray-400'>{cards.length} cards</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
