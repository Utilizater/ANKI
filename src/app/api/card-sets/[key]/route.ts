import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Card } from '@/types';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const name = decodeURIComponent(key);

    const db = await getDb();
    const set = await db.collection('card_sets').findOne({ name });

    if (!set) {
      return NextResponse.json({ error: 'Card set not found' }, { status: 404 });
    }

    return NextResponse.json(set.cards as Card[]);
  } catch (error) {
    console.error('Failed to fetch cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}
