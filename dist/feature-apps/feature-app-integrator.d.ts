import * as ReactDom from 'react-dom/client';
import { FeatureAppManager } from '@feature-hub/core';
declare class FeatureAppIntegrator {
    featureAppManager: FeatureAppManager;
    iconBasePath: string;
    logger: import("@feature-hub/core").Logger;
    /** Observe viewport changes */
    intersectionObserver: IntersectionObserver;
    /** Observe dome changes */
    mutationObserver: MutationObserver;
    /** Remember feature apps and their roots on page */
    featureAppMap: Map<Element, ReactDom.Root | null>;
    constructor(featureAppManager: FeatureAppManager);
    /** Initialize feature apps in a given dom element
        and it's children. Does not initialize same feature
        app twice if it already has been initalized. */
    initFeatureApps(dom: HTMLElement): Promise<void>;
    __isAbsoluteUrl(url: string): boolean;
    preloadFeatureApp(url: string, baseUrl: string): Promise<void>;
    __handleIntersection(entries: IntersectionObserverEntry[]): void;
    __handleMutation(mutations: Array<MutationRecord>): void;
    __mountFeatureApp(featureAppNode: Element): Promise<void>;
    /** Unmount a feature app at a DOM node from page. */
    __unmountComponentAtNode(featureAppNode: Element): Promise<void>;
    __observeMutationsRecursively(element: Node): void;
}
export { FeatureAppIntegrator };
