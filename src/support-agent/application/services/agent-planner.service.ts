import { Inject, Injectable } from '@nestjs/common';
import { LLM_PORT } from '../ports/llm.port';
import type { LlmPort } from '../ports/llm.port';
import type { PlaybookId } from '../../domain/playbook.entity';
import type { PlannerDecision } from '../../domain/planner-decision.entity';

interface PlannerDecisionJson extends PlannerDecision {}

@Injectable()
export class AgentPlannerService {
  constructor(
    @Inject(LLM_PORT) private readonly llmPort: LlmPort,
  ) {}

  async decide(input: {
    message: string;
    currentPlaybookId: PlaybookId;
    executionResponse: string;
    finalInputs: Record<string, unknown>;
    iteration: number;
    maxIterations: number;
  }): Promise<PlannerDecision> {
    console.log('Agent planner request', {
      currentPlaybookId: input.currentPlaybookId,
      iteration: input.iteration,
      finalInputs: input.finalInputs,
    });

    try {
      const decision = await this.llmPort.generateJson<PlannerDecisionJson>({
        messages: [
          {
            role: 'system',
            content:
              'You are a support agent planner. Return ONLY JSON with keys: action, playbookId, question, reason, confidence. action must be one of: switch_playbook, continue, ask_user, finalize. confidence must be a number between 0 and 1. question and reason must be in Spanish. Allowed playbookId values: carousel_template_failed, shipping_error_triage, shipping_error_portal_v1, shipping_error_portal_v2, shipping_error_api_v1, shipping_error_api_v2, shipping_error_send, activate_sender_v2, template_rejected, portal_login_failed, user_cannot_see_accounts.',
          },
          {
            role: 'user',
            content: `User message: ${input.message}\nCurrent playbook: ${input.currentPlaybookId}\nExecution response: ${input.executionResponse}\nFinal inputs: ${JSON.stringify(input.finalInputs)}\nIteration: ${input.iteration}/${input.maxIterations}`,
          },
        ],
      });

      return {
        action: decision.json.action,
        playbookId: decision.json.playbookId,
        question: decision.json.question,
        reason: decision.json.reason,
        confidence: decision.json.confidence ?? 0.6,
      };
    } catch (error) {
      console.log('Agent planner failed, using finalize fallback', { error });
      return {
        action: 'finalize',
        reason: 'Planner failed, finalize with current diagnosis',
        confidence: 0.5,
      };
    }
  }
}
