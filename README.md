# Anki Voice Cards

A mobile-first flashcard application with voice and text input modes, powered by Claude AI for intelligent answer validation.

## Features

- 📱 **Mobile-First Design** - Optimized for mobile devices
- 🎤 **Voice Mode** - Answer questions using speech recognition
- ⌨️ **Text Mode** - Traditional text input for answers
- 🤖 **AI-Powered Validation** - Claude Haiku validates answers with semantic understanding
- 🎯 **Smart Card System** - Cards require 3 correct answers before completion
- 📊 **Progress Tracking** - Visual feedback on your learning progress
- ✨ **Instant Feedback** - Know immediately if your answer is correct

## How It Works

1. **Card System**: Each card has a question and correct answer
2. **Answer Validation**: Your answers are validated by Claude AI, which understands semantic equivalence (e.g., "Paris" and "paris" are both correct)
3. **Progress Tracking**:
   - Correct answer on first try → Card removed from deck
   - Incorrect answer → Card marked to require 3 correct answers
   - Must answer correctly 3 times in a row to complete a marked card
4. **Voice Mode**: Uses browser's Web Speech API for real-time speech recognition
5. **Completion**: Game ends when all cards are mastered

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add your Anthropic API key to `.env.local`:

```
ANTHROPIC_API_KEY=your_api_key_here
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude Haiku 3.5
- **Icons**: Lucide React
- **Speech Recognition**: Web Speech API (browser-native)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── validate-answer/  # Claude AI answer validation
│   │   └── transcribe/        # Voice transcription endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AnkiGame.tsx          # Main game logic
│   ├── AnswerInput.tsx       # Text/Voice input component
│   ├── CardDisplay.tsx       # Card display component
│   ├── FeedbackDisplay.tsx   # Answer feedback UI
│   └── GameComplete.tsx      # Completion screen
├── data/
│   └── cards.ts              # Hardcoded flashcards
└── types/
    └── index.ts              # TypeScript interfaces
```

## Browser Compatibility

- **Voice Mode**: Requires Chrome, Edge, or Safari (Web Speech API support)
- **Text Mode**: Works in all modern browsers

## Future Enhancements

- Database integration for persistent card storage
- User accounts and progress tracking
- Custom card deck creation
- Spaced repetition algorithm
- Multi-language support
- Offline mode

## License

MIT
