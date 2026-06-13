'use client';

import { useState, useEffect } from 'react';
import { Card, CardState, GameState, FeedbackType } from '@/types';
import CardDisplay from './CardDisplay';
import AnswerInput from './AnswerInput';
import FeedbackDisplay from './FeedbackDisplay';
import GameComplete from './GameComplete';

interface AnkiGameProps {
  cards: Card[];
  deckName: string;
  onBack: () => void;
}

export default function AnkiGame({ cards, deckName, onBack }: AnkiGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    currentCardIndex: 0,
    isComplete: false,
  });
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mnemonicLoading, setMnemonicLoading] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    const initialCards: CardState[] = shuffledCards.map((card) => ({
      ...card,
      attemptsNeeded: 1,
      correctStreak: 0,
    }));

    setGameState({
      cards: initialCards,
      currentCardIndex: 0,
      isComplete: false,
    });
    setFeedback(null);
    setShowAnswer(false);
  };

  const getCurrentCard = (): CardState | null => {
    if (gameState.cards.length === 0) return null;
    return gameState.cards[gameState.currentCardIndex] || null;
  };

  const normalize = (s: string) =>
    s.trim().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const handleSubmitAnswer = (userAnswer: string) => {
    const currentCard = getCurrentCard();
    if (!currentCard) return;

    const isCorrect = normalize(userAnswer) === normalize(currentCard.correctAnswer);

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowAnswer(!isCorrect);

    if (isCorrect) {
      setTimeout(() => processAnswer(true), 2000);
    }
  };

  const handleNext = () => processAnswer(false);

  const handleGenerateMnemonic = async () => {
    const currentCard = getCurrentCard();
    if (!currentCard) return;

    setMnemonicLoading(true);
    try {
      const res = await fetch('/api/mnemonic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          deckName,
          question: currentCard.question,
          correctAnswer: currentCard.correctAnswer,
        }),
      });
      const { mnemonic } = await res.json();

      const updatedCards = [...gameState.cards];
      updatedCards[gameState.currentCardIndex] = {
        ...updatedCards[gameState.currentCardIndex],
        mnemonic,
      };
      setGameState({ ...gameState, cards: updatedCards });
    } finally {
      setMnemonicLoading(false);
    }
  };

  const processAnswer = (isCorrect: boolean) => {
    const currentCard = getCurrentCard();
    if (!currentCard) return;

    let updatedCards = [...gameState.cards];
    const currentIndex = gameState.currentCardIndex;

    if (isCorrect) {
      const newStreak = currentCard.correctStreak + 1;

      if (newStreak >= currentCard.attemptsNeeded) {
        updatedCards.splice(currentIndex, 1);
      } else {
        updatedCards[currentIndex] = { ...currentCard, correctStreak: newStreak };
        const card = updatedCards.splice(currentIndex, 1)[0];
        updatedCards.push(card);
      }
    } else {
      updatedCards[currentIndex] = { ...currentCard, attemptsNeeded: 3, correctStreak: 0 };
      const card = updatedCards.splice(currentIndex, 1)[0];
      updatedCards.push(card);
    }

    if (updatedCards.length === 0) {
      setGameState({ ...gameState, cards: updatedCards, isComplete: true });
    } else {
      const nextIndex = currentIndex >= updatedCards.length ? 0 : currentIndex;
      setGameState({ ...gameState, cards: updatedCards, currentCardIndex: nextIndex });
    }

    setFeedback(null);
    setShowAnswer(false);
  };

  if (gameState.isComplete) {
    return <GameComplete onRestart={initializeGame} onChangeDeck={onBack} />;
  }

  const currentCard = getCurrentCard();
  if (!currentCard) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-xl'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='w-full max-w-md'>
        {/* Progress indicator */}
        <div className='mb-6 text-center'>
          <p className='text-sm text-gray-600 mb-2'>
            Cards remaining: {gameState.cards.length}
          </p>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-indigo-600 h-2 rounded-full transition-all duration-300'
              style={{
                width: `${((cards.length - gameState.cards.length) / cards.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Card display */}
        <CardDisplay
          question={currentCard.question}
          correctAnswer={currentCard.correctAnswer}
          showAnswer={showAnswer}
          attemptsNeeded={currentCard.attemptsNeeded}
          correctStreak={currentCard.correctStreak}
        />

        {/* Feedback */}
        {feedback && <FeedbackDisplay type={feedback} />}

        {/* Answer input / Next button */}
        {feedback === 'incorrect' ? (
          <div className='flex flex-col gap-3'>
            {currentCard.mnemonic && (
              <div className='bg-amber-50 border border-amber-200 rounded-2xl p-4'>
                <p className='text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1'>
                  Мнемоника
                </p>
                <p className='text-amber-900 text-sm leading-relaxed'>
                  {currentCard.mnemonic}
                </p>
              </div>
            )}
            <button
              onClick={handleGenerateMnemonic}
              disabled={mnemonicLoading}
              className='w-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium py-3 rounded-2xl transition-colors disabled:opacity-50'>
              {mnemonicLoading
                ? 'Generating...'
                : currentCard.mnemonic
                  ? 'Regenerate mnemonic'
                  : 'Generate mnemonic'}
            </button>
            <button
              autoFocus
              onClick={handleNext}
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 rounded-2xl shadow-xl transition-colors'>
              Next →
            </button>
          </div>
        ) : (
          <AnswerInput
            onSubmit={handleSubmitAnswer}
            disabled={feedback !== null}
          />
        )}
      </div>
    </div>
  );
}
