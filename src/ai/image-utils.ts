/**
 * Image Processing Utilities for TensorFlow.js in React Native
 * 
 * Handles image loading, resizing, and conversion to tensors.
 */

import * as tf from '@tensorflow/tfjs';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface ProcessedImage {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

/**
 * Resize image for model input
 */
export async function resizeImageForModel(
  uri: string,
  targetSize: number = 224
): Promise<ProcessedImage> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: targetSize, height: targetSize } }],
    { 
      format: SaveFormat.JPEG,
      compress: 0.8,
      base64: true,
    }
  );

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
    base64: result.base64,
  };
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
  const { Image } = require('react-native');
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
}

/**
 * Clean up tensor memory
 */
export function disposeTensors(tensors: tf.Tensor[]): void {
  tensors.forEach(t => t.dispose());
}
