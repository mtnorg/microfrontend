import { FeatureAppManager, FeatureServices } from '@feature-hub/core';
declare class DebugListener {
    featureAppManager: FeatureAppManager;
    featureServices: FeatureServices;
    constructor(featureAppManager: FeatureAppManager, featureServices: FeatureServices);
    init(): void;
    sendAppListMessage(): void;
    sendServiceListMessage(): void;
}
export { DebugListener };
