import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { CARDS } from '@/data/cards';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface FindSimilarRequest {
  currentQuestionId: string;
  currentQuestion: string;
}

interface FindSimilarResponse {
  similarCard: {
    id: string;
    question: string;
    correctAnswer: string;
  } | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: FindSimilarRequest = await request.json();
    const { currentQuestionId, currentQuestion } = body;

    if (!currentQuestionId || !currentQuestion) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get all cards except the current one
    const availableCards = CARDS.filter(
      (card) => card.id !== currentQuestionId
    );

    if (availableCards.length === 0) {
      // No other cards available, return null
      return NextResponse.json({ similarCard: null });
    }

    // Create a list of questions for the LLM to analyze
    const cardsList = availableCards
      .map((card, index) => `${index + 1}. [ID: ${card.id}] ${card.question}`)
      .join('\n');

    const systemPrompt = `You are a question similarity analyzer for a U.S. Naturalization Test flashcard application.
Your task is to find the most similar question to the one the user got wrong.

Guidelines for similarity:
- Questions about the same topic (e.g., both about the Constitution, both about Presidents, both about wars)
- Questions with related concepts (e.g., Declaration of Independence and Constitution)
- Questions about the same historical period
- Questions about the same branch of government
- Questions about similar rights or responsibilities

Respond ONLY with a valid JSON object in this exact format:
{"cardId": "ID"} where ID is the card ID of the most similar question

If no similar question is found, respond with:
{"cardId": null}

Do not include any other text, explanation, or formatting.`;

    const userPrompt = `The user got this question wrong:
"${currentQuestion}"

Here are the available questions to choose from:
${cardsList}

Which question is most similar to the one the user got wrong? Return the card ID.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 100,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    let result: { cardId: string | null };
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      // If parsing fails, return a random card as fallback
      const randomCard =
        availableCards[Math.floor(Math.random() * availableCards.length)];
      return NextResponse.json({
        similarCard: {
          id: randomCard.id,
          question: randomCard.question,
          correctAnswer: randomCard.correctAnswer,
        },
      });
    }

    // Find the card by ID
    let similarCard = null;
    if (result.cardId) {
      const foundCard = availableCards.find(
        (card) => card.id === result.cardId
      );
      if (foundCard) {
        similarCard = {
          id: foundCard.id,
          question: foundCard.question,
          correctAnswer: foundCard.correctAnswer,
        };
      }
    }

    // If no similar card found by LLM, return a random one
    if (!similarCard) {
      const randomCard =
        availableCards[Math.floor(Math.random() * availableCards.length)];
      similarCard = {
        id: randomCard.id,
        question: randomCard.question,
        correctAnswer: randomCard.correctAnswer,
      };
    }

    const response: FindSimilarResponse = {
      similarCard,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error finding similar question:', error);
    return NextResponse.json(
      { error: 'Failed to find similar question' },
      { status: 500 }
    );
  }
}
