"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingFetcher = void 0;
const node_events_1 = require("node:events");
const event_source_1 = require("../event-source");
const events_1 = require("../events");
const feature_1 = require("../feature");
const request_1 = require("../request");
const url_utils_1 = require("../url-utils");
const streaming_fail_over_1 = require("./streaming-fail-over");
class StreamingFetcher extends node_events_1.EventEmitter {
    eventSource;
    url;
    appName;
    instanceId;
    headers;
    connectionId;
    onSave;
    onModeChange;
    failoverStrategy;
    constructor({ url, appName, instanceId, headers, connectionId, eventSource, maxFailuresUntilFailover = 5, failureWindowMs = 60_000, onSave, onModeChange, }) {
        super();
        this.url = url;
        this.appName = appName;
        this.instanceId = instanceId;
        this.headers = headers;
        this.connectionId = connectionId;
        this.onSave = onSave;
        this.onModeChange = onModeChange;
        this.eventSource = eventSource;
        this.failoverStrategy = new streaming_fail_over_1.FailoverStrategy(maxFailuresUntilFailover, failureWindowMs);
    }
    setupEventSource() {
        if (this.eventSource) {
            this.eventSource.addEventListener('unleash-connected', async (event) => {
                await this.handleFlagsFromStream(event);
            });
            this.eventSource.addEventListener('unleash-updated', this.handleFlagsFromStream.bind(this));
            this.eventSource.addEventListener('error', this.handleErrorEvent.bind(this));
            this.eventSource.addEventListener('end', this.handleServerDisconnect.bind(this));
            this.eventSource.addEventListener('fetch-mode', this.handleModeChange.bind(this));
        }
    }
    async handleErrorEvent(error) {
        const now = new Date();
        const statusCode = typeof error === 'object' &&
            error !== null &&
            typeof error.status === 'number'
            ? error.status
            : undefined;
        const message = typeof error === 'string'
            ? error
            : typeof error === 'object' &&
                error !== null &&
                typeof error.message === 'string'
                ? error.message
                : undefined;
        const failEvent = typeof statusCode === 'number'
            ? {
                type: 'http-status-error',
                message: message ?? `Stream failed with http status code ${statusCode}`,
                statusCode,
                occurredAt: now,
            }
            : {
                type: 'network-error',
                message: message ?? 'Network error occurred in streaming',
                occurredAt: now,
            };
        await this.handleFailoverDecision(failEvent);
    }
    async handleServerDisconnect() {
        const failEvent = {
            type: 'network-error',
            message: 'Server closed the streaming connection',
            occurredAt: new Date(),
        };
        await this.handleFailoverDecision(failEvent);
    }
    async handleFailoverDecision(event) {
        const now = new Date();
        const shouldFailover = this.failoverStrategy.shouldFailover(event, now);
        if (!shouldFailover) {
            return;
        }
        this.emit(events_1.UnleashEvents.Warn, event.message);
        if (this.onModeChange) {
            await this.onModeChange('polling');
        }
    }
    async handleFlagsFromStream(event) {
        try {
            const data = (0, feature_1.parseApiResponse)(JSON.parse(event.data));
            await this.onSave(data, true);
        }
        catch (err) {
            const errorMessage = err instanceof Error && typeof err.message === 'string' ? err.message : String(err);
            this.emit(events_1.UnleashEvents.Warn, `Requesting full re-hydration to prevent data loss because of a failed event process: ${errorMessage}`);
            this.forceRehydration();
        }
    }
    async handleModeChange(event) {
        const newMode = event.data;
        if (newMode === 'polling') {
            await this.handleFailoverDecision({
                type: 'server-hint',
                event: `polling`,
                message: 'Server has explicitly requested switching to polling mode',
                occurredAt: new Date(),
            });
        }
    }
    forceRehydration() {
        if (!this.eventSource) {
            return;
        }
        const currentEventSource = this.eventSource;
        this.eventSource = undefined;
        currentEventSource?.close();
        // Explicitly construct a new EventSource, this beast traps the last
        // event id in internal state and if we allow it to attempt to connect with that
        // Unleash will not send a rehydration to us, we'll pick up from where we left off
        this.eventSource = this.createEventSource();
        this.setupEventSource();
    }
    createEventSource() {
        return new event_source_1.EventSource((0, url_utils_1.resolveUrl)(this.url, './client/streaming'), {
            headers: (0, request_1.buildHeaders)({
                appName: this.appName,
                instanceId: this.instanceId,
                etag: undefined,
                contentType: undefined,
                custom: this.headers,
                specVersionSupported: '5.2.0',
                connectionId: this.connectionId,
            }),
            readTimeoutMillis: 60000,
            initialRetryDelayMillis: 2000,
            maxBackoffMillis: 30000,
            retryResetIntervalMillis: 60000,
            jitterRatio: 0.5,
            errorFilter: () => true,
        });
    }
    async start() {
        if (!this.eventSource) {
            this.eventSource = this.createEventSource();
        }
        this.setupEventSource();
    }
    stop() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = undefined;
        }
    }
}
exports.StreamingFetcher = StreamingFetcher;
//# sourceMappingURL=streaming-fetcher.js.map