import * as ReactDom from 'react-dom/client';
import { FeatureAppManager, Logger } from '@feature-hub/core';

import {
  RenderFeatureAppOptions,
  hydrateFeatureApp,
  renderFeatureApp,
} from './feature-app-loader-interface';
import { getConfig, parseFeatureAppAttributes } from './feature-app-parsing';

export interface ProcessFeatureAppOptions {
  readonly contentStore?: 'ContentStore';
  readonly featureAppManager: FeatureAppManager;
  readonly iconBasePath?: string;
  readonly logger: Logger;
}

interface componentObject {
  componentInfo: {
    componentID: string;
    componentName: string;
    implementer?: number;
    version?: string;
  };
  category: {
    primaryCategory: string;
  };
  attributes: {
    implementer: number;
    moduleNumber: number;
    subNumber: number;
    version: string;
  };
}

function processFeatureApp(
  featureApp: Element,
  options: ProcessFeatureAppOptions,
): ReactDom.Root | undefined {
  const { contentStore, featureAppManager, iconBasePath, logger } = options;

  const {
    baseUrl,
    callbacks,
    configAttribute,
    content,
    cssAttribute,
    featureAppId,
    serverSrc,
    src,
  } = parseFeatureAppAttributes(featureApp);

  if (src) {
    if (content && contentStore) {
      try {
        //contentStore.setContent(featureAppId, JSON.parse(content));
      } catch (error) {
        logger.error(`content could not be parsed - ${error.message}`);
      }
    }

    const featureAppLocation = baseUrl ? baseUrl : src;
    try {
      let css = [];
      try {
        css = cssAttribute ? JSON.parse(cssAttribute) : [];
      } catch (error) {
        logger.error(`css could not be parsed - ${error.message}`);
      }
      const config = getConfig(configAttribute, featureAppId, logger);

      if (callbacks) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config.callbacks = (window as any)[callbacks];
      }

      const renderOptions: RenderFeatureAppOptions = {
        featureApp,
        featureAppAttributes: {
          baseUrl,
          callbacks,
          config,
          css,
          featureAppId,
          serverSrc,
          src,
        },
        featureAppManager,
        iconBasePath,
        logger,
      };

      return serverSrc
        ? hydrateFeatureApp(renderOptions)
        : renderFeatureApp(renderOptions);
    } catch (error) {
      error.message = `[${featureAppId}] ${error.message}`;
      logger.error(error);
    }
  } else {
    logger.warn('no src attribute found for ', featureAppId);
  }
}

export {
  processFeatureApp,
};
