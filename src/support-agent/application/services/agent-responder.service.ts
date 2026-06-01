import { Inject, Injectable } from '@nestjs/common';
import { LLM_PORT } from '../ports/llm.port';
import type { LlmPort } from '../ports/llm.port';

@Injectable()
export class AgentResponderService {
  constructor(@Inject(LLM_PORT) private readonly llmPort: LlmPort) {}

  async buildFinalResponse(input: {
    message: string;
    finalDiagnosis: string;
    evidence: string[];
  }): Promise<string> {
    const response = await this.llmPort.generateText({
      messages: [
        {
          role: 'system',
          content:
            'You are an internal technical support agent. Respond in Spanish, concise and actionable. Include: diagnosis, key evidence, and next action.',
        },
        {
          role: 'user',
          content: `Mensaje original: ${input.message}\nDiagnostico: ${input.finalDiagnosis}\nEvidencia: ${JSON.stringify(input.evidence)}`,
        },
      ],
    });

    return response.content;
  }
}
