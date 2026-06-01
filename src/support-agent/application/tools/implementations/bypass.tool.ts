import { Injectable } from '@nestjs/common';

@Injectable()
export class BypassTool {
  async checkClient(inputs: { clientId: string }): Promise<Record<string, unknown>> {
    if (inputs.clientId === 'client-chedraui-mx') {
      return { bypassEnabled: false, clientId: inputs.clientId };
    }
    return { bypassEnabled: true, clientId: inputs.clientId };
  }
}
