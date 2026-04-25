import { Db, MongoClient } from "mongodb";
import { env } from "./env";

let client: MongoClient | null = null;
let db: Db | null = null;
let connectPromise: Promise<Db> | null = null;

const createClient = (): MongoClient => {
  return new MongoClient(env.MONGO_URI, {
    appName: "BOOKx-backend",
  });
};

const ensureUserIndexes = async (database: Db): Promise<void> => {
  const usersCollection = database.collection("users");

  await Promise.all([
    usersCollection.createIndex({ userID: 1 }, { unique: true }),
    usersCollection.createIndex({ email: 1 }, { unique: true }),
  ]);
};

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  if (connectPromise) {
    return connectPromise;
  }

  client = createClient();

  connectPromise = (async () => {
    await client!.connect();
    const connectedDb = client!.db(env.MONGO_DB_NAME);

    await ensureUserIndexes(connectedDb);

    db = connectedDb;

    console.log(`MongoDB connected to database: ${env.MONGO_DB_NAME}`);

    return connectedDb;
  })().catch((error) => {
    client = null;
    db = null;
    connectPromise = null;
    throw error;
  });

  return connectPromise;
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error("Database is not initialized. Call connectToDatabase first.");
  }

  return db;
};

export const closeDatabaseConnection = async (): Promise<void> => {
  if (!client) {
    return;
  }

  await client.close();
  client = null;
  db = null;
  connectPromise = null;

  console.log("MongoDB connection closed");
};
