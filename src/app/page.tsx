'use client';

import { useState } from 'react';
import AnkiGame from '@/components/AnkiGame';
import DeckSelect from '@/components/DeckSelect';
import { CARD_SETS } from '@/data/cards';
// import MusicNotes from '@/components/MusicNotes';

export default function Home() {
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);

  if (!selectedDeck) {
    return <DeckSelect onSelect={setSelectedDeck} />;
  }

  return (
    <AnkiGame
      cards={CARD_SETS[selectedDeck]}
      onBack={() => setSelectedDeck(null)}
    />
  );
}
