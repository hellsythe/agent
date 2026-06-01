import { Injectable } from '@nestjs/common';
import { PLAYBOOK_DEFINITIONS } from '../playbooks/playbook-definitions';
import { AgentExecutorService } from '../agent-executor/agent-executor.service';
import { IntentRouterService } from '../router/intent-router.service';
import { AgentPlannerService } from './agent-planner.service';
import { AgentResponderService } from './agent-responder.service';
import { PlaybookInputExtractorService } from './playbook-input-extractor.service';
import type { Playbook, PlaybookId } from '../../domain/playbook.entity';

export interface AgentLoopResult {
  response: string;
  playbookId: PlaybookId | 'unknown';
  confidence: number;
  evidence: string[];
  finalInputs: Record<string, unknown>;
  iterations: number;
  conversationState: {
    pendingPlaybookId: PlaybookId | 'unknown';
    collectedInputs: Record<string, unknown>;
    lastMissingInputs: string[];
  };
}

@Injectable()
export class AgentLoopService {
  private readonly maxIterations = 10;

  constructor(
    private readonly intentRouter: IntentRouterService,
    private readonly agentExecutor: AgentExecutorService,
    private readonly planner: AgentPlannerService,
    private readonly responder: AgentResponderService,
    private readonly inputExtractor: PlaybookInputExtractorService,
  ) {}

  async execute(input: {
    message: string;
    conversationContext?: string;
    previousState?: {
      pendingPlaybookId: PlaybookId | 'unknown';
      collectedInputs: Record<string, unknown>;
      lastMissingInputs: string[];
    };
  }): Promise<AgentLoopResult> {
    const effectiveMessage = this.buildEffectiveMessage(input.message, input.conversationContext);
    const routed = await this.intentRouter.route(effectiveMessage);

    if (!routed.topPlaybook || routed.confidence < 0.3) {
      return {
        response:
          'No pude identificar el problema con certeza. Por favor comparte: producto afectado, cliente, y un ejemplo concreto del fallo.',
        playbookId: 'unknown',
        confidence: routed.confidence,
        evidence: [],
        finalInputs: {},
        iterations: 0,
        conversationState: {
          pendingPlaybookId: 'unknown',
          collectedInputs: {},
          lastMissingInputs: [],
        },
      };
    }

    let currentPlaybook: Playbook = routed.topPlaybook;
    let currentInputs: Record<string, unknown> = await this.inputExtractor.extract(
      effectiveMessage,
      currentPlaybook.requiredInputs,
    );
    if (input.previousState?.pendingPlaybookId === currentPlaybook.id) {
      currentInputs = { ...input.previousState.collectedInputs, ...currentInputs };
    }
    if (routed.channel !== 'unknown') {
      currentInputs.channel = routed.channel;
    }
    const preconditionFailure = this.validatePreconditions(
      routed.topPlaybook,
      currentInputs,
    );
    if (preconditionFailure) {
      return {
        response: preconditionFailure,
        playbookId: routed.topPlaybook.id,
        confidence: routed.confidence,
        evidence: [],
        finalInputs: currentInputs,
        iterations: 0,
        conversationState: {
          pendingPlaybookId: currentPlaybook.id,
          collectedInputs: currentInputs,
          lastMissingInputs: [],
        },
      };
    }
    const evidence: string[] = [];
    let finalDiagnosis = '';
    let confidence = routed.confidence;

    for (let iteration = 1; iteration <= this.maxIterations; iteration += 1) {
      const execution = await this.agentExecutor.execute({
        message: effectiveMessage,
        playbook: currentPlaybook,
        initialInputs: currentInputs,
      });

      currentInputs = { ...currentInputs, ...execution.trace.finalInputs };
      const preconditionError = this.validatePreconditions(currentPlaybook, currentInputs);
      if (preconditionError) {
        return {
          response: preconditionError,
          playbookId: currentPlaybook.id,
          confidence,
          evidence,
          finalInputs: currentInputs,
          iterations: iteration,
          conversationState: {
            pendingPlaybookId: currentPlaybook.id,
            collectedInputs: currentInputs,
            lastMissingInputs: [],
          },
        };
      }

      const routedPlaybookId = this.resolveRoutedPlaybook(currentPlaybook, currentInputs);
      if (routedPlaybookId) {
        const nextPlaybook = this.findPlaybook(routedPlaybookId);
        if (nextPlaybook && nextPlaybook.id !== currentPlaybook.id) {
          currentPlaybook = nextPlaybook;
          continue;
        }
      }

      finalDiagnosis = execution.response;
      evidence.push(
        ...execution.trace.stepsExecuted
          .filter((step) => Boolean(step.toolResult))
          .map(
            (step) =>
              `${step.toolResult?.toolName}: ${step.toolResult?.success ? 'ok' : `error(${step.toolResult?.error})`}`,
          ),
      );

      if (execution.missingInputs?.length) {
        return {
          response: execution.response,
          playbookId: currentPlaybook.id,
          confidence,
          evidence,
          finalInputs: currentInputs,
          iterations: iteration,
          conversationState: {
            pendingPlaybookId: currentPlaybook.id,
            collectedInputs: currentInputs,
            lastMissingInputs: execution.missingInputs,
          },
        };
      }

      const decision = await this.planner.decide({
        message: effectiveMessage,
        currentPlaybookId: currentPlaybook.id,
        executionResponse: execution.response,
        finalInputs: currentInputs,
        iteration,
        maxIterations: this.maxIterations,
      });

      confidence = Math.min(1, Math.max(confidence, decision.confidence ?? confidence));

      if (decision.action === 'switch_playbook' && decision.playbookId) {
        const nextPlaybook = this.findPlaybook(decision.playbookId);
        if (nextPlaybook && nextPlaybook.id !== currentPlaybook.id) {
          currentPlaybook = nextPlaybook;
          const nextInputs = await this.inputExtractor.extract(
            effectiveMessage,
            currentPlaybook.requiredInputs,
          );
          currentInputs = { ...currentInputs, ...nextInputs };
          continue;
        }
      }

      if (decision.action === 'ask_user') {
        return {
          response:
            decision.question ??
            'Necesito informacion adicional para continuar. Puedes compartir mas contexto?',
          playbookId: currentPlaybook.id,
          confidence,
          evidence,
          finalInputs: currentInputs,
          iterations: iteration,
          conversationState: {
            pendingPlaybookId: currentPlaybook.id,
            collectedInputs: currentInputs,
            lastMissingInputs: [],
          },
        };
      }

      if (decision.action === 'finalize') {
        const response = await this.responder.buildFinalResponse({
          message: effectiveMessage,
          finalDiagnosis,
          evidence,
        });

        return {
          response,
          playbookId: currentPlaybook.id,
          confidence,
          evidence,
          finalInputs: currentInputs,
          iterations: iteration,
          conversationState: {
            pendingPlaybookId: 'unknown',
            collectedInputs: currentInputs,
            lastMissingInputs: [],
          },
        };
      }
    }

    const response = await this.responder.buildFinalResponse({
      message: effectiveMessage,
      finalDiagnosis,
      evidence,
    });

    return {
      response,
      playbookId: currentPlaybook.id,
      confidence,
      evidence,
      finalInputs: currentInputs,
      iterations: this.maxIterations,
      conversationState: {
        pendingPlaybookId: 'unknown',
        collectedInputs: currentInputs,
        lastMissingInputs: [],
      },
    };
  }

  private buildEffectiveMessage(message: string, conversationContext?: string): string {
    const context = conversationContext?.trim();
    if (!context) {
      return message;
    }
    return `Conversation context:\n${context}\n\nCurrent user message:\n${message}`;
  }

  private findPlaybook(playbookId: PlaybookId): Playbook | null {
    return PLAYBOOK_DEFINITIONS.find((playbook) => playbook.id === playbookId) ?? null;
  }

  private resolveRoutedPlaybook(playbook: Playbook, inputs: Record<string, unknown>): PlaybookId | null {
    if (!playbook.routing || playbook.routing.mode !== 'by_context') {
      return null;
    }
    const channel = String(inputs.channel ?? '').toLowerCase();
    const runtimeApiVersion = String(inputs.runtimeApiVersion ?? '').toLowerCase();
    const matchedRule = playbook.routing.rules.find((rule) => {
      const channelOk = !rule.when.channel || rule.when.channel === channel;
      const runtimeOk = !rule.when.runtimeApiVersion || rule.when.runtimeApiVersion === runtimeApiVersion;
      return channelOk && runtimeOk;
    });
    return matchedRule?.goToPlaybookId ?? null;
  }

  private validatePreconditions(
    playbook: Playbook,
    inputs: Record<string, unknown>,
  ): string | null {
    if (!playbook.preconditions) {
      return null;
    }

    const question =
      playbook.preconditions.clarificationQuestion ??
      'Necesito mas informacion para continuar. Puedes compartir mas contexto?';

    if (playbook.preconditions.requiredChannel) {
      const inputChannel = String(inputs.channel ?? 'unknown').toLowerCase();
      if (
        inputChannel === 'unknown' ||
        inputChannel !== playbook.preconditions.requiredChannel
      ) {
        return question;
      }
    }

    const requiredInputs = playbook.preconditions.requiredInputsForExecution ?? [];
    const hasMissingRequired = requiredInputs.some((field) => {
      const value = inputs[field];
      return value === undefined || value === null || value === '';
    });
    if (hasMissingRequired) {
      return question;
    }

    const requiredAnyOf = playbook.preconditions.requiredAnyOfInputs ?? [];
    const missingAnyOfGroup = requiredAnyOf.some((group) =>
      group.every((field) => {
        const value = inputs[field];
        return value === undefined || value === null || value === '';
      }),
    );
    if (missingAnyOfGroup) {
      return question;
    }

    return null;
  }
}
