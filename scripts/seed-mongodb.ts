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

    const documents = Object.entries(CARD_SETS).map(([name, cards]) => ({
      name,
      cards,
      createdAt: new Date(),
    }));

    // Drop existing data and re-insert
    await collection.deleteMany({});
    const result = await collection.insertMany(documents);

    console.log(`Seeded ${result.insertedCount} card sets:`);
    documents.forEach((doc) => console.log(`  - ${doc.name} (${doc.cards.length} cards)`));
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
