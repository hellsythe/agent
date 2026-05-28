import { EventEmitter } from 'node:stream';
import type Client from '../client';
import { type StaticContext } from '../unleash';
import type { ImpactMetricRegistry, MetricFlagContext } from './metric-types';
export declare class MetricsAPI extends EventEmitter {
    private metricRegistry;
    private variantResolver;
    private staticContext;
    constructor(metricRegistry: ImpactMetricRegistry, variantResolver: Pick<Client, 'forceGetVariant'>, staticContext: StaticContext);
    defineCounter(name: string, help: string): void;
    defineGauge(name: string, help: string): void;
    defineHistogram(name: string, help: string, buckets?: number[]): void;
    private getFlagLabels;
    /**
     * @param flagContext - @deprecated This parameter will be removed in a future release.
     */
    incrementCounter(name: string, value?: number, flagContext?: MetricFlagContext): void;
    /**
     * @param flagContext - @deprecated This parameter will be removed in a future release.
     */
    updateGauge(name: string, value: number, flagContext?: MetricFlagContext): void;
    /**
     * @param flagContext - @deprecated This parameter will be removed in a future release.
     */
    observeHistogram(name: string, value: number, flagContext?: MetricFlagContext): void;
}
//# sourceMappingURL=metric-api.d.ts.map