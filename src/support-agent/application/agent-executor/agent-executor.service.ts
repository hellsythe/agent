import { Inject, Injectable } from '@nestjs/common';
import { LoggerPort } from '@sdkconsultoria/nestjs-base/shared/application/ports/logger.port';
import type { Playbook, PlaybookStep } from '../../domain/playbook.entity';
import type { AgentExecutionTrace } from '../../domain/agent-execution-trace.entity';
import type {
  ToolExecutionResult,
  ToolRegistryPort,
} from '../../domain/tool-definition.entity';
import { TOOL_REGISTRY } from '../../domain/tool-definition.entity';

export interface AgentExecutorInput {
  message: string;
  playbook: Playbook;
  initialInputs: Record<string, unknown>;
}

export interface AgentExecutorOutput {
  response: string;
  trace: AgentExecutionTrace;
  missingInputs?: string[];
}

@Injectable()
export class AgentExecutorService {
  constructor(
    @Inject(TOOL_REGISTRY)
    private readonly toolRegistry: ToolRegistryPort,
    @Inject(LoggerPort)
    private readonly logger: LoggerPort,
  ) {}

  async execute(input: AgentExecutorInput): Promise<AgentExecutorOutput> {
    const trace: AgentExecutionTrace = {
      playbook: input.playbook,
      stepsExecuted: [],
      finalInputs: { ...input.initialInputs },
      diagnosis: '',
      confidence: 0,
    };

    const missing = this.detectMissingInputs(
      input.playbook,
      input.initialInputs,
    );
    if (missing.length > 0) {
      this.logger.info('Agent executor missing inputs', {
        playbookId: input.playbook.id,
        missing,
      });
      return {
        response: `Necesito mas informacion para continuar: ${missing.join(', ')}`,
        trace,
        missingInputs: missing,
      };
    }

    for (const step of input.playbook.steps) {
      const stepResult = await this.executeStep(
        step,
        trace.finalInputs,
        input.playbook.allowedTools,
      );
      trace.stepsExecuted.push(stepResult);
      if (stepResult.toolResult?.data) {
        if (
          step.tool === 'templates.findByName' &&
          stepResult.toolResult.data.type &&
          !stepResult.toolResult.data.templateType
        ) {
          stepResult.toolResult.data.templateType =
            stepResult.toolResult.data.type;
        }
        Object.assign(trace.finalInputs, stepResult.toolResult.data);

        const clientCandidates = trace.finalInputs.clientCandidates as
          | Array<{ clientId: string; name: string }>
          | undefined;
        if (clientCandidates?.length && !trace.finalInputs.clientId) {
          const options = clientCandidates
            .map((candidate) => `${candidate.name} (${candidate.clientId})`)
            .join(', ');
          return {
            response: `Encontré multiples clientes para ${trace.finalInputs.clientName}. Confirma el clientId exacto: ${options}`,
            trace,
            missingInputs: ['clientId'],
          };
        }
      }
      if (stepResult.toolResult?.success === false) {
        this.logger.warn('Tool execution failed', {
          stepId: step.id,
          tool: step.tool,
          error: stepResult.toolResult.error,
        });
        if (step.onFailure === 'stop') {
          trace.diagnosis = `Step ${step.id} failed: ${stepResult.toolResult.error}`;
          break;
        }
      }
    }

    if (!trace.diagnosis) {
      trace.diagnosis = this.buildResolution(input.playbook, trace.finalInputs);
    }
    trace.confidence = 0.85;

    this.logger.info('Agent executor completed', {
      playbookId: input.playbook.id,
      diagnosis: trace.diagnosis,
    });

    return {
      response: trace.diagnosis,
      trace,
    };
  }

  private detectMissingInputs(
    playbook: Playbook,
    inputs: Record<string, unknown>,
  ): string[] {
    const anyOfGroups = playbook.preconditions?.requiredAnyOfInputs ?? [];
    const anyOfFields = new Set(anyOfGroups.flat());

    const missingRequired = playbook.requiredInputs.filter((field) => {
      if (anyOfFields.has(field)) {
        return false;
      }
      const value = inputs[field];
      return value === undefined || value === null || value === '';
    });

    const missingAnyOfGroups = anyOfGroups
      .filter((group) =>
        group.every((field) => {
          const value = inputs[field];
          return value === undefined || value === null || value === '';
        }),
      )
      .map((group) => group.join(' | '));

    return [...missingRequired, ...missingAnyOfGroups];
  }

  private async executeStep(
    step: PlaybookStep,
    inputs: Record<string, unknown>,
    allowedTools: string[],
  ): Promise<AgentExecutionTrace['stepsExecuted'][number]> {
    if (!step.tool) {
      return { stepId: step.id, description: step.description };
    }

    if (!allowedTools.includes(step.tool)) {
      return {
        stepId: step.id,
        description: step.description,
        toolResult: {
          toolName: step.tool,
          success: false,
          error: 'Tool not allowed by playbook',
          durationMs: 0,
        },
      };
    }

    const toolInputs = this.mapInputsForTool(step.tool, inputs);
    if (Object.keys(toolInputs).length === 0) {
      return {
        stepId: step.id,
        description: step.description,
        toolResult: {
          toolName: step.tool,
          success: false,
          error: 'Missing inputs for tool execution',
          durationMs: 0,
        },
      };
    }
    const result = await this.toolRegistry.executeTool(step.tool, toolInputs);

    return {
      stepId: step.id,
      description: step.description,
      toolResult: result,
    };
  }

  private mapInputsForTool(
    toolName: string,
    inputs: Record<string, unknown>,
  ): Record<string, unknown> {
    const mapping: Record<string, Record<string, string>> = {
      'clients.findByName': { name: 'clientName' },
      'clients.resolveClient': {
        clientName: 'clientName',
        clientId: 'clientId',
      },
      'clients.getDeliveryRuntime': {
        clientId: 'clientId',
        requestedChannel: 'channel',
      },
      'templates.findByName': { name: 'templateName' },
      'campaigns.findByName': { name: 'campaignName' },
      'users.findByEmail': { email: 'userEmail' },
      'accounts.findByName': { name: 'accountName' },
      'bypass.checkClient': { clientId: 'clientId' },
      'gitlab.checkFeatureFlag': { featureName: 'featureName' },
      'meta.getTemplateStatus': { templateId: 'templateId' },
      'meta.getRejectionReason': { templateId: 'templateId' },
      'campaigns.getErrors': { campaignId: 'campaignId' },
      'users.getStatus': { userId: 'userId' },
      'auth.getLoginAttempts': { userId: 'userId' },
      'permissions.getRoles': { userId: 'userId' },
      'permissions.getAccounts': { userId: 'userId' },
    };

    const map = mapping[toolName] ?? {};
    const result: Record<string, unknown> = {};
    for (const [toolKey, inputKey] of Object.entries(map)) {
      if (inputs[inputKey] !== undefined) {
        result[toolKey] = inputs[inputKey];
      }
    }

    if (toolName === 'gitlab.checkFeatureFlag' && !result.featureName) {
      result.featureName = 'sender_v2';
    }

    return result;
  }

  private buildResolution(
    playbook: Playbook,
    inputs: Record<string, unknown>,
  ): string {
    let text = playbook.resolutionTemplate;
    for (const [key, value] of Object.entries(inputs)) {
      text = text.replace(new RegExp(`{${key}}`, 'g'), String(value ?? 'N/A'));
    }
    return text;
  }
}
