import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthTool {
  async getLoginAttempts(inputs: { userId: string }): Promise<Record<string, unknown>> {
    return { userId: inputs.userId, attempts: 3, lockedUntil: null };
  }
}
