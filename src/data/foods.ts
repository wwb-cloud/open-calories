import { FoodItem } from '../types';
export type { FoodItem } from '../types';

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

  // 主食（扩展）
  { name: '炒饭', kcalPer100g: 188, density: 0.85, category: '主食' },
  { name: '蛋炒饭', kcalPer100g: 194, density: 0.85, category: '主食' },
  { name: '炒面', kcalPer100g: 160, density: 0.9, category: '主食' },
  { name: '意面', kcalPer100g: 158, density: 0.9, category: '主食' },
  { name: '米粉', kcalPer100g: 109, density: 0.9, category: '主食' },
  { name: '河粉', kcalPer100g: 112, density: 0.9, category: '主食' },
  { name: '粉丝(煮)', kcalPer100g: 87, density: 0.95, category: '主食' },
  { name: '小米粥', kcalPer100g: 46, density: 1.0, category: '主食' },
  { name: '手抓饼', kcalPer100g: 306, density: 0.6, category: '主食' },
  { name: '烧麦', kcalPer100g: 210, density: 0.75, category: '主食' },
  { name: '馄饨', kcalPer100g: 170, density: 0.85, category: '主食' },
  { name: '米线', kcalPer100g: 102, density: 0.9, category: '主食' },

  // 肉类（扩展）
  { name: '鸡翅', kcalPer100g: 240, density: 1.0, category: '肉类' },
  { name: '鸡柳', kcalPer100g: 185, density: 1.0, category: '肉类' },
  { name: '鸡排', kcalPer100g: 224, density: 0.95, category: '肉类' },
  { name: '里脊肉', kcalPer100g: 155, density: 1.05, category: '肉类' },
  { name: '排骨', kcalPer100g: 278, density: 1.05, category: '肉类' },
  { name: '培根', kcalPer100g: 541, density: 0.95, category: '肉类' },
  { name: '午餐肉', kcalPer100g: 278, density: 0.95, category: '肉类' },
  { name: '鸭肉', kcalPer100g: 240, density: 1.0, category: '肉类' },
  { name: '鹅肉', kcalPer100g: 251, density: 1.0, category: '肉类' },
  { name: '牛腩', kcalPer100g: 332, density: 1.05, category: '肉类' },
  { name: '牛肉丸', kcalPer100g: 180, density: 1.0, category: '肉类' },

  // 海鲜（新增分类）
  { name: '三文鱼', kcalPer100g: 208, density: 1.0, category: '海鲜' },
  { name: '鳕鱼', kcalPer100g: 82, density: 1.0, category: '海鲜' },
  { name: '带鱼', kcalPer100g: 127, density: 1.0, category: '海鲜' },
  { name: '金枪鱼', kcalPer100g: 132, density: 1.0, category: '海鲜' },
  { name: '扇贝', kcalPer100g: 88, density: 0.95, category: '海鲜' },
  { name: '蛤蜊', kcalPer100g: 74, density: 1.0, category: '海鲜' },
  { name: '鱿鱼', kcalPer100g: 92, density: 0.95, category: '海鲜' },
  { name: '章鱼', kcalPer100g: 82, density: 0.95, category: '海鲜' },
  { name: '蟹肉', kcalPer100g: 103, density: 1.0, category: '海鲜' },

  // 蔬菜（扩展）
  { name: '生菜', kcalPer100g: 15, density: 0.25, category: '蔬菜' },
  { name: '芹菜', kcalPer100g: 16, density: 0.35, category: '蔬菜' },
  { name: '花菜', kcalPer100g: 25, density: 0.45, category: '蔬菜' },
  { name: '南瓜', kcalPer100g: 26, density: 0.75, category: '蔬菜' },
  { name: '冬瓜', kcalPer100g: 13, density: 0.85, category: '蔬菜' },
  { name: '西葫芦', kcalPer100g: 17, density: 0.8, category: '蔬菜' },
  { name: '豆角', kcalPer100g: 31, density: 0.6, category: '蔬菜' },
  { name: '莲藕', kcalPer100g: 74, density: 0.8, category: '蔬菜' },
  { name: '海带', kcalPer100g: 43, density: 0.8, category: '蔬菜' },
  { name: '木耳', kcalPer100g: 25, density: 0.35, category: '蔬菜' },

  // 豆制品（新增分类）
  { name: '豆腐', kcalPer100g: 76, density: 0.95, category: '豆制品' },
  { name: '北豆腐', kcalPer100g: 98, density: 1.0, category: '豆制品' },
  { name: '南豆腐', kcalPer100g: 57, density: 0.95, category: '豆制品' },
  { name: '豆干', kcalPer100g: 140, density: 1.0, category: '豆制品' },
  { name: '腐竹', kcalPer100g: 457, density: 0.45, category: '豆制品' },
  { name: '豆浆', kcalPer100g: 31, density: 1.0, category: '豆制品' },

  // 水果（扩展）
  { name: '蓝莓', kcalPer100g: 57, density: 0.7, category: '水果' },
  { name: '樱桃', kcalPer100g: 63, density: 0.8, category: '水果' },
  { name: '菠萝', kcalPer100g: 50, density: 0.85, category: '水果' },
  { name: '火龙果', kcalPer100g: 60, density: 0.85, category: '水果' },
  { name: '柚子', kcalPer100g: 38, density: 0.85, category: '水果' },
  { name: '哈密瓜', kcalPer100g: 34, density: 0.9, category: '水果' },
  { name: '荔枝', kcalPer100g: 66, density: 0.9, category: '水果' },
  { name: '榴莲', kcalPer100g: 147, density: 0.9, category: '水果' },

  // 饮品（扩展）
  { name: '豆奶', kcalPer100g: 45, density: 1.02, category: '饮品' },
  { name: '奶茶', kcalPer100g: 75, density: 1.03, category: '饮品' },
  { name: '拿铁', kcalPer100g: 49, density: 1.02, category: '饮品' },
  { name: '美式咖啡', kcalPer100g: 2, density: 1.0, category: '饮品' },
  { name: '绿茶', kcalPer100g: 1, density: 1.0, category: '饮品' },
  { name: '椰汁', kcalPer100g: 51, density: 1.02, category: '饮品' },

  // 零食（扩展）
  { name: '爆米花', kcalPer100g: 387, density: 0.25, category: '零食' },
  { name: '蛋挞', kcalPer100g: 367, density: 0.55, category: '零食' },
  { name: '甜甜圈', kcalPer100g: 452, density: 0.45, category: '零食' },
  { name: '曲奇', kcalPer100g: 488, density: 0.5, category: '零食' },
  { name: '威化饼', kcalPer100g: 502, density: 0.45, category: '零食' },
  { name: '能量棒', kcalPer100g: 420, density: 0.6, category: '零食' },

  // 主食（继续扩充）
  { name: '糙米饭', kcalPer100g: 112, density: 0.85, category: '主食' },
  { name: '紫米饭', kcalPer100g: 150, density: 0.85, category: '主食' },
  { name: '乌冬面', kcalPer100g: 126, density: 0.9, category: '主食' },
  { name: '荞麦面', kcalPer100g: 99, density: 0.9, category: '主食' },
  { name: '年糕', kcalPer100g: 154, density: 0.95, category: '主食' },
  { name: '寿司', kcalPer100g: 145, density: 0.9, category: '主食' },
  { name: '煎饼果子', kcalPer100g: 215, density: 0.65, category: '主食' },
  { name: '肉夹馍', kcalPer100g: 295, density: 0.7, category: '主食' },
  { name: '炒河粉', kcalPer100g: 168, density: 0.9, category: '主食' },
  { name: '盖浇饭', kcalPer100g: 175, density: 0.85, category: '主食' },

  // 肉类（继续扩充）
  { name: '牛排', kcalPer100g: 271, density: 1.05, category: '肉类' },
  { name: '猪里脊', kcalPer100g: 150, density: 1.05, category: '肉类' },
  { name: '猪蹄', kcalPer100g: 260, density: 1.0, category: '肉类' },
  { name: '鸡爪', kcalPer100g: 254, density: 0.95, category: '肉类' },
  { name: '鸡胗', kcalPer100g: 118, density: 1.05, category: '肉类' },
  { name: '牛肚', kcalPer100g: 95, density: 1.05, category: '肉类' },
  { name: '牛筋', kcalPer100g: 151, density: 1.05, category: '肉类' },
  { name: '烤鸭', kcalPer100g: 337, density: 0.95, category: '肉类' },
  { name: '叉烧', kcalPer100g: 279, density: 1.0, category: '肉类' },

  // 海鲜（继续扩充）
  { name: '虾仁', kcalPer100g: 99, density: 0.95, category: '海鲜' },
  { name: '海参', kcalPer100g: 78, density: 1.0, category: '海鲜' },
  { name: '生蚝', kcalPer100g: 68, density: 1.0, category: '海鲜' },
  { name: '小龙虾', kcalPer100g: 93, density: 0.95, category: '海鲜' },
  { name: '鲈鱼', kcalPer100g: 105, density: 1.0, category: '海鲜' },
  { name: '黄花鱼', kcalPer100g: 99, density: 1.0, category: '海鲜' },

  // 蔬菜（继续扩充）
  { name: '西芹', kcalPer100g: 14, density: 0.35, category: '蔬菜' },
  { name: '苦瓜', kcalPer100g: 19, density: 0.65, category: '蔬菜' },
  { name: '蒜苔', kcalPer100g: 61, density: 0.6, category: '蔬菜' },
  { name: '西洋菜', kcalPer100g: 11, density: 0.3, category: '蔬菜' },
  { name: '紫甘蓝', kcalPer100g: 31, density: 0.4, category: '蔬菜' },
  { name: '娃娃菜', kcalPer100g: 13, density: 0.35, category: '蔬菜' },
  { name: '芦笋', kcalPer100g: 20, density: 0.45, category: '蔬菜' },
  { name: '秋葵', kcalPer100g: 33, density: 0.55, category: '蔬菜' },

  // 豆制品（继续扩充）
  { name: '豆腐皮', kcalPer100g: 262, density: 0.55, category: '豆制品' },
  { name: '千页豆腐', kcalPer100g: 180, density: 0.95, category: '豆制品' },
  { name: '素鸡', kcalPer100g: 194, density: 1.0, category: '豆制品' },
  { name: '豆腐泡', kcalPer100g: 245, density: 0.5, category: '豆制品' },

  // 水果（继续扩充）
  { name: '石榴', kcalPer100g: 83, density: 0.85, category: '水果' },
  { name: '山竹', kcalPer100g: 73, density: 0.85, category: '水果' },
  { name: '杨梅', kcalPer100g: 30, density: 0.85, category: '水果' },
  { name: '木瓜', kcalPer100g: 43, density: 0.85, category: '水果' },
  { name: '柠檬', kcalPer100g: 29, density: 0.9, category: '水果' },
  { name: '李子', kcalPer100g: 46, density: 0.9, category: '水果' },

  // 饮品（继续扩充）
  { name: '苏打水', kcalPer100g: 0, density: 1.0, category: '饮品' },
  { name: '无糖可乐', kcalPer100g: 0, density: 1.0, category: '饮品' },
  { name: '红茶', kcalPer100g: 1, density: 1.0, category: '饮品' },
  { name: '乌龙茶', kcalPer100g: 1, density: 1.0, category: '饮品' },
  { name: '酸梅汤', kcalPer100g: 38, density: 1.02, category: '饮品' },
  { name: '鲜榨橙汁', kcalPer100g: 45, density: 1.04, category: '饮品' },

  // 零食（继续扩充）
  { name: '海苔', kcalPer100g: 330, density: 0.2, category: '零食' },
  { name: '牛肉干', kcalPer100g: 445, density: 0.65, category: '零食' },
  { name: '瓜子', kcalPer100g: 597, density: 0.45, category: '零食' },
  { name: '开心果', kcalPer100g: 562, density: 0.5, category: '零食' },
  { name: '花生米', kcalPer100g: 567, density: 0.55, category: '零食' },
  { name: '瑞士卷', kcalPer100g: 333, density: 0.5, category: '零食' },

  // 汤类（新增分类）
  { name: '紫菜蛋花汤', kcalPer100g: 22, density: 1.0, category: '汤类' },
  { name: '番茄蛋汤', kcalPer100g: 26, density: 1.0, category: '汤类' },
  { name: '玉米浓汤', kcalPer100g: 64, density: 1.02, category: '汤类' },
  { name: '排骨汤', kcalPer100g: 52, density: 1.01, category: '汤类' },
  { name: '菌菇汤', kcalPer100g: 18, density: 1.0, category: '汤类' },

  // 快餐/轻食
  { name: '披萨', kcalPer100g: 266, density: 0.6, category: '主食' },
  { name: '汉堡', kcalPer100g: 250, density: 0.7, category: '主食' },
  { name: '热狗', kcalPer100g: 290, density: 0.7, category: '主食' },
  { name: '三明治', kcalPer100g: 240, density: 0.6, category: '主食' },
  { name: '薯条', kcalPer100g: 312, density: 0.4, category: '零食' },
  { name: '炸鸡', kcalPer100g: 260, density: 0.95, category: '肉类' },
  { name: '沙拉', kcalPer100g: 35, density: 0.5, category: '蔬菜' },
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
