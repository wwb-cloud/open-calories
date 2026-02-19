/**
 * Food Classifier using TensorFlow.js MobileNet
 * 
 * Provides AI-powered food recognition for the OpenCalories app.
 * Falls back to mock predictions if TensorFlow.js is not available.
 */

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { FoodItem } from '../data/foods';
import { getMatchedFoods } from './food-mapping';

// Lazy load TensorFlow.js only when needed
let tf: typeof import('@tensorflow/tfjs') | null = null;
let mobilenet: typeof import('@tensorflow-models/mobilenet') | null = null;
let jpeg: typeof import('jpeg-js') | null = null;

// Model state
let model: import('@tensorflow-models/mobilenet').MobileNet | null = null;
let isModelLoading = false;
let tfAvailable = false;

// MobileNet prediction type
interface MobileNetPrediction {
  className: string;
  probability: number;
}

export interface PredictionResult {
  label: string;
  confidence: number;
  matchedFood?: FoodItem;
}

/**
 * Try to load TensorFlow.js modules
 */
async function loadTensorFlow(): Promise<boolean> {
  if (tfAvailable) return true;
  
  try {
    // Dynamic imports for React Native compatibility
    tf = await import('@tensorflow/tfjs');
    mobilenet = await import('@tensorflow-models/mobilenet');
    jpeg = await import('jpeg-js');
    
    // Check if tf is available
    if (tf && mobilenet && jpeg) {
      await tf.ready();
      tfAvailable = true;
      console.log('TensorFlow.js loaded successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.warn('TensorFlow.js not available, using fallback:', error);
    tfAvailable = false;
    return false;
  }
}

/**
 * Initialize TensorFlow.js and load MobileNet model
 */
export async function initClassifier(): Promise<boolean> {
  if (model) return true;
  if (isModelLoading) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return model !== null;
  }

  try {
    isModelLoading = true;
    
    // Try to load TensorFlow.js
    const tfLoaded = await loadTensorFlow();
    
    if (!tfLoaded || !mobilenet || !tf) {
      console.log('Using mock classifier (TensorFlow.js not available)');
      return false;
    }
    
    // Load MobileNet model
    model = await mobilenet.load({
      version: 2,
      alpha: 0.5, // Smaller model (~3MB)
    });
    
    console.log('MobileNet model loaded successfully');
    return true;
  } catch (error) {
    console.error('Failed to load MobileNet model:', error);
    return false;
  } finally {
    isModelLoading = false;
  }
}

/**
 * Check if classifier is ready
 */
export function isClassifierReady(): boolean {
  return model !== null;
}

/**
 * Check if TensorFlow.js is available
 */
export function isTensorFlowAvailable(): boolean {
  return tfAvailable;
}

/**
 * Map MobileNet prediction to food database
 */
function mapPredictionToFood(predictions: MobileNetPrediction[]): PredictionResult[] {
  const results: PredictionResult[] = [];

  for (const pred of predictions) {
    const confidence = pred.probability;
    const matchedFoods = getMatchedFoods(pred.className);
    for (const matchedFood of matchedFoods) {
      results.push({
        label: pred.className,
        confidence,
        matchedFood,
      });
    }
  }

  if (results.length === 0) {
    return predictions.slice(0, 3).map(pred => ({
      label: pred.className,
      confidence: pred.probability,
      matchedFood: undefined,
    }));
  }

  const uniqueResults = results.filter((result, index, self) =>
    index === self.findIndex(r => 
      r.matchedFood?.name === result.matchedFood?.name
    )
  );

  return uniqueResults.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

/**
 * Get mock predictions when TensorFlow.js is not available
 */
function getMockPredictions(): PredictionResult[] {
  // Return a small shuffled set to avoid always defaulting to rice
  const mockFoods = [
    { label: 'bread', confidence: 0.72 },
    { label: 'chicken', confidence: 0.58 },
    { label: 'vegetable', confidence: 0.45 },
    { label: 'fruit', confidence: 0.32 },
    { label: 'rice', confidence: 0.28 },
  ];

  for (let i = mockFoods.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [mockFoods[i], mockFoods[j]] = [mockFoods[j], mockFoods[i]];
  }

  return mockFoods.map(m => {
    const matchedFood = getMatchedFoods(m.label)[0];
    return {
      label: m.label,
      confidence: m.confidence,
      matchedFood,
    };
  });
}

/**
 * Classify food from image URI
 */
export async function classifyFood(imageUri: string): Promise<PredictionResult[]> {
  // Try to use TensorFlow.js
  if (!model) {
    const loaded = await initClassifier();
    if (!loaded || !model) {
      // Return mock predictions
      return getMockPredictions();
    }
  }

  try {
    if (!tf || !jpeg) {
      return getMockPredictions();
    }
    
    // Resize image to 224x224
    const manipulated = await manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      { 
        format: SaveFormat.JPEG,
        compress: 1,
        base64: true,
      }
    );

    if (!manipulated.base64) {
      throw new Error('Failed to get base64 from image');
    }

    // Decode base64 using Buffer for React Native compatibility
    const bytes = new Uint8Array(Buffer.from(manipulated.base64, 'base64'));

    // Decode JPEG
    const decoded = jpeg.decode(bytes, { useTArray: true });
    
    // Create tensor
    const tensor = tf.tensor3d(
      new Int32Array(decoded.data),
      [decoded.height, decoded.width, 4]
    );
    
    // Remove alpha channel
    const rgbTensor = tensor.slice([0, 0, 0], [-1, -1, 3]);
    
    // Run classification
    const predictions = await model!.classify(rgbTensor as import('@tensorflow/tfjs').Tensor3D, 5);
    
    // Clean up
    tensor.dispose();
    (rgbTensor as import('@tensorflow/tfjs').Tensor).dispose();
    
    return mapPredictionToFood(predictions);
  } catch (error) {
    console.error('Classification error:', error);
    return getMockPredictions();
  }
}

/**
 * Get top prediction with food match
 */
export async function getTopFoodPrediction(imageUri: string): Promise<PredictionResult | null> {
  const results = await classifyFood(imageUri);
  const matchedResult = results.find(r => r.matchedFood);
  return matchedResult || results[0] || null;
}

/**
 * Clean up classifier resources
 */
export function disposeClassifier(): void {
  if (model) {
    model = null;
  }
  if (tf) {
    tf.disposeVariables();
  }
}
