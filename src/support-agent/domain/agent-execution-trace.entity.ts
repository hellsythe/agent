import type { ToolExecutionResult } from './tool-definition.entity';
import type { Playbook } from './playbook.entity';

export interface AgentExecutionTrace {
  playbook: Playbook;
  stepsExecuted: Array<{
    stepId: string;
    description: string;
    toolResult?: ToolExecutionResult;
    userPrompted?: boolean;
    userInput?: string;
  }>;
  finalInputs: Record<string, unknown>;
  diagnosis: string;
  confidence: number;
}
