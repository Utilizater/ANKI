'use client';

import { useState, useEffect } from 'react';
import { Card, CardState, GameState, FeedbackType } from '@/types';
import { CARDS } from '@/data/cards';
import CardDisplay from './CardDisplay';
import AnswerInput from './AnswerInput';
import FeedbackDisplay from './FeedbackDisplay';
import GameComplete from './GameComplete';

export default function AnkiGame() {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    currentCardIndex: 0,
    isComplete: false,
  });
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Shuffle cards and initialize state
    const shuffledCards = [...CARDS].sort(() => Math.random() - 0.5);
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

  const handleSubmitAnswer = async (userAnswer: string) => {
    const currentCard = getCurrentCard();
    if (!currentCard || isLoading) return;

    setIsLoading(true);
    setShowAnswer(false);

    try {
      const response = await fetch('/api/validate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswer,
          correctAnswer: currentCard.correctAnswer,
        }),
      });

      const data = await response.json();
      const isCorrect = data.isCorrect;

      setFeedback(isCorrect ? 'correct' : 'incorrect');
      setShowAnswer(!isCorrect);

      // Wait for user to see feedback (3 seconds for incorrect to see the answer)
      setTimeout(
        () => {
          processAnswer(isCorrect);
        },
        isCorrect ? 2000 : 3000
      );
    } catch (error) {
      console.error('Error validating answer:', error);
      setFeedback('incorrect');
      setIsLoading(false);
    }
  };

  const processAnswer = (isCorrect: boolean) => {
    const currentCard = getCurrentCard();
    if (!currentCard) return;

    let updatedCards = [...gameState.cards];
    const currentIndex = gameState.currentCardIndex;

    if (isCorrect) {
      // Increment correct streak
      const newStreak = currentCard.correctStreak + 1;

      if (newStreak >= currentCard.attemptsNeeded) {
        // Card completed - remove from array
        updatedCards.splice(currentIndex, 1);
      } else {
        // Update streak and move to end
        updatedCards[currentIndex] = {
          ...currentCard,
          correctStreak: newStreak,
        };
        // Move card to end of array
        const card = updatedCards.splice(currentIndex, 1)[0];
        updatedCards.push(card);
      }
    } else {
      // Reset streak and mark as needing 3 correct answers
      updatedCards[currentIndex] = {
        ...currentCard,
        attemptsNeeded: 3,
        correctStreak: 0,
      };
      // Move card to end of array
      const card = updatedCards.splice(currentIndex, 1)[0];
      updatedCards.push(card);
    }

    // Check if game is complete
    if (updatedCards.length === 0) {
      setGameState({
        ...gameState,
        cards: updatedCards,
        isComplete: true,
      });
    } else {
      // Move to next card (which is now at current index due to removal/rotation)
      const nextIndex = currentIndex >= updatedCards.length ? 0 : currentIndex;
      setGameState({
        ...gameState,
        cards: updatedCards,
        currentCardIndex: nextIndex,
      });
    }

    setFeedback(null);
    setShowAnswer(false);
    setIsLoading(false);
  };

  if (gameState.isComplete) {
    return <GameComplete onRestart={initializeGame} />;
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
                width: `${
                  ((CARDS.length - gameState.cards.length) / CARDS.length) * 100
                }%`,
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

        {/* Answer input */}
        <AnswerInput
          onSubmit={handleSubmitAnswer}
          disabled={isLoading || feedback !== null}
        />
      </div>
    </div>
  );
}
