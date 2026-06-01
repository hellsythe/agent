export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmGenerateParams {
  messages: LlmMessage[];
}

export interface LlmGenerateResult {
  content: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
}

export interface LlmGenerateJsonResult<T> extends LlmGenerateResult {
  json: T;
}

export const LLM_PORT = Symbol('LLM_PORT');

export interface LlmPort {
  generateText(params: LlmGenerateParams): Promise<LlmGenerateResult>;
  generateJson<T>(params: LlmGenerateParams): Promise<LlmGenerateJsonResult<T>>;
}
