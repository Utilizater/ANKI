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

    const systemPrompt = `You are an answer validation assistant for a U.S. Naturalization Test flashcard application.
Your task is to determine if the user's answer is semantically correct compared to the expected answer.

IMPORTANT: Be VERY LENIENT with civics answers. Accept partial answers, different phrasings, and equivalent meanings.

Guidelines:
- Accept answers that contain the core meaning, even if incomplete
- "six" is correct for "six years" (the number is the key information)
- "four" is correct for "four years"
- "two" is correct for "two years"
- "Congress" is correct for "The Congress" or "U.S. Congress"
- "President" is correct for "The President"
- Accept singular/plural variations: "state" = "states", "right" = "rights"
- Accept partial names: "Washington" = "George Washington"
- Accept abbreviations: "DC" = "Washington, D.C."
- Ignore case differences: "paris" = "Paris"
- Accept number words or digits: "4" = "four", "100" = "one hundred"
- For "name one" questions, accept any valid example even if different from the stored answer
- Accept semantically equivalent answers: "freedom of speech" = "free speech"

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
