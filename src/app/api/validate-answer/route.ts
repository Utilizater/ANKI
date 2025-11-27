import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AnswerValidationRequest, AnswerValidationResponse } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body: AnswerValidationRequest = await request.json();
    const { userAnswer, correctAnswer } = body;

    if (!userAnswer || !correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an answer validation assistant for a flashcard application. 
Your task is to determine if the user's answer is semantically correct compared to the expected answer.
Be lenient with minor spelling mistakes, different phrasings, or equivalent answers.
For example:
- "Paris" and "paris" should be considered correct
- "4" and "four" should be considered correct
- "H2O" and "water" might be considered correct depending on context
- "William Shakespeare" and "Shakespeare" should be considered correct

Respond ONLY with a valid JSON object in this exact format:
{"isCorrect": true} or {"isCorrect": false}

Do not include any other text, explanation, or formatting.`;

    const userPrompt = `Expected answer: "${correctAnswer}"
User's answer: "${userAnswer}"

Is the user's answer correct?`;

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

    let validationResult: { isCorrect: boolean };
    try {
      validationResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      );
    }

    const response: AnswerValidationResponse = {
      isCorrect: validationResult.isCorrect,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error validating answer:', error);
    return NextResponse.json(
      { error: 'Failed to validate answer' },
      { status: 500 }
    );
  }
}
