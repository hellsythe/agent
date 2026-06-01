import type { PlaybookId } from './playbook.entity';

export type PlannerAction =
  | 'switch_playbook'
  | 'continue'
  | 'ask_user'
  | 'finalize';

export interface PlannerDecision {
  action: PlannerAction;
  playbookId?: PlaybookId;
  question?: string;
  reason: string;
  confidence: number;
}
