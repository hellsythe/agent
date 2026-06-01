import { Module } from '@nestjs/common';
import { IntentRouterService } from './application/router/intent-router.service';
import { PlaybookRetrieverService } from './application/playbook-retriever/playbook-retriever.service';
import { AgentExecutorService } from './application/agent-executor/agent-executor.service';
import { ToolRegistryService } from './application/tool-registry/tool-registry.service';
import { AgentLoopService } from './application/services/agent-loop.service';
import { AgentPlannerService } from './application/services/agent-planner.service';
import { AgentResponderService } from './application/services/agent-responder.service';
import { PlaybookInputExtractorService } from './application/services/playbook-input-extractor.service';
import { TOOL_REGISTRY } from './domain/tool-definition.entity';
import { ClientsTool } from './application/tools/implementations/clients.tool';
import { BypassTool } from './application/tools/implementations/bypass.tool';
import { GitlabTool } from './application/tools/implementations/gitlab.tool';
import { CampaignsTool } from './application/tools/implementations/campaigns.tool';
import { TemplatesTool } from './application/tools/implementations/templates.tool';
import { MetaTool } from './application/tools/implementations/meta.tool';
import { UsersTool } from './application/tools/implementations/users.tool';
import { AuthTool } from './application/tools/implementations/auth.tool';
import { PermissionsTool } from './application/tools/implementations/permissions.tool';
import { AccountsTool } from './application/tools/implementations/accounts.tool';
import { OpenAiHttpAdapter } from './infrastructure/http/adapters/llm/openai-http.adapter';
import {
  LlmIntentClassifierAdapter,
  LLM_INTENT_CLASSIFIER,
} from './infrastructure/http/adapters/llm/llm-intent-classifier.adapter';
import { LLM_PORT } from './application/ports/llm.port';

@Module({
  controllers: [],
  providers: [
    IntentRouterService,
    PlaybookRetrieverService,
    AgentExecutorService,
    ToolRegistryService,
    AgentLoopService,
    AgentPlannerService,
    AgentResponderService,
    PlaybookInputExtractorService,
    OpenAiHttpAdapter,
    LlmIntentClassifierAdapter,
    ClientsTool,
    BypassTool,
    GitlabTool,
    CampaignsTool,
    TemplatesTool,
    MetaTool,
    UsersTool,
    AuthTool,
    PermissionsTool,
    AccountsTool,
    { provide: TOOL_REGISTRY, useExisting: ToolRegistryService },
    { provide: LLM_PORT, useExisting: OpenAiHttpAdapter },
    { provide: LLM_INTENT_CLASSIFIER, useExisting: LlmIntentClassifierAdapter },
  ],
  exports: [
    IntentRouterService,
    PlaybookRetrieverService,
    AgentExecutorService,
    AgentLoopService,
  ],
})
export class SupportAgentModule {}
