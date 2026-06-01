export type AgentDomain =
  | 'messaging'
  | 'portal'
  | 'permissions'
  | 'features'
  | 'campaigns'
  | 'unknown';

export type PlaybookId =
  | 'carousel_template_failed'
  | 'shipping_error_triage'
  | 'shipping_error_portal_v1'
  | 'shipping_error_portal_v2'
  | 'shipping_error_api_v1'
  | 'shipping_error_api_v2'
  | 'shipping_error_send'
  | 'activate_sender_v2'
  | 'template_rejected'
  | 'portal_login_failed'
  | 'user_cannot_see_accounts';

export interface PlaybookStep {
  id: string;
  description: string;
  tool?: string;
  condition?: string;
  onFailure: 'continue' | 'stop' | 'ask_user';
}

export interface PlaybookPreconditions {
  requiredChannel?: 'auronix_portal' | 'send_portal' | 'api_integration';
  requiredInputsForExecution?: string[];
  requiredAnyOfInputs?: string[][];
  clarificationQuestion?: string;
}

export interface PlaybookRoutingRule {
  when: {
    channel?: 'auronix_portal' | 'send_portal' | 'api_integration';
    runtimeApiVersion?: 'v1' | 'v2';
  };
  goToPlaybookId: PlaybookId;
}

export interface PlaybookRouting {
  mode: 'by_context';
  rules: PlaybookRoutingRule[];
}

export interface Playbook {
  id: PlaybookId;
  domain: AgentDomain;
  title: string;
  description: string;
  triggers: string[];
  requiredInputs: string[];
  allowedTools: string[];
  steps: PlaybookStep[];
  resolutionTemplate: string;
  preconditions?: PlaybookPreconditions;
  routing?: PlaybookRouting;
}

export interface PlaybookMatch {
  playbook: Playbook;
  confidence: number;
  missingInputs: string[];
}
