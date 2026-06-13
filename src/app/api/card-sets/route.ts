import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const sets = await db
      .collection('card_sets')
      .find({}, { projection: { name: 1, 'cards': 1 } })
      .toArray();

    const result = sets.map((s) => ({
      name: s.name as string,
      count: (s.cards as unknown[]).length,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch card sets:', error);
    return NextResponse.json({ error: 'Failed to fetch card sets' }, { status: 500 });
  }
}
