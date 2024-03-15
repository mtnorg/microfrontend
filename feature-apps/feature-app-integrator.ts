import * as ReactDom from 'react-dom/client';
import { FeatureAppManager } from '@feature-hub/core';
import { createLogger } from '../logger';
import { processFeatureApp } from './feature-app-processing';
const featureAppSelector = 'feature-app[src]';

class FeatureAppIntegrator {
  featureAppManager: FeatureAppManager;
  iconBasePath: string;
  logger = createLogger();

  /** Observe viewport changes */
  intersectionObserver: IntersectionObserver;

  /** Observe dome changes */
  mutationObserver: MutationObserver;

  /** Remember feature apps and their roots on page */
  featureAppMap: Map<Element, ReactDom.Root | null> = new Map();

  constructor(
    featureAppManager: FeatureAppManager,
  ) {
    this.featureAppManager = featureAppManager;
    const intersectionObserverOptions = {
      rootMargin: '100% 0px 100% 0px', // trigger intersection on feature apps that are placed ~1 viewport above or below
    };

    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        this.__handleIntersection.bind(this),
        intersectionObserverOptions,
      );
    }

    this.mutationObserver = new MutationObserver(
      this.__handleMutation.bind(this),
    );
  }

  /** Initialize feature apps in a given dom element
      and it's children. Does not initialize same feature
      app twice if it already has been initalized. */
  async initFeatureApps(dom: HTMLElement): Promise<void> {
    const allApps = Array.from(dom.querySelectorAll(featureAppSelector));

    const childApps = new Set(
      allApps.flatMap((app) =>
        Array.from(app.querySelectorAll(featureAppSelector)),
      ),
    );

    const topLevelApps = allApps.filter((app) => !childApps.has(app));

    const filterInvalidFeatureApps = (featureAppNode: Element): boolean => {
      if (this.featureAppMap.has(featureAppNode)) return false;

      const isEmptySrc = featureAppNode.getAttribute('src') === '';

      if (isEmptySrc) {
        this.logger.info(
          `Feature app "${featureAppNode.getAttribute(
            'id',
          )}" does not have "src" attribute defined, skipping CSR`,
        );
      }

      return !isEmptySrc;
    };

    await Promise.all(
      topLevelApps
        .filter(filterInvalidFeatureApps)
        .map(async (featureAppNode) => {
          this.featureAppMap.set(featureAppNode, null);

          // Only IF we have an intersectionObserver AND the loading is set to lazy we DO an observe,
          // direct mounting of app otherwise
          const loading = featureAppNode.getAttribute('loading');
          if (
            this.intersectionObserver &&
            loading &&
            loading.toLowerCase() == 'lazy'
          ) {
            this.intersectionObserver.observe(featureAppNode);
          } else {
            await this.__mountFeatureApp(featureAppNode);
          }

          this.__observeMutationsRecursively(featureAppNode);

          this.logger.info(
            'Initialised Feature App ' + featureAppNode.id + '.',
          );
        }),
    );
  }

  __isAbsoluteUrl(url: string): boolean {
    return url.includes('//');
  }

  async preloadFeatureApp(url: string, baseUrl: string): Promise<void> {
    try {
      let fullUrl = url;
      if (baseUrl && !this.__isAbsoluteUrl(url)) {
        if (baseUrl.endsWith('/') || url.startsWith('/')) {
          fullUrl = baseUrl + url;
        } else {
          fullUrl = baseUrl + '/' + url;
        }
      }
      return await this.featureAppManager.preloadFeatureApp(fullUrl);
    } catch (error) {
      this.logger.warn(`preloading error (${url}): ${error}`);
    }
  }

  __handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((intersectionEntry: IntersectionObserverEntry) => {
      // Return if not intersecting…
      if (!intersectionEntry.isIntersecting) return;

      this.__mountFeatureApp(intersectionEntry.target);
    });
  }

  __handleMutation(mutations: Array<MutationRecord>): void {
    this.logger.info(`Mutation observer found ${mutations.length} records`);

    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((removedNode) => {
        for (const featureAppNode of this.featureAppMap.keys()) {
          if (removedNode.contains(featureAppNode)) {
            this.__unmountComponentAtNode(featureAppNode);
          }
        }
      });
    });
  }

  async __mountFeatureApp(featureAppNode: Element): Promise<void> {
    let root = this.featureAppMap.get(featureAppNode);

    if (root === null) {
      // Preload the current feature app and all its child feature apps.
      const featureAppNodes = [
        featureAppNode
      ];

      await Promise.all(
        featureAppNodes.map((node) => {
          const featureAppUrl = node.getAttribute('src');
          const featureAppBaseUrl = node.getAttribute('base-url');

          return this.preloadFeatureApp(featureAppUrl, featureAppBaseUrl);
        }),
      );

      root = processFeatureApp(featureAppNode, {
        featureAppManager: this.featureAppManager,
        iconBasePath: this.iconBasePath,
        logger: this.logger,
      });

      this.featureAppMap.set(featureAppNode, root);

      this.logger.info('Mounted Feature App ' + featureAppNode.id + '.');
    }
  }

  /** Unmount a feature app at a DOM node from page. */
  async __unmountComponentAtNode(featureAppNode: Element): Promise<void> {
    const root = this.featureAppMap.get(featureAppNode);

    // Real un-mount only on mounted feature apps.
    if (root) {
      root.unmount();
    }

    // cleanup some more things
    this.featureAppMap.delete(featureAppNode);
    this.intersectionObserver.unobserve(featureAppNode);

    this.logger.info('Unmounted Feature App ' + featureAppNode.id + '.');
  }

  __observeMutationsRecursively(element: Node): void {
    // break condition
    if (element.parentNode === document.body.parentNode) {
      return;
    }

    this.mutationObserver.observe(element.parentNode, {
      attributes: false,
      characterData: false,
      childList: true,
    });

    this.__observeMutationsRecursively(element.parentNode);
  }
}

export { FeatureAppIntegrator };
