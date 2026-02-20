import './polyfills';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';
import * as jpeg from 'jpeg-js';

import { getMatchedFoods } from './food-mapping';

// Pure base64 decoder — does NOT rely on Buffer polyfill
function base64ToUint8Array(b64: string): Uint8Array {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(128);
  for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;

  // Strip padding
  let len = b64.length;
  while (len > 0 && b64[len - 1] === '=') len--;

  const outLen = (len * 3) >> 2;
  const out = new Uint8Array(outLen);
  let p = 0;
  let bits = 0;
  let buf = 0;

  for (let i = 0; i < len; i++) {
    const code = b64.charCodeAt(i);
    if (code > 127) continue;
    const val = lookup[code];
    buf = (buf << 6) | val;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[p++] = (buf >> bits) & 0xff;
    }
  }
  return out;
}

export interface TFLitePredictResult {
  label: string;
  confidence: number;
  matchedFoodName?: string;
  debugInfo?: string;
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

// AIY Food V1 is a quantized model expecting Uint8 (0-255) input
function toUint8Rgb(decoded: jpeg.BufferRet, targetSize: number): Uint8Array {
  const { width, height, data } = decoded;
  if (width !== targetSize || height !== targetSize) {
    throw new Error('Unexpected image size after resize');
  }

  const uint8 = new Uint8Array(width * height * 3);
  let idx = 0;
  for (let i = 0; i < data.length; i += 4) {
    uint8[idx++] = data[i];      // R
    uint8[idx++] = data[i + 1];  // G
    uint8[idx++] = data[i + 2];  // B
  }
  return uint8;
}

function softmax(scores: ArrayLike<number>): number[] {
  let maxVal = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < scores.length; i++) {
    const v = scores[i] ?? 0;
    if (v > maxVal) maxVal = v;
  }
  const exps: number[] = [];
  let sum = 0;
  for (let i = 0; i < scores.length; i++) {
    const e = Math.exp((scores[i] ?? 0) - maxVal);
    exps.push(e);
    sum += e;
  }
  return exps.map(e => e / sum);
}

function getTopN(scores: ArrayLike<number>, n: number): { index: number; confidence: number }[] {
  const probs = softmax(scores);
  const indexed = probs.map((p, i) => ({ index: i, confidence: p }));
  indexed.sort((a, b) => b.confidence - a.confidence);
  return indexed.slice(0, n);
}

function normalizeScores(output: unknown): ArrayLike<number> {
  if (output instanceof Float32Array || output instanceof Uint8Array) return output;
  if (output instanceof ArrayBuffer) return new Float32Array(output);
  if (Array.isArray(output)) return output as number[];
  return [] as number[];
}

export const TFLiteModule = {
  predictFood: async (imagePath: string): Promise<TFLitePredictResult> => {
    const debug: string[] = [];
    
    const [loadedModel, labelList] = await Promise.all([loadModel(), loadLabels()]);
    debug.push(`标签数:${labelList.length}`);

    // Get model input tensor info to determine correct size and type
    const inputTensors = loadedModel.inputs;
    const inputType = inputTensors?.[0]?.dataType ?? 'unknown';
    const inputShape = inputTensors?.[0]?.shape ?? [];
    debug.push(`输入:${inputType} ${JSON.stringify(inputShape)}`);

    // Determine the target image size from model shape
    // Shape is typically [1, height, width, 3]
    const targetSize = (inputShape.length >= 3 ? inputShape[1] : 224) as number;
    debug.push(`目标尺寸:${targetSize}x${targetSize}`);

    const manipulated = await manipulateAsync(
      imagePath,
      [{ resize: { width: targetSize, height: targetSize } }],
      { format: SaveFormat.JPEG, compress: 1, base64: true }
    );

    if (!manipulated.base64) {
      throw new Error('Failed to get base64 from image');
    }

    // Use our own base64 decoder instead of broken Buffer polyfill
    const bytes = base64ToUint8Array(manipulated.base64);
    debug.push(`b64解码:${bytes.length}字节`);
    
    // Verify JPEG header (0xFF 0xD8)
    const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8;
    debug.push(`JPEG头:${isJpeg ? '✓' : '✗'}(${bytes[0]},${bytes[1]})`);
    
    const decoded = jpeg.decode(bytes, { useTArray: true });
    debug.push(`解码:${decoded.width}x${decoded.height}`);
    
    // Sample some pixel values to verify image is valid (not all white)
    const pixSample = Array.from(decoded.data.slice(0, 12));
    debug.push(`像素:${pixSample.join(',')}`);

    // Prepare input based on model's expected data type
    let input: Uint8Array | Float32Array;
    let usedType: string;
    if (inputType === 'uint8' || inputType === 'UINT8') {
      input = toUint8Rgb(decoded, targetSize);
      usedType = 'uint8';
    } else {
      input = toFloat32Rgb(decoded, targetSize);
      usedType = 'f32';
    }
    debug.push(`${usedType} len:${input.length}`);

    const outputs = await loadedModel.run([input]);
    
    const rawOutput = outputs[0];
    const scores = normalizeScores(rawOutput);
    debug.push(`分数数:${scores.length}`);
    
    const rawSample = Array.from(scores).slice(0, 3).map((s: any) => Number(s).toFixed(3));
    debug.push(`原始:${rawSample.join(',')}`);
    
    const topN = getTopN(scores, 10);

    const top5Str = topN.slice(0, 5).map(t =>
      `${labelList[t.index] || t.index}(${(t.confidence * 100).toFixed(1)}%)`
    ).join(', ');
    debug.push(`Top5: ${top5Str}`);

    // Try each candidate until we find one that maps to a Chinese food name
    for (const candidate of topN) {
      const candidateLabel = labelList[candidate.index] || `class_${candidate.index}`;
      const matchedFoods = getMatchedFoods(candidateLabel);
      if (matchedFoods.length > 0) {
        return {
          label: candidateLabel,
          confidence: candidate.confidence,
          matchedFoodName: matchedFoods[0].name,
          debugInfo: debug.join(' | '),
        };
      }
    }

    // No match found in top-N, return top-1 without match
    const bestLabel = labelList[topN[0].index] || `class_${topN[0].index}`;
    return {
      label: bestLabel,
      confidence: topN[0].confidence,
      matchedFoodName: undefined,
      debugInfo: debug.join(' | '),
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
