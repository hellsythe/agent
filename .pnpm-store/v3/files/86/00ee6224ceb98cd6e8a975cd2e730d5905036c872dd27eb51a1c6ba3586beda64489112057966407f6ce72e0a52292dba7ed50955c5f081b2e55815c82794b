"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_SPEC_VERSION = void 0;
const node_events_1 = require("node:events");
const events_1 = require("../events");
const feature_1 = require("../feature");
const adaptive_fetcher_1 = require("./adaptive-fetcher");
exports.SUPPORTED_SPEC_VERSION = '5.2.0';
class Repository extends node_events_1.EventEmitter {
    appName;
    bootstrapProvider;
    bootstrapOverride;
    storageProvider;
    ready = false;
    connected = false;
    stopped = false;
    data = {};
    segments;
    fetcher;
    // Keep references for backward compatibility
    url;
    projectName;
    // Etag property for backward compatibility
    get etag() {
        return this.fetcher.getEtag?.() || undefined;
    }
    set etag(value) {
        this.fetcher.setEtag?.(value);
    }
    constructor({ url, appName, instanceId, connectionId, projectName, refreshInterval = 15_000, timeout, headers, customHeadersFunction, httpOptions, namePrefix, tags, bootstrapProvider, bootstrapOverride = true, storageProvider, eventSource, mode, }) {
        super();
        this.appName = appName;
        this.url = url;
        this.projectName = projectName;
        this.bootstrapProvider = bootstrapProvider;
        this.bootstrapOverride = bootstrapOverride;
        this.storageProvider = storageProvider;
        this.segments = new Map();
        this.fetcher = new adaptive_fetcher_1.AdaptiveFetcher({
            url,
            appName,
            instanceId,
            connectionId,
            refreshInterval,
            timeout,
            headers,
            customHeadersFunction,
            httpOptions,
            namePrefix,
            tags,
            projectName,
            mode,
            eventSource,
            onSave: this.save.bind(this),
        });
        this.setupFetchingStrategyEvents();
    }
    setupFetchingStrategyEvents() {
        this.fetcher.on(events_1.UnleashEvents.Error, (err) => this.emit(events_1.UnleashEvents.Error, err));
        this.fetcher.on(events_1.UnleashEvents.Warn, (msg) => this.emit(events_1.UnleashEvents.Warn, msg));
        this.fetcher.on(events_1.UnleashEvents.Unchanged, () => this.emit(events_1.UnleashEvents.Unchanged));
        this.fetcher.on(events_1.UnleashEvents.Mode, (data) => this.emit(events_1.UnleashEvents.Mode, data));
    }
    validateFeature(feature) {
        const errors = [];
        if (!Array.isArray(feature.strategies)) {
            errors.push(`feature.strategies should be an array, but was ${typeof feature.strategies}`);
        }
        if (feature.variants && !Array.isArray(feature.variants)) {
            errors.push(`feature.variants should be an array, but was ${typeof feature.variants}`);
        }
        if (typeof feature.enabled !== 'boolean') {
            errors.push(`feature.enabled should be an boolean, but was ${typeof feature.enabled}`);
        }
        if (errors.length > 0) {
            const err = new Error(errors.join(', '));
            this.emit(events_1.UnleashEvents.Error, err);
        }
    }
    async start() {
        await Promise.all([this.fetcher.start(), this.loadBackup(), this.loadBootstrap()]);
    }
    async loadBackup() {
        try {
            const content = await this.storageProvider.get(this.appName);
            if (this.ready) {
                return;
            }
            if (content && this.notEmpty(content)) {
                this.data = this.convertToMap(content.features);
                this.segments = this.createSegmentLookup(content.segments);
                this.setReady();
            }
        }
        catch (err) {
            this.emit(events_1.UnleashEvents.Warn, err);
        }
    }
    setReady() {
        const doEmitReady = this.ready === false;
        this.ready = true;
        if (doEmitReady) {
            process.nextTick(() => {
                this.emit(events_1.UnleashEvents.Ready);
            });
        }
    }
    createSegmentLookup(segments) {
        if (!segments) {
            return new Map();
        }
        return new Map(segments.map((segment) => [segment.id, segment]));
    }
    async save(response, fromApi) {
        if (this.stopped) {
            return;
        }
        if (fromApi) {
            this.connected = true;
            this.applyFeatureResponse(response);
        }
        else if (!this.connected) {
            // Only allow bootstrap if not connected
            this.applyFeatureResponse(response);
        }
        this.setReady();
        const newFeatures = Object.values(this.data);
        this.emit(events_1.UnleashEvents.Changed, newFeatures);
        const clientFeatureResponse = {
            version: 'version' in response ? response.version : 2,
            features: newFeatures,
            segments: [...this.segments.values()],
        };
        await this.storageProvider.set(this.appName, clientFeatureResponse);
    }
    applyFeatureResponse(response) {
        switch (response.type) {
            case 'delta': {
                response.events.forEach((event) => {
                    switch (event.type) {
                        case 'feature-updated': {
                            this.data[event.feature.name] = event.feature;
                            break;
                        }
                        case 'feature-removed': {
                            delete this.data[event.featureName];
                            break;
                        }
                        case 'segment-updated': {
                            this.segments.set(event.segment.id, event.segment);
                            break;
                        }
                        case 'segment-removed': {
                            this.segments.delete(event.segmentId);
                            break;
                        }
                        case 'hydration': {
                            this.data = this.convertToMap(event.features);
                            this.segments = this.createSegmentLookup(event.segments);
                            break;
                        }
                        default: {
                            this.emit(events_1.UnleashEvents.Warn, `Unknown event type received, this may or may not cause features to evaluate incorrectly: ${JSON.stringify(event)}`);
                            break;
                        }
                    }
                });
                break;
            }
            case 'full': {
                this.data = this.convertToMap(response.features);
                this.segments = this.createSegmentLookup(response.segments);
                break;
            }
            default: {
                assertNever(response);
            }
        }
    }
    notEmpty(content) {
        return content.features.length > 0;
    }
    async loadBootstrap() {
        try {
            const content = await this.bootstrapProvider.readBootstrap();
            if (!this.bootstrapOverride && this.ready) {
                // early exit if we already have backup data and should not override it.
                return;
            }
            if (content && this.notEmpty(content)) {
                await this.save((0, feature_1.parseApiResponse)(content), false);
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            this.emit(events_1.UnleashEvents.Warn, `Unleash SDK was unable to load bootstrap.
Message: ${message}`);
        }
    }
    convertToMap(features) {
        const result = {};
        if (!features?.length)
            return {};
        for (const feature of features) {
            this.validateFeature(feature);
            result[feature.name] = feature;
        }
        return result;
    }
    stop() {
        this.stopped = true;
        this.fetcher.stop();
        this.removeAllListeners();
    }
    getSegment(segmentId) {
        return this.segments.get(segmentId);
    }
    getToggle(name) {
        return this.data[name];
    }
    getToggles() {
        return Object.keys(this.data).map((key) => this.data[key]);
    }
    getTogglesWithSegmentData() {
        const toggles = this.getToggles();
        return toggles.map((toggle) => {
            const { strategies, ...restOfToggle } = toggle;
            return { ...restOfToggle, strategies: this.enhanceStrategies(strategies) };
        });
    }
    getMode() {
        return this.fetcher.getMode();
    }
    async setMode(mode) {
        await this.fetcher.setMode(mode);
    }
    // Compatibility methods for tests - delegate to fetching strategy
    getFailures() {
        return this.fetcher.getFailures();
    }
    nextFetch() {
        return this.fetcher.nextFetch();
    }
    async fetch() {
        return this.fetcher.fetch();
    }
    enhanceStrategies = (strategies) => {
        return strategies?.map((strategy) => {
            const { segments, ...restOfStrategy } = strategy;
            const enhancedSegments = segments?.map((segment) => this.getSegment(segment));
            return { ...restOfStrategy, segments: enhancedSegments };
        });
    };
}
exports.default = Repository;
const assertNever = (value) => {
    throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
};
//# sourceMappingURL=index.js.map