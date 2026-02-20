/**
 * AI Module Entry Point
 * 
 * Re-exports all AI-related functionality for the OpenCalories app.
 */

// Cloud classifier
export {
  classifyFoodWithCloud,
  isCloudClassifierConfigured,
  type CloudPredictResult,
} from './cloud-classifier';

// Image utilities
export {
  resizeImageForModel,
  getImageDimensions,
  disposeTensors,
  type ProcessedImage,
} from './image-utils';

// Weight estimation
export {
  CREDIT_CARD_WIDTH_MM,
  CREDIT_CARD_HEIGHT_MM,
  CREDIT_CARD_AREA_MM2,
  REFERENCE_OBJECTS,
  estimateTypicalWeight,
  calculateWeightFromArea,
  getFoodDensity,
  estimateWeightFromImage,
  calculateWeightFromDimensions,
  getWeightSuggestions,
  type WeightEstimation,
  type ReferenceObject,
} from './weight-estimation';
