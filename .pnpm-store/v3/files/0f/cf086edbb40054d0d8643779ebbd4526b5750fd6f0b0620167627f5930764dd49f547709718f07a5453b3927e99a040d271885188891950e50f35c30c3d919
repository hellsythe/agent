export type FailEvent = NetworkEventError | HttpStatusError | ServerEvent;
type BaseFailEvent = {
    occurredAt: Date;
    message: string;
};
type NetworkEventError = BaseFailEvent & {
    type: 'network-error';
};
type HttpStatusError = BaseFailEvent & {
    statusCode: number;
    type: 'http-status-error';
};
type ServerEvent = BaseFailEvent & {
    event: string;
    type: 'server-hint';
};
export declare class FailoverStrategy {
    private readonly maxFails;
    private readonly relaxTimeMs;
    private failures;
    constructor(maxFails: number, relaxTimeMs: number);
    shouldFailover(event: FailEvent, now?: Date): boolean;
    private handleServerEvent;
    private handleNetwork;
    private handleHttpStatus;
    private hasTooManyFails;
    private pruneOldFailures;
}
export {};
//# sourceMappingURL=streaming-fail-over.d.ts.map