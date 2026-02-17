import { FoodItem } from '../types';

// 常见食物热量表 (kcal/100g) 和密度 (g/cm³)
export const FOOD_DATABASE: FoodItem[] = [
  // 主食
  { name: '米饭', kcalPer100g: 130, density: 0.85, category: '主食' },
  { name: '白粥', kcalPer100g: 46, density: 1.0, category: '主食' },
  { name: '面条(煮)', kcalPer100g: 110, density: 0.9, category: '主食' },
  { name: '馒头', kcalPer100g: 223, density: 0.5, category: '主食' },
  { name: '面包', kcalPer100g: 265, density: 0.4, category: '主食' },
  { name: '饺子', kcalPer100g: 200, density: 0.8, category: '主食' },
  { name: '包子', kcalPer100g: 227, density: 0.6, category: '主食' },
  { name: '红薯', kcalPer100g: 86, density: 0.9, category: '主食' },
  { name: '玉米', kcalPer100g: 112, density: 0.7, category: '主食' },
  { name: '燕麦', kcalPer100g: 389, density: 0.4, category: '主食' },
  
  // 肉类
  { name: '鸡胸肉', kcalPer100g: 165, density: 1.05, category: '肉类' },
  { name: '猪肉(瘦)', kcalPer100g: 143, density: 1.1, category: '肉类' },
  { name: '猪肉(肥)', kcalPer100g: 393, density: 0.95, category: '肉类' },
  { name: '牛肉', kcalPer100g: 250, density: 1.05, category: '肉类' },
  { name: '羊肉', kcalPer100g: 294, density: 1.05, category: '肉类' },
  { name: '鸡腿', kcalPer100g: 215, density: 1.0, category: '肉类' },
  { name: '鱼肉', kcalPer100g: 206, density: 1.05, category: '肉类' },
  { name: '虾', kcalPer100g: 99, density: 0.95, category: '肉类' },
  { name: '鸡蛋', kcalPer100g: 155, density: 1.03, category: '肉类' },
  { name: '火腿肠', kcalPer100g: 212, density: 0.8, category: '肉类' },
  
  // 蔬菜
  { name: '青菜', kcalPer100g: 25, density: 0.3, category: '蔬菜' },
  { name: '西兰花', kcalPer100g: 34, density: 0.5, category: '蔬菜' },
  { name: '西红柿', kcalPer100g: 18, density: 0.95, category: '蔬菜' },
  { name: '黄瓜', kcalPer100g: 16, density: 0.9, category: '蔬菜' },
  { name: '胡萝卜', kcalPer100g: 41, density: 0.7, category: '蔬菜' },
  { name: '土豆', kcalPer100g: 77, density: 0.7, category: '蔬菜' },
  { name: '茄子', kcalPer100g: 25, density: 0.6, category: '蔬菜' },
  { name: '白菜', kcalPer100g: 20, density: 0.4, category: '蔬菜' },
  { name: '菠菜', kcalPer100g: 23, density: 0.3, category: '蔬菜' },
  { name: '蘑菇', kcalPer100g: 22, density: 0.4, category: '蔬菜' },
  
  // 水果
  { name: '苹果', kcalPer100g: 52, density: 0.8, category: '水果' },
  { name: '香蕉', kcalPer100g: 89, density: 0.9, category: '水果' },
  { name: '橙子', kcalPer100g: 47, density: 0.85, category: '水果' },
  { name: '葡萄', kcalPer100g: 69, density: 0.95, category: '水果' },
  { name: '西瓜', kcalPer100g: 30, density: 0.95, category: '水果' },
  { name: '草莓', kcalPer100g: 32, density: 0.6, category: '水果' },
  { name: '梨', kcalPer100g: 57, density: 0.85, category: '水果' },
  { name: '桃子', kcalPer100g: 39, density: 0.9, category: '水果' },
  { name: '猕猴桃', kcalPer100g: 61, density: 0.95, category: '水果' },
  { name: '芒果', kcalPer100g: 60, density: 0.9, category: '水果' },
  
  // 零食/饮品
  { name: '牛奶', kcalPer100g: 54, density: 1.03, category: '饮品' },
  { name: '酸奶', kcalPer100g: 72, density: 1.05, category: '饮品' },
  { name: '可乐', kcalPer100g: 42, density: 1.04, category: '饮品' },
  { name: '果汁', kcalPer100g: 45, density: 1.05, category: '饮品' },
  { name: '巧克力', kcalPer100g: 546, density: 1.3, category: '零食' },
  { name: '薯片', kcalPer100g: 536, density: 0.2, category: '零食' },
  { name: '饼干', kcalPer100g: 502, density: 0.5, category: '零食' },
  { name: '坚果', kcalPer100g: 607, density: 0.5, category: '零食' },
  { name: '蛋糕', kcalPer100g: 371, density: 0.5, category: '零食' },
  { name: '冰淇淋', kcalPer100g: 207, density: 0.9, category: '零食' },
];

export function getFoodByName(name: string): FoodItem | undefined {
  return FOOD_DATABASE.find(food => food.name === name);
}

export function searchFoods(query: string): FoodItem[] {
  if (!query) return FOOD_DATABASE;
  const lowerQuery = query.toLowerCase();
  return FOOD_DATABASE.filter(food => 
    food.name.toLowerCase().includes(lowerQuery)
  );
}

export function getFoodsByCategory(category: string): FoodItem[] {
  return FOOD_DATABASE.filter(food => food.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(FOOD_DATABASE.map(food => food.category))];
}

// 计算热量
export function calculateCalories(
  foodName: string, 
  weightGram: number, 
  cookingMultiplier: number
): number {
  const food = getFoodByName(foodName);
  if (!food) return 0;
  
  return Math.round((weightGram * food.kcalPer100g / 100) * cookingMultiplier);
}
