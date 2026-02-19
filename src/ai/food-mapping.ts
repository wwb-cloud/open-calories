import { FOOD_DATABASE, FoodItem } from '../data/foods';

// Food label mappings - English labels to food database names.
export const FOOD_LABEL_MAPPING: Record<string, string[]> = {
  // Fruits
  banana: ['香蕉'],
  orange: ['橙子'],
  apple: ['苹果'],
  'granny smith': ['苹果'],
  strawberry: ['草莓'],
  pineapple: ['芒果'],
  fig: ['梨'],
  lemon: ['橙子'],

  // Vegetables
  broccoli: ['西兰花'],
  cauliflower: ['西兰花'],
  cucumber: ['黄瓜'],
  mushroom: ['蘑菇'],
  corn: ['玉米'],
  carrot: ['胡萝卜'],
  potato: ['土豆'],
  'sweet potato': ['红薯'],
  tomato: ['西红柿'],
  cabbage: ['白菜'],
  lettuce: ['青菜'],
  spinach: ['菠菜'],

  // Meat & Protein
  chicken: ['鸡胸肉'],
  hen: ['鸡胸肉'],
  cock: ['鸡胸肉'],
  pork: ['猪肉(瘦)'],
  beef: ['牛肉'],
  steak: ['牛肉'],
  'meat loaf': ['猪肉(肥)'],
  eggnog: ['鸡蛋'],

  // Seafood
  fish: ['鱼肉'],
  salmon: ['鱼肉'],
  crab: ['虾'],
  lobster: ['虾'],
  shrimp: ['虾'],

  // Staples
  rice: ['米饭'],
  bread: ['面包'],
  pizza: ['馒头'],
  hamburger: ['馒头'],
  hotdog: ['火腿肠'],
  'hot dog': ['火腿肠'],
  burrito: ['包子'],
  taco: ['饺子'],
  dumpling: ['饺子'],
  waffle: ['面包'],
  pancake: ['面包'],
  pretzel: ['饼干'],
  bagel: ['面包'],
  croissant: ['面包'],

  // Snacks & Desserts
  chocolate: ['巧克力'],
  'ice cream': ['冰淇淋'],
  'ice lolly': ['冰淇淋'],
  cookie: ['饼干'],
  brownie: ['蛋糕'],
  cup: ['蛋糕'],
  cheese: ['蛋糕'],

  // Drinks
  coffee: ['牛奶'],
  espresso: ['牛奶'],
  tea: ['牛奶'],
  milk: ['牛奶'],
  smoothie: ['果汁'],
  juice: ['果汁'],
  coke: ['可乐'],
  'pop bottle': ['可乐'],
  beer: ['可乐'],
  wine: ['可乐'],
  consomme: ['白粥'],
  'hot pot': ['面条(煮)'],
  ramen: ['面条(煮)'],
};

export function getMatchedFoods(label: string): FoodItem[] {
  const normalized = label.toLowerCase();
  const matchedNames: string[] = [];

  for (const [key, foodNames] of Object.entries(FOOD_LABEL_MAPPING)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      matchedNames.push(...foodNames);
    }
  }

  const uniqueNames = [...new Set(matchedNames)];
  return uniqueNames
    .map(name => FOOD_DATABASE.find(food => food.name === name))
    .filter((food): food is FoodItem => Boolean(food));
}
