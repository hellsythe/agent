export type ToolRiskLevel = 'low' | 'medium' | 'high';

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, { type: string; description: string }>;
  required: string[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  riskLevel: ToolRiskLevel;
}

export interface ToolExecutionResult {
  toolName: string;
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  durationMs: number;
}

export const TOOL_REGISTRY = Symbol('TOOL_REGISTRY');

export interface ToolRegistryPort {
  getAvailableTools(): ToolDefinition[];
  getTool(name: string): ToolDefinition | null;
  executeTool(name: string, inputs: Record<string, unknown>): Promise<ToolExecutionResult>;
}
