import { LlmIntentClassifierAdapter } from './llm-intent-classifier.adapter';
import type { LlmPort } from '../../../../application/ports/llm.port';

describe('LlmIntentClassifierAdapter', () => {
  const createLlmPort = (json: Record<string, unknown>): LlmPort => ({
    generateText: jest.fn(),
    generateJson: jest.fn().mockResolvedValue({
      json,
      model: 'test-model',
      promptTokens: 10,
      completionTokens: 10,
    }),
  });

  it('maps specialized shipping incidents to shipping_error_triage', async () => {
    const llmPort = createLlmPort({
      incidentType: 'shipping_error_portal_v1',
      channel: 'auronix_portal',
      confidence: 0.8,
      reasoning: 'shipping issue',
    });
    const adapter = new LlmIntentClassifierAdapter(llmPort);

    const result = await adapter.classify('no puede enviar en portal');

    expect(result.incidentType).toBe('shipping_error_triage');
  });

  it('returns unknown channel when channel is invalid', async () => {
    const llmPort = createLlmPort({
      incidentType: 'shipping_error_triage',
      channel: 'mobile_app',
      confidence: 0.8,
      reasoning: 'shipping issue',
    });
    const adapter = new LlmIntentClassifierAdapter(llmPort);

    const result = await adapter.classify('cliente 49980 no puede enviar');

    expect(result.channel).toBe('unknown');
  });

  it('normalizes non-numeric confidence', async () => {
    const llmPort = createLlmPort({
      incidentType: 'shipping_error_triage',
      channel: 'unknown',
      confidence: 'high',
      reasoning: 'shipping issue',
    });
    const adapter = new LlmIntentClassifierAdapter(llmPort);

    const result = await adapter.classify('cliente 49980 no puede enviar');

    expect(result.confidence).toBe(0.4);
  });

  it('keeps unknown channel when no channel evidence', async () => {
    const llmPort = createLlmPort({
      incidentType: 'shipping_error_triage',
      channel: 'unknown',
      confidence: 0.7,
      reasoning: 'client id without channel',
    });
    const adapter = new LlmIntentClassifierAdapter(llmPort);

    const result = await adapter.classify(
      'el cliente 49980 no puede hacer envios',
    );

    expect(result.incidentType).toBe('shipping_error_triage');
    expect(result.channel).toBe('unknown');
  });

  it('uses known channel when message is clear', async () => {
    const llmPort = createLlmPort({
      incidentType: 'shipping_error_triage',
      channel: 'api_integration',
      confidence: 0.7,
      reasoning: 'api context',
    });
    const adapter = new LlmIntentClassifierAdapter(llmPort);

    const result = await adapter.classify('falla envio por endpoint de api v2');

    expect(result.channel).toBe('api_integration');
  });
});
