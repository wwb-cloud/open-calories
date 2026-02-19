import './polyfills';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';
import * as jpeg from 'jpeg-js';

import { getMatchedFoods } from './food-mapping';

export interface TFLitePredictResult {
  label: string;
  confidence: number;
  matchedFoodName?: string;
}

export interface WeightEstimateResult {
  weightGram: number;
  areaCm2: number;
}

const MODEL_ASSET = require('../../assets/models/aiy_food_V1.tflite');
const LABELS_ASSET = require('../../assets/models/aiy_food_V1_labelmap.csv');

let model: TensorflowModel | null = null;
let modelLoading: Promise<TensorflowModel> | null = null;
let labels: string[] | null = null;
let labelsLoading: Promise<string[]> | null = null;

async function loadLabels(): Promise<string[]> {
  if (labels) return labels;
  if (labelsLoading) return labelsLoading;

  labelsLoading = (async () => {
    const asset = Asset.fromModule(LABELS_ASSET);
    if (!asset.localUri) {
      await asset.downloadAsync();
    }

    const uri = asset.localUri || asset.uri;
    const content = await FileSystem.readAsStringAsync(uri);
    const lines = content.split(/\r?\n/).filter(Boolean);
    const parsed = lines.slice(1).map(line => {
      const commaIndex = line.indexOf(',');
      return commaIndex >= 0 ? line.slice(commaIndex + 1).trim() : line.trim();
    });

    labels = parsed;
    return parsed;
  })();

  try {
    return await labelsLoading;
  } finally {
    labelsLoading = null;
  }
}

async function loadModel(): Promise<TensorflowModel> {
  if (model) return model;
  if (modelLoading) return modelLoading;

  modelLoading = (async () => {
    const loaded = await loadTensorflowModel(MODEL_ASSET);
    model = loaded;
    return loaded;
  })();

  try {
    return await modelLoading;
  } finally {
    modelLoading = null;
  }
}

function toFloat32Rgb(decoded: jpeg.BufferRet, targetSize: number): Float32Array {
  const { width, height, data } = decoded;
  if (width !== targetSize || height !== targetSize) {
    throw new Error('Unexpected image size after resize');
  }

  const float = new Float32Array(width * height * 3);
  let idx = 0;
  for (let i = 0; i < data.length; i += 4) {
    float[idx++] = data[i] / 255;
    float[idx++] = data[i + 1] / 255;
    float[idx++] = data[i + 2] / 255;
  }
  return float;
}

function getTopIndex(scores: ArrayLike<number>): { index: number; confidence: number } {
  let bestIndex = 0;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < scores.length; i += 1) {
    const value = scores[i] ?? 0;
    if (value > bestScore) {
      bestScore = value;
      bestIndex = i;
    }
  }
  return { index: bestIndex, confidence: bestScore };
}

function normalizeScores(output: unknown): ArrayLike<number> {
  if (output instanceof Float32Array || output instanceof Uint8Array) return output;
  if (output instanceof ArrayBuffer) return new Float32Array(output);
  if (Array.isArray(output)) return output as number[];
  return [] as number[];
}

export const TFLiteModule = {
  predictFood: async (imagePath: string): Promise<TFLitePredictResult> => {
    const [loadedModel, labelList] = await Promise.all([loadModel(), loadLabels()]);

    const manipulated = await manipulateAsync(
      imagePath,
      [{ resize: { width: 224, height: 224 } }],
      { format: SaveFormat.JPEG, compress: 1, base64: true }
    );

    if (!manipulated.base64) {
      throw new Error('Failed to get base64 from image');
    }

    const bytes = new Uint8Array(Buffer.from(manipulated.base64, 'base64'));
    const decoded = jpeg.decode(bytes, { useTArray: true });
    const input = toFloat32Rgb(decoded, 224);

    const outputs = await loadedModel.run([input]);
    const scores = normalizeScores(outputs[0]);
    const { index, confidence } = getTopIndex(scores);

    const label = labelList[index] || `class_${index}`;
    const matchedFoods = getMatchedFoods(label);
    const matchedFoodName = matchedFoods[0]?.name;

    return {
      label,
      confidence,
      matchedFoodName,
    };
  },

  estimateWeight: async (
    _imagePath: string,
    _cardRealW: number,
    _cardRealH: number
  ): Promise<WeightEstimateResult> => {
    throw new Error('Weight estimation not implemented in Phase 1');
  },
};

export default TFLiteModule;
