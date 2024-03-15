import { Logger } from '@feature-hub/core';
interface FeatureAppStringAttributes {
    readonly baseUrl: string;
    readonly callbacks: string;
    readonly configAttribute: string;
    readonly content: string;
    readonly cssAttribute: string;
    readonly featureAppId: string;
    readonly serverSrc: string;
    readonly src: string;
}
declare function getConfig(configAttribute: string, featureAppId: string, logger: Logger): Record<string, unknown>;
declare function parseFeatureAppAttributes(featureApp: Element): FeatureAppStringAttributes;
export { getConfig, parseFeatureAppAttributes };
