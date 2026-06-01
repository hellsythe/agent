import { Inject, Injectable } from '@nestjs/common';
import { LLM_PORT } from '../ports/llm.port';
import type { LlmPort } from '../ports/llm.port';

@Injectable()
export class PlaybookInputExtractorService {
  constructor(@Inject(LLM_PORT) private readonly llmPort: LlmPort) {}

  async extract(
    message: string,
    requiredInputs: string[],
  ): Promise<Record<string, string>> {
    if (!requiredInputs.length) {
      return {};
    }

    try {
      const response = await this.llmPort.generateJson<{
        extractedInputs: Record<string, string>;
      }>({
        messages: [
          {
            role: 'system',
            content:
              'You extract required fields from user text. Return ONLY JSON with key extractedInputs. Use exact camelCase keys provided in requiredInputs. If a value is missing, do not invent it. If requiredInputs includes clientId and the user provides a numeric id (for example 49980), extract it as clientId and prioritize it over clientName for client resolution.',
          },
          {
            role: 'user',
            content: `Message: ${message}\nRequired inputs: ${requiredInputs.join(', ')}`,
          },
        ],
      });

      const extracted = response.json.extractedInputs ?? {};
      const filtered: Record<string, string> = {};
      for (const key of requiredInputs) {
        const value = extracted[key];
        if (value) {
          filtered[key] = value;
        }
      }

      return filtered;
    } catch {
      return {};
    }
  }
}
