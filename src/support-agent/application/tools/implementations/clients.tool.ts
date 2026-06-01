import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsTool {
  private readonly clientsById: Record<
    string,
    { clientId: string; name: string; status: string }
  > = {
    '49980': { clientId: '49980', name: 'Aurrera', status: 'active' },
    'client-aurrera-mx': {
      clientId: 'client-aurrera-mx',
      name: 'Aurrera',
      status: 'active',
    },
    'client-walmart-mx': {
      clientId: 'client-walmart-mx',
      name: 'Walmart',
      status: 'active',
    },
    'client-chedraui-norte': {
      clientId: 'client-chedraui-norte',
      name: 'Chedraui Norte',
      status: 'active',
    },
    'client-chedraui-sur': {
      clientId: 'client-chedraui-sur',
      name: 'Chedraui Sur',
      status: 'active',
    },
  };

  async findByName(inputs: { name: string }): Promise<Record<string, unknown>> {
    const name = inputs.name?.trim();
    if (!name) {
      throw new Error('clientName is required');
    }
    const normalized = name.toLowerCase();
    if (normalized === 'chedraui') {
      return {
        clientCandidates: [
          { clientId: 'client-chedraui-norte', name: 'Chedraui Norte' },
          { clientId: 'client-chedraui-sur', name: 'Chedraui Sur' },
        ],
        name: 'Chedraui',
      };
    }
    if (normalized === 'aurrera') {
      return {
        clientId: 'client-aurrera-mx',
        name: 'Aurrera',
        status: 'active',
      };
    }
    if (normalized === 'walmart') {
      return {
        clientId: 'client-walmart-mx',
        name: 'Walmart',
        status: 'active',
      };
    }
    throw new Error(`Client not found: ${inputs.name}`);
  }

  async resolveClient(inputs: {
    clientName?: string;
    clientId?: string;
  }): Promise<Record<string, unknown>> {
    if (inputs.clientId) {
      const normalizedId = String(inputs.clientId).trim();
      const byId = this.clientsById[normalizedId];
      if (!byId) {
        throw new Error(`Client not found for clientId: ${normalizedId}`);
      }
      return {
        clientId: byId.clientId,
        clientName: byId.name,
        status: byId.status,
      };
    }

    if (inputs.clientName) {
      const resolved = await this.findByName({ name: inputs.clientName });
      if (resolved.name && !resolved.clientName) {
        return { ...resolved, clientName: resolved.name };
      }
      return resolved;
    }

    throw new Error('clientName or clientId is required');
  }

  async getDeliveryRuntime(inputs: {
    clientId: string;
    requestedChannel?: string;
  }): Promise<Record<string, unknown>> {
    const profileByClientId: Record<
      string,
      { runtimeApiVersion: 'v1' | 'v2' }
    > = {
      'client-aurrera-mx': { runtimeApiVersion: 'v1' },
      'client-walmart-mx': { runtimeApiVersion: 'v2' },
      'client-chedraui-norte': { runtimeApiVersion: 'v1' },
      'client-chedraui-sur': { runtimeApiVersion: 'v2' },
    };

    const profile = profileByClientId[inputs.clientId];
    if (!profile) {
      throw new Error(
        `Runtime profile not found for clientId: ${inputs.clientId}`,
      );
    }

    return {
      runtimeApiVersion: profile.runtimeApiVersion,
      resolvedChannel: inputs.requestedChannel ?? 'unknown',
    };
  }
}
