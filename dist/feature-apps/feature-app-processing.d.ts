import * as ReactDom from 'react-dom/client';
import { FeatureAppManager, Logger } from '@feature-hub/core';
export interface ProcessFeatureAppOptions {
    readonly contentStore?: 'ContentStore';
    readonly featureAppManager: FeatureAppManager;
    readonly iconBasePath?: string;
    readonly logger: Logger;
}
declare function processFeatureApp(featureApp: Element, options: ProcessFeatureAppOptions): ReactDom.Root | undefined;
export { processFeatureApp, };
