'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

interface DeckMeta {
  name: string;
  count: number;
}

interface DeckSelectProps {
  onSelect: (key: string) => void;
}

export default function DeckSelect({ onSelect }: DeckSelectProps) {
  const [decks, setDecks] = useState<DeckMeta[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/card-sets')
      .then((r) => r.json())
      .then(setDecks)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-red-500'>Failed to load card sets.</p>
      </div>
    );
  }

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

        {decks.length === 0 ? (
          <div className='flex justify-center'>
            <div className='w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin' />
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {decks.map(({ name, count }) => (
              <button
                key={name}
                onClick={() => onSelect(name)}
                className='bg-white rounded-2xl shadow-md p-5 flex items-center justify-between hover:shadow-lg hover:bg-indigo-50 transition-all text-left'>
                <span className='text-lg font-semibold text-gray-800'>{name}</span>
                <span className='text-sm text-gray-400'>{count} cards</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
