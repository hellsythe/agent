import { EventEmitter } from 'node:events';
import type { FetcherInterface, FetchingOptions } from './fetcher';
export declare class AdaptiveFetcher extends EventEmitter implements FetcherInterface {
    private currentFetcher;
    private pollingFetcher;
    private streamingFetcher;
    private options;
    private stopped;
    constructor(options: FetchingOptions);
    private setupFetcherEventForwarding;
    private handleModeChange;
    private switchToPolling;
    private switchToStreaming;
    start(): Promise<void>;
    setMode(mode: 'polling' | 'streaming'): Promise<void>;
    stop(): void;
    getMode(): 'streaming' | 'polling';
    getFailures(): number;
    nextFetch(): number;
    fetch(): Promise<void>;
    getEtag(): string | undefined;
    setEtag(value: string | undefined): void;
}
//# sourceMappingURL=adaptive-fetcher.d.ts.map