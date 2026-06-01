import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplatesTool {
  async findByName(inputs: { name: string }): Promise<Record<string, unknown>> {
    if (inputs.name.toLowerCase().includes('carousel')) {
      return { templateId: 'tpl-carousel-001', name: inputs.name, type: 'carousel', status: 'approved' };
    }
    return { templateId: 'tpl-std-001', name: inputs.name, type: 'text', status: 'approved' };
  }
}
