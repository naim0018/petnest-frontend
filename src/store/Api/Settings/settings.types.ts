export interface GeminiConfigResponse {
  isConfigured: boolean;
  maskedKey: string;
  source: 'DATABASE' | 'ENV' | 'NONE';
  updatedAt: string | null;
}

export interface UpdateGeminiKeyPayload {
  apiKey: string;
}

export interface TestGeminiKeyPayload {
  apiKey?: string;
}

export interface TestGeminiKeyResponse {
  success: boolean;
  message: string;
  modelCount?: number;
}
