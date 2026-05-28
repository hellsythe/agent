import { EventEmitter } from 'node:events';
import type { Context } from './context';
import type { FeatureInterface } from './feature';
import type { RepositoryInterface } from './repository';
import type { Strategy, StrategyTransportInterface } from './strategy';
import type { Constraint, Segment, StrategyResult } from './strategy/strategy';
import { type Variant, type VariantWithFeatureStatus } from './variant';
/**
 * Type for toggle name queries. Defaults to string but can be augmented by users.
 * Users can extend this via module augmentation:
 *
 * declare module 'unleash-client' {
 *   interface UnleashTypes {
 *     flagNames: 'foo' | 'bar';
 *   }
 * }
 */
export interface UnleashTypes {
    flagNames: string;
}
export type Name = UnleashTypes['flagNames'];
export default class UnleashClient extends EventEmitter {
    private repository;
    private strategies;
    private warnedStrategies;
    private warnedDependencies;
    constructor(repository: RepositoryInterface, strategies: Strategy[]);
    private getStrategy;
    warnStrategyOnce(missingStrategy: string, name: string, strategies: StrategyTransportInterface[]): void;
    warnDependencyOnce(missingDependency: string, name: string): void;
    isParentDependencySatisfied(feature: FeatureInterface | undefined, context: Context): boolean;
    isEnabled(name: Name, context: Context, fallback: () => boolean): boolean;
    isFeatureEnabled(feature: FeatureInterface | undefined, context: Context, fallback: () => boolean): StrategyResult;
    yieldConstraintsFor(strategy: StrategyTransportInterface): IterableIterator<Constraint | undefined>;
    yieldSegmentConstraints(segments: (Segment | undefined)[]): IterableIterator<Constraint | undefined>;
    getVariant(name: string, context: Context, fallbackVariant?: Variant): VariantWithFeatureStatus;
    forceGetVariant(name: string, context: Context, fallbackVariant?: Variant): VariantWithFeatureStatus;
    private resolveVariant;
}
//# sourceMappingURL=client.d.ts.map