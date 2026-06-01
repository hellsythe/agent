import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsTool {
  async getRoles(inputs: { userId: string }): Promise<Record<string, unknown>> {
    return { userId: inputs.userId, roles: ['viewer', 'campaign_manager'] };
  }

  async getAccounts(inputs: { userId: string }): Promise<Record<string, unknown>> {
    return { userId: inputs.userId, accounts: ['acc-001', 'acc-002'] };
  }
}
