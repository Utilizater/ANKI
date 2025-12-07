'use client';

import { useState } from 'react';
import AnkiGame from '@/components/AnkiGame';
import MusicNotes from '@/components/MusicNotes';
import { BookOpen, Music } from 'lucide-react';

type Tab = 'anki' | 'music';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('anki');

  return (
    <div className='min-h-screen'>
      {/* Tab Navigation */}
      <div className='bg-white shadow-md sticky top-0 z-50'>
        <div className='max-w-md mx-auto flex'>
          <button
            onClick={() => setActiveTab('anki')}
            className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'anki'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            <BookOpen className='w-5 h-5' />
            Anki Cards
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'music'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            <Music className='w-5 h-5' />
            Music Notes
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>{activeTab === 'anki' ? <AnkiGame /> : <MusicNotes />}</div>
    </div>
  );
}
