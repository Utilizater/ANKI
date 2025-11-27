import { FeedbackType } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface FeedbackDisplayProps {
  type: FeedbackType;
}

export default function FeedbackDisplay({ type }: FeedbackDisplayProps) {
  if (!type) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
        type === 'correct'
          ? 'bg-green-100 border-2 border-green-300'
          : 'bg-red-100 border-2 border-red-300'
      }`}>
      {type === 'correct' ? (
        <>
          <CheckCircle className='w-8 h-8 text-green-600 flex-shrink-0' />
          <div>
            <p className='font-bold text-green-800 text-lg'>Correct! 🎉</p>
            <p className='text-green-700 text-sm'>Great job!</p>
          </div>
        </>
      ) : (
        <>
          <XCircle className='w-8 h-8 text-red-600 flex-shrink-0' />
          <div>
            <p className='font-bold text-red-800 text-lg'>Not quite right</p>
            <p className='text-red-700 text-sm'>Try again!</p>
          </div>
        </>
      )}
    </div>
  );
}
