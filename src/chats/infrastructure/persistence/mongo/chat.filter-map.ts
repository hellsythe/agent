import type { CriteriaFilterMap } from '@sdkconsultoria/nestjs-base/shared/application/criteria/filter-operator';
import type { ChatCriteria } from '../../../domain/chat.criteria';
import type { ChatPersistence } from '../../mappers/chat.mapper';

export const CHAT_FILTER_MAP: CriteriaFilterMap<ChatCriteria, ChatPersistence> =
  {
    sessionId: { fieldName: 'sessionId', operator: 'equals' },
    userId: { fieldName: 'userId', operator: 'equals' },
    role: { fieldName: 'role', operator: 'equals' },
    visibility: { fieldName: 'visibility', operator: 'equals' },
    turnId: { fieldName: 'turnId', operator: 'equals' },
  };
