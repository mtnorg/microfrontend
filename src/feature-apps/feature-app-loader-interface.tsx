import * as React from 'react';
import * as ReactDom from 'react-dom/client';

import {
  Css,
  FeatureAppLoader,
  FeatureHubContextProvider,
} from '@feature-hub/react';

import {
  FeatureAppEnvironment,
  FeatureAppManager,
  FeatureServices,
  Logger,
} from '@feature-hub/core';

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

function hydrateFeatureApp(options: RenderFeatureAppOptions): ReactDom.Root {
  const {
    featureApp,
    featureAppAttributes,
    featureAppManager,
    iconBasePath,
    logger,
  } = options;

  const { baseUrl, config, css, featureAppId, serverSrc, src } =
    featureAppAttributes;

  return ReactDom.hydrateRoot(
    featureApp,
    <FeatureHubContextProvider value={{ featureAppManager, logger }}>
        <FeatureAppLoader
          {...(baseUrl && { baseUrl: baseUrl })}
          {...(config && { config: config })}
          {...(css && { css: css })}
          {...(featureAppId && { featureAppId: featureAppId })}
          {...(serverSrc && { serverSrc: serverSrc })}
          {...(src && { src: src })}
        />
    </FeatureHubContextProvider>,
    {
      onRecoverableError: (error, errorInfo) => {
        logger.error(`[${featureAppId}] ${error}${errorInfo.componentStack}`);
      },
    },
  );
}

function renderFeatureApp(options: RenderFeatureAppOptions): ReactDom.Root {
  const {
    featureApp,
    featureAppAttributes,
    featureAppManager,
    iconBasePath,
    logger,
  } = options;

  const { baseUrl, config, css, featureAppId, serverSrc, src } =
    featureAppAttributes;

  const root = ReactDom.createRoot(featureApp);

  root.render(
    <FeatureHubContextProvider value={{ featureAppManager, logger }}>
        <FeatureAppLoader
          {...(baseUrl && { baseUrl: baseUrl })}
          {...(config && { config: config })}
          {...(css && { css: css })}
          {...(featureAppId && { featureAppId: featureAppId })}
          {...(serverSrc && { serverSrc: serverSrc })}
          {...(src && { src: src })}
        />
    </FeatureHubContextProvider>,
  );

  return root;
}

export {
  hydrateFeatureApp,
  renderFeatureApp,
};
