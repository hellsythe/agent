import type { Context } from '../context';
import { Strategy } from './strategy';
export default class FlexibleRolloutStrategy extends Strategy {
    private randomGenerator;
    constructor(randomGenerator?: () => string);
    resolveStickiness(stickiness: string, context: Context): string | undefined;
    isEnabled(parameters: {
        groupId?: string;
        rollout?: number | string;
        stickiness?: string;
    }, context: Context): boolean;
}
//# sourceMappingURL=flexible-rollout-strategy.d.ts.map