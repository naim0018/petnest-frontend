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

export interface GoogleOAuthConfigResponse {
  isConfigured: boolean;
  isEnabled: boolean;
  clientId: string;
  maskedSecret: string;
  redirectUri: string;
  source: 'DATABASE' | 'ENV' | 'NONE';
  updatedAt: string | null;
}

export interface UpdateGoogleOAuthPayload {
  clientId?: string;
  clientSecret?: string;
  isEnabled?: boolean;
}

export interface OAuthStatusResponse {
  googleEnabled: boolean;
}
