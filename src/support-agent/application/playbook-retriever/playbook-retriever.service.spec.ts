import { PlaybookRetrieverService } from './playbook-retriever.service';

describe('PlaybookRetrieverService', () => {
  const service = new PlaybookRetrieverService();

  it('retrieves top 3 playbooks for carousel message', () => {
    const results = service.retrieve('Chedraui no puede enviar plantillas carousel');
    expect(results.length).toBeLessThanOrEqual(3);
    expect(results[0].playbook.id).toBe('carousel_template_failed');
    expect(results[0].confidence).toBeGreaterThanOrEqual(0.4);
  });

  it('includes missing inputs when required data is absent', () => {
    const results = service.retrieve('carousel');
    const top = results[0];
    expect(top.missingInputs).toContain('clientName');
  });

  it('filters by domain when provided', () => {
    const results = service.retrieve('login failed', 'portal');
    expect(results.every((r) => r.playbook.domain === 'portal')).toBe(true);
  });

  it('keeps retrieval keyword-based without local extraction', () => {
    const results = service.retrieve('El cliente es chedraui y la plantilla es pago_mayo');
    expect(results.length).toBeGreaterThan(0);
  });
});
