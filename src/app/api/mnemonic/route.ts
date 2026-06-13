import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getDb } from '@/lib/mongodb';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { cardId, deckName, question, correctAnswer } = await req.json();

    const prompt = `Тебе дано испанское слово и его перевод.

Придумай короткую русскоязычную мнемонику для запоминания испанского слова.

Правила:
- Используй созвучие с русскими словами или известными понятиями.
- Создавай яркий и легко представимый образ.
- Объясни связь с переводом.
- Не более 1-2 предложений.
- Отвечай только мнемоникой.

Пример:
niño — мальчик

Мнемоника:
Маленький НИНДЗЯ оказался обычным мальчиком. НИНДЗЯ → niño → мальчик.

Слово:
${correctAnswer}

Перевод:
${question}`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const mnemonic =
      message.content[0].type === 'text' ? message.content[0].text.trim() : '';

    const db = await getDb();
    await db.collection('card_sets').updateOne(
      { name: deckName, 'cards.id': cardId },
      { $set: { 'cards.$.mnemonic': mnemonic } }
    );

    return NextResponse.json({ mnemonic });
  } catch (error) {
    console.error('Mnemonic generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate mnemonic' }, { status: 500 });
  }
}
