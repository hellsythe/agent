import { Inject, Injectable } from '@nestjs/common';
import type {
  ToolDefinition,
  ToolExecutionResult,
  ToolRegistryPort,
} from '../../domain/tool-definition.entity';
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

@Injectable()
export class ToolRegistryService implements ToolRegistryPort {
  private readonly tools: Map<string, ToolDefinition>;
  private readonly executors: Map<
    string,
    (inputs: Record<string, unknown>) => Promise<Record<string, unknown>>
  >;

  constructor(
    private readonly clientsTool: ClientsTool,
    private readonly bypassTool: BypassTool,
    private readonly gitlabTool: GitlabTool,
    private readonly campaignsTool: CampaignsTool,
    private readonly templatesTool: TemplatesTool,
    private readonly metaTool: MetaTool,
    private readonly usersTool: UsersTool,
    private readonly authTool: AuthTool,
    private readonly permissionsTool: PermissionsTool,
    private readonly accountsTool: AccountsTool,
  ) {
    this.tools = new Map([
      [
        'clients.findByName',
        {
          name: 'clients.findByName',
          description: 'Find a client by name',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Client name' },
            },
            required: ['name'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'clients.resolveClient',
        {
          name: 'clients.resolveClient',
          description: 'Resolve client by name or clientId',
          inputSchema: {
            type: 'object',
            properties: {
              clientName: { type: 'string', description: 'Client name' },
              clientId: { type: 'string', description: 'Client ID' },
            },
            required: [],
          },
          riskLevel: 'low',
        },
      ],
      [
        'bypass.checkClient',
        {
          name: 'bypass.checkClient',
          description: 'Check if bypass is enabled for a client',
          inputSchema: {
            type: 'object',
            properties: {
              clientId: { type: 'string', description: 'Client ID' },
            },
            required: ['clientId'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'clients.getDeliveryRuntime',
        {
          name: 'clients.getDeliveryRuntime',
          description: 'Resolve runtime api version for a client',
          inputSchema: {
            type: 'object',
            properties: {
              clientId: { type: 'string', description: 'Client ID' },
              requestedChannel: {
                type: 'string',
                description: 'Observed channel from user text',
              },
            },
            required: ['clientId'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'gitlab.checkFeatureFlag',
        {
          name: 'gitlab.checkFeatureFlag',
          description: 'Check if a feature flag is enabled',
          inputSchema: {
            type: 'object',
            properties: {
              featureName: { type: 'string', description: 'Feature name' },
            },
            required: ['featureName'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'campaigns.findByName',
        {
          name: 'campaigns.findByName',
          description: 'Find a campaign by name',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Campaign name' },
            },
            required: ['name'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'campaigns.getErrors',
        {
          name: 'campaigns.getErrors',
          description: 'Get errors for a campaign',
          inputSchema: {
            type: 'object',
            properties: {
              campaignId: { type: 'string', description: 'Campaign ID' },
            },
            required: ['campaignId'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'templates.findByName',
        {
          name: 'templates.findByName',
          description: 'Find a template by name',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Template name' },
            },
            required: ['name'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'meta.getTemplateStatus',
        {
          name: 'meta.getTemplateStatus',
          description: 'Get template status from Meta',
          inputSchema: {
            type: 'object',
            properties: {
              templateId: { type: 'string', description: 'Template ID' },
            },
            required: ['templateId'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'meta.getRejectionReason',
        {
          name: 'meta.getRejectionReason',
          description: 'Get rejection reason from Meta',
          inputSchema: {
            type: 'object',
            properties: {
              templateId: { type: 'string', description: 'Template ID' },
            },
            required: ['templateId'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'users.findByEmail',
        {
          name: 'users.findByEmail',
          description: 'Find a user by email',
          inputSchema: {
            type: 'object',
            properties: {
              email: { type: 'string', description: 'User email' },
            },
            required: ['email'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'users.getStatus',
        {
          name: 'users.getStatus',
          description: 'Get user status',
          inputSchema: {
            type: 'object',
            properties: { userId: { type: 'string', description: 'User ID' } },
            required: ['userId'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'auth.getLoginAttempts',
        {
          name: 'auth.getLoginAttempts',
          description: 'Get login attempts for a user',
          inputSchema: {
            type: 'object',
            properties: { userId: { type: 'string', description: 'User ID' } },
            required: ['userId'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'permissions.getRoles',
        {
          name: 'permissions.getRoles',
          description: 'Get roles for a user',
          inputSchema: {
            type: 'object',
            properties: { userId: { type: 'string', description: 'User ID' } },
            required: ['userId'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'permissions.getAccounts',
        {
          name: 'permissions.getAccounts',
          description: 'Get accounts accessible by a user',
          inputSchema: {
            type: 'object',
            properties: { userId: { type: 'string', description: 'User ID' } },
            required: ['userId'],
          },
          riskLevel: 'low',
        },
      ],
      [
        'accounts.findByName',
        {
          name: 'accounts.findByName',
          description: 'Find an account by name',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Account name' },
            },
            required: ['name'],
          },
          riskLevel: 'low',
        },
      ],
    ]);

    this.executors = new Map([
      [
        'clients.findByName',
        (i) => this.clientsTool.findByName(i as { name: string }),
      ],
      [
        'clients.resolveClient',
        (i) =>
          this.clientsTool.resolveClient(
            i as { clientName?: string; clientId?: string },
          ),
      ],
      [
        'clients.getDeliveryRuntime',
        (i) =>
          this.clientsTool.getDeliveryRuntime(
            i as { clientId: string; requestedChannel?: string },
          ),
      ],
      [
        'bypass.checkClient',
        (i) => this.bypassTool.checkClient(i as { clientId: string }),
      ],
      [
        'gitlab.checkFeatureFlag',
        (i) => this.gitlabTool.checkFeatureFlag(i as { featureName: string }),
      ],
      [
        'campaigns.findByName',
        (i) => this.campaignsTool.findByName(i as { name: string }),
      ],
      [
        'campaigns.getErrors',
        (i) => this.campaignsTool.getErrors(i as { campaignId: string }),
      ],
      [
        'templates.findByName',
        (i) => this.templatesTool.findByName(i as { name: string }),
      ],
      [
        'meta.getTemplateStatus',
        (i) => this.metaTool.getTemplateStatus(i as { templateId: string }),
      ],
      [
        'meta.getRejectionReason',
        (i) => this.metaTool.getRejectionReason(i as { templateId: string }),
      ],
      [
        'users.findByEmail',
        (i) => this.usersTool.findByEmail(i as { email: string }),
      ],
      [
        'users.getStatus',
        (i) => this.usersTool.getStatus(i as { userId: string }),
      ],
      [
        'auth.getLoginAttempts',
        (i) => this.authTool.getLoginAttempts(i as { userId: string }),
      ],
      [
        'permissions.getRoles',
        (i) => this.permissionsTool.getRoles(i as { userId: string }),
      ],
      [
        'permissions.getAccounts',
        (i) => this.permissionsTool.getAccounts(i as { userId: string }),
      ],
      [
        'accounts.findByName',
        (i) => this.accountsTool.findByName(i as { name: string }),
      ],
    ]);
  }

  getAvailableTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  getTool(name: string): ToolDefinition | null {
    return this.tools.get(name) ?? null;
  }

  async executeTool(
    name: string,
    inputs: Record<string, unknown>,
  ): Promise<ToolExecutionResult> {
    const start = Date.now();
    const executor = this.executors.get(name);
    if (!executor) {
      return {
        toolName: name,
        success: false,
        error: `Tool not found: ${name}`,
        durationMs: Date.now() - start,
      };
    }

    try {
      const data = await executor(inputs);
      return {
        toolName: name,
        success: true,
        data,
        durationMs: Date.now() - start,
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      return {
        toolName: name,
        success: false,
        error,
        durationMs: Date.now() - start,
      };
    }
  }
}
