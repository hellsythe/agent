import { ToolRegistryService } from './tool-registry.service';
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

describe('ToolRegistryService', () => {
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

  it('returns all available tools', () => {
    const tools = registry.getAvailableTools();
    expect(tools.length).toBe(16);
    expect(tools.some((t) => t.name === 'clients.findByName')).toBe(true);
    expect(tools.some((t) => t.name === 'clients.resolveClient')).toBe(true);
    expect(tools.some((t) => t.name === 'clients.getDeliveryRuntime')).toBe(
      true,
    );
    expect(tools.some((t) => t.name === 'bypass.checkClient')).toBe(true);
  });

  it('executes clients.findByName successfully', async () => {
    const result = await registry.executeTool('clients.findByName', {
      name: 'chedraui',
    });
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('clientCandidates');
  });

  it('executes clients.resolveClient with numeric clientId', async () => {
    const result = await registry.executeTool('clients.resolveClient', {
      clientId: '49980',
    });
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      clientId: '49980',
      clientName: 'Aurrera',
    });
  });

  it('returns error for non-existent tool', async () => {
    const result = await registry.executeTool('nonexistent.tool', {});
    expect(result.success).toBe(false);
    expect(result.error).toContain('Tool not found');
  });

  it('executes bypass.checkClient and returns false for chedraui', async () => {
    const result = await registry.executeTool('bypass.checkClient', {
      clientId: 'client-chedraui-mx',
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      bypassEnabled: false,
      clientId: 'client-chedraui-mx',
    });
  });

  it('executes gitlab.checkFeatureFlag', async () => {
    const result = await registry.executeTool('gitlab.checkFeatureFlag', {
      featureName: 'sender_v2',
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ enabled: true, featureName: 'sender_v2' });
  });

  it('returns error when feature flag does not exist', async () => {
    const result = await registry.executeTool('gitlab.checkFeatureFlag', {
      featureName: 'unknown_flag',
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      enabled: false,
      featureName: 'unknown_flag',
    });
  });

  it('executes users.findByEmail successfully', async () => {
    const result = await registry.executeTool('users.findByEmail', {
      email: 'test@example.com',
    });
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('userId');
  });

  it('returns error when user does not exist', async () => {
    const result = await registry.executeTool('users.findByEmail', {
      email: 'nonexistent@example.com',
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('User not found');
  });
});
