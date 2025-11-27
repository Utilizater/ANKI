import { Trophy } from 'lucide-react';

interface GameCompleteProps {
  onRestart: () => void;
}

export default function GameComplete({ onRestart }: GameCompleteProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-emerald-100'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center'>
        <div className='mb-6 flex justify-center'>
          <div className='bg-yellow-100 rounded-full p-6'>
            <Trophy className='w-16 h-16 text-yellow-600' />
          </div>
        </div>

        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
          Congratulations! 🎉
        </h1>

        <p className='text-lg text-gray-600 mb-8'>
          You've completed all the flashcards! Great job on your learning
          journey.
        </p>

        <button
          onClick={onRestart}
          className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg'>
          Start New Session
        </button>
      </div>
    </div>
  );
}
