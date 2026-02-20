import * as FileSystem from 'expo-file-system';

import { FoodItem } from '../data/foods';
import { getMatchedFoods } from './food-mapping';

interface BasePredictionResult {
  label: string;
  confidence: number;
  matchedFood?: FoodItem;
}

export interface CloudPredictResult extends BasePredictionResult {
  provider: 'gemini';
}

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

function getGeminiApiKey(): string | null {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  return key ? key : null;
}

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < 0 || end <= start) {
    return null;
  }
  return text.slice(start, end + 1);
}

function normalizeConfidence(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return 0;
  if (num > 1) return Math.min(num / 100, 1);
  if (num < 0) return 0;
  return num;
}

function resolveMatchedFood(label: string, matchedFoodName?: string): FoodItem | undefined {
  if (matchedFoodName?.trim()) {
    const direct = getMatchedFoods(matchedFoodName)[0];
    if (direct) return direct;
  }
  return getMatchedFoods(label)[0];
}

export function isCloudClassifierConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

export async function classifyFoodWithCloud(imageUri: string): Promise<CloudPredictResult | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  const base64Image = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const prompt = [
    '你是食物识别助手。',
    '请识别图片中的主要食物，输出严格 JSON，不要输出 markdown。',
    '字段：label(英文短词), confidence(0-1), matchedFoodName(中文可选)。',
    '若不确定，也要给一个最可能的食物标签和较低置信度。',
  ].join(' ');

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Cloud classifier request failed: ${response.status}`);
  }

  const payload = await response.json();
  const text: string =
    payload?.candidates?.[0]?.content?.parts?.find((part: { text?: string }) => typeof part.text === 'string')?.text ||
    '';

  if (!text) {
    throw new Error('Cloud classifier returned empty response');
  }

  let parsed: { label?: string; confidence?: number | string; matchedFoodName?: string } | null = null;

  try {
    parsed = JSON.parse(text);
  } catch {
    const maybeJson = extractFirstJsonObject(text);
    if (maybeJson) {
      parsed = JSON.parse(maybeJson);
    }
  }

  if (!parsed?.label) {
    throw new Error('Cloud classifier returned invalid label');
  }

  const label = parsed.label.trim();
  const confidence = normalizeConfidence(parsed.confidence);
  const matchedFood = resolveMatchedFood(label, parsed.matchedFoodName);

  return {
    provider: 'gemini',
    label,
    confidence,
    matchedFood,
  };
}
