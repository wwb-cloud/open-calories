export interface TFLitePredictResult {
  label: string;
  confidence: number;
}

export interface WeightEstimateResult {
  weightGram: number;
  areaCm2: number;
}

export const TFLiteModule = {
  predictFood: async (_imagePath: string): Promise<TFLitePredictResult> => {
    throw new Error('TFLite not implemented in Phase 1');
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
