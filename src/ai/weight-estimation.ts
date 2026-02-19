/**
 * Volume Estimation Utilities
 * 
 * Estimates food weight using reference object (credit card) detection.
 * This is a simplified implementation for Phase 2.
 */

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// Credit card standard dimensions (ISO/IEC 7810 ID-1)
export const CREDIT_CARD_WIDTH_MM = 85.6;
export const CREDIT_CARD_HEIGHT_MM = 53.98;
export const CREDIT_CARD_AREA_MM2 = CREDIT_CARD_WIDTH_MM * CREDIT_CARD_HEIGHT_MM; // ~4620 mm²

export interface WeightEstimation {
  weightGrams: number;
  confidence: number;
  method: 'reference' | 'typical' | 'manual';
}

export interface ReferenceObject {
  type: 'credit_card' | 'coin' | 'smartphone' | 'custom';
  widthMm: number;
  heightMm: number;
}

// Reference objects database
export const REFERENCE_OBJECTS: Record<string, ReferenceObject> = {
  credit_card: {
    type: 'credit_card',
    widthMm: CREDIT_CARD_WIDTH_MM,
    heightMm: CREDIT_CARD_HEIGHT_MM,
  },
  // Chinese 1 Yuan coin diameter: 25mm
  coin_1yuan: {
    type: 'coin',
    widthMm: 25,
    heightMm: 25,
  },
  // iPhone standard dimensions (approximate)
  smartphone: {
    type: 'smartphone',
    widthMm: 71.5,
    heightMm: 147.5,
  },
};

/**
 * Estimate food weight based on typical portion sizes
 * This is used when no reference object is available
 */
export function estimateTypicalWeight(foodName: string): number {
  // Typical portion sizes in grams
  const typicalWeights: Record<string, number> = {
    // 主食
    '米饭': 200,
    '白粥': 300,
    '面条(煮)': 200,
    '馒头': 100,
    '面包': 50,
    '饺子': 20, // per piece
    '包子': 80,
    '红薯': 150,
    '玉米': 100,
    
    // 肉类
    '鸡胸肉': 150,
    '猪肉(瘦)': 100,
    '猪肉(肥)': 100,
    '牛肉': 150,
    '羊肉': 150,
    '鸡腿': 150,
    '鱼肉': 150,
    '虾': 100,
    '鸡蛋': 50,
    '火腿肠': 50,
    
    // 蔬菜
    '青菜': 150,
    '西兰花': 100,
    '西红柿': 150,
    '黄瓜': 100,
    '胡萝卜': 80,
    '土豆': 150,
    '茄子': 150,
    '白菜': 200,
    '菠菜': 100,
    '蘑菇': 100,
    
    // 水果
    '苹果': 180,
    '香蕉': 120,
    '橙子': 180,
    '葡萄': 100,
    '西瓜': 300,
    '草莓': 100,
    '梨': 180,
    '桃子': 150,
    '猕猴桃': 80,
    '芒果': 200,
    
    // 饮品
    '牛奶': 250,
    '酸奶': 150,
    '可乐': 330,
    '果汁': 200,
    
    // 零食
    '巧克力': 50,
    '薯片': 50,
    '饼干': 30,
    '坚果': 30,
    '蛋糕': 100,
    '冰淇淋': 100,
  };

  return typicalWeights[foodName] || 150; // Default to 150g
}

/**
 * Calculate weight from area ratio
 * 
 * @param foodAreaPixels - Food area in pixels
 * @param referenceAreaPixels - Reference object area in pixels
 * @param referenceAreaMm2 - Reference object area in mm²
 * @param foodDensity - Food density in g/cm³
 * @param estimatedHeightMm - Estimated food height in mm
 */
export function calculateWeightFromArea(
  foodAreaPixels: number,
  referenceAreaPixels: number,
  referenceAreaMm2: number,
  foodDensity: number = 0.8,
  estimatedHeightMm: number = 30
): number {
  if (referenceAreaPixels <= 0 || foodAreaPixels <= 0) {
    return 0;
  }

  // Calculate scale: mm² per pixel
  const scaleMm2PerPixel = referenceAreaMm2 / referenceAreaPixels;
  
  // Calculate food area in mm²
  const foodAreaMm2 = foodAreaPixels * scaleMm2PerPixel;
  
  // Estimate volume (area × height)
  const volumeMm3 = foodAreaMm2 * estimatedHeightMm;
  
  // Convert to cm³ (1 cm³ = 1000 mm³)
  const volumeCm3 = volumeMm3 / 1000;
  
  // Calculate weight using density
  const weightGrams = volumeCm3 * foodDensity;
  
  return Math.round(weightGrams);
}

/**
 * Get food density from database
 */
export function getFoodDensity(foodName: string): number {
  const food = require('../data/foods').FOOD_DATABASE.find(
    (f: { name: string; density?: number }) => f.name === foodName
  );
  return food?.density || 0.8;
}

/**
 * Estimate weight using image analysis
 * This is a placeholder for more advanced implementation
 */
export async function estimateWeightFromImage(
  imageUri: string,
  foodName: string,
  referenceObject?: ReferenceObject
): Promise<WeightEstimation> {
  // For now, use typical portion sizes
  // TODO: Implement actual image analysis with object detection
  
  const typicalWeight = estimateTypicalWeight(foodName);
  
  return {
    weightGrams: typicalWeight,
    confidence: 0.6,
    method: 'typical',
  };
}

/**
 * Manual weight estimation helper
 * Calculates weight based on user-provided measurements
 */
export function calculateWeightFromDimensions(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  density: number = 0.8
): number {
  const volumeCm3 = lengthCm * widthCm * heightCm;
  const weightGrams = volumeCm3 * density;
  return Math.round(weightGrams);
}

/**
 * Weight adjustment suggestions based on food category
 */
export function getWeightSuggestions(foodName: string): number[] {
  const typical = estimateTypicalWeight(foodName);
  
  // Return a range of suggested weights around the typical portion
  return [
    Math.round(typical * 0.5),
    Math.round(typical * 0.75),
    typical,
    Math.round(typical * 1.25),
    Math.round(typical * 1.5),
  ].filter((w, i, arr) => arr.indexOf(w) === i); // Remove duplicates
}
