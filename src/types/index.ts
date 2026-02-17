export interface Meal {
  id: number;
  foodLabel: string;
  weightGram: number;
  cooking: CookingMethod;
  kcal: number;
  imageUri?: string;
  createdAt: number;
}

export type CookingMethod = 'raw' | 'steamed' | 'fried' | 'deepFried';

export interface CookingOption {
  value: CookingMethod;
  label: string;
  multiplier: number;
}

export const COOKING_OPTIONS: CookingOption[] = [
  { value: 'raw', label: '生食', multiplier: 1.0 },
  { value: 'steamed', label: '清蒸', multiplier: 1.0 },
  { value: 'fried', label: '炒', multiplier: 1.15 },
  { value: 'deepFried', label: '油炸', multiplier: 1.45 },
];

export interface FoodItem {
  name: string;
  kcalPer100g: number;
  density?: number;
  category: string;
}

export interface DailySummary {
  date: string;
  totalKcal: number;
  mealCount: number;
}
