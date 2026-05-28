import { EventEmitter } from 'node:events';
import type { TagFilter } from '../tags';
import type { FetcherInterface, PollingFetchingOptions } from './fetcher';
export declare class PollingFetcher extends EventEmitter implements FetcherInterface {
    private timer;
    private stopped;
    private failures;
    private etag;
    private options;
    constructor(options: PollingFetchingOptions);
    timedFetch(interval: number): void;
    start(): Promise<void>;
    nextFetch(): number;
    getFailures(): number;
    getEtag(): string | undefined;
    setEtag(value: string | undefined): void;
    private backoff;
    private countSuccess;
    private configurationError;
    private recoverableError;
    private handleErrorCases;
    fetch(): Promise<void>;
    mergeTagsToStringArray(tags: Array<TagFilter>): Array<string>;
    stop(): void;
}
//# sourceMappingURL=polling-fetcher.d.ts.map