'use client';

import { useState } from 'react';
import AnkiGame from '@/components/AnkiGame';
import DeckSelect from '@/components/DeckSelect';
import { Card } from '@/types';
// import MusicNotes from '@/components/MusicNotes';

export default function Home() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectDeck = async (name: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/card-sets/${encodeURIComponent(name)}`);
      const data: Card[] = await res.json();
      setSelectedDeck(name);
      setCards(data);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedDeck(null);
    setCards(null);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (!selectedDeck || !cards) {
    return <DeckSelect onSelect={handleSelectDeck} />;
  }

  return <AnkiGame cards={cards} deckName={selectedDeck} onBack={handleBack} />;
}
