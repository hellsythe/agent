import type { CriteriaFilterMap } from '@sdkconsultoria/nestjs-base/shared/application/criteria/filter-operator';
import { SessionCriteria } from '../../../domain/session.criteria';
import { SessionPersistence } from '../../mappers/session.mapper';

export const SESSION_FILTER_MAP: CriteriaFilterMap<SessionCriteria, SessionPersistence> = {
  id: { fieldName: '_id', operator: 'equals' },
  userId: { fieldName: 'userId', operator: 'equals' },
  alias: { fieldName: 'alias', operator: 'like' },
};
