interface CardDisplayProps {
  question: string;
  correctAnswer: string;
  showAnswer: boolean;
  attemptsNeeded: number;
  correctStreak: number;
}

export default function CardDisplay({
  question,
  correctAnswer,
  showAnswer,
  attemptsNeeded,
  correctStreak,
}: CardDisplayProps) {
  return (
    <div className='bg-white rounded-2xl shadow-xl p-8 mb-6'>
      {/* Question */}
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Question</h2>
        <p className='text-xl text-gray-700'>{question}</p>
      </div>

      {/* Progress indicator for current card */}
      {attemptsNeeded > 0 && (
        <div className='mb-4'>
          <div className='flex items-center justify-between text-sm text-gray-600 mb-2'>
            <span>Progress on this card:</span>
            <span>
              {correctStreak} / {attemptsNeeded}
            </span>
          </div>
          <div className='flex gap-1'>
            {Array.from({ length: attemptsNeeded }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index < correctStreak ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show correct answer if needed */}
      {showAnswer && (
        <div className='mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg'>
          <p className='text-sm font-semibold text-red-800 mb-1'>
            Correct Answer:
          </p>
          <p className='text-lg text-red-900'>{correctAnswer}</p>
        </div>
      )}
    </div>
  );
}
