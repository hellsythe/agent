import { Injectable } from '@nestjs/common';

@Injectable()
export class GitlabTool {
  async checkFeatureFlag(inputs: { featureName: string }): Promise<Record<string, unknown>> {
    if (inputs.featureName === 'sender_v2') {
      return { enabled: true, featureName: inputs.featureName };
    }
    return { enabled: false, featureName: inputs.featureName };
  }
}
