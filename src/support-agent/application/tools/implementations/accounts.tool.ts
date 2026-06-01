import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountsTool {
  async findByName(inputs: { name: string }): Promise<Record<string, unknown>> {
    if (inputs.name.toLowerCase().includes('main')) {
      return { accountId: 'acc-001', name: inputs.name, status: 'active' };
    }
    throw new Error(`Account not found: ${inputs.name}`);
  }
}
