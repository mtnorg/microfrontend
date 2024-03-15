import * as ReactDom from 'react-dom/client';
import { Css } from '@feature-hub/react';
import { FeatureAppManager, Logger } from '@feature-hub/core';
export interface FeatureAppAttributes {
    readonly baseUrl: string;
    readonly callbacks: string;
    readonly config: Record<string, unknown>;
    readonly css: Css[];
    readonly featureAppId: string;
    readonly serverSrc: string;
    readonly src: string;
}
export interface RenderFeatureAppOptions {
    readonly featureApp: Element;
    readonly featureAppAttributes: FeatureAppAttributes;
    readonly featureAppManager: FeatureAppManager;
    readonly iconBasePath?: string;
    readonly logger: Logger;
}
declare function hydrateFeatureApp(options: RenderFeatureAppOptions): ReactDom.Root;
declare function renderFeatureApp(options: RenderFeatureAppOptions): ReactDom.Root;
export { hydrateFeatureApp, renderFeatureApp, };
