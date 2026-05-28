import {
  startDefaultTestInfrastructure,
  type TestInfrastructureRuntime,
} from '@sdkconsultoria/nestjs-base';

type RuntimeState = {
  runtime?: TestInfrastructureRuntime;
  profile?: 'mongo' | 'full';
};

const state: RuntimeState = {};

export async function startTestInfrastructure(
  profile: 'mongo' | 'full' = 'mongo',
): Promise<Record<string, string>> {
  if (state.runtime && state.profile === profile) {
    return state.runtime.env;
  }

  if (state.runtime) {
    await state.runtime.stop();
    state.runtime = undefined;
    state.profile = undefined;
  }

  const runtime = await startDefaultTestInfrastructure({
    profile,
  });
  state.runtime = runtime;
  state.profile = profile;

  Object.assign(process.env, runtime.env);
  return runtime.env;
}

export async function stopTestInfrastructure(): Promise<void> {
  if (state.runtime) {
    await state.runtime.stop();
    state.runtime = undefined;
    state.profile = undefined;
  }
}

export async function startMongoTestInfrastructure(): Promise<Record<string, string>> {
  return startTestInfrastructure('mongo');
}

export async function startFullTestInfrastructure(): Promise<Record<string, string>> {
  return startTestInfrastructure('full');
}
