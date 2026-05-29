import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { LlmGenerateParams, LlmGenerateResult, LlmPort } from '../../../../application/ports/llm.port';

@Injectable()
export class OpenAiHttpAdapter implements LlmPort {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY') ?? process.env.OPENAI_API_KEY;
    this.model =
      this.configService.get<string>('OPENAI_MODEL') ?? process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

    this.client = new OpenAI({ apiKey });
  }

  async generateText(params: LlmGenerateParams): Promise<LlmGenerateResult> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: params.messages,
    });

    return {
      content: completion.choices[0]?.message?.content ?? '',
      model: completion.model,
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
    };
  }
}
