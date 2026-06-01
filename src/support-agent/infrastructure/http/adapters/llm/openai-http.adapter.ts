import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type {
  LlmGenerateJsonResult,
  LlmGenerateParams,
  LlmGenerateResult,
  LlmPort,
} from '../../../../application/ports/llm.port';

@Injectable()
export class OpenAiHttpAdapter implements LlmPort {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey =
      this.configService.get<string>('OPENAI_API_KEY') ??
      process.env.OPENAI_API_KEY;
    this.model =
      this.configService.get<string>('OPENAI_MODEL') ??
      process.env.OPENAI_MODEL ??
      'gpt-4o-mini';

    this.client = new OpenAI({ apiKey });
  }

  async generateText(params: LlmGenerateParams): Promise<LlmGenerateResult> {
    console.log('LLM request (text)', {
      model: this.model,
      messages: this.summarizeMessages(params.messages),
    });

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: params.messages,
    });

    console.log('LLM response (text)', {
      model: completion.model,
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
      contentPreview: this.truncate(
        completion.choices[0]?.message?.content ?? '',
      ),
    });

    return {
      content: completion.choices[0]?.message?.content ?? '',
      model: completion.model,
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
    };
  }

  async generateJson<T>(
    params: LlmGenerateParams,
  ): Promise<LlmGenerateJsonResult<T>> {
    console.log('LLM request (json)', {
      model: this.model,
      messages: this.summarizeMessages(params.messages),
    });

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: params.messages,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content ?? '{}';

    console.log('LLM response (json)', {
      model: completion.model,
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
      contentPreview: this.truncate(content),
    });

    return {
      content,
      json: JSON.parse(content) as T,
      model: completion.model,
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
    };
  }

  private summarizeMessages(messages: LlmGenerateParams['messages']): Array<{
    role: string;
    contentPreview: string;
  }> {
    return messages.map((message) => ({
      role: message.role,
      contentPreview: this.truncate(message.content),
    }));
  }

  private truncate(value: string, maxLength = 500): string {
    if (value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength)}...`;
  }
}
