import { EventEmitter } from 'node:events';
import { type ApiResponse, type ClientFeaturesResponse, type EnhancedFeatureInterface, type FeatureInterface } from '../feature';
import type { CustomHeaders, CustomHeadersFunction } from '../headers';
import type { HttpOptions } from '../http-options';
import type { Segment } from '../strategy/strategy';
import type { TagFilter } from '../tags';
import type { Mode } from '../unleash-config';
import type { BootstrapProvider } from './bootstrap-provider';
import type { StorageProvider } from './storage-provider';
export declare const SUPPORTED_SPEC_VERSION = "5.2.0";
export interface RepositoryInterface extends EventEmitter {
    getToggle(name: string): FeatureInterface | undefined;
    getToggles(): FeatureInterface[];
    getTogglesWithSegmentData(): EnhancedFeatureInterface[];
    getSegment(id: number): Segment | undefined;
    stop(): void;
    start(): Promise<void>;
    setMode?(mode: 'polling' | 'streaming'): Promise<void>;
}
export interface RepositoryOptions {
    url: string;
    appName: string;
    instanceId: string;
    connectionId: string;
    projectName?: string;
    refreshInterval: number;
    timeout?: number;
    headers?: CustomHeaders;
    customHeadersFunction?: CustomHeadersFunction;
    httpOptions?: HttpOptions;
    namePrefix?: string;
    tags?: Array<TagFilter>;
    bootstrapProvider: BootstrapProvider;
    bootstrapOverride?: boolean;
    storageProvider: StorageProvider<ClientFeaturesResponse>;
    eventSource?: EventSource;
    mode: Mode;
}
export default class Repository extends EventEmitter implements EventEmitter {
    private appName;
    private bootstrapProvider;
    private bootstrapOverride;
    private storageProvider;
    private ready;
    private connected;
    private stopped;
    private data;
    private segments;
    private fetcher;
    readonly url: string;
    readonly projectName?: string;
    get etag(): string | undefined;
    set etag(value: string | undefined);
    constructor({ url, appName, instanceId, connectionId, projectName, refreshInterval, timeout, headers, customHeadersFunction, httpOptions, namePrefix, tags, bootstrapProvider, bootstrapOverride, storageProvider, eventSource, mode, }: RepositoryOptions);
    private setupFetchingStrategyEvents;
    validateFeature(feature: FeatureInterface): void;
    start(): Promise<void>;
    loadBackup(): Promise<void>;
    setReady(): void;
    createSegmentLookup(segments: Segment[] | undefined): Map<number, Segment>;
    save(response: ApiResponse, fromApi: boolean): Promise<void>;
    private applyFeatureResponse;
    notEmpty(content: ClientFeaturesResponse): boolean;
    loadBootstrap(): Promise<void>;
    private convertToMap;
    stop(): void;
    getSegment(segmentId: number): Segment | undefined;
    getToggle(name: string): FeatureInterface | undefined;
    getToggles(): FeatureInterface[];
    getTogglesWithSegmentData(): EnhancedFeatureInterface[];
    getMode(): 'streaming' | 'polling';
    setMode(mode: 'polling' | 'streaming'): Promise<void>;
    getFailures(): number;
    nextFetch(): number;
    fetch(): Promise<void>;
    private enhanceStrategies;
}
//# sourceMappingURL=index.d.ts.map