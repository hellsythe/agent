import { Injectable } from '@nestjs/common';

@Injectable()
export class MetaTool {
  async getTemplateStatus(inputs: { templateId: string }): Promise<Record<string, unknown>> {
    return { templateId: inputs.templateId, status: 'active', qualityScore: 0.95 };
  }

  async getRejectionReason(inputs: { templateId: string }): Promise<Record<string, unknown>> {
    return {
      templateId: inputs.templateId,
      rejectionReason: 'Policy violation: promotional content outside allowed hours',
      category: 'policy',
    };
  }
}
