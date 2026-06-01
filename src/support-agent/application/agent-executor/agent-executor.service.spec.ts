import { AgentExecutorService } from './agent-executor.service';
import { ToolRegistryService } from '../tool-registry/tool-registry.service';
import { ClientsTool } from '../tools/implementations/clients.tool';
import { BypassTool } from '../tools/implementations/bypass.tool';
import { GitlabTool } from '../tools/implementations/gitlab.tool';
import { CampaignsTool } from '../tools/implementations/campaigns.tool';
import { TemplatesTool } from '../tools/implementations/templates.tool';
import { MetaTool } from '../tools/implementations/meta.tool';
import { UsersTool } from '../tools/implementations/users.tool';
import { AuthTool } from '../tools/implementations/auth.tool';
import { PermissionsTool } from '../tools/implementations/permissions.tool';
import { AccountsTool } from '../tools/implementations/accounts.tool';
import { PLAYBOOK_DEFINITIONS } from '../playbooks/playbook-definitions';
import { LoggerPort } from '@sdkconsultoria/nestjs-base/shared/application/ports/logger.port';

describe('AgentExecutorService', () => {
  const registry = new ToolRegistryService(
    new ClientsTool(),
    new BypassTool(),
    new GitlabTool(),
    new CampaignsTool(),
    new TemplatesTool(),
    new MetaTool(),
    new UsersTool(),
    new AuthTool(),
    new PermissionsTool(),
    new AccountsTool(),
  );

  const logger: LoggerPort = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const executor = new AgentExecutorService(registry, logger);

  it('executes carousel playbook with all inputs', async () => {
    const playbook = PLAYBOOK_DEFINITIONS.find((p) => p.id === 'carousel_template_failed')!;
    const result = await executor.execute({
      message: 'Walmart no puede enviar plantillas carousel',
      playbook,
      initialInputs: { clientName: 'Walmart', templateName: 'carousel-promo' },
    });

    expect(result.trace.stepsExecuted.length).toBeGreaterThan(0);
    expect(result.response).toContain('Walmart');
    expect(result.missingInputs).toBeUndefined();
  });

  it('asks for missing inputs when required data is absent', async () => {
    const playbook = PLAYBOOK_DEFINITIONS.find((p) => p.id === 'carousel_template_failed')!;
    const result = await executor.execute({
      message: 'no puede enviar plantillas',
      playbook,
      initialInputs: {},
    });

    expect(result.missingInputs).toContain('clientName');
    expect(result.response).toContain('Necesito mas informacion');
  });

  it('handles non-existent user gracefully', async () => {
    const playbook = PLAYBOOK_DEFINITIONS.find((p) => p.id === 'portal_login_failed')!;
    const result = await executor.execute({
      message: 'usuario nonexistent@example.com no puede entrar',
      playbook,
      initialInputs: { userEmail: 'nonexistent@example.com' },
    });

    const step = result.trace.stepsExecuted.find((s) => s.toolResult?.toolName === 'users.findByEmail');
    expect(step?.toolResult?.success).toBe(false);
    expect(step?.toolResult?.error).toContain('User not found');
    expect(result.response).toContain('Step 1 failed');
  });

  it('handles disabled feature flag', async () => {
    const playbook = PLAYBOOK_DEFINITIONS.find((p) => p.id === 'activate_sender_v2')!;
    const result = await executor.execute({
      message: 'activar enviador v2',
      playbook,
      initialInputs: { clientName: 'Walmart' },
    });

    expect(result.trace.stepsExecuted.some((s) => s.toolResult?.toolName === 'gitlab.checkFeatureFlag')).toBe(true);
    expect(result.response).toContain('Sender v2');
  });

  it('continues execution when tool fails with onFailure=continue', async () => {
    const playbook = PLAYBOOK_DEFINITIONS.find((p) => p.id === 'template_rejected')!;
    const result = await executor.execute({
      message: 'plantilla rechazada',
      playbook,
      initialInputs: { clientName: 'Walmart', templateName: 'unknown-template' },
    });

    expect(result.trace.stepsExecuted.length).toBeGreaterThanOrEqual(2);
  });

  it('asks user to disambiguate when client has multiple ids', async () => {
    const playbook = PLAYBOOK_DEFINITIONS.find((p) => p.id === 'shipping_error_triage')!;
    const result = await executor.execute({
      message: 'cliente chedraui no puede enviar en portal auronix',
      playbook,
      initialInputs: { clientName: 'Chedraui' },
    });

    expect(result.missingInputs).toContain('clientId');
    expect(result.response).toContain('multiples clientes');
    expect(result.response).toContain('Chedraui Norte');
    expect(result.response).toContain('Chedraui Sur');
  });
});
