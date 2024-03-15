import { HistoryServiceV2 } from '@feature-hub/history-service';
import { SerializedStateManagerV1 } from '@feature-hub/serialized-state-manager';
export interface IntegratorFeatureServices {
    's2:history': HistoryServiceV2;
    's2:serialized-state-manager': SerializedStateManagerV1;
}
export declare const featureServiceDependencies: Record<keyof IntegratorFeatureServices, string>;
