import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { MongoClient } from 'mongodb';
import { CARD_SETS } from '../src/data/cards';

const uri = process.env.MONGO_DB_URI;
if (!uri) throw new Error('MONGO_DB_URI is not set');

const DB_NAME = 'anki';
const COLLECTION = 'card_sets';

async function seed() {
  const client = new MongoClient(uri!);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    for (const [name, cards] of Object.entries(CARD_SETS)) {
      const existing = await collection.findOne({ name });

      // Preserve existing mnemonics by card id
      const mergedCards = cards.map((card) => {
        const existingCard = existing?.cards?.find((c: { id: string }) => c.id === card.id);
        return existingCard?.mnemonic ? { ...card, mnemonic: existingCard.mnemonic } : card;
      });

      await collection.replaceOne(
        { name },
        { name, cards: mergedCards, createdAt: existing?.createdAt ?? new Date(), updatedAt: new Date() },
        { upsert: true }
      );

      console.log(`  - ${name} (${mergedCards.length} cards, ${mergedCards.filter((c) => c.mnemonic).length} mnemonics preserved)`);
    }
    console.log('Done.');
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
