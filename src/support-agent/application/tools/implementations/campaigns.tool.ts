import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignsTool {
  async findByName(inputs: { name: string }): Promise<Record<string, unknown>> {
    const name = inputs.name?.trim();
    if (!name) {
      throw new Error('campaignName is required');
    }
    if (name.toLowerCase().includes('summer')) {
      return { campaignId: 'camp-001', name: inputs.name, status: 'active' };
    }
    throw new Error(`Campaign not found: ${inputs.name}`);
  }

  async getErrors(inputs: { campaignId: string }): Promise<Record<string, unknown>> {
    return { campaignId: inputs.campaignId, errors: ['Rate limit exceeded at 14:00'] };
  }
}
