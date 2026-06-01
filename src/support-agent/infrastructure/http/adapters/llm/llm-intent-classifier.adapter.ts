import { Inject, Injectable } from '@nestjs/common';
import { LLM_PORT } from '../../../../application/ports/llm.port';
import type { LlmPort } from '../../../../application/ports/llm.port';
import type { PlaybookId } from '../../../../domain/playbook.entity';
import { PLAYBOOK_DEFINITIONS } from '../../../../application/playbooks/playbook-definitions';

export interface LlmClassificationResult {
  incidentType: PlaybookId | 'unknown';
  channel: 'auronix_portal' | 'send_portal' | 'api_integration' | 'unknown';
  confidence: number;
  reasoning: string;
}

export const LLM_INTENT_CLASSIFIER = Symbol('LLM_INTENT_CLASSIFIER');

export interface LlmIntentClassifierPort {
  classify(message: string): Promise<LlmClassificationResult>;
}

@Injectable()
export class LlmIntentClassifierAdapter implements LlmIntentClassifierPort {
  private readonly validPlaybookIds = new Set(PLAYBOOK_DEFINITIONS.map((playbook) => playbook.id));
  private readonly validChannels = new Set([
    'auronix_portal',
    'send_portal',
    'api_integration',
    'unknown',
  ] as const);

  constructor(
    @Inject(LLM_PORT) private readonly llmPort: LlmPort,
  ) {}

  async classify(message: string): Promise<LlmClassificationResult> {
    console.log('LLM intent classification request', { message });

    try {
      const incidentCatalog = PLAYBOOK_DEFINITIONS
        .map((playbook) => `- ${playbook.id}: ${playbook.description}`)
        .join('\n');

      const response = await this.llmPort.generateJson<LlmClassificationResult>({
        messages: [
          {
            role: 'system',
            content: `You are an intent classifier for an internal support agent at Auronix.

Your task is to analyze user messages and classify them into:
1. incidentType: the specific playbook to use
2. channel: delivery path used at incident time
3. confidence: how confident you are (0-1)
4. reasoning: brief explanation

Available incidentTypes:
${incidentCatalog}
- unknown: Cannot determine the issue

Available channels:
- auronix_portal: User flow originated in Portal UI
- send_portal: User flow originated in Send UI
- api_integration: User flow originated in direct API calls
- unknown

Be semantic and understand synonyms:
- "no envia", "no sale", "no dispara", "atoradas", "no llega" = campaign/template sending issues
- "no pueden hacer envios", "error de envio", "envios fallando" = shipping_error_triage
- "rechazada", "no aprobada", "denegada" = template_rejected
- "no puede entrar", "login", "acceso", "inicio sesion" = portal_login_failed
- "no ve", "no aparece", "faltan cuentas" = user_cannot_see_accounts
- "activar", "habilitar", "prender" = feature activation

Channel disambiguation rule:
- You may infer channel from clear context (for example: campaign manager UI -> send_portal, endpoint/webhook/token/integration language -> api_integration, portal login/navigation language -> auronix_portal).
- If context is ambiguous, return channel=unknown.

Routing rule for shipping incidents:
- For any sending/shipping failure, prefer incidentType=shipping_error_triage.
- Do not choose specialized shipping playbooks at classification time; runtime version and specialization are resolved later by tools and routing rules.

Return ONLY valid JSON matching the interface structure.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
      });

      console.log('LLM intent classification response', {
        classification: response.json,
        model: response.model,
        tokens: response.promptTokens,
      });

      return {
        incidentType: this.normalizeIncidentType(response.json.incidentType),
        channel: this.normalizeChannel(response.json.channel),
        confidence: this.normalizeConfidence(response.json.confidence),
        reasoning: response.json.reasoning ?? '',
      };
    } catch (error) {
      console.log('LLM intent classification failed', { error, message });
      return {
        incidentType: 'unknown',
        channel: 'unknown',
        confidence: 0,
        reasoning: 'LLM classification failed, falling back',
      };
    }
  }

  private normalizeIncidentType(rawIncidentType: PlaybookId | 'unknown' | undefined): PlaybookId | 'unknown' {
    if (!rawIncidentType) {
      return 'unknown';
    }
    if (String(rawIncidentType).startsWith('shipping_error_') && rawIncidentType !== 'shipping_error_triage') {
      return 'shipping_error_triage';
    }
    return this.validPlaybookIds.has(rawIncidentType as PlaybookId)
      ? (rawIncidentType as PlaybookId)
      : 'unknown';
  }

  private normalizeChannel(
    rawChannel: 'auronix_portal' | 'send_portal' | 'api_integration' | 'unknown' | undefined,
  ): 'auronix_portal' | 'send_portal' | 'api_integration' | 'unknown' {
    if (!rawChannel || !this.validChannels.has(rawChannel)) {
      return 'unknown';
    }
    return rawChannel;
  }

  private normalizeConfidence(rawConfidence: number | undefined): number {
    const value = typeof rawConfidence === 'number' && Number.isFinite(rawConfidence) ? rawConfidence : 0.4;
    return Math.max(0, Math.min(1, value));
  }
}
