import * as SQLite from 'expo-sqlite';
import { Meal, DailySummary } from '../types';

const DB_NAME = 'calories.db';

let db: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<void> | null = null;

export async function initDatabase(): Promise<void> {
  if (db) return;
  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    db = await SQLite.openDatabaseAsync(DB_NAME);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        foodLabel TEXT NOT NULL,
        weightGram INTEGER NOT NULL,
        cooking TEXT NOT NULL,
        kcal INTEGER NOT NULL,
        imageUri TEXT,
        createdAt INTEGER NOT NULL
      );
    `);
  })();

  try {
    await initPromise;
  } finally {
    initPromise = null;
  }
}

async function ensureDatabase(): Promise<SQLite.SQLiteDatabase> {
  await initDatabase();
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export async function addMeal(
  foodLabel: string,
  weightGram: number,
  cooking: string,
  kcal: number,
  imageUri?: string
): Promise<number> {
  const database = await ensureDatabase();
  
  const result = await database.runAsync(
    'INSERT INTO meals (foodLabel, weightGram, cooking, kcal, imageUri, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    foodLabel,
    weightGram,
    cooking,
    kcal,
    imageUri || null,
    Date.now()
  );
  
  return result.lastInsertRowId;
}

export async function getAllMeals(): Promise<Meal[]> {
  const database = await ensureDatabase();

  const rows = await database.getAllAsync<Meal>(
    'SELECT * FROM meals ORDER BY createdAt DESC'
  );
  
  return rows;
}

export async function getMealsByDate(timestamp: number): Promise<Meal[]> {
  const database = await ensureDatabase();
  
  const startOfDay = new Date(timestamp).setHours(0, 0, 0, 0);
  const endOfDay = new Date(timestamp).setHours(23, 59, 59, 999);
  
  const rows = await database.getAllAsync<Meal>(
    'SELECT * FROM meals WHERE createdAt >= ? AND createdAt <= ? ORDER BY createdAt DESC',
    startOfDay,
    endOfDay
  );
  
  return rows;
}

export async function getTodayTotalKcal(): Promise<number> {
  const database = await ensureDatabase();
  
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const endOfDay = new Date().setHours(23, 59, 59, 999);
  
  const result = await database.getFirstAsync<{ total: number }>(
    'SELECT SUM(kcal) as total FROM meals WHERE createdAt >= ? AND createdAt <= ?',
    startOfDay,
    endOfDay
  );
  
  return result?.total || 0;
}

export async function deleteMeal(id: number): Promise<void> {
  const database = await ensureDatabase();

  await database.runAsync('DELETE FROM meals WHERE id = ?', id);
}

export async function getDailySummaries(days: number = 7): Promise<DailySummary[]> {
  const database = await ensureDatabase();
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);
  
  const rows = await database.getAllAsync<{ date: string; totalKcal: number; mealCount: number }>(
    `SELECT 
      date(createdAt / 1000, 'unixepoch', 'localtime') as date,
      SUM(kcal) as totalKcal,
      COUNT(*) as mealCount
    FROM meals 
    WHERE createdAt >= ?
    GROUP BY date
    ORDER BY date DESC`,
    startDate.getTime()
  );
  
  return rows;
}
