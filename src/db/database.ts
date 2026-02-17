import * as SQLite from 'expo-sqlite';
import { Meal, DailySummary } from '../types';

const DB_NAME = 'calories.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
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
}

export async function addMeal(
  foodLabel: string,
  weightGram: number,
  cooking: string,
  kcal: number,
  imageUri?: string
): Promise<number> {
  if (!db) throw new Error('Database not initialized');
  
  const result = await db.runAsync(
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
  if (!db) throw new Error('Database not initialized');
  
  const rows = await db.getAllAsync<Meal>(
    'SELECT * FROM meals ORDER BY createdAt DESC'
  );
  
  return rows;
}

export async function getMealsByDate(timestamp: number): Promise<Meal[]> {
  if (!db) throw new Error('Database not initialized');
  
  const startOfDay = new Date(timestamp).setHours(0, 0, 0, 0);
  const endOfDay = new Date(timestamp).setHours(23, 59, 59, 999);
  
  const rows = await db.getAllAsync<Meal>(
    'SELECT * FROM meals WHERE createdAt >= ? AND createdAt <= ? ORDER BY createdAt DESC',
    startOfDay,
    endOfDay
  );
  
  return rows;
}

export async function getTodayTotalKcal(): Promise<number> {
  if (!db) throw new Error('Database not initialized');
  
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const endOfDay = new Date().setHours(23, 59, 59, 999);
  
  const result = await db.getFirstAsync<{ total: number }>(
    'SELECT SUM(kcal) as total FROM meals WHERE createdAt >= ? AND createdAt <= ?',
    startOfDay,
    endOfDay
  );
  
  return result?.total || 0;
}

export async function deleteMeal(id: number): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  
  await db.runAsync('DELETE FROM meals WHERE id = ?', id);
}

export async function getDailySummaries(days: number = 7): Promise<DailySummary[]> {
  if (!db) throw new Error('Database not initialized');
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);
  
  const rows = await db.getAllAsync<{ date: string; totalKcal: number; mealCount: number }>(
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
