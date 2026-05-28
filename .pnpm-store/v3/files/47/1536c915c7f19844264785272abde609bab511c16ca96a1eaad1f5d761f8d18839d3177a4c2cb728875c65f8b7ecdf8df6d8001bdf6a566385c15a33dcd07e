import type { StrategyTransportInterface } from './strategy';
import type { EnhancedStrategyTransportInterface, Segment } from './strategy/strategy';
import type { VariantDefinition } from './variant';
export interface Dependency {
    feature: string;
    variants?: string[];
    enabled?: boolean;
}
export interface FeatureInterface {
    name: string;
    type?: string;
    project?: string;
    description?: string;
    enabled: boolean;
    stale?: boolean;
    impressionData?: boolean;
    strategies?: StrategyTransportInterface[];
    variants?: VariantDefinition[];
    dependencies?: Dependency[];
}
export interface EnhancedFeatureInterface extends Omit<FeatureInterface, 'strategies'> {
    strategies?: EnhancedStrategyTransportInterface[];
}
export type ApiResponse = (ClientFeaturesDelta & {
    type: 'delta';
}) | (ClientFeaturesResponse & {
    type: 'full';
});
export interface ClientFeaturesResponse {
    version: number;
    features: FeatureInterface[];
    segments?: Segment[];
    query?: Record<string, unknown>;
}
export interface ClientFeaturesDelta {
    events: DeltaEvent[];
}
export declare const parseApiResponse: (data: unknown) => ApiResponse;
export type DeltaEvent = FeatureUpdated | FeatureRemoved | SegmentUpdated | SegmentRemoved | Hydration;
export type FeatureUpdated = {
    type: 'feature-updated';
    eventId: number;
    feature: FeatureInterface;
};
export type FeatureRemoved = {
    type: 'feature-removed';
    eventId: number;
    featureName: string;
    project: string;
};
export type SegmentUpdated = {
    type: 'segment-updated';
    eventId: number;
    segment: Segment;
};
export type SegmentRemoved = {
    type: 'segment-removed';
    eventId: number;
    segmentId: number;
};
export type Hydration = {
    type: 'hydration';
    eventId: number;
    features: FeatureInterface[];
    segments: Segment[];
};
//# sourceMappingURL=feature.d.ts.map