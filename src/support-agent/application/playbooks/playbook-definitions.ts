import type { Playbook } from '../../domain/playbook.entity';

export const PLAYBOOK_DEFINITIONS: Playbook[] = [
  {
    id: 'carousel_template_failed',
    domain: 'messaging',
    title: 'Carousel template sending failed',
    description: 'Diagnose why a client cannot send carousel templates',
    triggers: [
      'carousel',
      'plantilla carousel',
      'no envia carousel',
      'carousel no sale',
    ],
    requiredInputs: ['clientName', 'templateName'],
    allowedTools: [
      'clients.findByName',
      'templates.findByName',
      'meta.getTemplateStatus',
      'bypass.checkClient',
    ],
    steps: [
      {
        id: '1',
        description: 'Find client by name',
        tool: 'clients.findByName',
        onFailure: 'stop',
      },
      {
        id: '2',
        description: 'Find template by name',
        tool: 'templates.findByName',
        onFailure: 'stop',
      },
      {
        id: '3',
        description: 'Check template status in Meta',
        tool: 'meta.getTemplateStatus',
        onFailure: 'continue',
      },
      {
        id: '4',
        description: 'Check if bypass is enabled for client',
        tool: 'bypass.checkClient',
        condition: 'templateType == carousel',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'Client {clientName} template {templateName}: status={templateStatus}, bypass={bypassStatus}. If bypass is disabled and template is carousel, enable bypass or switch to standard template.',
  },
  {
    id: 'shipping_error_triage',
    domain: 'campaigns',
    title: 'Shipping error triage',
    description:
      'Resolve channel, runtime version and template type before specialized diagnosis',
    triggers: [
      'no pueden hacer envios',
      'error de envio',
      'no envia mensajes',
      'envios fallando',
    ],
    requiredInputs: ['clientName', 'clientId'],
    allowedTools: [
      'clients.resolveClient',
      'clients.getDeliveryRuntime',
      'templates.findByName',
    ],
    steps: [
      {
        id: '1',
        description: 'Resolve client by name or clientId',
        tool: 'clients.resolveClient',
        onFailure: 'ask_user',
      },
      {
        id: '2',
        description: 'Resolve channel runtime and apiVersion for client',
        tool: 'clients.getDeliveryRuntime',
        onFailure: 'ask_user',
      },
      {
        id: '3',
        description: 'Resolve template type when templateName exists',
        tool: 'templates.findByName',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'Shipping triage for {clientName}: channel={channel}, runtimeApiVersion={runtimeApiVersion}, templateType={templateType}.',
    preconditions: {
      requiredAnyOfInputs: [['clientName', 'clientId']],
      clarificationQuestion:
        'Para continuar necesito cliente por nombre o clientId, y confirmar el canal del incidente: Portal Auronix, Send o API.',
    },
    routing: {
      mode: 'by_context',
      rules: [
        {
          when: { channel: 'send_portal' },
          goToPlaybookId: 'shipping_error_send',
        },
        {
          when: { channel: 'auronix_portal', runtimeApiVersion: 'v1' },
          goToPlaybookId: 'shipping_error_portal_v1',
        },
        {
          when: { channel: 'auronix_portal', runtimeApiVersion: 'v2' },
          goToPlaybookId: 'shipping_error_portal_v2',
        },
        {
          when: { channel: 'api_integration', runtimeApiVersion: 'v1' },
          goToPlaybookId: 'shipping_error_api_v1',
        },
        {
          when: { channel: 'api_integration', runtimeApiVersion: 'v2' },
          goToPlaybookId: 'shipping_error_api_v2',
        },
      ],
    },
  },
  {
    id: 'shipping_error_portal_v1',
    domain: 'campaigns',
    title: 'Shipping errors portal v1',
    description:
      'Diagnose portal shipping errors for clients running on API v1',
    triggers: ['portal v1 no envia', 'error envio portal v1'],
    requiredInputs: ['clientName', 'clientId'],
    allowedTools: [
      'bypass.checkClient',
      'campaigns.findByName',
      'campaigns.getErrors',
    ],
    steps: [
      {
        id: '1',
        description: 'Check bypass status for v1 client',
        tool: 'bypass.checkClient',
        onFailure: 'continue',
      },
      {
        id: '2',
        description: 'Find campaign sample when available',
        tool: 'campaigns.findByName',
        onFailure: 'continue',
      },
      {
        id: '3',
        description: 'Get campaign errors when campaign exists',
        tool: 'campaigns.getErrors',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'Portal v1 diagnosis for {clientName} ({clientId}): templateType={templateType}, bypass={bypassStatus}, campaign={campaignId}, errors={errors}.',
    preconditions: {
      requiredChannel: 'auronix_portal',
      clarificationQuestion:
        'Para diagnosticar este flujo necesito confirmar que el origen fue Portal Auronix.',
    },
  },
  {
    id: 'shipping_error_portal_v2',
    domain: 'campaigns',
    title: 'Shipping errors portal v2',
    description:
      'Diagnose portal shipping errors for clients running on API v2',
    triggers: ['portal v2 no envia', 'error envio portal v2'],
    requiredInputs: ['clientName', 'clientId'],
    allowedTools: ['campaigns.findByName', 'campaigns.getErrors'],
    steps: [
      {
        id: '1',
        description: 'Find campaign sample when available',
        tool: 'campaigns.findByName',
        onFailure: 'continue',
      },
      {
        id: '2',
        description: 'Get campaign errors when campaign exists',
        tool: 'campaigns.getErrors',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'Portal v2 diagnosis for {clientName} ({clientId}): templateType={templateType}, campaign={campaignId}, errors={errors}.',
    preconditions: {
      requiredChannel: 'auronix_portal',
      clarificationQuestion:
        'Para diagnosticar este flujo necesito confirmar que el origen fue Portal Auronix.',
    },
  },
  {
    id: 'shipping_error_api_v1',
    domain: 'campaigns',
    title: 'Shipping errors API v1',
    description: 'Diagnose shipping errors for direct API v1 integrations',
    triggers: ['api v1 no envia', 'integracion api v1 con error'],
    requiredInputs: ['clientName', 'clientId'],
    allowedTools: [
      'bypass.checkClient',
      'campaigns.findByName',
      'campaigns.getErrors',
    ],
    steps: [
      {
        id: '1',
        description: 'Check bypass status for v1 client',
        tool: 'bypass.checkClient',
        onFailure: 'continue',
      },
      {
        id: '2',
        description: 'Find campaign sample when available',
        tool: 'campaigns.findByName',
        onFailure: 'continue',
      },
      {
        id: '3',
        description: 'Get campaign errors when campaign exists',
        tool: 'campaigns.getErrors',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'API v1 diagnosis for {clientName} ({clientId}): templateType={templateType}, bypass={bypassStatus}, campaign={campaignId}, errors={errors}.',
    preconditions: {
      requiredChannel: 'api_integration',
      clarificationQuestion:
        'Para diagnosticar este flujo necesito confirmar que el origen fue API Integration.',
    },
  },
  {
    id: 'shipping_error_api_v2',
    domain: 'campaigns',
    title: 'Shipping errors API v2',
    description: 'Diagnose shipping errors for direct API v2 integrations',
    triggers: ['api v2 no envia', 'integracion api v2 con error'],
    requiredInputs: ['clientName', 'clientId'],
    allowedTools: ['campaigns.findByName', 'campaigns.getErrors'],
    steps: [
      {
        id: '1',
        description: 'Find campaign sample when available',
        tool: 'campaigns.findByName',
        onFailure: 'continue',
      },
      {
        id: '2',
        description: 'Get campaign errors when campaign exists',
        tool: 'campaigns.getErrors',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'API v2 diagnosis for {clientName} ({clientId}): templateType={templateType}, campaign={campaignId}, errors={errors}.',
    preconditions: {
      requiredChannel: 'api_integration',
      clarificationQuestion:
        'Para diagnosticar este flujo necesito confirmar que el origen fue API Integration.',
    },
  },
  {
    id: 'shipping_error_send',
    domain: 'campaigns',
    title: 'Shipping errors Send backend',
    description: 'Diagnose shipping errors for Send backend flow',
    triggers: ['send no envia', 'error de envio send'],
    requiredInputs: ['clientName', 'clientId'],
    allowedTools: ['campaigns.findByName', 'campaigns.getErrors'],
    steps: [
      {
        id: '1',
        description: 'Find campaign sample when available',
        tool: 'campaigns.findByName',
        onFailure: 'continue',
      },
      {
        id: '2',
        description: 'Get campaign errors when campaign exists',
        tool: 'campaigns.getErrors',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'Send backend diagnosis for {clientName} ({clientId}): templateType={templateType}, campaign={campaignId}, errors={errors}.',
    preconditions: {
      requiredChannel: 'send_portal',
      clarificationQuestion:
        'Para diagnosticar este flujo necesito confirmar que el origen fue Send.',
    },
  },
  {
    id: 'activate_sender_v2',
    domain: 'features',
    title: 'Activate sender v2',
    description: 'Guide user through activating sender v2 feature',
    triggers: [
      'activar enviador v2',
      'sender v2',
      'enviador v2',
      'activate sender',
    ],
    requiredInputs: ['clientName'],
    allowedTools: ['clients.findByName', 'gitlab.checkFeatureFlag'],
    steps: [
      {
        id: '1',
        description: 'Find client by name',
        tool: 'clients.findByName',
        onFailure: 'stop',
      },
      {
        id: '2',
        description: 'Check if feature flag is enabled',
        tool: 'gitlab.checkFeatureFlag',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'Sender v2 for {clientName}: feature flag status={featureFlagStatus}. To activate: ensure flag is on, then redeploy with v2 config.',
  },
  {
    id: 'template_rejected',
    domain: 'messaging',
    title: 'Template rejected by Meta',
    description: 'Find out why a template was rejected',
    triggers: [
      'plantilla rechazada',
      'template rejected',
      'rechazo',
      'no aprobada',
    ],
    requiredInputs: ['templateName', 'clientName'],
    allowedTools: [
      'clients.findByName',
      'templates.findByName',
      'meta.getRejectionReason',
    ],
    steps: [
      {
        id: '1',
        description: 'Find client by name',
        tool: 'clients.findByName',
        onFailure: 'stop',
      },
      {
        id: '2',
        description: 'Find template by name',
        tool: 'templates.findByName',
        onFailure: 'stop',
      },
      {
        id: '3',
        description: 'Get rejection reason from Meta',
        tool: 'meta.getRejectionReason',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'Template {templateName} for {clientName} was rejected. Reason: {rejectionReason}. Fix the issue and resubmit.',
  },
  {
    id: 'portal_login_failed',
    domain: 'portal',
    title: 'Portal login failed',
    description: 'Diagnose why a user cannot log into the portal',
    triggers: [
      'no puede entrar',
      'login failed',
      'no inicia sesion',
      'portal access',
    ],
    requiredInputs: ['userEmail'],
    allowedTools: [
      'users.findByEmail',
      'users.getStatus',
      'auth.getLoginAttempts',
    ],
    steps: [
      {
        id: '1',
        description: 'Find user by email',
        tool: 'users.findByEmail',
        onFailure: 'stop',
      },
      {
        id: '2',
        description: 'Check user status',
        tool: 'users.getStatus',
        onFailure: 'continue',
      },
      {
        id: '3',
        description: 'Check login attempts',
        tool: 'auth.getLoginAttempts',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'User {userEmail}: status={userStatus}, loginAttempts={loginAttempts}. If locked, unlock account. If disabled, request reactivation.',
  },
  {
    id: 'user_cannot_see_accounts',
    domain: 'permissions',
    title: 'User cannot see accounts',
    description: 'Diagnose why a user cannot see accounts in the portal',
    triggers: [
      'no puede ver cuentas',
      'cannot see accounts',
      'accounts missing',
      'no ve cuentas',
    ],
    requiredInputs: ['userEmail'],
    allowedTools: [
      'users.findByEmail',
      'permissions.getRoles',
      'permissions.getAccounts',
      'accounts.findByName',
    ],
    steps: [
      {
        id: '1',
        description: 'Find user by email',
        tool: 'users.findByEmail',
        onFailure: 'stop',
      },
      {
        id: '2',
        description: 'Get user roles',
        tool: 'permissions.getRoles',
        onFailure: 'continue',
      },
      {
        id: '3',
        description: 'Get accounts for user',
        tool: 'permissions.getAccounts',
        onFailure: 'continue',
      },
    ],
    resolutionTemplate:
      'User {userEmail}: roles={roles}, accounts={accounts}. If missing permissions, assign account-view role. If account not linked, link account to user.',
  },
];
