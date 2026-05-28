import { EventEmitter } from 'node:events';
import type { FetcherInterface, StreamingFetchingOptions } from './fetcher';
export declare class StreamingFetcher extends EventEmitter implements FetcherInterface {
    private eventSource;
    private readonly url;
    private readonly appName;
    private readonly instanceId;
    private readonly headers?;
    private readonly connectionId?;
    private readonly onSave;
    private readonly onModeChange?;
    private readonly failoverStrategy;
    constructor({ url, appName, instanceId, headers, connectionId, eventSource, maxFailuresUntilFailover, failureWindowMs, onSave, onModeChange, }: StreamingFetchingOptions);
    private setupEventSource;
    private handleErrorEvent;
    private handleServerDisconnect;
    private handleFailoverDecision;
    private handleFlagsFromStream;
    private handleModeChange;
    private forceRehydration;
    private createEventSource;
    start(): Promise<void>;
    stop(): void;
}
//# sourceMappingURL=streaming-fetcher.d.ts.map