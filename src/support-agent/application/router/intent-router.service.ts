import { Inject, Injectable } from '@nestjs/common';
import type { AgentDomain, Playbook } from '../../domain/playbook.entity';
import { PLAYBOOK_DEFINITIONS } from '../playbooks/playbook-definitions';
import {
  LLM_INTENT_CLASSIFIER,
  type LlmIntentClassifierPort,
} from '../../infrastructure/http/adapters/llm/llm-intent-classifier.adapter';

export interface IntentRouterResult {
  domain: AgentDomain;
  channel: 'auronix_portal' | 'send_portal' | 'api_integration' | 'unknown';
  candidatePlaybooks: Array<{ playbook: Playbook; score: number }>;
  topPlaybook: Playbook | null;
  confidence: number;
  llmUsed: boolean;
}

@Injectable()
export class IntentRouterService {
  constructor(
    @Inject(LLM_INTENT_CLASSIFIER)
    private readonly llmClassifier: LlmIntentClassifierPort,
  ) {}

  async route(message: string): Promise<IntentRouterResult> {
    const llmResult = await this.llmClassifier.classify(message);

    const hasHighConfidence = llmResult.confidence >= 0.45;
    const hasValidIncident = llmResult.incidentType !== 'unknown';

    if (hasHighConfidence && hasValidIncident) {
      const playbook = PLAYBOOK_DEFINITIONS.find((p) => p.id === llmResult.incidentType);
      if (playbook) {
        return {
          domain: playbook.domain,
          channel: llmResult.channel,
          candidatePlaybooks: [{ playbook, score: llmResult.confidence }],
          topPlaybook: playbook,
          confidence: llmResult.confidence,
          llmUsed: true,
        };
      }
    }

    return {
      domain: 'unknown',
      channel: llmResult.channel,
      candidatePlaybooks: [],
      topPlaybook: null,
      confidence: llmResult.confidence,
      llmUsed: true,
    };
  }
}
