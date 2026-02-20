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
  blueberry: ['蓝莓'],
  cherry: ['樱桃'],
  mango: ['芒果'],
  melon: ['哈密瓜'],
  watermelon: ['西瓜'],
  papaya: ['木瓜'],
  lychee: ['荔枝'],
  durian: ['榴莲'],
  kiwi: ['猕猴桃'],
  grapefruit: ['柚子'],
  fig: ['梨'],
  pear: ['梨'],
  peach: ['桃子'],
  plum: ['李子'],
  pomegranate: ['石榴'],
  mangosteen: ['山竹'],

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
  'purple cabbage': ['紫甘蓝'],
  lettuce: ['生菜'],
  spinach: ['菠菜'],
  celery: ['芹菜'],
  asparagus: ['芦笋'],
  okra: ['秋葵'],
  pumpkin: ['南瓜'],
  wintermelon: ['冬瓜'],
  zucchini: ['西葫芦'],
  eggplant: ['茄子'],
  lotus: ['莲藕'],
  kelp: ['海带'],
  'black fungus': ['木耳'],

  // Meat & Protein
  chicken: ['鸡胸肉'],
  hen: ['鸡胸肉'],
  cock: ['鸡胸肉'],
  drumstick: ['鸡腿'],
  wing: ['鸡翅'],
  bacon: ['培根'],
  pork: ['猪肉(瘦)'],
  'pork belly': ['猪肉(肥)'],
  rib: ['排骨'],
  beef: ['牛肉'],
  steak: ['牛肉'],
  'beef steak': ['牛排'],
  'meat loaf': ['猪肉(肥)'],
  eggnog: ['鸡蛋'],
  egg: ['鸡蛋'],
  sausage: ['火腿肠'],
  ham: ['午餐肉'],
  duck: ['鸭肉'],
  goose: ['鹅肉'],

  // Seafood
  fish: ['鱼肉'],
  salmon: ['三文鱼'],
  cod: ['鳕鱼'],
  tuna: ['金枪鱼'],
  squid: ['鱿鱼'],
  octopus: ['章鱼'],
  crab: ['虾'],
  lobster: ['虾'],
  shrimp: ['虾'],
  scallop: ['扇贝'],
  clam: ['蛤蜊'],
  oyster: ['生蚝'],
  crayfish: ['小龙虾'],

  // Staples
  rice: ['米饭'],
  'brown rice': ['糙米饭'],
  'purple rice': ['紫米饭'],
  bread: ['面包'],
  pizza: ['披萨'],
  hamburger: ['汉堡'],
  hotdog: ['热狗'],
  'hot dog': ['热狗'],
  burrito: ['包子'],
  taco: ['饺子'],
  dumpling: ['饺子'],
  wonton: ['馄饨'],
  waffle: ['面包'],
  pancake: ['面包'],
  pretzel: ['饼干'],
  bagel: ['面包'],
  croissant: ['面包'],
  noodles: ['面条(煮)'],
  ramen: ['面条(煮)'],
  udon: ['乌冬面'],
  soba: ['荞麦面'],
  pasta: ['意面'],
  'rice noodles': ['米粉'],
  vermicelli: ['粉丝(煮)'],
  congee: ['白粥'],
  oatmeal: ['燕麦'],
  sushi: ['寿司'],
  'fried rice': ['炒饭'],
  'egg fried rice': ['蛋炒饭'],
  'chow mein': ['炒面'],
  'stir-fried noodles': ['炒面'],
  'rice noodle': ['米粉'],
  sandwich: ['三明治'],
  fries: ['薯条'],
  'fried chicken': ['炸鸡'],

  // Snacks & Desserts
  chocolate: ['巧克力'],
  'ice cream': ['冰淇淋'],
  'ice lolly': ['冰淇淋'],
  cookie: ['饼干'],
  cookies: ['曲奇'],
  wafer: ['威化饼'],
  brownie: ['蛋糕'],
  donut: ['甜甜圈'],
  cup: ['蛋糕'],
  cheese: ['蛋糕'],
  popcorn: ['爆米花'],
  tart: ['蛋挞'],
  seaweed: ['海苔'],
  jerky: ['牛肉干'],
  nuts: ['坚果'],
  peanuts: ['花生米'],
  pistachio: ['开心果'],
  sunflower: ['瓜子'],

  // Drinks
  coffee: ['美式咖啡'],
  espresso: ['美式咖啡'],
  latte: ['拿铁'],
  tea: ['绿茶'],
  'black tea': ['红茶'],
  'oolong tea': ['乌龙茶'],
  milk: ['牛奶'],
  smoothie: ['果汁'],
  juice: ['鲜榨橙汁'],
  coke: ['可乐'],
  soda: ['苏打水'],
  'coke zero': ['无糖可乐'],
  'pop bottle': ['可乐'],
  beer: ['可乐'],
  wine: ['可乐'],
  consomme: ['白粥'],
  'hot pot': ['面条(煮)'],
  'soy milk': ['豆浆'],
  'milk tea': ['奶茶'],
  yogurt: ['酸奶'],
  tofu: ['豆腐'],
  'soybean curd': ['豆腐'],
  salad: ['沙拉'],
  soup: ['菌菇汤'],

  // AIY Food V1 common labels (additional mappings)
  quesadilla: ['饺子', '包子'],  // 墨西哥卷饼 → 主食类
  'stir fry': ['炒面', '炒饭'],  // 炒菜 → 可能含主食
  'stir-fry': ['炒面', '炒饭'],
  curry: ['咖喱饭', '米饭'],  // 咖喱 → 主食
  'pad thai': ['炒面'],
  bibimbap: ['盖浇饭', '米饭'],
  'spring roll': ['春卷', '饺子'],
  'egg roll': ['春卷', '饺子'],
  gyoza: ['饺子'],
  tempura: ['炸鸡', '天妇罗'],
  teriyaki: ['鸡胸肉'],
  satay: ['鸡排', '牛肉'],
  kebab: ['牛肉', '羊肉'],
  shawarma: ['牛肉', '羊肉'],
  falafel: ['豆腐'],
  hummus: ['豆腐'],
  'noodle soup': ['面条(煮)'],
  pho: ['米线', '面条(煮)'],
  laksa: ['米线', '面条(煮)'],
  'lo mein': ['炒面'],
  dimsum: ['烧麦', '饺子'],
  'bao bun': ['包子'],
  porridge: ['白粥'],
  'roast duck': ['烤鸭'],
  'peking duck': ['烤鸭'],
  'roast chicken': ['鸡腿'],
  'grilled chicken': ['鸡胸肉'],
  'grilled fish': ['鱼肉'],
  'fish and chips': ['鱼肉'],
  'fish fillet': ['鱼肉'],
  lasagna: ['意面'],
  ravioli: ['饺子'],
  risotto: ['炒饭'],
  paella: ['炒饭'],
  casserole: ['排骨汤'],
  'mashed potato': ['土豆'],
  'french fries': ['薯条'],
  'onion rings': ['薯条'],
  nachos: ['薯片'],
  'potato salad': ['土豆'],
  coleslaw: ['沙拉'],
  'caesar salad': ['沙拉'],
  'greek salad': ['沙拉'],
  omelette: ['鸡蛋'],
  'scrambled egg': ['鸡蛋'],
  'fried egg': ['鸡蛋'],
  'boiled egg': ['鸡蛋'],
  'egg benedict': ['鸡蛋'],
  pancakes: ['面包'],
  toast: ['面包'],
  muffin: ['蛋糕'],
  scone: ['饼干'],
  pie: ['蛋挞'],
  quiche: ['蛋挞'],
  tiramisu: ['蛋糕'],
  cheesecake: ['蛋糕'],
  pudding: ['蛋糕'],
  'ice cream sundae': ['冰淇淋'],
  gelato: ['冰淇淋'],
  sorbet: ['冰淇淋'],
  'bubble tea': ['奶茶'],
  cappuccino: ['拿铁'],
  mocha: ['拿铁'],
  'hot chocolate': ['牛奶'],
  cider: ['果汁'],
};

export function getMatchedFoods(label: string): FoodItem[] {
  const normalized = label.toLowerCase().trim();
  const matchedNames: string[] = [];

  console.log('[food-mapping] 输入标签:', label, '→ 规范化:', normalized);

  // Step 1: Try exact match first
  if (FOOD_LABEL_MAPPING[normalized]) {
    console.log('[food-mapping] 精确匹配到:', normalized, '→', FOOD_LABEL_MAPPING[normalized]);
    matchedNames.push(...FOOD_LABEL_MAPPING[normalized]);
  }

  // Step 2: Try partial match (word boundary aware)
  if (matchedNames.length === 0) {
    for (const [key, foodNames] of Object.entries(FOOD_LABEL_MAPPING)) {
      // Create word boundary regex: \b ensures we match whole words
      const keyPattern = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      const labelPattern = new RegExp(`\\b${normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      
      if (keyPattern.test(normalized) || labelPattern.test(key)) {
        console.log('[food-mapping] 部分匹配:', key, '→', foodNames);
        matchedNames.push(...foodNames);
      }
    }
  }

  // Step 3: If still no match, try loose substring match (fallback)
  if (matchedNames.length === 0) {
    for (const [key, foodNames] of Object.entries(FOOD_LABEL_MAPPING)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        console.log('[food-mapping] 模糊匹配:', key, '→', foodNames);
        matchedNames.push(...foodNames);
      }
    }
  }

  const uniqueNames = [...new Set(matchedNames)];
  console.log('[food-mapping] 最终匹配到的食物名:', uniqueNames);
  
  return uniqueNames
    .map(name => FOOD_DATABASE.find(food => food.name === name))
    .filter((food): food is FoodItem => Boolean(food));
}
