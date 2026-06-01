import { Injectable } from '@nestjs/common';
import type { Playbook, PlaybookMatch } from '../../domain/playbook.entity';
import { PLAYBOOK_DEFINITIONS } from '../playbooks/playbook-definitions';

@Injectable()
export class PlaybookRetrieverService {
  retrieve(message: string, domain?: string): PlaybookMatch[] {
    const text = message.toLowerCase();
    const candidates = domain
      ? PLAYBOOK_DEFINITIONS.filter((p) => p.domain === domain)
      : PLAYBOOK_DEFINITIONS;

    const scored = candidates.map((playbook) => {
      let score = 0.1;
      for (const trigger of playbook.triggers) {
        if (text.includes(trigger.toLowerCase())) {
          score += 0.4;
        }
      }
      const requiredSet = new Set(playbook.requiredInputs);
      const foundInputs: Record<string, string> = {};
      let foundCount = 0;
      for (const key of Object.keys(foundInputs)) {
        if (requiredSet.has(key)) foundCount++;
      }
      if (playbook.requiredInputs.length > 0) {
        score += (foundCount / playbook.requiredInputs.length) * 0.3;
      }

      const missing = playbook.requiredInputs.filter((ri) => !foundInputs[ri]);

      return {
        playbook,
        confidence: Math.min(score, 1),
        missingInputs: missing,
      };
    });

    scored.sort((a, b) => b.confidence - a.confidence);
    return scored.slice(0, 3);
  }
}
