import { IntentRouterService } from './intent-router.service';
import type { LlmIntentClassifierPort } from '../../infrastructure/http/adapters/llm/llm-intent-classifier.adapter';

describe('IntentRouterService', () => {
  const createMockLlmClassifier = (overrides: Partial<ReturnType<LlmIntentClassifierPort['classify']>> = {}): LlmIntentClassifierPort => ({
    classify: jest.fn().mockResolvedValue({
      incidentType: 'unknown',
      channel: 'unknown',
      confidence: 0,
      reasoning: '',
      ...overrides,
    }),
  });

  it('routes carousel template issue via LLM', async () => {
    const mockLlm = createMockLlmClassifier({
      incidentType: 'carousel_template_failed',
      channel: 'send_portal',
      confidence: 0.85,
    });

    const service = new IntentRouterService(mockLlm);
    const result = await service.route('cliente Chedraui no puede enviar plantillas carousel');

    expect(result.domain).toBe('messaging');
    expect(result.topPlaybook?.id).toBe('carousel_template_failed');
    expect(result.confidence).toBe(0.85);
    expect(result.llmUsed).toBe(true);
    expect(mockLlm.classify).toHaveBeenCalledTimes(1);
  });

  it('routes sender v2 activation via LLM', async () => {
    const mockLlm = createMockLlmClassifier({
      incidentType: 'activate_sender_v2',
      channel: 'send_portal',
      confidence: 0.9,
    });

    const service = new IntentRouterService(mockLlm);
    const result = await service.route('que necesito para activar enviador v2');

    expect(result.domain).toBe('features');
    expect(result.topPlaybook?.id).toBe('activate_sender_v2');
    expect(result.llmUsed).toBe(true);
  });

  it('routes shipping triage via LLM', async () => {
    const mockLlm = createMockLlmClassifier({
      incidentType: 'shipping_error_triage',
      channel: 'auronix_portal',
      confidence: 0.9,
    });

    const service = new IntentRouterService(mockLlm);
    const result = await service.route('El cliente aurrera no puede hacer envios en portal');

    expect(result.topPlaybook?.id).toBe('shipping_error_triage');
  });

  it('returns unknown when LLM confidence is low', async () => {
    const mockLlm = createMockLlmClassifier({
      incidentType: 'unknown',
      confidence: 0.3,
      channel: 'unknown',
    });

    const service = new IntentRouterService(mockLlm);
    const result = await service.route('El cliente es Chedraui y la plantilla es pago_mayo');

    expect(result.llmUsed).toBe(true);
    expect(result.topPlaybook).toBeNull();
  });

  it('returns unknown for unrecognized message', async () => {
    const mockLlm = createMockLlmClassifier({
      incidentType: 'unknown',
      confidence: 0.2,
      channel: 'unknown',
    });

    const service = new IntentRouterService(mockLlm);
    const result = await service.route('hola que tal');

    expect(result.domain).toBe('unknown');
    expect(result.topPlaybook).toBeNull();
    expect(result.llmUsed).toBe(true);
  });
});
