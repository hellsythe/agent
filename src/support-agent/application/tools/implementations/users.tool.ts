import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersTool {
  async findByEmail(inputs: { email: string }): Promise<Record<string, unknown>> {
    if (inputs.email.includes('test')) {
      return { userId: 'user-001', email: inputs.email, name: 'Test User', status: 'active' };
    }
    throw new Error(`User not found: ${inputs.email}`);
  }

  async getStatus(inputs: { userId: string }): Promise<Record<string, unknown>> {
    return { userId: inputs.userId, status: 'active', lastLogin: '2024-01-15T10:00:00Z' };
  }
}
